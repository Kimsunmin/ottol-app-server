FROM node:18-alpine
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
COPY .env.prod ./
RUN pnpm install
RUN pnpm run build
ENV NODE_ENV prod
EXPOSE 3000
CMD ["node", "dist/main"]