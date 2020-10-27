FROM node:15.0.1-alpine3.10
RUN mkdir /src
ADD . /src
RUN chmod -R 777 /usr/local/lib/node_modules/
RUN cd /src && ls &&  npm i  &&   npm run build


FROM nginx:alpine
COPY --from=0 /src/dist /usr/share/nginx/html
