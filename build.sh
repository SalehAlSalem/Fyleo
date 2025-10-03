#!/bin/bash

# 🚀 Appwrite Static Site Build Script
echo "🔧 Starting Fyleo build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Install vite globally if needed
echo "⚡ Installing Vite..."
npm install -g vite@latest

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build files are in ./dist directory"