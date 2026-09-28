const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  
  if (uri && !uri.includes('localhost:27017')) {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`[Database] Connected to external MongoDB: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[Database] External MongoDB connection failed (${err.message}). Falling back to local embedded runner.`);
    }
  }

  // Attempt local MongoDB on standard port first
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/healthguard_ai', { serverSelectionTimeoutMS: 1500 });
    console.log(`[Database] Connected to local MongoDB service at 127.0.0.1:27017`);
    return;
  } catch (err) {
    // Expected if standard Windows MongoDB service is not running
  }

  // Fallback to embedded development MongoDB engine
  try {
    console.log(`[Database] Initializing standalone local development MongoDB engine...`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 60000,
        dbName: 'healthguard_ai'
      }
    });
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Standalone MongoDB running and connected at: ${memoryUri}`);
  } catch (memError) {
    console.error(`[Database] Fatal: Unable to initialize MongoDB engine:`, memError.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error during disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
