FROM node:10-alpine as build
COPY . .
RUN npm ci
RUN npx webpack || exit 0

FROM nginx:1.17-alpine
WORKDIR app
#COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/webkeeper.conf /etc/nginx/conf.d/webkeeper.conf
COPY --from=build dist /app/dist
COPY --from=build stend /app/stend
COPY --from=build iframe-entry/* /app/.

EXPOSE 80
