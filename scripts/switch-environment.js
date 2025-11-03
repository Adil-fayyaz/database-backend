#!/usr/bin/env node

/**
 * Script per cambiare facilmente ambiente/server
 * 
 * Uso: node scripts/switch-environment.js [local|vps|raspberry|cloud]
 */

const fs = require('fs');
const path = require('path');

const environments = {
  local: '.env.local',
  vps: '.env.vps',
  raspberry: '.env.raspberry',
  cloud: '.env.cloud',
};

const envArg = process.argv[2];

if (!envArg || !environments[envArg]) {
  console.log('\n❌ Ambiente non valido!\n');
  console.log('Uso: node scripts/switch-environment.js [ambiente]\n');
  console.log('Ambienti disponibili:');
  console.log('  • local      - Server locale (PC di casa)');
  console.log('  • vps        - VPS (Contabo, Hetzner, Oracle, etc)');
  console.log('  • raspberry  - Raspberry Pi (server casa)');
  console.log('  • cloud      - Cloud (Railway, Render, Fly.io)\n');
  process.exit(1);
}

const sourceFile = path.join(__dirname, '..', environments[envArg]);
const targetFile = path.join(__dirname, '..', '.env');

if (!fs.existsSync(sourceFile)) {
  console.log(`\n❌ File ${environments[envArg]} non trovato!\n`);
  process.exit(1);
}

// Backup del .env corrente se esiste
if (fs.existsSync(targetFile)) {
  const backupFile = path.join(__dirname, '..', '.env.backup');
  fs.copyFileSync(targetFile, backupFile);
  console.log('\n📦 Backup del .env corrente salvato in .env.backup');
}

// Copia il nuovo ambiente
fs.copyFileSync(sourceFile, targetFile);

console.log(`\n✅ Ambiente cambiato a: ${envArg.toUpperCase()}`);
console.log(`   File caricato: ${environments[envArg]}`);
console.log('\n⚠️  IMPORTANTE: Verifica e aggiorna i seguenti valori nel .env:');
console.log('   • JWT_SECRET (genera con: node scripts/generate-secret.js)');
console.log('   • PUBLIC_URL (il tuo dominio/URL pubblico)');
console.log('   • CORS_ORIGINS (origini permesse)\n');
console.log('Dopo aver configurato, riavvia il server:\n');
console.log('   npm start\n');



