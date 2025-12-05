import archiver from 'archiver';
import stream from 'stream';

const toArchive = (res, files, name) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const pass = new stream.PassThrough();
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${name}.zip"`);
  archive.pipe(pass);
  pass.pipe(res);
  for (const f of files) {
    archive.append(f.content, { name: f.path });
  }
  archive.finalize();
};

const sanitizeName = (s) => s.replace(/[^a-zA-Z0-9-_]/g, '-');

const baseFiles = (botName, systemPrompt) => {
  return [
    {
      path: 'README.md',
      content: `# ${botName}\n\nSet up environment variables in .env and run scripts.\n`
    },
    {
      path: '.env.example',
      content: `SYSTEM_PROMPT=${JSON.stringify(systemPrompt)}\n`
    },
    {
      path: 'DEPLOYMENT.md',
      content: `Install dependencies with npm install. Copy .env.example to .env and set values. Use npm run start to run locally. Deploy to Render or Railway using Node 20. Set environment variables in the service dashboard.`
    }
  ];
};

const discordTemplate = ({ botName, systemPrompt }) => {
  const files = baseFiles(botName, systemPrompt);
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: sanitizeName(`${botName}-discord-bot`),
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        start: 'node src/bot.js'
      },
      dependencies: {
        discord: '^0.8.2',
        'discord.js': '^14.15.3',
        dotenv: '^16.4.5',
        openai: '^4.47.1'
      }
    }, null, 2)
  });
  files.push({
    path: 'src/llm.js',
    content: `import OpenAI from 'openai';\nimport dotenv from 'dotenv';\ndotenv.config();\nconst apiKey = process.env.OPENAI_API_KEY || '';\nlet client = null;\nconst getClient = () => {\n  if (!client) client = new OpenAI({ apiKey });\n  return client;\n};\nexport const reply = async (messages) => {\n  const c = getClient();\n  const response = await c.chat.completions.create({\n    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',\n    messages\n  });\n  return response.choices?.[0]?.message?.content?.trim() || '';\n};\n`
  });
  files.push({
    path: 'src/bot.js',
    content: `import dotenv from 'dotenv';\ndotenv.config();\nimport { Client, GatewayIntentBits } from 'discord.js';\nimport { reply } from './llm.js';\nconst client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });\nconst token = process.env.DISCORD_BOT_TOKEN || '';\nconst system = process.env.SYSTEM_PROMPT || ${JSON.stringify(systemPrompt)};\nclient.on('ready', () => {});\nclient.on('messageCreate', async (message) => {\n  if (message.author.bot) return;\n  const content = message.content.trim();\n  if (!content) return;\n  let response = '';\n  try {\n    response = await reply([{ role: 'system', content: system }, { role: 'user', content }]);\n  } catch (e) {\n    response = 'Unable to respond right now.';\n  }\n  if (response) {\n    message.reply(response);\n  }\n});\nclient.login(token);\n`
  });
  files.push({
    path: '.env.example',
    content: `SYSTEM_PROMPT=${JSON.stringify(systemPrompt)}\nDISCORD_BOT_TOKEN=\nOPENAI_API_KEY=\nOPENAI_MODEL=gpt-4o-mini\n`
  });
  return files;
};

const redditTemplate = ({ botName, systemPrompt }) => {
  const files = baseFiles(botName, systemPrompt);
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: sanitizeName(`${botName}-reddit-bot`),
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        start: 'node src/bot.js'
      },
      dependencies: {
        snoowrap: '^1.23.0',
        dotenv: '^16.4.5',
        openai: '^4.47.1'
      }
    }, null, 2)
  });
  files.push({
    path: 'src/llm.js',
    content: `import OpenAI from 'openai';\nimport dotenv from 'dotenv';\ndotenv.config();\nconst apiKey = process.env.OPENAI_API_KEY || '';\nlet client = null;\nconst getClient = () => {\n  if (!client) client = new OpenAI({ apiKey });\n  return client;\n};\nexport const reply = async (messages) => {\n  const c = getClient();\n  const response = await c.chat.completions.create({\n    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',\n    messages\n  });\n  return response.choices?.[0]?.message?.content?.trim() || '';\n};\n`
  });
  files.push({
    path: 'src/bot.js',
    content: `import dotenv from 'dotenv';\ndotenv.config();\nimport Snoowrap from 'snoowrap';\nimport { reply } from './llm.js';\nconst system = process.env.SYSTEM_PROMPT || ${JSON.stringify(systemPrompt)};\nconst r = new Snoowrap({\n  userAgent: process.env.REDDIT_USER_AGENT || 'bot',\n  clientId: process.env.REDDIT_CLIENT_ID || '',\n  clientSecret: process.env.REDDIT_CLIENT_SECRET || '',\n  username: process.env.REDDIT_USERNAME || '',\n  password: process.env.REDDIT_PASSWORD || ''\n});\nconst subreddit = process.env.SUBREDDIT || '';\nconst intervalMs = Number(process.env.POLL_INTERVAL_MS || '30000');\nlet lastChecked = Date.now();\nconst loop = async () => {\n  try {\n    const posts = await r.getSubreddit(subreddit).getNew({ limit: 5 });\n    for (const post of posts) {\n      const comments = await post.expandReplies({ depth: 1, limit: 5 });\n      const list = comments.comments || [];\n      for (const c of list) {\n        const body = c.body?.trim() || '';\n        if (!body) continue;\n        if (c.created_utc * 1000 < lastChecked) continue;\n        const messages = [{ role: 'system', content: system }, { role: 'user', content: body }];\n        let response = '';\n        try {\n          response = await reply(messages);\n        } catch (e) {\n          response = '';\n        }\n        if (response) {\n          await r.getComment(c.id).reply(response);\n        }\n      }\n    }\n  } catch (e) {}\n  lastChecked = Date.now();\n  setTimeout(loop, intervalMs);\n};\nloop();\n`
  });
  files.push({
    path: '.env.example',
    content: `SYSTEM_PROMPT=${JSON.stringify(systemPrompt)}\nREDDIT_USER_AGENT=\nREDDIT_CLIENT_ID=\nREDDIT_CLIENT_SECRET=\nREDDIT_USERNAME=\nREDDIT_PASSWORD=\nSUBREDDIT=\nPOLL_INTERVAL_MS=30000\nOPENAI_API_KEY=\nOPENAI_MODEL=gpt-4o-mini\n`
  });
  return files;
};

const llmWrapperTemplate = ({ botName, systemPrompt }) => {
  const files = baseFiles(botName, systemPrompt);
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: sanitizeName(`${botName}-llm-wrapper`),
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        start: 'node src/server.js'
      },
      dependencies: {
        express: '^4.19.2',
        cors: '^2.8.5',
        dotenv: '^16.4.5',
        openai: '^4.47.1'
      }
    }, null, 2)
  });
  files.push({
    path: 'src/llm.js',
    content: `import OpenAI from 'openai';\nimport dotenv from 'dotenv';\ndotenv.config();\nconst apiKey = process.env.OPENAI_API_KEY || '';\nlet client = null;\nconst getClient = () => {\n  if (!client) client = new OpenAI({ apiKey });\n  return client;\n};\nexport const reply = async (messages) => {\n  const c = getClient();\n  const response = await c.chat.completions.create({\n    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',\n    messages\n  });\n  return response.choices?.[0]?.message?.content?.trim() || '';\n};\n`
  });
  files.push({
    path: 'src/server.js',
    content: `import express from 'express';\nimport cors from 'cors';\nimport dotenv from 'dotenv';\ndotenv.config();\nimport { reply } from './llm.js';\nconst app = express();\napp.use(cors());\napp.use(express.json());\nconst system = process.env.SYSTEM_PROMPT || ${JSON.stringify(systemPrompt)};\napp.post('/chat', async (req, res) => {\n  const { message } = req.body;\n  if (!message) return res.status(400).json({ error: 'Message is required' });\n  let response = '';\n  try {\n    response = await reply([{ role: 'system', content: system }, { role: 'user', content: message }]);\n  } catch (e) {\n    return res.status(500).json({ error: 'Unable to respond' });\n  }\n  res.json({ response });\n});\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\nconst port = process.env.PORT ? Number(process.env.PORT) : 3000;\napp.listen(port, () => {});\n`
  });
  files.push({
    path: '.env.example',
    content: `SYSTEM_PROMPT=${JSON.stringify(systemPrompt)}\nOPENAI_API_KEY=\nOPENAI_MODEL=gpt-4o-mini\nPORT=3000\n`
  });
  return files;
};

export const generateBotArchive = (res, { platform, botName, personality }) => {
  const name = sanitizeName(botName || 'chatbot');
  const systemPrompt = personality || 'You are a helpful assistant.';
  let files = [];
  if (platform === 'discord') files = discordTemplate({ botName: name, systemPrompt });
  else if (platform === 'reddit') files = redditTemplate({ botName: name, systemPrompt });
  else files = llmWrapperTemplate({ botName: name, systemPrompt });
  toArchive(res, files, `${name}-${platform}`);
};

