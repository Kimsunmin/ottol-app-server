FROM node:18-alpine
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV prod
EXPOSE 3000
CMD ["node", "dist/main"]