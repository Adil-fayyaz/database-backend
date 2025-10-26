# 🚀 Deploy su Railway - GUIDA VELOCE

## Database Infinity (Backend)

✅ **GIÀ PUSHATO** su https://github.com/Adil-fayyaz/database-backend

**Deploy:**
1. Vai su https://railway.app
2. New Project → Deploy from GitHub
3. Seleziona `database-backend`
4. Railway rileva Dockerfile automaticamente
5. Deploy!

## BlackCyber (App Flutter)

**Crea il repo GitHub:**
```bash
# Crea nuovo repo su GitHub con nome "blackcyber"
# Poi esegui:
git push -u origin master
```

**Deploy solo Server:**
1. Railway → New Project
2. Deploy from GitHub → `blackcyber` 
3. Seleziona root directory: `/server`
4. Environment Variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
5. Deploy!

## Dashboard (Frontend)

**Per Database Infinity:**
1. Netlify.com → New Site
2. Deploy from GitHub → `database-backend`
3. Base directory: `/dashboard`
4. Build: `npm run build`
5. Publish: `dashboard/dist`
6. Add env: `VITE_API_URL` con URL Railway

## ✅ RISULTATO FINALE

- **Backend DB Infinity:** Railway → https://tuo-backend.railway.app
- **Dashboard:** Netlify → https://tua-dashboard.netlify.app
- **BlackCyber Server:** Railway → https://blackcyber.railway.app
- **Tutto GRATIS per sempre!**


