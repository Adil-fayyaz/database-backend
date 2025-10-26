// This file shows example structure for managing keys
// DO NOT commit actual keys to version control

module.exports = {
  development: {
    jwtSecret: process.env.JWT_SECRET || 'development_secret_key_change_in_production',
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/privateserverx',
  },
  production: {
    jwtSecret: process.env.JWT_SECRET,
    mongoURI: process.env.MONGODB_URI,
  },
};

