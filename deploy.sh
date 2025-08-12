#!/bin/bash

echo "🚀 Prestamos Backend - Netlify Deployment Script"
echo "================================================"

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one with your MongoDB connection string."
    echo "   You can copy .env.example and fill in your values."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test functions
echo "🧪 Testing serverless functions..."
npm run test:functions

# Build
echo "🔨 Building for deployment..."
npm run build

# Check if user is logged in to Netlify
echo "🔐 Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "Please login to Netlify first:"
    netlify login
fi

echo ""
echo "✅ Pre-deployment checks complete!"
echo ""
echo "To deploy:"
echo "  - For preview: netlify deploy"
echo "  - For production: netlify deploy --prod"
echo ""
echo "Don't forget to set your environment variables in Netlify dashboard:"
echo "  - MONGO_STRING or MONGODB_URI"
echo ""
echo "🌟 Happy deploying!"
