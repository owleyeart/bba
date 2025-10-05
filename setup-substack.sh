#!/bin/bash

# Substack Integration Quick Start Script
# This script sets up and starts both frontend and backend for the News page

echo "🚀 Bob Baker Art - Substack Integration Setup"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing backend dependencies..."
cd backend
npm install axios xml2js

echo ""
echo "📦 Step 2: Installing frontend dependencies (if needed)..."
cd ..
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Start the backend:"
echo "   cd backend && npm run develop"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Visit http://localhost:5173/news to see your Substack integration"
echo ""
echo "📚 For more details, see SUBSTACK_INTEGRATION.md"
