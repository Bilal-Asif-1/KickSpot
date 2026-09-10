# PowerShell script to start the backend server with proper environment variables
Write-Host "🚀 Starting KickSpot Backend Server..." -ForegroundColor Green

# Kill any existing process on port 5000
Write-Host "🔍 Checking for existing processes on port 5000..." -ForegroundColor Yellow
$existingProcess = netstat -ano | findstr :5000
if ($existingProcess) {
    Write-Host "⚠️  Port 5000 is in use. Stopping existing process..." -ForegroundColor Red
    $pid = ($existingProcess -split '\s+')[4]
    if ($pid -and $pid -ne "0") {
        taskkill /PID $pid /F 2>$null
        Write-Host "✅ Existing process stopped." -ForegroundColor Green
    }
}
# Set environment variables for Railway MySQL
$env:STRIPE_SECRET_KEY = "sk_test_51234567890abcdefghijklmnopqrstuvwxyz"
$env:DATABASE_URL = "mysql://root:vkZENdGnsCocrbPsUkwmXVICmRFvJAIh@trolley.proxy.rlwy.net:20786/railway"
$env:MYSQL_HOST = "trolley.proxy.rlwy.net"
$env:MYSQL_DB = "railway"
$env:MYSQL_USER = "root"
$env:MYSQL_PASSWORD = "vkZENdGnsCocrbPsUkwmXVICmRFvJAIh"
$env:MYSQL_PORT = "20786"


# Navigate to backend directory
Set-Location "backend"

Write-Host "📊 Database: Railway MySQL" -ForegroundColor Cyan
Write-Host "💳 Stripe: Test Mode" -ForegroundColor Yellow
Write-Host "🌐 Server: http://localhost:5000" -ForegroundColor Blue
Write-Host "🚀 Starting server..." -ForegroundColor Green

# Start the development server
npm run dev
