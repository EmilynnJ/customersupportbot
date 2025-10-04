# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
RUN npm install
COPY . .
RUN npm run build --workspace client

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/client/package.json ./client/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
WORKDIR /app/server
CMD ["npm", "start"]
