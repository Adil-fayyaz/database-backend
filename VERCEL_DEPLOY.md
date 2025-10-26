# Deploy su Vercel - Dashboard Database Infinity

## 🚀 Deploy Rapido

### Opzione 1: Via Vercel Dashboard (Consigliato)
1. Vai su https://vercel.com e accedi
2. Clicca "Add New Project"
3. Collega il repository GitHub
4. Configura il progetto:
   - **Framework Preset**: Vite
   - **Root Directory**: `dashboard`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables**:
   - Aggiungi `VITE_API_URL` = `https://database-backend-production-2f45.up.railway.app/api`

6. Clicca "Deploy"

### Opzione 2: Via CLI
```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Dalla root del progetto
cd dashboard

# Deploy
vercel

# Segui le istruzioni e aggiungi le env variables quando richiesto
```

### Configuration Files
- `vercel.json` - Configurazione Vercel
- `vite.config.js` - Configurazione Vite
- `.env` - Environment variables locali

## 📝 Environment Variables
```
VITE_API_URL=https://database-backend-production-2f45.up.railway.app/api
```

## ✅ Verifica Deploy
Dopo il deploy, visita l'URL fornito da Vercel per verificare che tutto funzioni.

## 🔄 Update
Per aggiornare il deploy:
1. Fai push su GitHub
2. Vercel deploya automaticamente

## 🌐 URL Production
- Backend: https://database-backend-production-2f45.up.railway.app
- Dashboard: [URL fornito da Vercel]


