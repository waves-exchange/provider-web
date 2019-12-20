FROM node:10-alpine as build
COPY . .
RUN npm ci
RUN npx webpack || exit 0

FROM nginx:1.17-alpine
WORKDIR app
RUN mkdir signer
RUN touch index.html
COPY nginx/webkeeper.conf /etc/nginx/conf.d/webkeeper.conf
COPY --from=build dist /app/signer/dist
COPY --from=build stend /app/signer/stend
COPY --from=build iframe-entry/* /app/signer/.

EXPOSE 80
