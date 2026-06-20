#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 MindHaven Setup Script${NC}"
echo ""

# Check if Docker and Docker Compose are installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}"

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose found${NC}"

# Start Docker services
echo ""
echo -e "${YELLOW}Starting Docker services...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ PostgreSQL is running${NC}"

# Setup Backend
echo ""
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi
echo -e "${GREEN}✓ .env file created${NC}"

echo "Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo "Running database migrations..."
sleep 5  # Wait for PostgreSQL to be ready
alembic upgrade head > /dev/null 2>&1
echo -e "${GREEN}✓ Database migrations completed${NC}"

cd ..

# Setup Frontend
echo ""
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi
echo -e "${GREEN}✓ .env file created${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}To start the application:${NC}"
echo ""
echo "Backend:"
echo "  cd backend"
echo "  source venv/bin/activate  # or venv\\Scripts\\activate on Windows"
echo "  python main.py"
echo ""
echo "Frontend (in a new terminal):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Access the application at:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
