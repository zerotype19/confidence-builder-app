FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the React app
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
