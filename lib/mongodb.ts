import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  );
}

/**
 * Cached connection object stored on the Node.js global to survive
 * hot-module replacement (HMR) during development. Without this cache,
 * every file change would open a new database connection.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the NodeJS Global type so TypeScript recognises the custom property.
declare global {
  // var is required here — let/const are not hoisted onto globalThis.
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Reuse the existing cache across hot reloads, or create a fresh one.
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

/**
 * Connects to MongoDB via Mongoose, reusing an existing connection when one
 * is already open or pending. Safe to call in every server-side request.
 *
 * @returns The resolved Mongoose instance.
 */
async function connectDB(): Promise<Mongoose> {
  // Return immediately if a live connection already exists.
  if (cached.conn) {
    return cached.conn;
  }

  // Initiate the connection only once; subsequent calls share the same promise.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Disable command buffering so operations fail fast when disconnected
      // rather than queuing silently.
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so the next call can attempt a fresh connection.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
