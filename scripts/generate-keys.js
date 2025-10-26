const crypto = require('crypto');

console.log('🔑 Generating secure keys for PrivateServerX...\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('Copy these keys to your .env file:\n');
console.log('================================');
console.log('JWT_SECRET=' + jwtSecret);
console.log('================================\n');
console.log('⚠️  Keep these keys SECRET!');
console.log('⚠️  Never commit them to version control!');
console.log('⚠️  Store them securely in production!\n');

// Optional: Generate MongoDB connection URI
console.log('MongoDB Connection Examples:');
console.log('Local: MONGODB_URI=mongodb://localhost:27017/privateserverx');
console.log('Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname\n');

