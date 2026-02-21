FROM oven/bun:1.2

WORKDIR /app

COPY package.json package-lock.json* bunfig.toml* ./
RUN bun install

COPY . .

RUN bun run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "start"]
