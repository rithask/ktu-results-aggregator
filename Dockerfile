# Use Node.js version 16 as the base image
FROM node:alpine

# Set the working directory inside the container for the backend
WORKDIR /app

# Create log directory for the backend
RUN mkdir -p /app/logs
RUN chmod -R 777 /app/logs

# Copy the backend package files to the working directory
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install --production

# Copy the rest of the backend application files to the working directory
COPY backend/ ./

# Set the working directory for the frontend build
WORKDIR /app/frontend

# Copy the frontend package files to the frontend directory
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Build the frontend
COPY frontend/ ./

# Set the working directory to backend
WORKDIR /app

# Build the frontend
RUN npm run build:ui:docker

# Expose the necessary port for the backend
EXPOSE 3001

CMD ["node", "index.js"]
