# ✅ TUTTO PRONTO! - Avvia Ora

## 🎉 SISTEMA COMPLETO E PRIVATO!

Il tuo server è configurato con **database SQLite locale** - tutto sul tuo computer, nessun servizio esterno!

---

## ✅ COSA È STATO FATTO

- ✅ Database SQLite locale creato: `data/database.db`
- ✅ Server in ascolto su **http://localhost:5000**
- ✅ Utenti di test creati
- ✅ Nessun MongoDB o servizio esterno
- ✅ Tutto completamente privato!

---

## 🚀 AVVIA LA DASHBOARD (2 comandi)

Apri un **NUOVO TERMINALE** PowerShell e esegui:

```powershell
cd "C:\Users\adil\Desktop\database infinity\dashboard"
npm run dev
```

Aspetta che appaia il messaggio:
```
➜  Local:   http://localhost:3000/
```

Poi apri il browser su: **http://localhost:3000**

---

## 🔑 LOGIN

```
Email: admin@example.com
Password: admin123
```

---

## 📡 API DISPONIBILI

Il server è già avviato su: **http://localhost:5000**

### Test API dal browser:

**Health Check:**
```
http://localhost:5000/health
```

**Registra Utente:**
```javascript
// Invia da Postman o dal browser console
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mario Rossi',
    email: 'mario@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log);
```

**Login:**
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
}).then(r => r.json()).then(console.log);
```

---

## 📱 COLLEGA LA TUA APP MOBILE

### Esempio Completo:

```javascript
const API_URL = 'http://localhost:5000/api';

// 1. Registra utente
async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
}

// 2. Login
async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
}

// 3. Invia messaggio
async function sendMessage(receiverId, content) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ receiverId, content })
  });
  return response.json();
}

// 4. Ricevi messaggi
async function getMessages() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// USAGE
(async () => {
  // Registra
  await registerUser('Mario', 'mario@test.com', 'pass123');
  
  // Login
  const { data } = await loginUser('mario@test.com', 'pass123');
  console.log('Token:', data.token);
  
  // Invia messaggio
  await sendMessage(2, 'Ciao, come va?');
  
  // Ricevi messaggi
  const { data: messages } = await getMessages();
  console.log('Messaggi:', messages);
})();
```

---

## 📂 FILE DATABASE

Tutto è salvato nel file locale:
```
data/database.db
```

**Per backup**: copia la cartella `data/`

---

## ✅ CHECKLIST

- [x] Database locale creato
- [x] Server in ascolto (porta 5000)
- [x] Utenti di test creati
- [ ] Dashboard avviata (esegui comando sopra)
- [ ] Apri http://localhost:3000
- [ ] Login con admin@example.com / admin123
- [ ] Collega la tua app mobile

---

## 🔗 ENDPOINTS

- `POST /api/auth/register` - Registra utente
- `POST /api/auth/login` - Login utente
- `GET /api/users` - Lista utenti
- `GET /api/messages` - Lista messaggi
- `POST /api/messages` - Crea messaggio
- `DELETE /api/messages/:id` - Elimina messaggio
- `GET /api/files` - Lista file
- `POST /api/files` - Carica file

---

## 🎯 COMANDI RAPIDI

```powershell
# Avvia server (già avviato)
npm start

# Popola database (già fatto)
npm run seed

# Avvia dashboard (NUOVO TERMINALE)
cd dashboard && npm run dev

# Backup database
Copy-Item "data\database.db" "backup-$(Get-Date -Format 'yyyyMMdd').db"
```

---

**🚀 TUTTO PRONTO! Accedi a http://localhost:3000**

