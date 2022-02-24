# Uses the node base image with the latest LTS version
FROM node:current-alpine3.15
# Informs Docker that the container listens on the 
# specified network ports at runtime
EXPOSE 4000
# Copies server.js and the two package files from the local 
# directory to a new app directory on the container
COPY server.js package.json package-lock.json app/
COPY ./api/ app/api/
COPY ./datasets/ app/datasets/
# Changes working directory to the new directory just created
WORKDIR /app
# Installs npm dependencies on container
RUN npm ci
# Command container will actually run when called
CMD ["node", "server.js"]