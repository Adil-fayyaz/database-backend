#!/bin/bash

echo "🚀 PrivateServerX Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm install

# Install dashboard dependencies
echo ""
echo "📦 Installing dashboard dependencies..."
cd dashboard
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp env.template .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo ""
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB: docker-compose up -d mongodb"
echo "3. Start backend: npm start"
echo "4. Start dashboard: cd dashboard && npm run dev"
echo ""
echo "Or use: npm run start:all (to start everything at once)"

