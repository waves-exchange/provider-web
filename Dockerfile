FROM node:15-alpine as build
COPY . /app/
WORKDIR /app/
RUN npm ci
WORKDIR packages/provider-web-ui
RUN npm run build

FROM nginx:1.17-alpine
WORKDIR iframe-entry
RUN mkdir signer
RUN touch index.html
COPY nginx/webkeeper.conf /etc/nginx/conf.d/webkeeper.conf
COPY --from=build /app/packages/provider-web-ui/dist/ /iframe-entry/signer/
EXPOSE 80
