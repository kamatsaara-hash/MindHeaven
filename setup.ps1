Write-Host "🚀 MindHaven Setup Script for Windows" -ForegroundColor Green
Write-Host ""

# Check Prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker found" -ForegroundColor Green

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not installed. Please install it first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker Compose found" -ForegroundColor Green

# Start Docker services
Write-Host ""
Write-Host "Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d
Write-Host "✓ PostgreSQL is running" -ForegroundColor Green

# Setup Backend
Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Push-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

& ".\venv\Scripts\Activate.ps1"
Write-Host "✓ Virtual environment activated" -ForegroundColor Green

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..."
    Copy-Item ".env.example" ".env"
}
Write-Host "✓ .env file created" -ForegroundColor Green

Write-Host "Installing dependencies..."
pip install -r requirements.txt | Out-Null
Write-Host "✓ Dependencies installed" -ForegroundColor Green

Write-Host "Running database migrations..."
Start-Sleep -Seconds 5
alembic upgrade head | Out-Null
Write-Host "✓ Database migrations completed" -ForegroundColor Green

Pop-Location

# Setup Frontend
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Push-Location frontend

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..."
    Copy-Item ".env.example" ".env"
}
Write-Host "✓ .env file created" -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install | Out-Null
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

Pop-Location

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:"
Write-Host "  cd backend"
Write-Host "  .\venv\Scripts\Activate.ps1"
Write-Host "  python main.py"
Write-Host ""
Write-Host "Frontend (in a new terminal):"
Write-Host "  cd frontend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend: http://localhost:8000"
Write-Host "  API Docs: http://localhost:8000/docs"
