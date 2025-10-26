const fs = require('fs');
const path = require('path');

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const stream = fs.createWriteStream(path.join(logDir, 'server.log'), { flags: 'a' });

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] [${timestamp}] ${message}\n`;
    console.log(message);
    stream.write(logMessage);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[ERROR] [${timestamp}] ${message}\n`;
    console.error(message);
    stream.write(logMessage);
  },
  stream,
};

module.exports = logger;

