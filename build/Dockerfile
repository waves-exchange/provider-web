FROM nginx:alpine
ARG NPM_TOKEN
COPY .npmrc .npmrc
RUN apk add npm && \
    npm update && \
    npm install @waves.exchange/storage-provider
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

