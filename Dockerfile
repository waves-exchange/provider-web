FROM node:10-alpine as build
COPY . .
RUN npm ci
RUN npm run build || exit 0

FROM nginx:1.17-alpine
WORKDIR iframe-entry
RUN mkdir signer
RUN touch index.html
COPY nginx/webkeeper.conf /etc/nginx/conf.d/webkeeper.conf
COPY --from=build iframe-entry/ /iframe-entry/signer/
EXPOSE 80
