# 🔐 AdilPrivateServer - Completamente Privato

**100% LOCALE - NESSUN SERVIZIO ESTERNO!**

Un server privato completo con database locale, nessun MongoDB, nessun servizio cloud.

---

## ✨ Caratteristiche

- ✅ Database SQLite **LOCALE** (file .db)
- ✅ Nessun servizio esterno
- ✅ Tutto sul tuo computer
- ✅ Password criptate con bcrypt
- ✅ JWT authentication
- ✅ API REST complete
- ✅ Dashboard React admin
- ✅ Upload file
- ✅ Sicurezza integrata

---

## 🚀 Avvio Rapido

### 1. Installa dipendenze

```powershell
npm install
```

### 2. Popola il database

```powershell
npm run seed
```

Questo crea:
- Utenti di test
- Messaggi di esempio
- Il database locale `data/database.db`

### 3. Avvia il server

```powershell
npm start
```

Il server sarà su: **http://localhost:5000**

### 4. Avvia la dashboard (nuovo terminale)

```powershell
cd dashboard
npm install
npm run dev
```

Apri: **http://localhost:3000**

---

## 🔑 Credenziali

Dopo `npm run seed`:

```
Email: admin@example.com
Password: admin123
```

---

## 📡 API Endpoints

### Registrazione
```javascript
POST http://localhost:5000/api/auth/register
Body: { "name": "Mario", "email": "mario@example.com", "password": "password123" }
```

### Login
```javascript
POST http://localhost:5000/api/auth/login
Body: { "email": "mario@example.com", "password": "password123" }
```

### Invia Messaggio
```javascript
POST http://localhost:5000/api/messages
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { "receiverId": 2, "content": "Ciao!" }
```

### Ottieni Messaggi
```javascript
GET http://localhost:5000/api/messages
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Lista Utenti
```javascript
GET http://localhost:5000/api/users
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

---

## 🎯 Esempio Completo

```javascript
// 1. Registra un utente
const register = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mario Rossi',
    email: 'mario@example.com',
    password: 'password123'
  })
});
const { data } = await register.json();
const token = data.token;

// 2. Invia un messaggio
await fetch('http://localhost:5000/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    receiverId: 2,
    content: 'Ciao! Questo è il mio messaggio.'
  })
});

// 3. Ottieni tutti i messaggi
const messages = await fetch('http://localhost:5000/api/messages', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data: allMessages } = await messages.json();
console.log(allMessages);
```

---

## 📂 Struttura

```
adilprivateserver/
├── data/                    # Database locale SQLite
│   └── database.db         # File database
├── routes/                  # API routes
│   ├── auth.js
│   ├── users.js
│   ├── messages.js
│   └── files.js
├── dashboard/              # React dashboard
├── uploads/                # File caricati
├── database.js             # Database manager
└── server.js               # Entry point
```

---

## 🔒 Sicurezza

- ✅ Password hash con bcrypt
- ✅ JWT tokens
- ✅ Helmet security headers
- ✅ CORS configurato
- ✅ Rate limiting
- ✅ Validazione input

---

## 📱 Collegare App Mobile

### React Native / Flutter

```javascript
const API_URL = 'http://TUO_IP:5000/api';

// Trova il tuo IP
ipconfig // Windows
ifconfig // Mac/Linux

// Esempio con fetch
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'mario@example.com',
    password: 'password123'
  })
});
```

---

## 💾 Database Locale

Il database è un **file SQLite locale**:
- Cartella: `data/database.db`
- Nessun server esterno
- Solo sul tuo computer
- Backup: copia il file `database.db`

**Per fare backup**: copia la cartella `data/`

---

## 🆘 Troubleshooting

**Errore: Cannot find module 'better-sqlite3'**
```powershell
npm install
```

**Porta già in uso?**
Cambia la porta nel file `.env`:
```env
PORT=5001
```

---

## ✅ Checklist Avvio

- [ ] `npm install` eseguito
- [ ] `npm run seed` eseguito
- [ ] Server avviato con `npm start`
- [ ] Dashboard avviata con `cd dashboard && npm run dev`
- [ ] Accedi a http://localhost:3000
- [ ] Login con admin@example.com / admin123

---

**🚀 Tutto privato, tutto locale, tutto tuo!**
