# ⚡ SETUP VELOCE - CAMBIA SERVER IN 3 PASSI

## 🚀 PRIMO AVVIO

### 1. Genera Secret Sicuro
```bash
npm run generate-secret
```
Copia il `JWT_SECRET` generato.

### 2. Scegli Ambiente
```bash
# Server locale (PC casa)
npm run env:local

# VPS (Contabo, Hetzner, Oracle)
npm run env:vps

# Raspberry Pi
npm run env:raspberry

# Cloud (Railway, Render)
npm run env:cloud
```

### 3. Configura .env
Apri il file `.env` appena creato e modifica:
```env
JWT_SECRET=il_secret_copiato_prima
PUBLIC_URL=http://tuodominio.com
CORS_ORIGINS=http://tuodominio.com
```

### 4. Avvia Server
```bash
npm start
```

---

## 🔄 CAMBIARE SERVER

### Da Locale a VPS
```bash
npm run env:vps
# Modifica .env con nuovo URL
npm start
```

### Da VPS a Cloud
```bash
npm run env:cloud
# Modifica .env con URL cloud
npm start
```

### Da qualsiasi a Raspberry Pi
```bash
npm run env:raspberry
# Modifica .env con DuckDNS URL
npm start
```

---

## 📋 COMANDI RAPIDI

```bash
# Genera nuovo secret
npm run generate-secret

# Cambia a locale
npm run env:local

# Cambia a VPS
npm run env:vps

# Cambia a Raspberry
npm run env:raspberry

# Cambia a cloud
npm run env:cloud

# Testa sistema
npm test

# Avvia server
npm start

# Sviluppo (auto-restart)
npm run dev
```

---

## 🌍 CONFIGURAZIONI AMBIENTE

### 🏠 Locale (PC casa)
- **Quando:** Sviluppo, test, uso personale
- **Costo:** Gratis
- **Sempre attivo:** ❌ (solo se PC acceso)
- **Privacy:** ⭐⭐⭐⭐⭐

### 🖥️ VPS (Server dedicato)
- **Quando:** Produzione, sempre disponibile
- **Costo:** €4/mese
- **Sempre attivo:** ✅
- **Privacy:** ⭐⭐⭐⭐⭐

### 🍓 Raspberry Pi (Casa sempre attivo)
- **Quando:** Server casa 24/7, privacy assoluta
- **Costo:** €60 una tantum + €2/anno elettricità
- **Sempre attivo:** ✅
- **Privacy:** ⭐⭐⭐⭐⭐

### ☁️ Cloud (Railway, Render)
- **Quando:** Deploy veloce, scalabile
- **Costo:** Gratis/€5/mese
- **Sempre attivo:** ✅
- **Privacy:** ⭐⭐⭐

---

## 🔐 PRIVACY

Per privacy massima, usa:
1. **VPS** o **Raspberry Pi** (tu controlli hardware)
2. Aggiungi **E2E encryption** (guida separata)
3. Usa **HTTPS** sempre
4. Non usare servizi cloud che vedono i dati

---

## 📱 AGGIORNA APP

Quando cambi server, aggiorna URL nell'app mobile:

**Flutter:**
```dart
// lib/config/api_config.dart
static const String BASE_URL = 'https://nuovoserver.com/api';
```

**React Native:**
```javascript
// config/api.js
export const API_URL = 'https://nuovoserver.com/api';
```

---

## ✅ CHECKLIST

- [ ] Generato JWT_SECRET
- [ ] Scelto ambiente (local/vps/raspberry/cloud)
- [ ] Configurato .env con URL corretto
- [ ] Testato con `npm test`
- [ ] Server avviato con `npm start`
- [ ] App mobile aggiornata con nuovo URL

---

**Cambiare server è facile! Basta 1 comando! 🎉**



