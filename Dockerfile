# Use Node.js version 16 as the base image
FROM node:alpine

# Set the working directory inside the container for the backend
WORKDIR /usr/src/app/backend

# Create log directory for the backend
RUN mkdir -p /usr/src/app/log
RUN chmod -R 777 /usr/src/app/log

# Copy the backend package files to the working directory
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install --production

# Copy the rest of the backend application files to the working directory
COPY backend/ ./

# Set the working directory for the frontend build
WORKDIR /usr/src/app/frontend

# Copy the frontend package files to the frontend directory
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Build the frontend
COPY frontend/ ./

# Set the working directory to backend
WORKDIR /usr/src/app/backend

# Build the frontend
RUN npm run build:ui

# Expose the necessary port for the backend
EXPOSE 3001

CMD ["npm", "start"]
