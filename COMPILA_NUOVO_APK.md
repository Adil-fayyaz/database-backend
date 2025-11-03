╔══════════════════════════════════════════════════════════════════╗
║     📱 COME COMPILARE NUOVO APK (BACKEND LOCALE)                 ║
╚══════════════════════════════════════════════════════════════════╝

⚠️ NOTA: L'APK attuale funziona già perfettamente!
Compila un nuovo APK SOLO se hai cambiato il codice.


════════════════════════════════════════════════════════════════════

📋 STEP 1: VERIFICA IP DEL PC

Vai in PowerShell:
> ipconfig

Cerca: Indirizzo IPv4

Se è diverso da 192.168.1.2, modifica il file:
blackcyber - Copia - Copia - Copia/lib/services/backend_config.dart

Cambia IP in quello che trovi con ipconfig


════════════════════════════════════════════════════════════════════

📋 STEP 2: ASSICURATI CHE IL SERVER SIA IN ESECUZIONE

Vai nella cartella server:
> cd "blackcyber - Copia - Copia - Copia\server"

Avvia il server:
> node index.js

Dovresti vedere:
"✅ Server: http://localhost:3000"
"🔍 Monitor: http://localhost:3000/monitor.html"


════════════════════════════════════════════════════════════════════

📋 STEP 3: COMPILA L'APK

Opzione A - Flutter CLI:
> cd "blackcyber - Copia - Copia - Copia"
> flutter build apk --release


Opzione B - Android Gradle:
> cd android
> .\gradlew assembleRelease


Opzione C - Usa script BAT:
> cd "blackcyber - Copia - Copia - Copia"
> COMPILA_NUOVO_APK.bat


════════════════════════════════════════════════════════════════════

📋 STEP 4: TROVA L'APK GENERATO

L'APK sarà in:
blackcyber - Copia - Copia - Copia\build\app\outputs\flutter-apk\app-release.apk


════════════════════════════════════════════════════════════════════

📋 STEP 5: INSTALLA SUL TELEFONO

Usa lo script automatico:
> INSTALLA_APK_TELEFONO.bat

OPPURE trasferisci manualmente l'APK.


════════════════════════════════════════════════════════════════════

⚙️ CONFIGURAZIONI DISPONIBILI:

1. RETE LOCALE (attuale):
   BASE_URL = 'http://192.168.1.2:3000/api'
   
   ✓ Telefono deve essere sulla STESSA WiFi del PC


2. NGROK (pubblico temporaneo):
   BASE_URL = 'https://xxxx.ngrok.io/api'
   
   ✓ Funziona da ovunque (temporaneo)


3. RAILWAY (pubblico permanente):
   BASE_URL = 'https://xxxx.up.railway.app/api'
   
   ✓ Funziona da ovunque (sempre online)


════════════════════════════════════════════════════════════════════

✅ L'APP NON USA PIÙ FIREBASE!

Tutte le operazioni vanno sul TUO server:
- Nessun costo
- Controllo totale
- Nessuna dipendenza esterna
- Dati tuoi al 100%














