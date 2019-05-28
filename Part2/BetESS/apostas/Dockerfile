FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# npm install
#RUN  npm install

RUN rm -rf node_modules && \
    npm install --silent
# Run npm install --global grpc --unsafe-perm

EXPOSE 3002 9202
CMD [ "npm", "run", "start" ]