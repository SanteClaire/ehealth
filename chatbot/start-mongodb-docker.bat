@echo off
echo 🐳 Démarrage MongoDB avec Docker pour SantéClaire
echo.

REM Vérifier si Docker est en cours d'exécution
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker n'est pas démarré
    echo 💡 Démarrez Docker Desktop et relancez ce script
    pause
    exit /b 1
)

echo ✅ Docker est actif

REM Arrêter le conteneur existant s'il existe
docker stop mongodb-santeclaire >nul 2>&1
docker rm mongodb-santeclaire >nul 2>&1

echo 🚀 Démarrage de MongoDB...
docker run -d --name mongodb-santeclaire -p 27017:27017 mongo:latest

if %errorlevel% equ 0 (
    echo ✅ MongoDB démarré avec succès !
    echo 🔗 Connexion MongoDB Compass: mongodb://localhost:27017
    echo 📊 Base de données: santeclaire-chatbot
    echo.
    echo 💡 Vous pouvez maintenant vous connecter dans MongoDB Compass
) else (
    echo ❌ Erreur lors du démarrage de MongoDB
)

pause
