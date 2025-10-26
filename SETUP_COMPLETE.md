# ✅ Setup Completo - AdilPrivateServer

## 🎉 Il progetto è pronto!

Tutto è stato configurato. Segui questi passaggi per avviare il server.

---

## 📋 Prerequisiti

Assicurati di avere installato:
- ✅ Node.js 18+
- ✅ npm
- ✅ MongoDB (locale o Docker)

---

## 🚀 Setup Rapido (3 passi)

### 1️⃣ Installa le dipendenze

```powershell
# Installa backend
npm install

# Installa dashboard
cd dashboard
npm install
cd ..
```

### 2️⃣ Configura l'ambiente

Crea il file `.env` nella root del progetto:

```powershell
cp env.template .env
```

Edita il file `.env` con queste variabili:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/privateserverx
JWT_SECRET=genera_una_chiave_sicura_con_il_comando_sotto
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

Genera una chiave JWT sicura:

```powershell
npm run generate-keys
```

Copia la chiave generata nel file `.env`.

### 3️⃣ Avvia MongoDB

**Opzione A - Con Docker (più facile):**

```powershell
docker compose up -d mongodb
```

**Opzione B - MongoDB locale:**

Installa MongoDB per Windows:
https://www.mongodb.com/try/download/community

---

## 🌱 Popola il database con dati di test

```powershell
npm run seed
```

Questo creerà:
- 👥 4 utenti (1 admin, 3 utenti)
- 💬 8 messaggi di esempio
- 📁 3 file di test

**Credenziali di test:**
- Admin: `admin@example.com` / `admin123`
- User: `john@example.com` / `user123`

---

## 🎯 Avvia il sistema

### Terminale 1 - Backend

```powershell
npm start
```

Dovresti vedere:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📚 API Documentation: http://localhost:5000/api-docs
```

### Terminale 2 - Dashboard

```powershell
cd dashboard
npm run dev
```

Apri il browser: **http://localhost:3000**

---

## 📱 Accedi alla Dashboard

1. Apri **http://localhost:3000**
2. Login con:
   - Email: `admin@example.com`
   - Password: `admin123`

---

## 🔗 Connetti la tua App Mobile

### Esempi di API:

#### Registra un utente:
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mario Rossi',
    email: 'mario@example.com',
    password: 'password123'
  })
}).then(res => res.json())
  .then(data => console.log(data.data.token));
```

#### Login:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'mario@example.com',
    password: 'password123'
  })
}).then(res => res.json())
  .then(data => localStorage.setItem('token', data.data.token));
```

#### Invia un messaggio:
```javascript
fetch('http://localhost:5000/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    receiverId: 'USER_ID',
    content: 'Ciao! Questo è il mio messaggio.'
  })
});
```

#### Ottieni tutti i messaggi:
```javascript
fetch('http://localhost:5000/api/messages', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(res => res.json())
  .then(data => console.log(data.data));
```

---

## 📚 Documentazione API

Vai su: **http://localhost:5000/api-docs**

Troverai:
- Tutti gli endpoint disponibili
- Esempi di richieste e risposte
- Provare le API direttamente dal browser

---

## 🎯 Endpoint Disponibili

### Autenticazione
- `POST /api/auth/register` - Registra utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Ottieni utente corrente

### Utenti
- `GET /api/users` - Lista tutti gli utenti
- `GET /api/users/:id` - Dettagli utente
- `DELETE /api/users/:id` - Elimina utente

### Messaggi
- `GET /api/messages` - Lista tutti i messaggi
- `POST /api/messages` - Crea un messaggio
- `DELETE /api/messages/:id` - Elimina messaggio

### File
- `GET /api/files` - Lista tutti i file
- `POST /api/files` - Carica un file
- `DELETE /api/files/:id` - Elimina un file

---

## 🐳 Usa Docker (Opzionale)

Avvia tutto con Docker:

```powershell
docker compose up -d
```

Questo avvierà:
- ✅ MongoDB
- ✅ Backend Node.js

Poi avvia solo la dashboard:

```powershell
cd dashboard
npm run dev
```

---

## 📱 Flutter/React Native

Guarda il file **API_EXAMPLES.md** per esempi completi per:
- React Native
- Flutter
- Axios
- Fetch API

---

## 🔒 Sicurezza

✅ Password crittografate con bcrypt  
✅ JWT tokens per autenticazione  
✅ Helmet per sicurezza HTTP  
✅ CORS configurato  
✅ Rate limiting attivo  
✅ Input validation  
✅ Nessun servizio esterno - tutto locale!  

---

## 🆘 Troubleshooting

**Errore: "MongoDB connection error"**
- Verifica che MongoDB sia avviato: `docker compose up -d mongodb`

**Porta già in uso:**
- Cambia la porta nel file `.env`

**Dashboard non si carica:**
- Assicurati di essere nella directory dashboard
- Verifica che la porta 3000 non sia occupata

**Token non valido:**
- Fai logout e login di nuovo
- Verifica che il token sia presente in localStorage

---

## 📂 Struttura Progetto

```
privateserverx/
├── 📁 models/          # Database models
├── 📁 routes/          # API routes
├── 📁 middleware/      # Auth, logging
├── 📁 scripts/         # Seed, utilities
├── 📁 dashboard/       # React dashboard
├── 📁 uploads/         # File caricati
├── 📁 logs/            # Server logs
└── 📄 server.js        # Entry point
```

---

## 🎉 Tutto pronto!

Il tuo server privato è funzionante e sicuro. Buon lavoro! 🚀

