FROM node:20.7.0
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY ./dist ./dist
RUN mkdir compile
EXPOSE 3000
CMD ["npm", "run", "serve"]
