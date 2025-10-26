# ✅ RISOLVI TUTTO - Guida Rapida

## 🔴 PROBLEMA ATTUALE:
MongoDB non è installato/in esecuzione!

## 🚀 SOLUZIONE VELOCE (5 minuti)

### Opzione 1: Usa MongoDB Atlas (GRATUITO)

1. **Vai su**: https://www.mongodb.com/cloud/atlas/register

2. **Crea account gratuito** (compila il form)

3. **Crea cluster gratuito**:
   - Clicca "Build a Database"
   - Seleziona "FREE" (M0)
   - Crea

4. **Crea utente database**:
   - Username: `admin`
   - Password: `admin123`
   - Clicca "Create Database User"

5. **Ottieni connection string**:
   - Clicca "Connect" → "Connect your application"
   - Copia la string che inizia con `mongodb+srv://...`

6. **Modifica la stringa** aggiungendo la password:
   ```
   mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/privateserverx?retryWrites=true&w=majority
   ```

7. **Aggiungi al file `.env`**:
   ```env
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/privateserverx?retryWrites=true&w=majority
   JWT_SECRET=la_chiave_generata_con_npm_run_generate_keys
   ```

---

### Opzione 2: Installa MongoDB Locale

1. **Scarica MongoDB**: https://www.mongodb.com/try/download/community
   - Version: 7.0
   - Platform: Windows
   - Package: MSI

2. **Installa** (Next → Next → Finish)

3. **Avvia il servizio**:
   ```powershell
   net start MongoDB
   ```

---

## 🎯 DOPO AVER RISOLTO MONGODB

### Passo 1: Configura le chiavi

```powershell
cd "C:\Users\adil\Desktop\database infinity"
npm run generate-keys
```

Copia la chiave generata nel file `.env`

### Passo 2: Popola il database

```powershell
npm run seed
```

Dovresti vedere:
```
✅ MongoDB connected successfully
✅ Database seeded successfully!
```

### Passo 3: Avvia il backend

```powershell
npm start
```

### Passo 4: Avvia la dashboard (NUOVO TERMINALE)

```powershell
cd "C:\Users\adil\Desktop\database infinity\dashboard"
npm run dev
```

### Passo 5: Accedi!

Apri: **http://localhost:3000**

Credenziali:
- Email: `admin@example.com`
- Password: `admin123`

---

## 📱 COLLEGA LA TUA APP MOBILE

### Esempio con Fetch API:

```javascript
// Registra un utente
const registerUser = async (name, email, password) => {
  const response = await fetch('http://TUO_IP:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
};

// Login
const loginUser = async (email, password) => {
  const response = await fetch('http://TUO_IP:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};

// Invia messaggio
const sendMessage = async (receiverId, content) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://TUO_IP:5000/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ receiverId, content })
  });
  return response.json();
};

// Ricevi messaggi
const getMessages = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://TUO_IP:5000/api/messages', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

**Nota**: Sostituisci `TUO_IP` con:
- `localhost` se l'app è sulla stessa macchina
- L'IP della tua macchina (es: `192.168.1.100`) se l'app è su un dispositivo mobile

**Trova il tuo IP**:
```powershell
ipconfig | Select-String "IPv4"
```

---

## ✅ CHECKLIST

- [ ] MongoDB configurato (Atlas o locale)
- [ ] File `.env` creato
- [ ] Chiavi JWT generate e aggiunte a `.env`
- [ ] Database popolato con `npm run seed`
- [ ] Backend avviato con `npm start`
- [ ] Dashboard avviata con `npm run dev`
- [ ] Dashboard accessibile su http://localhost:3000
- [ ] API disponibile su http://localhost:5000/api-docs

---

## 🆘 AIUTO

Leggi anche:
- **QUICK_MONGODB_FIX.md** - Dettagli MongoDB
- **API_EXAMPLES.md** - Esempi completi API
- **SETUP_COMPLETE.md** - Setup dettagliato

