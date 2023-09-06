# Dockerfile for caictdevelop/uni-registrar-driver-did-bid

FROM node:14-alpine
MAINTAINER guoshijie <guoshijie@caict.ac.cn>

# build uni-registrar-driver-did-bid

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

# done

EXPOSE 9080

CMD [ "node", "index.js" ]
