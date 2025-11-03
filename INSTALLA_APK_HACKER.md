# 🎭 INSTALLA APK TEMA HACKER

## 📱 TELEFONO COLLEGATO

Hai già collegato il telefono? Perfetto!

---

## 🚀 PASSI VELOCI

### 1. Trova il tuo APK attuale (2 minuti)

Cerca nella cartella del progetto Flutter:

```bash
# Cerca APK esistente
dir /s *.apk

# Oppure vai direttamente a:
cd build\app\outputs\flutter-apk\
```

Se non hai APK, devi compilarlo (vedi sotto).

---

### 2. Modifica configurazione per Railway (1 minuto)

**IMPORTANTE:** Prima di installare, devi cambiare l'URL nell'app!

Trova il file di configurazione (di solito):
```
lib/config/api_config.dart
lib/services/backend_config.dart
lib/config.dart
```

Cambia:
```dart
// PRIMA (locale)
static const String BASE_URL = 'http://192.168.1.2:3000/api';

// DOPO (Railway - dopo che hai fatto deploy)
static const String BASE_URL = 'https://tuoserver.up.railway.app/api';
static const String SOCKET_URL = 'https://tuoserver.up.railway.app';
```

---

### 3. Cambia tema in HACKER (5 minuti)

#### Opzione A: Veloce (solo colori)

Trova il file theme/colors:
```dart
// Cambia colori principali
primaryColor: Color(0xFF00FF41),  // Verde Matrix
backgroundColor: Color(0xFF0A0A0A), // Nero
accentColor: Color(0xFF00D9FF),    // Cyan
```

#### Opzione B: Completo (tema hacker)

Copia il codice da `APP_HACKER_THEME.md` che ho creato.

---

### 4. Cambia icona app (3 minuti)

#### Scarica icona hacker:
1. Vai su: https://www.flaticon.com/search?word=hacker+mask
2. Scarica icona (512x512 o 1024x1024)
3. Salva come `ic_launcher.png`

#### Sostituisci icona:
```bash
# Android
android/app/src/main/res/mipmap-hdpi/ic_launcher.png
android/app/src/main/res/mipmap-mdpi/ic_launcher.png
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Oppure usa tool automatico:
flutter pub add flutter_launcher_icons
```

#### Configura flutter_launcher_icons:
```yaml
# pubspec.yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_launcher_icons:
  android: true
  ios: false
  image_path: "assets/icon/hacker_icon.png"
  adaptive_icon_background: "#000000"
  adaptive_icon_foreground: "assets/icon/hacker_icon.png"
```

Poi:
```bash
flutter pub get
flutter pub run flutter_launcher_icons
```

---

### 5. Cambia nome app (1 minuto)

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
    android:label="CyberChat"  <!-- Cambia questo -->
    android:icon="@mipmap/ic_launcher">
```

Scegli tra:
- CyberChat 🔐
- DarkNet 🎭
- Ghost Protocol 👻
- Matrix Chat 💚
- Shadow Talk 🌑

---

### 6. Compila nuovo APK (3 minuti)

```bash
# Vai nella cartella del progetto Flutter
cd /percorso/al/tuo/progetto/flutter

# Compila APK release
flutter build apk --release

# APK sarà in:
# build/app/outputs/flutter-apk/app-release.apk
```

---

### 7. Installa sul telefono (1 minuto)

#### Opzione A: Via ADB (più veloce)
```bash
# Verifica telefono collegato
adb devices

# Installa
adb install build/app/outputs/flutter-apk/app-release.apk

# Se già installata, disinstalla prima:
adb uninstall com.tuopackage.app
adb install build/app/outputs/flutter-apk/app-release.apk
```

#### Opzione B: Manuale
```bash
# Copia APK sul telefono
adb push build/app/outputs/flutter-apk/app-release.apk /sdcard/Download/

# Sul telefono:
# 1. Vai in Download
# 2. Tap su app-release.apk
# 3. Installa
```

---

## 🎨 TEMA HACKER - COSA CAMBIA

### Prima (normale)
```
- Colori: Blu/Bianco
- Icona: Logo normale
- Font: Standard
- UI: Classica
```

### Dopo (hacker)
```
- Colori: Verde Matrix / Nero / Cyan
- Icona: Maschera hacker 🎭
- Font: Monospace (Courier)
- UI: Stile terminal/cyberpunk
- Effetti: Glow verde, bordi neon
- Suoni: Beep elettronici
```

---

## 🔗 URL RAILWAY

**IMPORTANTE:** L'app funzionerà SOLO se:

1. ✅ Hai fatto deploy su Railway
2. ✅ Hai l'URL Railway (tipo: `https://xxx.up.railway.app`)
3. ✅ Hai cambiato URL nell'app
4. ✅ Hai ricompilato APK

**Sequenza corretta:**
```
1. Deploy su Railway → Ottieni URL
2. Cambia URL nell'app
3. Compila APK
4. Installa sul telefono
```

---

## 🆘 SE NON HAI PROGETTO FLUTTER

Se non hai il progetto Flutter dell'app, devi:

### Opzione 1: Usa app esistente
```bash
# Trova il progetto Flutter
# Di solito in:
C:\Users\adil\Desktop\blackcyber
C:\Users\adil\Desktop\flutter_app
# O cerca:
dir /s pubspec.yaml
```

### Opzione 2: Crea nuova app
```bash
# Crea nuovo progetto Flutter
flutter create cyberch4t

# Copia il codice tema hacker
# Configura URL Railway
# Compila
```

---

## ✅ CHECKLIST COMPLETA

Prima di installare:

- [ ] Deploy fatto su Railway
- [ ] URL Railway ottenuto
- [ ] URL cambiato nell'app (api_config.dart)
- [ ] Tema cambiato in hacker (colori verde/nero)
- [ ] Icona cambiata (maschera hacker)
- [ ] Nome app cambiato (CyberChat)
- [ ] APK compilato (`flutter build apk --release`)
- [ ] Telefono collegato (`adb devices`)
- [ ] APK installato (`adb install app-release.apk`)
- [ ] App testata (apri e verifica connessione)

---

## 🎯 COMANDI RAPIDI

```bash
# 1. Compila APK
flutter build apk --release

# 2. Verifica telefono
adb devices

# 3. Disinstalla vecchia versione
adb uninstall com.tuopackage.app

# 4. Installa nuova
adb install build/app/outputs/flutter-apk/app-release.apk

# 5. Avvia app
adb shell am start -n com.tuopackage.app/.MainActivity
```

---

## 🎭 RISULTATO FINALE

L'app avrà:
- ✅ Tema hacker (verde Matrix su nero)
- ✅ Icona mascherata 🎭
- ✅ Connessione a Railway (sempre attivo)
- ✅ Tutte le funzionalità (messaggi, gruppi, file, chiamate)
- ✅ Privacy totale (nessuno vede i dati)
- ✅ Gratis (Railway tier gratuito)

---

**Dimmi dove sei bloccato e ti aiuto! 🚀**



