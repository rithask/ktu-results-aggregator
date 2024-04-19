# Use Node.js version 16 as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Create log directory
RUN mkdir -p /usr/src/app/log

# Set proper permissions for log directory
RUN chmod -R 777 /usr/src/app/log

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files to the working directory
COPY . .

# Expose port 3001 to the outside world
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
