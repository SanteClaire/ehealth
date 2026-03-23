@echo off
echo 🚀 Démarrage de MongoDB pour SantéClaire...
echo.

REM Vérifier si MongoDB est installé
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB n'est pas installé ou pas dans le PATH
    echo 💡 Installez MongoDB Community Server depuis: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

REM Créer le dossier de données s'il n'existe pas
if not exist "data\db" (
    echo 📁 Création du dossier de données MongoDB...
    mkdir data\db
)

REM Démarrer MongoDB
echo ✅ Démarrage de MongoDB sur le port 27017...
echo 💡 Appuyez sur Ctrl+C pour arrêter MongoDB
echo.
mongod --dbpath=data\db --port=27017

pause
