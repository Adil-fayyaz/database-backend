# 🔄 GUIDA: CAMBIARE SERVER FACILMENTE

Questo sistema è configurato per permetterti di cambiare server quando vuoi, senza modificare il codice.

---

## 🚀 CAMBIO RAPIDO (1 comando)

### Cambia a Server Locale (PC casa)
```bash
node scripts/switch-environment.js local
npm start
```

### Cambia a VPS (Contabo, Hetzner, Oracle Cloud)
```bash
node scripts/switch-environment.js vps
npm start
```

### Cambia a Raspberry Pi
```bash
node scripts/switch-environment.js raspberry
npm start
```

### Cambia a Cloud (Railway, Render, Fly.io)
```bash
node scripts/switch-environment.js cloud
npm start
```

---

## 📝 CONFIGURAZIONE INIZIALE

### 1. Genera JWT Secret (una volta sola)
```bash
node scripts/generate-secret.js
```

Copia il secret generato nel file `.env` che stai usando.

### 2. Scegli l'ambiente
```bash
# Esempio: uso VPS
node scripts/switch-environment.js vps
```

### 3. Modifica configurazione
Apri il file `.env` e aggiorna:
```env
JWT_SECRET=il_secret_generato_prima
PUBLIC_URL=https://tuodominio.com
CORS_ORIGINS=https://tuodominio.com,https://app.tuodominio.com
```

### 4. Avvia server
```bash
npm start
```

---

## 🌍 CONFIGURAZIONI PER AMBIENTE

### 🏠 Server Locale (PC casa)
**File:** `.env.local`

**Quando usare:**
- Sviluppo e test
- Uso personale in rete locale
- Non serve dominio pubblico

**Configurazione:**
```env
PUBLIC_URL=http://192.168.1.2:3000
CORS_ORIGINS=http://localhost:3000,http://192.168.1.2:3000
```

**Pro:**
- Gratis
- Controllo totale
- Veloce (rete locale)

**Contro:**
- Funziona solo se PC acceso
- Solo in rete locale (o con port forwarding)

---

### 🖥️ VPS (Server dedicato)
**File:** `.env.vps`

**Quando usare:**
- Produzione
- Sempre disponibile
- Privacy totale (tu controlli il server)

**Provider consigliati:**
- **Contabo**: €4/mese
- **Hetzner**: €4/mese
- **Oracle Cloud**: GRATIS (free tier)
- **Scaleway**: Da €0.10/ora

**Configurazione:**
```env
PUBLIC_URL=https://tuodominio.com
CORS_ORIGINS=https://tuodominio.com
FORCE_HTTPS=true
```

**Setup VPS:**
```bash
# 1. Connetti al VPS via SSH
ssh root@tuoip

# 2. Installa Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. Copia il progetto
git clone https://github.com/tuorepo/messaging-server.git
cd messaging-server

# 4. Configura ambiente
node scripts/switch-environment.js vps
node scripts/generate-secret.js
# Copia il secret nel .env

# 5. Installa dipendenze
npm install

# 6. Avvia con PM2 (sempre attivo)
npm install -g pm2
pm2 start npm --name "messaging-server" -- start
pm2 save
pm2 startup
```

---

### 🍓 Raspberry Pi (Server casa sempre attivo)
**File:** `.env.raspberry`

**Quando usare:**
- Server casa sempre attivo
- Privacy assoluta
- Consumi bassissimi (€2/anno elettricità)

**Hardware necessario:**
- Raspberry Pi 4 (4GB RAM) - €60
- MicroSD 64GB - €10
- Alimentatore ufficiale - €10

**Configurazione:**
```env
PUBLIC_URL=https://tuoserver.duckdns.org
DB_PATH=/home/pi/messaging-server/data/database.db
```

**Setup Raspberry Pi:**
```bash
# 1. Installa Ubuntu Server su Raspberry Pi
# Usa Raspberry Pi Imager

# 2. Connetti via SSH
ssh pi@192.168.1.X

# 3. Installa Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
sudo apt-get install -y nodejs

# 4. Copia progetto
git clone https://github.com/tuorepo/messaging-server.git
cd messaging-server

# 5. Configura
node scripts/switch-environment.js raspberry
node scripts/generate-secret.js

# 6. Setup DuckDNS (URL gratuito)
# Registrati su duckdns.org
# Crea dominio: tuoserver.duckdns.org
# Configura nel router: port forwarding porta 3000

# 7. Avvia con PM2
npm install -g pm2
pm2 start npm --name "messaging-server" -- start
pm2 save
pm2 startup
```

---

### ☁️ Cloud (Railway, Render, Fly.io)
**File:** `.env.cloud`

**Quando usare:**
- Deploy veloce
- Tier gratuito disponibile
- Scalabilità automatica

**Provider consigliati:**
- **Railway**: Gratis per tier base, poi $5/mese
- **Render**: Gratis per tier base
- **Fly.io**: Gratis per 3 VM piccole

**Configurazione:**
```env
PUBLIC_URL=https://tuoapp.up.railway.app
```

**Deploy su Railway:**
```bash
# 1. Installa Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Crea progetto
railway init

# 4. Configura variabili d'ambiente
railway variables set JWT_SECRET=$(node scripts/generate-secret.js | grep JWT_SECRET | cut -d= -f2)
railway variables set NODE_ENV=production

# 5. Deploy
railway up

# 6. Ottieni URL
railway domain
```

---

## 🔐 PRIVACY: QUALE SCEGLIERE?

| Soluzione | Privacy | Costo | Sempre attivo | Setup |
|-----------|---------|-------|---------------|-------|
| **Locale** | ⭐⭐⭐⭐⭐ | Gratis | ❌ | Facile |
| **VPS** | ⭐⭐⭐⭐⭐ | €4/mese | ✅ | Medio |
| **Raspberry Pi** | ⭐⭐⭐⭐⭐ | €2/anno | ✅ | Medio |
| **Cloud** | ⭐⭐⭐ | Gratis/€5 | ✅ | Facile |

**Per privacy massima:** VPS o Raspberry Pi + E2E encryption

---

## 🔄 MIGRAZIONE TRA SERVER

### Da Locale a VPS
```bash
# 1. Backup database
cp data/database.db database-backup.db

# 2. Sul VPS
scp database-backup.db root@tuovps:/var/www/messaging-server/data/database.db

# 3. Cambia ambiente
node scripts/switch-environment.js vps

# 4. Aggiorna .env con nuovo URL
# PUBLIC_URL=https://tuodominio.com

# 5. Riavvia
pm2 restart messaging-server
```

### Da VPS a Raspberry Pi
```bash
# 1. Backup dal VPS
ssh root@tuovps "tar -czf backup.tar.gz /var/www/messaging-server/data"
scp root@tuovps:backup.tar.gz .

# 2. Ripristina su Raspberry
scp backup.tar.gz pi@raspberry:/home/pi/
ssh pi@raspberry "tar -xzf backup.tar.gz"

# 3. Cambia ambiente
node scripts/switch-environment.js raspberry

# 4. Riavvia
pm2 restart messaging-server
```

---

## 📱 AGGIORNA APP MOBILE

Quando cambi server, aggiorna l'URL nell'app:

**Flutter/Dart:**
```dart
// lib/config/api_config.dart
class ApiConfig {
  // Cambia questo quando cambi server
  static const String BASE_URL = 'https://tuonuovoserver.com/api';
  static const String SOCKET_URL = 'https://tuonuovoserver.com';
}
```

**React Native:**
```javascript
// config/api.js
export const API_URL = 'https://tuonuovoserver.com/api';
export const SOCKET_URL = 'https://tuonuovoserver.com';
```

Poi ricompila l'app.

---

## 🆘 TROUBLESHOOTING

### Server non si avvia
```bash
# Verifica configurazione
cat .env

# Controlla se JWT_SECRET è configurato
grep JWT_SECRET .env

# Rigenera secret se necessario
node scripts/generate-secret.js
```

### CORS errors
```bash
# Verifica CORS_ORIGINS nel .env
# Deve includere l'URL da cui accedi

# Esempio:
CORS_ORIGINS=https://tuodominio.com,https://app.tuodominio.com
```

### Database non trovato
```bash
# Verifica path database
grep DB_PATH .env

# Crea directory se non esiste
mkdir -p data
```

---

## 💡 TIPS

1. **Tieni backup:** Fai backup regolare del database
2. **Usa PM2:** Per tenere server sempre attivo
3. **Monitoring:** Usa `pm2 monit` per vedere status
4. **Logs:** `pm2 logs messaging-server` per vedere errori
5. **SSL/HTTPS:** Usa Caddy o Nginx per HTTPS automatico su VPS

---

**Cambiare server è facile! Basta 1 comando e sei pronto! 🚀**



