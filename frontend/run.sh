#!/bin/bash

# Exit on error
set -e

# Default to development mode unless specified
MODE=${1:-dev}

echo "Setting up Next.js frontend application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check Node.js version (should be 18 or higher)
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Your Node.js version is too old. Please upgrade to Node.js 18 or later."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

if [ "$MODE" = "dev" ]; then
    # Start in development mode
    echo "Starting the application in development mode on port 3000..."
    npm run dev
else
    # Build the Next.js application
    echo "Building the application for production..."
    npm run build
    
    # Set production environment
    export NODE_ENV=production
    
    # Start the application using serve for static exports
    echo "Starting the application in production mode on port 3000..."
    npx serve@latest out -p 3000
fi

echo "Application is running on http://localhost:3000"