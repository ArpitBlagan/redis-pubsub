FROM node:20

WORKDIR /user/app/src

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]