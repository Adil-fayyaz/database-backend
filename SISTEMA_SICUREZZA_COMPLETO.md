# 🛡️ SISTEMA DI SICUREZZA - WHITE DEVEL

## ✅ FUNZIONALITÀ IMPLEMENTATE

### Backend - Rilevamento Intrusioni

1. **Security Monitor Middleware** (`middleware/securityMonitor.js`)
   - Monitora tutte le richieste HTTP
   - Rileva pattern sospetti
   - Traccia tentativi di accesso falliti
   - Blocca IP automaticamente dopo 5 tentativi falliti
   - Log di tutte le attività sospette

2. **Security Log Model** (`models/SecurityLog.js`)
   - Memorizza tutti gli eventi di sicurezza
   - Supporta 4 livelli di gravità: low, medium, high, critical
   - Mantiene fino a примерно 1000 log recenti

3. **Security API Routes** (`routes/security.js`)
   - `/api/security/alerts` - Ottieni tutti gli alert
   - `/api/security/alerts/critical` - Solo alert critici
   - `/api/security/stats` - Statistiche di sicurezza
   - `/api/security/ip/:ip` - Alert per IP specifico
   - `/api/security/test` - Test del sistema

### App Flutter - Dashboard Sicurezza

1. **Security Alert Screen** (`lib/screens/security_alert_screen.dart`)
   - Visualizza tutti gli alert di sicurezza
   - Statistiche in tempo reale
   - Notifiche per alert critici
   - Aggiornamento automatico

2. **Backend Service** (`lib/services/backend_service.dart`)
   - `getSecurityAlerts()` - Ottieni alert
   - `getCriticalAlerts()` - Solo alert critici
   - `getSecurityStats()` - Statistiche

3. **Accesso dalla Schermata Principale**
   - Icona sicurezza nell'header
   - Notifica visiva se ci sono alert critici

## 🚨 COSA VIENE RILEVATO

1. **Tentativi di Autenticazione Falliti**
   - Login con credenziali errate
   - Token invalidi o scaduti
   - Accesso senza autorizzazione

2. **Attività Sospette**
   - Accesso a troppi endpoint diversi
   - Tentativi di accesso a endpoint sensibili (/admin, /.env)
   - User agent sospetto o mancante
   - Metodi HTTP insoliti

3. **IP Bloccati**
   - Dopo 5 tentativi falliti, l'IP viene bloccato per 15 minuti
   - Tutte le richieste da IP bloccati vengono rifiutate

4. **Intrusioni Critiche**
   - Tentativi di accesso a file di configurazione
   - Pattern di attacco riconosciuti
   - Traffico anomalo

## 📊 LIVELLI DI GRAVITÀ

- **Low** - Attività normale, solo log
- **Medium** - Attività sospetta, monitorare
- **High** - Tentativo di intrusione, bloccato
- **Critical** - Intrusione grave, richiede attenzione immediata

## 🔔 NOTIFICHE

Il sistema mostra notifiche quando:
- C'è un alert critico
- Un IP viene bloccato
- Rilevata attività sospetta
- Tentativi di accesso non autorizzati

## 📱 COME USARE

1. **Apri la Dashboard Sicurezza**
   - Dalla schermata principale, tocca l'icona 🛡️ (scudo)
   - Oppure vai su Impostazioni > Sicurezza

2. **Visualizza Alert**
   - Gli alert più recenti sono mostrati per primi
   - Gli alert critici sono evidenziati in rosso
   - Ogni alert mostra:
     - Tipo (intrusione, accesso fallito, ecc.)
     - IP sorgente
     - Motivo
     - Timestamp

3. **Statistiche**
   - Totali: tutti gli eventi registrati
   - API Critici: eventi critici
   - Alti: eventi ad alta priorità
   - Bloccati: numero di IP bloccati
   - Ultime 24h: eventi nelle ultime 24 ore

## ⚠️ AVVISO LEGALE

Questo sistema è progettato per:
- Proteggere il TUO sistema e i TUOI dati
- Monitorare accessi al TUO server
- Rilevare tentativi di intrusione nel TUO sistema

**NON utilizzare per:**
- Monitorare sistemi di altri senza autorizzazione
- Intercettare traffico non autorizzato
- Attaccare altri sistemi

Uso responsabile e legale solamente.

## 🔧 CONFIGURAZIONE

Il sistema è attivo automaticamente quando il server è avviato.

Per testare:
```bash
# Test endpoint
curl http://localhost:3000/api/security/test

# Visualizza alert
curl http://localhost:3000/api/security/alerts

# Statistiche
curl http://localhost:3000/api/security/stats
```

## ✅ TUTTO PRONTO!

Il sistema di sicurezza è completamente funzionale e ti avviserà immediatamente se qualcuno cerca di entrare o tracciare il tuo sistema!

