# SupportBot – Customer Support Chatbot Template

SupportBot is a full-stack customer support chatbot template that combines an Express + SQLite backend, a React + Tailwind frontend, and OpenAI-powered fallback responses. Businesses can deploy and customize it quickly for their own support workflows.

## Features
- Landing page with clear CTA and marketing content
- Modern chat interface with FAQ matching and OpenAI fallback
- Admin dashboard for managing FAQs and reviewing conversations
- JWT-based admin authentication
- SQLite persistence with WAL mode for durability
- Docker-ready with multi-environment configuration
- Vercel and Render deployment scripts

## Tech Stack
- Backend: Node.js, Express, better-sqlite3
- Frontend: React (Vite), Tailwind CSS
- AI: OpenAI API (configurable via `.env`)
- Auth: JWT (configurable admin credentials)
- Database: SQLite (bundled with schema + seed)

## Project Structure
```
customersupportbot/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   ├── public/
│   └── ...
├── server/             # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   └── services/
│   └── data/           # SQLite database (created at runtime)
├── Dockerfile
├── docker-compose.yml
├── package.json        # Workspaces (client + server)
└── README.md
```

## Prerequisites
- Node.js 18+
- npm 9+
- OpenAI API key

## Environment Variables
Create a `.env` file in the project root:
```
OPENAI_API_KEY=sk-...
JWT_SECRET=replace-with-secure-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
# Optional: pre-hash the password (overrides ADMIN_PASSWORD)
# ADMIN_PASSWORD_HASH=$2a$10$...
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
DB_PATH=./server/data/supportbot.sqlite
FAQ_MATCH_THRESHOLD=0.8
```

### Frontend Env
For production builds, you can configure the API base URL:
```
# client/.env
VITE_API_URL=/api
```

## Installation
```bash
npm install
npm run seed --workspace server
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Scripts
- `npm run dev` – concurrently runs client (Vite) + server (nodemon)
- `npm run build` – builds the client bundle
- `npm run start` – starts the server
- `npm run seed --workspace server` – ensures schema and seeds FAQ data

## Admin Access
Hit `http://localhost:5173/admin` and log in with the credentials from `.env`. Use the dashboard to:
- Add, edit, delete FAQ entries
- View recent conversations and inspect transcripts

## Deployment
### Docker
```bash
docker-compose up --build
```
- `Dockerfile` builds the server, installs dependencies, builds the client, and serves static assets
- `docker-compose.yml` runs the server container and exposes port 5000

### Vercel
- Use `vercel.json` to proxy API routes to the Express server or use serverless functions (modify as needed)
- Deploy the `client` as the frontend project
- Backend can run on Render/Fly/Heroku using `render.yaml`

### Render
Use `render.yaml` to spin up a web service for the server and a static site for the client. Adjust environment variables within Render dashboard.

## Database
- SQLite file is automatically created at `server/data/supportbot.sqlite`
- `better-sqlite3` ensures synchronous, safe access
- Schema includes:
  - `faq` – question/answer pairs
  - `conversations` – metadata per chat session
  - `messages` – individual user/bot messages

## Extending
- Swap JWT auth with Clerk/Auth0 by replacing `server/src/middleware/auth.js`
- Customize the system prompt for OpenAI in `server/src/services/openaiService.js`
- Adjust FAQ match threshold via `FAQ_MATCH_THRESHOLD`
- Add analytics endpoints for dashboards using data from `conversations` and `messages`

## License
Commercial license. Attribution not required.