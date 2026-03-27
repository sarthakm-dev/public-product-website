FROM node:20-bookworm-slim AS deps

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

COPY package.json ./
RUN npm install

FROM node:20-bookworm-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app
ENV NODE_ENV=production

COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .

EXPOSE 1337

CMD ["npm", "run", "start"]
