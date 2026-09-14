FROM node:22-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

COPY . .
RUN pnpm exec prisma generate

EXPOSE 3000
CMD ["pnpm", "dev"]