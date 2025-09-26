@echo off
echo.
echo ========================================
echo    🚀 Fyleo Development Server 
echo    جامعة البلقاء التطبيقية
echo ========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo ❌ Missing .env file!
    echo 📋 Please copy .env.example to .env and configure it
    echo.
    echo Copying .env.example to .env...
    copy ".env.example" ".env"
    echo ✅ .env file created!
    echo.
    echo ⚠️  Please edit .env with your actual credentials:
    echo    - Firebase credentials
    echo    - GitHub token
    echo    - Supabase credentials
    echo.
    pause
    exit /b 1
)

echo 🔧 Checking Node.js version...
node --version
echo.

echo 📦 Installing dependencies...
call npm install
echo.

echo 🔄 Starting development server...
echo 🌐 Server will be available at: http://localhost:5173
echo.
echo 📁 Hybrid Storage Status:
echo    - GitHub: Ready for files ^< 25MB
echo    - Supabase: Ready for files 25-100MB
echo.
echo 🔥 Firebase: Auth ^& Database only
echo ❌ Firebase Storage: DISABLED (using hybrid system)
echo.

call npm run dev