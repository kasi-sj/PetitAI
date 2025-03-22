# Stage 1: Build Stage
FROM node:22 AS builder  

# Set the working directory
WORKDIR /usr/src/app

# Install OpenSSL (required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Production Stage
FROM node:22-slim  

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set the working directory
WORKDIR /usr/src/app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Hugging Face Spaces uses port 7860 by default
EXPOSE 7860

# Set Hugging Face required environment variable
ENV HF_HOME="/usr/src/app"

# Command to run the application
CMD ["node", "dist/index.js"]
