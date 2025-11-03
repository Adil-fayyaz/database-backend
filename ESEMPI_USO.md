# 📚 ESEMPI PRATICI DI USO

## 🎯 SCENARI COMUNI

### Scenario 1: Sviluppo Locale → Produzione VPS

**Situazione:** Stai sviluppando sul PC, poi vuoi mettere in produzione su VPS.

```bash
# 1. SVILUPPO LOCALE
npm run env:local
npm run generate-secret
# Modifica .env con il secret generato
npm start

# Sviluppa e testa...

# 2. QUANDO SEI PRONTO PER PRODUZIONE
# Sul tuo PC, prepara per VPS
npm run env:vps

# Modifica .env:
# PUBLIC_URL=https://tuodominio.com
# CORS_ORIGINS=https://tuodominio.com
# JWT_SECRET=usa_lo_stesso_secret_o_generane_uno_nuovo

# 3. BACKUP DATABASE
cp data/database.db database-prod-backup.db

# 4. CARICA SU VPS
scp -r . root@tuovps:/var/www/messaging-server/
scp database-prod-backup.db root@tuovps:/var/www/messaging-server/data/database.db

# 5. SUL VPS
ssh root@tuovps
cd /var/www/messaging-server
npm install
npm start

# 6. CONFIGURA PM2 (per tenere sempre attivo)
npm install -g pm2
pm2 start npm --name "messaging-server" -- start
pm2 save
pm2 startup
```

---

### Scenario 2: VPS → Raspberry Pi (per risparmiare)

**Situazione:** Hai un VPS che costa €4/mese, vuoi passare a Raspberry Pi per risparmiare.

```bash
# 1. SETUP RASPBERRY PI
# Sul Raspberry Pi
sudo apt update
sudo apt install -y nodejs npm git
git clone https://github.com/tuorepo/messaging-server.git
cd messaging-server
npm install

# 2. CONFIGURA RASPBERRY
npm run env:raspberry

# Modifica .env:
# PUBLIC_URL=https://tuoserver.duckdns.org
# JWT_SECRET=copia_quello_dal_vps

# 3. TRASFERISCI DATABASE DAL VPS
# Sul tuo PC
scp root@tuovps:/var/www/messaging-server/data/database.db ./database-vps.db
scp database-vps.db pi@raspberry:/home/pi/messaging-server/data/database.db

# 4. CONFIGURA DUCKDNS (URL gratuito)
# Vai su duckdns.org
# Crea dominio: tuoserver.duckdns.org
# Configura nel router: port forwarding porta 3000 → Raspberry Pi

# 5. AVVIA SU RASPBERRY
# Sul Raspberry Pi
npm install -g pm2
pm2 start npm --name "messaging-server" -- start
pm2 save
pm2 startup

# 6. TESTA
curl https://tuoserver.duckdns.org/health

# 7. AGGIORNA APP MOBILE
# Cambia URL nell'app: https://tuoserver.duckdns.org

# 8. SPEGNI VPS (risparmi €4/mese!)
```

---

### Scenario 3: Deploy Veloce su Railway

**Situazione:** Vuoi mettere online velocemente senza configurare server.

```bash
# 1. PREPARA PROGETTO
npm run env:cloud

# 2. INSTALLA RAILWAY CLI
npm install -g @railway/cli

# 3. LOGIN E INIT
railway login
railway init

# 4. GENERA E CONFIGURA SECRET
npm run generate-secret
# Copia il JWT_SECRET generato

railway variables set JWT_SECRET=il_secret_copiato
railway variables set NODE_ENV=production

# 5. DEPLOY
railway up

# 6. OTTIENI URL
railway domain
# Output: https://messaging-server-production.up.railway.app

# 7. CONFIGURA DOMINIO CUSTOM (opzionale)
railway domain add tuodominio.com

# 8. AGGIORNA APP MOBILE
# URL: https://messaging-server-production.up.railway.app

# FATTO! Server online in 5 minuti! 🚀
```

---

### Scenario 4: Backup e Restore

**Situazione:** Vuoi fare backup regolare del database.

```bash
# BACKUP AUTOMATICO
# Aggiungi a crontab (Linux/Mac) o Task Scheduler (Windows)

# Script backup giornaliero
#!/bin/bash
DATE=$(date +%Y%m%d)
cp /var/www/messaging-server/data/database.db \
   /var/www/backups/database-$DATE.db

# Tieni solo ultimi 7 giorni
find /var/www/backups -name "database-*.db" -mtime +7 -delete

# RESTORE DA BACKUP
# Se qualcosa va storto
cp /var/www/backups/database-20251031.db \
   /var/www/messaging-server/data/database.db

pm2 restart messaging-server
```

---

### Scenario 5: Multi-Ambiente (Dev + Staging + Prod)

**Situazione:** Vuoi 3 ambienti separati.

```bash
# DEVELOPMENT (locale)
npm run env:local
# .env con: PUBLIC_URL=http://localhost:3000

# STAGING (VPS test)
npm run env:vps
# .env con: PUBLIC_URL=https://staging.tuodominio.com

# PRODUCTION (VPS prod)
npm run env:vps
# .env con: PUBLIC_URL=https://tuodominio.com

# Ogni ambiente ha:
# - Database separato
# - JWT_SECRET separato
# - CORS_ORIGINS separato
```

---

### Scenario 6: Migrazione da Cloud a VPS (più privacy)

**Situazione:** Hai Railway ma vuoi più controllo e privacy.

```bash
# 1. BACKUP DA RAILWAY
railway run node scripts/backup-db.js
railway download data/database.db ./database-railway.db

# 2. SETUP VPS
ssh root@tuovps
apt update && apt install -y nodejs npm
git clone https://github.com/tuorepo/messaging-server.git
cd messaging-server
npm install

# 3. CONFIGURA VPS
npm run env:vps
npm run generate-secret
# Modifica .env con nuovo secret e dominio

# 4. TRASFERISCI DATABASE
# Dal tuo PC
scp database-railway.db root@tuovps:/var/www/messaging-server/data/database.db

# 5. AVVIA SU VPS
ssh root@tuovps
cd /var/www/messaging-server
pm2 start npm --name "messaging-server" -- start
pm2 save

# 6. CONFIGURA NGINX + SSL
sudo apt install -y nginx certbot python3-certbot-nginx
# Configura nginx reverse proxy
# Ottieni SSL con: certbot --nginx -d tuodominio.com

# 7. AGGIORNA APP
# URL: https://tuodominio.com

# 8. CANCELLA RAILWAY
railway down
```

---

### Scenario 7: Test Locale Prima di Deploy

**Situazione:** Vuoi testare tutto localmente prima di mettere online.

```bash
# 1. SETUP LOCALE
npm run env:local
npm run generate-secret
npm start

# 2. TESTA
npm test
# Verifica che tutti i test passino (10/10)

# 3. TESTA MANUALMENTE
# Apri http://localhost:3000/health
# Registra utente test
# Invia messaggi
# Testa gruppi
# Testa upload file

# 4. SE TUTTO OK, DEPLOY
npm run env:vps
# Configura .env per produzione
# Deploy su VPS

# 5. TESTA IN PRODUZIONE
npm test
# Verifica che funzioni anche online
```

---

### Scenario 8: Disaster Recovery

**Situazione:** Il server è crashato, devi ripristinare velocemente.

```bash
# PIANO A: Ripristina stesso server
ssh root@tuovps
cd /var/www/messaging-server
git pull
npm install
cp /var/www/backups/database-latest.db data/database.db
pm2 restart messaging-server

# PIANO B: Sposta su nuovo server
# 1. Setup nuovo VPS
ssh root@nuovovps
# Installa tutto come scenario 1

# 2. Trasferisci backup
scp /var/www/backups/database-latest.db root@nuovovps:/var/www/messaging-server/data/

# 3. Aggiorna DNS
# Punta tuodominio.com → nuovo IP

# 4. Avvia
pm2 start npm --name "messaging-server" -- start

# PIANO C: Failover su Railway (velocissimo)
railway init
railway up
railway domain add tuodominio.com
# Online in 5 minuti!
```

---

## 💡 TIPS & TRICKS

### Monitoraggio

```bash
# Con PM2
pm2 monit

# Logs in tempo reale
pm2 logs messaging-server

# Status
pm2 status

# Restart se necessario
pm2 restart messaging-server
```

### Performance

```bash
# Ottimizza database
sqlite3 data/database.db "VACUUM;"
sqlite3 data/database.db "ANALYZE;"

# Pulisci vecchi file upload
find uploads/ -mtime +30 -delete

# Pulisci vecchi status (>24h)
# Automatico nel codice
```

### Security

```bash
# Rigenera JWT_SECRET periodicamente
npm run generate-secret
# Aggiorna .env
pm2 restart messaging-server

# Aggiorna dipendenze
npm audit fix
npm update

# Backup prima di aggiornare
cp data/database.db data/database-pre-update.db
```

### Debug

```bash
# Verifica configurazione
cat .env

# Test connessione database
sqlite3 data/database.db "SELECT COUNT(*) FROM users;"

# Test API
curl http://localhost:3000/health

# Test Socket.IO
node test-realtime.js
```

---

## 🎯 CHECKLIST DEPLOYMENT

Prima di ogni deploy:

- [ ] Backup database
- [ ] Test locali passano (npm test)
- [ ] .env configurato correttamente
- [ ] JWT_SECRET sicuro (min 32 caratteri)
- [ ] CORS_ORIGINS include tutti i domini necessari
- [ ] HTTPS configurato (in produzione)
- [ ] PM2 configurato per auto-restart
- [ ] Backup automatici attivi
- [ ] Monitoring attivo (PM2 o altro)
- [ ] App mobile aggiornata con nuovo URL

---

**Con questi esempi puoi gestire qualsiasi scenario! 🚀**



