import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI 

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable inside .env.local");
}


// Define a proper type for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache the mongoose connection
const globalWithMongo = global as {
  mongoose?: MongooseCache;
};

// Global variable to store the connection across hot reloads in dev
const cached: MongooseCache = globalWithMongo.mongoose || { conn: null, promise: null };

// Store on the global object for reuse between hot reloads
if (!globalWithMongo.mongoose) {
  globalWithMongo.mongoose = cached;
}

export async function connectToDb(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = MONGODB_URI as string; // Type assertion since we've checked it exists

    cached.promise = mongoose
      .connect(mongoUri, {
        dbName: 'viacam_database',
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset the promise so we can retry next time
    cached.promise = null;
    throw error;
  }
}
