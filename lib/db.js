const { PrismaClient } = require('@prisma/client');

let db;

if (process.env.NODE_ENV === 'production') {
  // Create a new instance in production
  db = new PrismaClient();
} else {
  // Use a global variable in development to avoid creating multiple instances
  if (!global.db) {
    global.db = new PrismaClient();
  }
  db = global.db;
}

module.exports = db;