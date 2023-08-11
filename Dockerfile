FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
RUN rm -rf src
EXPOSE 3000
CMD ["node", "dist/main"]
