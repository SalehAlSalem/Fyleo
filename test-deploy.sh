#!/bin/bash

echo "🚀 Fyleo Quick Test & Deploy Script"
echo "===================================="
echo "جامعة البلقاء التطبيقية - AlBalqa Applied University"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Missing .env file!"
    echo "📋 Copying .env.example to .env..."
    cp .env.example .env
    echo "✅ .env created! Please configure with your credentials."
    echo ""
    echo "⚠️  Required Setup:"
    echo "   1. Firebase credentials (Auth & Database)"
    echo "   2. GitHub Personal Access Token"
    echo "   3. Supabase URL & Anon Key"
    echo ""
    echo "📖 See SETUP.md for detailed instructions"
    exit 1
fi

echo "🔧 Node.js Version:"
node --version
echo ""

echo "📦 Installing dependencies..."
npm install
echo ""

echo "🏗️  Building for production..."
npm run build
echo ""

echo "🧪 Testing hybrid storage system..."
echo "📁 GitHub: Files < 25MB (Free)"
echo "📁 Supabase: Files 25-100MB (1GB/month)"
echo "🔥 Firebase: Auth & Database only"
echo ""

echo "🌐 Starting development server..."
echo "Server will be available at: http://localhost:5173"
echo ""
echo "🎯 Test the file upload in Dashboard to verify hybrid storage!"
echo ""

npm run dev