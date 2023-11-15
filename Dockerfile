FROM node:18-alpine
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["NODE_ENV=prod", "node", "dist/main"]