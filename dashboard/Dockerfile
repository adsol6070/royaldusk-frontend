# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before running npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# # Build the Vite application
# RUN npm run build

# Expose the port Vite will run on
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]