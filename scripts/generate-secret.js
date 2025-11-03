#!/usr/bin/env node

/**
 * Genera un JWT_SECRET sicuro
 */

const crypto = require('crypto');

console.log('\n🔐 GENERATORE JWT_SECRET SICURO\n');
console.log('━'.repeat(60));

// Genera secret casuale di 64 caratteri
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ Secret generato con successo!\n');
console.log('Copia questa riga nel tuo file .env:\n');
console.log(`JWT_SECRET=${secret}`);
console.log('\n' + '━'.repeat(60));
console.log('\n⚠️  IMPORTANTE: Non condividere mai questo secret!');
console.log('   Tienilo segreto e al sicuro.\n');

// Salva in un file opzionale
const fs = require('fs');
const path = require('path');

const secretFile = path.join(__dirname, '..', '.jwt-secret.txt');
fs.writeFileSync(secretFile, `JWT_SECRET=${secret}\n`, 'utf8');

console.log(`📄 Secret salvato anche in: ${secretFile}`);
console.log('   (Aggiungi .jwt-secret.txt al .gitignore)\n');



