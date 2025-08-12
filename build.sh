#!/bin/bash
echo "Node.js version check..."
node --version
npm --version

echo "Installing dependencies..."
npm install --production

echo "Build complete!"
