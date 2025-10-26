# 🚀 Soluzione Veloce per MongoDB (2 minuti)

## Opzione 1: MongoDB Atlas (GRATUITO - Più Veloce)

1. Vai su: https://www.mongodb.com/cloud/atlas/register
2. Clicca "Try Free"
3. Inserisci:
   - Nome: Adil
   - Email: la tua email
   - Password: una password sicura
4. Clicca "Get started free"
5. Seleziona "Build a Database" → "FREE" (M0)
6. Seleziona "AWS" e una regione vicina
7. Clicca "Create"
8. Crea un utente database:
   - Username: `admin`
   - Password: `admin123` (o altra password)
   - Clicca "Create Database User"
9. Clicca "Connect" → "Connect your application"
10. Copia la connection string. Sembra così:
    ```
    mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
11. Sostituisci `<password>` con la password che hai scelto
12. Aggiungi il nome del database alla fine:
    ```
    mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/privateserverx?retryWrites=true&w=majority
    ```

13. Apri il file `.env` nel progetto e incolla questa string:
    ```env
    MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/privateserverx?retryWrites=true&w=majority
    ```

14. Salva il file e riavvia il server!

---

## Opzione 2: Installa MongoDB Locale (5 minuti)

### Download e installazione:
1. Vai su: https://www.mongodb.com/try/download/community
2. Seleziona:
   - Version: 7.0 (Latest)
   - Platform: Windows
   - Package: MSI
3. Scarica il file
4. Apri il file scaricato
5. Installa con opzioni predefinite
6. ✅ Seleziona "Install MongoDB as a Service"
7. Fai "Next" fino alla fine

### Avvia MongoDB:
```powershell
net start MongoDB
```

---

## Verifica che MongoDB funzioni:

```powershell
# Atlas (usa il connection string nel .env)
# ✅ Funziona automaticamente

# Locale (verifica il servizio)
Get-Service -Name "MongoDB"
# Dovresti vedere: Running
```

---

## Dopo aver configurato MongoDB:

```powershell
# 1. Vai nella directory del progetto
cd "C:\Users\adil\Desktop\database infinity"

# 2. Genera le chiavi JWT
npm run generate-keys

# 3. Configura il file .env con:
# - La chiave JWT generata
# - Il connection string MongoDB

# 4. Popola il database
npm run seed

# 5. Avvia il server
npm start
```

---

## Quick Test:

Dopo aver configurato tutto, prova:

```powershell
npm run seed
```

Dovresti vedere:
```
✅ MongoDB connected successfully
✅ Database seeded successfully!
```

Buona fortuna! 🚀

