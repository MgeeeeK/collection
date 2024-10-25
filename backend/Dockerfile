FROM node:22-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci --include=dev && \
    npm rebuild bcrypt --build-from-source


COPY . /app
COPY .env /app

# Increase Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"


EXPOSE 4000
CMD ["npm", "run", "start"]