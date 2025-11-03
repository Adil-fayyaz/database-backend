# 🚀 DEPLOY BACKEND BLACKCYBER SU RAILWAY - RAPIDO

## ⚠️ PROBLEMA ATTUALE
Il server `database-backend-production-2f45.up.railway.app` è per un altro progetto.
Serve deployare il backend blackcyber separatamente!

## ✅ SOLUZIONE: Deploy su Railway

### STEP 1: Crea Repository GitHub

1. Vai su https://github.com/new
2. Nome repo: `blackcyber-backend`
3. Crea repository

### STEP 2: Push Codice

```bash
cd "C:\Users\adil\Desktop\database infinity\blackcyber-backend"
git init
git add .
git commit -m "Initial commit - BlackCyber Backend"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/blackcyber-backend.git
git push -u origin main
```

### STEP 3: Deploy su Railway

1. Vai su https://railway.app
2. Login con GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Seleziona `blackcyber-backend`
5. Railway rileva automaticamente Node.js

### STEP 4: Configura Environment Variables

Su Railway, vai in **Variables** e aggiungi:

```
MONGODB_URI=mongodb+srv://adilfayyaz388:TUAPASSWORD@cluster0.axbaokd.mongodb.net/blackcyber?retryWrites=true&w=majority
JWT_SECRET=blackcyber-super-secret-key-2024-production-ready
PORT=3000
NODE_ENV=production
```

⚠️ **SOSTITUISCI `TUAPASSWORD` con la password MongoDB Atlas reale!**

### STEP 5: Ottieni URL

Railway genera un URL tipo:
`https://blackcyber-backend-production-xxxx.up.railway.app`

### STEP 6: Aggiorna App

Modifica `backend_config.dart`:
```dart
static const String BASE_URL = 'https://blackcyber-backend-production-xxxx.up.railway.app/api';
static const String SOCKET_URL = 'https://blackcyber-backend-production-xxxx.up.railway.app';
```

### STEP 7: Ricompila APK

```bash
cd "blackcyber - Copia - Copia - Copia"
flutter build apk --release
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

---

## ✅ RISULTATO

L'app funzionerà **anche con PC spento** perché usa Railway cloud!

