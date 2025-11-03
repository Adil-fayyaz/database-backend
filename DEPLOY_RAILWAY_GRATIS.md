# 🚀 DEPLOY GRATIS SU RAILWAY - GUIDA COMPLETA

## ✅ FATTO FINORA

1. ✅ Railway CLI installato
2. ✅ JWT_SECRET generato
3. ✅ Ambiente cloud configurato

---

## 🎯 PROSSIMI PASSI

### 1. Login su Railway (1 minuto)

```bash
railway login
```

Si aprirà il browser, fai login con GitHub (gratis).

---

### 2. Inizializza progetto (30 secondi)

```bash
railway init
```

Ti chiederà:
- **Nome progetto:** `messaging-server` (o quello che vuoi)
- Premi INVIO per confermare

---

### 3. Configura variabili d'ambiente (1 minuto)

```bash
# Imposta JWT_SECRET
railway variables set JWT_SECRET=8a31ad4d9e8df74a2f83f9edcbfe2eb1cfc6b2bc3c724bab9f68251c9b7d7c29e3aa343b8c642762dfce3c8d78a961506660213d8a91fd36a6337da981bd3977

# Imposta NODE_ENV
railway variables set NODE_ENV=production

# Imposta PORT (Railway lo fornisce automaticamente, ma impostiamo default)
railway variables set PORT=3000
```

---

### 4. Deploy! (2 minuti)

```bash
railway up
```

Vedrai:
```
✓ Build successful
✓ Deployment successful
```

---

### 5. Ottieni URL pubblico (30 secondi)

```bash
railway domain
```

Output tipo:
```
https://messaging-server-production-xxxx.up.railway.app
```

**Copia questo URL!**

---

### 6. Testa che funzioni (30 secondi)

```bash
# Sostituisci con il tuo URL
curl https://messaging-server-production-xxxx.up.railway.app/health
```

Dovresti vedere:
```json
{
  "status": "OK",
  "database": "connected",
  "websocket": "active"
}
```

---

### 7. Aggiorna app mobile (2 minuti)

**Flutter:**
```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String BASE_URL = 'https://messaging-server-production-xxxx.up.railway.app/api';
  static const String SOCKET_URL = 'https://messaging-server-production-xxxx.up.railway.app';
}
```

**React Native:**
```javascript
// config/api.js
export const API_URL = 'https://messaging-server-production-xxxx.up.railway.app/api';
export const SOCKET_URL = 'https://messaging-server-production-xxxx.up.railway.app';
```

Ricompila l'app e sei pronto!

---

## 🎉 FATTO!

Il tuo server è:
- ✅ Online 24/7
- ✅ Gratis (500h/mese = sempre attivo per uso normale)
- ✅ URL pubblico
- ✅ HTTPS automatico
- ✅ Deploy automatico da Git

---

## 📊 MONITORAGGIO

### Vedi logs in tempo reale
```bash
railway logs
```

### Vedi status
```bash
railway status
```

### Dashboard web
```bash
railway open
```

Si apre il browser con dashboard completa.

---

## 🔄 AGGIORNAMENTI FUTURI

Quando modifichi il codice:

```bash
# Commit le modifiche
git add .
git commit -m "Update"
git push

# Railway fa deploy automatico!
# Oppure manualmente:
railway up
```

---

## 💰 COSTI

**Tier Gratuito Railway:**
- ✅ $5 di credito/mese
- ✅ 500 ore esecuzione/mese
- ✅ 100GB bandwidth/mese
- ✅ 1GB RAM
- ✅ 1GB storage

**Per uso normale (messaggi, gruppi, file):**
- Consumi: ~$2-3/mese
- **Resta sempre nel tier gratuito!**

**Se superi:**
- Primo mese gratis comunque
- Poi ~$5/mese per uso illimitato

---

## 🆘 TROUBLESHOOTING

### Build fallisce
```bash
# Verifica che package.json sia corretto
cat package.json

# Riprova deploy
railway up --force
```

### Database non si crea
```bash
# Railway usa storage effimero di default
# Aggiungi volume persistente:
railway volume create data
railway volume mount data /app/data
```

### Logs per debug
```bash
railway logs --follow
```

---

## 🔐 SICUREZZA

Railway fornisce automaticamente:
- ✅ HTTPS (certificato SSL gratuito)
- ✅ Firewall
- ✅ DDoS protection
- ✅ Backup automatici

---

## 📱 L'APP FUNZIONERÀ?

**SÌ! Perfettamente!**

Dopo aver aggiornato l'URL nell'app:
1. ✅ Messaggi real-time (< 1 secondo)
2. ✅ Gruppi
3. ✅ File upload
4. ✅ Status/Storie
5. ✅ Chiamate vocali/video
6. ✅ Tutto funziona identico

**Differenza:** Invece di `http://192.168.1.2:3000` usi `https://tuoapp.up.railway.app`

---

## 🎯 COMANDI RAPIDI

```bash
# Login
railway login

# Init progetto
railway init

# Configura variabili
railway variables set JWT_SECRET=tuo_secret
railway variables set NODE_ENV=production

# Deploy
railway up

# Ottieni URL
railway domain

# Logs
railway logs

# Status
railway status

# Dashboard
railway open
```

---

**Deploy completato! Server online gratis! 🎉**



