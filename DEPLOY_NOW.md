# 🚀 DEPLOY BACKEND SU RAILWAY - RAPIDO

## Problema
Il server su Railway `database-backend-production-2f45.up.railway.app` è per un altro progetto (database-infinity).
Devi deployare il backend blackcyber su Railway!

## Soluzione Rapida - Opzione 1: Usa ngrok (VELOCE)

1. Installa ngrok: https://ngrok.com/download
2. Avvia il server locale:
   ```bash
   cd "blackcyber-backend"
   npm start
   ```
3. In un altro terminale:
   ```bash
   ngrok http 3000
   ```
4. Copia l'URL https (es: https://xxxx-xx-xx-xxx-xx.ngrok.io)
5. Aggiorna backend_config.dart con questo URL
6. Ricompila APK

## Opzione 2: Deploy su Railway

1. Vai su https://railway.app
2. New Project → Deploy from GitHub
3. Se non hai repo GitHub, crea uno:
   ```bash
   cd "blackcyber-backend"
   git init
   git add .
   git commit -m "Initial commit"
   # Crea repo su GitHub e:
   git remote add origin https://github.com/TUO_USERNAME/blackcyber-backend.git
   git push -u origin main
   ```
4. Su Railway → Deploy from GitHub → Seleziona repo
5. Railway rileva automaticamente Node.js
6. Aggiungi Environment Variables:
   - MONGODB_URI=mongodb+srv://adilfayyaz388:TUAPASSWORD@cluster0.axbaokd.mongodb.net/blackcyber
   - JWT_SECRET=blackcyber-super-secret-key-2024-production-ready
   - PORT=3000
7. Railway genera URL tipo: https://xxxx.up.railway.app
8. Aggiorna backend_config.dart con questo URL
9. Ricompila APK

## Opzione 3: Usa il server esistente ma aggiungi route

Il server database-backend potrebbe non avere le route corrette per blackcyber.
Serve deployare il backend blackcyber specifico!

