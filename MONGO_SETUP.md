# 🗄️ MongoDB Setup per Windows

## Opzione 1: Installa MongoDB nativo (Raccomandato)

### Step 1: Download MongoDB
1. Vai su: https://www.mongodb.com/try/download/community
2. Seleziona:
   - **Version**: 7.0 (Latest)
   - **Platform**: Windows
   - **Package**: MSI
3. Scarica e installa

### Step 2: Durante l'installazione
- ✅ Seleziona "Complete"
- ✅ Installa come Windows Service
- ✅ Installa MongoDB Compass (GUI opzionale ma utile)

### Step 3: Verifica installazione
Apri PowerShell e verifica:

```powershell
mongo --version
```

### Step 4: MongoDB è già configurato!
Il file `.env` contiene già la connessione corretta:
```
MONGODB_URI=mongodb://localhost:27017/privateserverx
```

---

## Opzione 2: Usa Docker (Se preferisci)

### Step 1: Installa Docker Desktop
1. Vai su: https://www.docker.com/products/docker-desktop
2. Scarica "Docker Desktop for Windows"
3. Installa e riavvia il computer

### Step 2: Avvia MongoDB con Docker
```powershell
docker compose up -d mongodb
```

---

## Opzione 3: MongoDB Atlas (Cloud gratuito)

1. Vai su: https://www.mongodb.com/cloud/atlas/register
2. Crea un account gratuito
3. Crea un cluster gratuito
4. Copia la connection string
5. Incollala nel file `.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/privateserverx
```

---

## Dopo l'installazione

Riavvia il server:

```powershell
# Ferma il server (Ctrl+C)
# Poi riavvia:
npm start
```

Dovresti vedere:
```
✅ MongoDB connected successfully
```

---

## Troubleshooting

**Errore: "MongoDB connection error"**
- Assicurati che MongoDB sia in esecuzione
- Controlla il file `.env` esiste
- Verifica che la porta 27017 non sia occupata

**Come verificare MongoDB è attivo:**
```powershell
# Se hai installato MongoDB nativo:
Get-Service MongoDB

# Dovresti vedere: Running
```

```powershell
# Se usi Docker:
docker ps

# Dovresti vedere: privateserverx-mongodb
```

