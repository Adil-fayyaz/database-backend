# 🎭 APP TEMA HACKER - CONFIGURAZIONE

## 🎨 TEMA DARK HACKER

### Colori da usare nell'app

```dart
// lib/config/theme.dart
class HackerTheme {
  // Colori principali
  static const Color primary = Color(0xFF00FF41);      // Verde Matrix
  static const Color secondary = Color(0xFF0D0D0D);    // Nero profondo
  static const Color accent = Color(0xFF00D9FF);       // Cyan elettrico
  static const Color danger = Color(0xFFFF0040);       // Rosso neon
  
  // Background
  static const Color bgDark = Color(0xFF0A0A0A);       // Nero assoluto
  static const Color bgCard = Color(0xFF1A1A1A);       // Grigio scuro
  static const Color bgInput = Color(0xFF0F0F0F);      // Nero input
  
  // Testo
  static const Color textPrimary = Color(0xFF00FF41);  // Verde
  static const Color textSecondary = Color(0xFF808080); // Grigio
  static const Color textWhite = Color(0xFFFFFFFF);    // Bianco
  
  // Effetti
  static const Color glow = Color(0xFF00FF41);         // Glow verde
  static const Color shadow = Color(0xFF000000);       // Ombra
}
```

### Font Monospace (stile hacker)

```dart
// pubspec.yaml
fonts:
  - family: Courier
    fonts:
      - asset: fonts/CourierPrime-Regular.ttf
      - asset: fonts/CourierPrime-Bold.ttf
        weight: 700

// Oppure usa:
fontFamily: 'Courier New'
```

### Effetti UI

```dart
// Glow effect
BoxDecoration(
  color: HackerTheme.bgCard,
  borderRadius: BorderRadius.circular(8),
  border: Border.all(
    color: HackerTheme.primary,
    width: 1,
  ),
  boxShadow: [
    BoxShadow(
      color: HackerTheme.glow.withOpacity(0.3),
      blurRadius: 10,
      spreadRadius: 2,
    ),
  ],
)

// Typing effect per messaggi
AnimatedTextKit(
  animatedTexts: [
    TypewriterAnimatedText(
      message,
      textStyle: TextStyle(
        color: HackerTheme.primary,
        fontFamily: 'Courier',
      ),
      speed: Duration(milliseconds: 50),
    ),
  ],
)

// Glitch effect per titoli
// Usa package: flutter_glitch_effect
```

---

## 🎭 ICONA APP MASCHERATA

### Opzione 1: Anonymous Mask
```
Icona: Maschera Guy Fawkes (Anonymous)
Colori: Bianco su nero con bordo verde neon
```

### Opzione 2: Skull Hacker
```
Icona: Teschio con occhi verdi luminosi
Colori: Nero con dettagli verde Matrix
```

### Opzione 3: Binary Face
```
Icona: Faccia stilizzata fatta di 0 e 1
Colori: Verde su nero
```

### Genera icona online:
1. Vai su: https://www.canva.com/
2. Cerca "hacker mask icon"
3. Personalizza con colori verde/nero
4. Esporta 1024x1024 PNG

### Oppure usa queste icone pronte:
- https://www.flaticon.com/search?word=hacker%20mask
- https://www.iconfinder.com/search?q=anonymous+mask

---

## 📱 NOME APP

Scegli uno:
- **CyberChat** 🔐
- **DarkNet Messenger** 🎭
- **Ghost Protocol** 👻
- **Shadow Talk** 🌑
- **Matrix Chat** 💚
- **Phantom Messenger** 👤
- **CipherChat** 🔒
- **BlackBox Messenger** ⬛

---

## 🎨 SCHERMATA LOGIN STILE HACKER

```dart
// Login screen con effetto Matrix
Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        Color(0xFF0A0A0A),
        Color(0xFF001A00),
      ],
    ),
  ),
  child: Column(
    children: [
      // Logo con glow
      Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Color(0xFF00FF41).withOpacity(0.5),
              blurRadius: 30,
              spreadRadius: 10,
            ),
          ],
        ),
        child: Image.asset('assets/logo_hacker.png'),
      ),
      
      // Titolo con glitch
      Text(
        'CYBERCH4T',
        style: TextStyle(
          fontSize: 32,
          fontFamily: 'Courier',
          color: Color(0xFF00FF41),
          letterSpacing: 4,
          shadows: [
            Shadow(
              color: Color(0xFF00FF41),
              blurRadius: 10,
            ),
          ],
        ),
      ),
      
      // Input con bordo neon
      TextField(
        style: TextStyle(
          color: Color(0xFF00FF41),
          fontFamily: 'Courier',
        ),
        decoration: InputDecoration(
          hintText: '> Enter username_',
          hintStyle: TextStyle(color: Color(0xFF808080)),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Color(0xFF00FF41)),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Color(0xFF00FF41), width: 2),
          ),
        ),
      ),
      
      // Button con glow
      ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFF00FF41),
          foregroundColor: Color(0xFF000000),
          shadowColor: Color(0xFF00FF41),
          elevation: 10,
        ),
        child: Text(
          '[ ACCESS ]',
          style: TextStyle(
            fontFamily: 'Courier',
            fontWeight: FontWeight.bold,
          ),
        ),
        onPressed: () => login(),
      ),
    ],
  ),
)
```

---

## 💬 CHAT STILE TERMINAL

```dart
// Messaggio ricevuto
Container(
  padding: EdgeInsets.all(12),
  decoration: BoxDecoration(
    color: Color(0xFF0F0F0F),
    border: Border.all(color: Color(0xFF00FF41)),
    borderRadius: BorderRadius.circular(4),
  ),
  child: Row(
    children: [
      Text(
        '> ',
        style: TextStyle(color: Color(0xFF00FF41)),
      ),
      Expanded(
        child: Text(
          message,
          style: TextStyle(
            color: Color(0xFF00FF41),
            fontFamily: 'Courier',
          ),
        ),
      ),
    ],
  ),
)

// Messaggio inviato
Container(
  padding: EdgeInsets.all(12),
  decoration: BoxDecoration(
    color: Color(0xFF001A00),
    border: Border.all(color: Color(0xFF00D9FF)),
    borderRadius: BorderRadius.circular(4),
  ),
  child: Text(
    message,
    style: TextStyle(
      color: Color(0xFF00D9FF),
      fontFamily: 'Courier',
    ),
  ),
)
```

---

## 🔊 SUONI STILE HACKER

```dart
// Suoni da aggiungere
assets/sounds/
  - message_received.mp3  // Beep elettronico
  - message_sent.mp3      // Click keyboard
  - notification.mp3      // Alert cyberpunk
  - typing.mp3            // Typing sound

// Usa package: audioplayers
```

---

## 📦 PACKAGES NECESSARI

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  
  # HTTP e Socket.IO
  http: ^1.1.0
  socket_io_client: ^2.0.3+1
  
  # UI Effects
  animated_text_kit: ^4.2.2
  shimmer: ^3.0.0
  flutter_glow: ^0.3.0
  
  # Audio
  audioplayers: ^5.2.1
  
  # Storage
  shared_preferences: ^2.2.2
  
  # Icons
  font_awesome_flutter: ^10.6.0
```

---

## 🎯 CONFIGURAZIONE URL RAILWAY

```dart
// lib/config/api_config.dart
class ApiConfig {
  // IMPORTANTE: Cambia questo con il tuo URL Railway!
  static const String BASE_URL = 'https://IL-TUO-URL.up.railway.app/api';
  static const String SOCKET_URL = 'https://IL-TUO-URL.up.railway.app';
  
  // App info
  static const String APP_NAME = 'CyberChat';
  static const String APP_VERSION = '2.0.0';
  
  // Theme
  static const bool DARK_MODE = true;
  static const bool HACKER_THEME = true;
}
```

---

## 🏗️ COMPILA APK

```bash
# 1. Modifica nome app
# android/app/src/main/AndroidManifest.xml
<application
    android:label="CyberChat"
    android:icon="@mipmap/ic_launcher">

# 2. Cambia icona
# Metti la tua icona hacker in:
# android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# 3. Compila
flutter build apk --release

# APK sarà in:
# build/app/outputs/flutter-apk/app-release.apk
```

---

## 📲 INSTALLA SUL TELEFONO

```bash
# Collega telefono via USB
# Abilita Debug USB sul telefono

# Installa
adb install build/app/outputs/flutter-apk/app-release.apk

# Oppure copia APK sul telefono e installa manualmente
```

---

## 🎨 SPLASH SCREEN HACKER

```dart
// lib/screens/splash_screen.dart
class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }
  
  Future<void> _initializeApp() async {
    // Simula caricamento con effetto hacker
    await Future.delayed(Duration(seconds: 2));
    
    // Vai a login/home
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0A0A0A),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo con glow
            Container(
              padding: EdgeInsets.all(30),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Color(0xFF00FF41).withOpacity(0.5),
                    blurRadius: 50,
                    spreadRadius: 20,
                  ),
                ],
              ),
              child: Icon(
                Icons.security,
                size: 100,
                color: Color(0xFF00FF41),
              ),
            ),
            
            SizedBox(height: 30),
            
            // Testo animato
            AnimatedTextKit(
              animatedTexts: [
                TypewriterAnimatedText(
                  'INITIALIZING...',
                  textStyle: TextStyle(
                    fontSize: 20,
                    color: Color(0xFF00FF41),
                    fontFamily: 'Courier',
                    letterSpacing: 2,
                  ),
                  speed: Duration(milliseconds: 100),
                ),
              ],
            ),
            
            SizedBox(height: 20),
            
            // Loading bar
            Container(
              width: 200,
              height: 4,
              child: LinearProgressIndicator(
                backgroundColor: Color(0xFF1A1A1A),
                valueColor: AlwaysStoppedAnimation<Color>(
                  Color(0xFF00FF41),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## ✅ CHECKLIST

- [ ] Cambia colori tema (verde/nero)
- [ ] Cambia icona app (maschera hacker)
- [ ] Cambia nome app (CyberChat o altro)
- [ ] Aggiungi font Courier/monospace
- [ ] Configura URL Railway in api_config.dart
- [ ] Compila APK: `flutter build apk --release`
- [ ] Installa sul telefono: `adb install app-release.apk`
- [ ] Testa connessione con Railway
- [ ] Verifica tema hacker funzioni

---

**Vuoi che ti prepari il codice completo del tema hacker? 🎭**



