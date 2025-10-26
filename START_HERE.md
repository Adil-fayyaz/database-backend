# 🚀 INIZIA QUI - AdilPrivateServer

## ✅ Tutto è pronto!

Il tuo server privato è stato creato completamente. Segui questi passi per avviarlo.

---

## 🎯 Setup Veloce (2 minuti)

### Passo 1: Installa le dipendenze

```powershell
npm install
cd dashboard && npm install && cd ..
```

### Passo 2: Genera le chiavi di sicurezza

```powershell
npm run generate-keys
```

Copia la chiave JWT generata e incollala nel file `.env`:

```powershell
# Crea il file .env se non esiste
copy env.template .env

# Apri il file .env e incolla la chiave generata
```

### Passo 3: Avvia MongoDB

```powershell
# Con Docker (più facile)
docker compose up -d mongodb

# O installa MongoDB localmente
# Scarica da: https://www.mongodb.com/try/download/community
```

### Passo 4: Popola il database (opzionale)

```powershell
npm run seed
```

Questo crea utenti e dati di test:
- 👤 Admin: `admin@example.com` / `admin123`
- 👤 User: `john@example.com` / `user123`

### Passo 5: Avvia tutto!

**Terminale 1 - Backend:**
```powershell
npm start
```

**Terminale 2 - Dashboard:**
```powershell
cd dashboard
npm run dev
```

---

## 🌐 Accedi

- **Dashboard**: http://localhost:3000
- **API Docs**: http://localhost:5000/api-docs
- **API**: http://localhost:5000/api

Login dashboard:
- Email: `admin@example.com`
- Password: `admin123`

---

## 📱 Connetti la tua App

Vedi **API_EXAMPLES.md** per esempi completi con:
- React Native
- Flutter
- Axios
- Fetch API

### Esempio rapido:

```javascript
// Registra un utente
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  },
  body: JSON.stringify({
    name: 'Mario',
    email: 'mario@example.com',
    password: 'password123'
  })
});
```

---

## 📚 Documentazione

- **SETUP_COMPLETE.md** - Guida completa di setup
- **README.md** - Documentazione completa del progetto
- **API_EXAMPLES.md** - Esempi di integrazione
- **QUICK_START.md** - Guida veloce
- **PROJECT_SUMMARY.md** - Riepilogo del progetto

---

## 🐳 Docker (Alternativa)

Se preferisci usare Docker per tutto:

```powershell
docker compose up -d
```

Poi avvia solo la dashboard:
```powershell
cd dashboard
npm run dev
```

---

## 🎨 Cosa include

✅ Backend completo con JWT auth  
✅ MongoDB con Mongoose  
✅ Dashboard React moderna  
✅ API REST complete  
✅ Swagger documentation  
✅ File upload  
✅ Sicurezza integrata  
✅ Docker support  
✅ Seed script per test data  

---

## 🆘 Problemi?

**MongoDB non si connette?**
- Installa MongoDB: https://www.mongodb.com/try/download/community
- Oppure usa Docker: `docker compose up -d mongodb`

**Porta già in uso?**
- Cambia la porta nel file `.env`

**Dashboard non si avvia?**
- Assicurati di essere nella directory `dashboard`
- Installa le dipendenze: `npm install`

**Serve aiuto?** Leggi **SETUP_COMPLETE.md** per la guida dettagliata!

---

## 🚀 Pronto!

Inizia con:
```powershell
npm install
npm run generate-keys
npm run seed
npm start
```

Buon lavoro! 🎉

