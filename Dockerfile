# Build and run Campus Dish Link as a Node.js server on AWS EC2.
# Debian slim is used for broad compatibility with native Node/Vite dependencies.
FROM node:22-bookworm-slim

WORKDIR /app

# package-lock.json is not currently committed, so use npm install rather than npm ci.
COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .

# Compile the TanStack Start app for Nitro's Node server preset.
RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

EXPOSE 3000

# The Node server output is produced by the node-server Nitro preset.
CMD ["node", ".output/server/index.mjs"]
