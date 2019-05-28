FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# npm install
RUN rm -rf node_modules && \
    npm install --silent
# Run npm install --global grpc --unsafe-perm

EXPOSE 3003 9203
CMD [ "npm", "run", "start" ]