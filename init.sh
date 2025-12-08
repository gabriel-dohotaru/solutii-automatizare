#!/bin/bash

# Soluții Automatizare - Development Environment Setup Script
# This script sets up and runs the development environment for the project

set -e  # Exit on any error

echo "=================================================="
echo "  Soluții Automatizare - Dev Environment Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version 18+ is required${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
echo ""

# Function to install dependencies
install_dependencies() {
    local dir=$1
    local name=$2

    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo -e "${YELLOW}Installing $name dependencies...${NC}"
        cd "$dir"
        npm install
        cd ..
        echo -e "${GREEN}✓ $name dependencies installed${NC}"
        echo ""
    fi
}

# Install backend dependencies
if [ -d "backend" ]; then
    install_dependencies "backend" "Backend"
elif [ -f "server/package.json" ]; then
    install_dependencies "server" "Backend"
elif [ -f "package.json" ] && grep -q "express" package.json; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    echo ""
fi

# Install frontend dependencies
if [ -d "frontend" ]; then
    install_dependencies "frontend" "Frontend"
elif [ -d "client" ]; then
    install_dependencies "client" "Frontend"
fi

# Setup environment variables
setup_env() {
    local env_file=$1
    local env_example=$2

    if [ ! -f "$env_file" ] && [ -f "$env_example" ]; then
        echo -e "${YELLOW}Creating $env_file from example...${NC}"
        cp "$env_example" "$env_file"
        echo -e "${GREEN}✓ $env_file created${NC}"
        echo -e "${YELLOW}⚠ Please update $env_file with your configuration${NC}"
        echo ""
    fi
}

# Check for .env files
if [ -d "backend" ]; then
    setup_env "backend/.env" "backend/.env.example"
elif [ -d "server" ]; then
    setup_env "server/.env" "server/.env.example"
else
    setup_env ".env" ".env.example"
fi

if [ -d "frontend" ]; then
    setup_env "frontend/.env" "frontend/.env.example"
elif [ -d "client" ]; then
    setup_env "client/.env" "client/.env.example"
fi

# Initialize database
echo -e "${YELLOW}Checking database setup...${NC}"
if [ -f "backend/init-db.js" ]; then
    cd backend
    node init-db.js
    cd ..
elif [ -f "server/init-db.js" ]; then
    cd server
    node init-db.js
    cd ..
elif [ -f "init-db.js" ]; then
    node init-db.js
fi
echo -e "${GREEN}✓ Database initialized${NC}"
echo ""

echo "=================================================="
echo -e "${GREEN}  Setup Complete!${NC}"
echo "=================================================="
echo ""
echo "To start the development servers:"
echo ""

# Provide instructions based on project structure
if [ -d "backend" ] && [ -d "frontend" ]; then
    echo "  Terminal 1 (Backend):"
    echo "    cd backend && npm run dev"
    echo ""
    echo "  Terminal 2 (Frontend):"
    echo "    cd frontend && npm run dev"
    echo ""
    echo "  Backend will run on:  http://localhost:3001"
    echo "  Frontend will run on: http://localhost:5173"
elif [ -d "server" ] && [ -d "client" ]; then
    echo "  Terminal 1 (Server):"
    echo "    cd server && npm run dev"
    echo ""
    echo "  Terminal 2 (Client):"
    echo "    cd client && npm run dev"
    echo ""
    echo "  Server will run on: http://localhost:3001"
    echo "  Client will run on: http://localhost:5173"
else
    echo "  npm run dev"
    echo ""
    echo "  Application will run on: http://localhost:5173"
    echo "  API will run on: http://localhost:3001"
fi

echo ""
echo "=================================================="
echo ""
echo -e "${YELLOW}Quick Start Commands:${NC}"
echo "  npm run dev       - Start development servers"
echo "  npm run build     - Build for production"
echo "  npm test          - Run tests"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "  README.md         - Project overview and setup"
echo "  feature_list.json - Complete feature testing list"
echo ""
echo "=================================================="
