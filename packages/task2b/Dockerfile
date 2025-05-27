FROM node:slim

ENV YARN_VERSION=1.22.19

RUN apt-get update && apt-get install -y \
  curl \
  openssl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile

WORKDIR /usr/src/app/packages/task2b

RUN yarn prisma generate

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:deploy"]
