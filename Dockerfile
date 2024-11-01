# Base image for development
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies (including devDependencies for development)
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Run prisma generate to create the Prisma client inside the Docker image
RUN npx prisma generate

# Expose the port Next.js uses
EXPOSE 3000

# Set environment variable to development (if needed)
ENV NODE_ENV development

# Default command to start Next.js in development mode with hot reloading
CMD ["npm", "run", "dev:init"]