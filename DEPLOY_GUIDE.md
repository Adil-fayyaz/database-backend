# 🚀 Deploy Gratuito per Sempre

## Backend su Railway (Gratis)

1. Vai su https://railway.app
2. Crea account (gratis con GitHub)
3. New Project → Deploy from GitHub
4. Seleziona questo repo
5. Railway rileva automaticamente Dockerfile
6. Copia l'URL (es: `https://your-app.railway.app`)
7. L'URL include: `/api/auth`, `/api/users`, etc.

## Dashboard su Netlify (Gratis)

1. Vai su https://netlify.com
2. Login con GitHub
3. New Site from Git → seleziona repo
4. Impostazioni:
   - **Build command:** `cd dashboard && npm run build`
   - **Publish directory:** `dashboard/dist`
5. Aggiungi environment variable:
   - `VITE_API_URL`: URL di Railway (es: `https://your-app.railway.app/api`)
6. Deploy!

## ⚙️ Modifica File per Deploy

Prima di deploy, modifica:
1. `dashboard/.env.production` → imposta URL di Railway
2. Push su GitHub

## ✅ Risultato

- Backend: `https://your-app.railway.app` (Railway - gratis)
- Frontend: `https://your-app.netlify.app` (Netlify - gratis)
- Database: SQLite locale (gratis)
- Nessun costo per sempre!

