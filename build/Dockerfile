FROM nginx:alpine
ARG NPM_TOKEN
COPY .npmrc .npmrc 
RUN apk add npm && \
    npm update && \
    npm install @waves/storage-provider
RUN rm -f .npmrc
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

