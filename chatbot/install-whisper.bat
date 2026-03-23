@echo off
echo 🎤 Installation de Whisper pour SantéClaire
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python n'est pas installé ou pas dans le PATH
    echo 💡 Installez Python depuis le Microsoft Store ou python.org
    echo 🔗 https://www.microsoft.com/store/productId/9NRWMJP3717K
    pause
    exit /b 1
)

echo ✅ Python détecté
python --version

echo.
echo 📦 Installation de Whisper...
pip install openai-whisper

echo.
echo 🧪 Test de Whisper...
whisper --help

echo.
echo 🎉 Installation terminée !
echo 💡 Vous pouvez maintenant utiliser la transcription vocale dans votre chatbot
pause
