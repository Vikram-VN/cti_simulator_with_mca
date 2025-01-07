# Use Node.js official image with the specified version
FROM node:20 as builder

# Set the working directory for the build stage
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . ./

# Build the project
RUN npm run build

# Use a smaller Node.js image for the runtime stage
FROM node:20-alpine as runtime

# Set the working directory inside the runtime container
WORKDIR /usr/src/app

# Copy only the build artifacts and essential files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on (default is 3000 for Express apps, update if necessary)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
