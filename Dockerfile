FROM node:21.5.0-alpine3.19
COPY . .
RUN yarn
RUN yarn build
# COPY dist .
