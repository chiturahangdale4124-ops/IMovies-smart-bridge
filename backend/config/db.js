const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    // Attempt local or configured MongoDB connection with 2.5s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to external/local MongoDB (${err.message}).`);
    console.log('[MongoDB] Initializing high-performance embedded MongoDB engine...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri, {
        dbName: 'imovies'
      });
      console.log(`[MongoDB] Embedded MongoDB running and connected at: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] Critical: Failed to start embedded MongoDB: ${memErr.message}`);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
