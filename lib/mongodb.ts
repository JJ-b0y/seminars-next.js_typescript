import mongoose from 'mongoose';

// Define the connection cache type
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the Node.js Global type (object) so TypeScript recognizes the MongooseCache custom property.
declare global {
  // var is required here — let/const are not hoisted onto globalThis.
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

// Initialize the cache on the global object and reuse across hot reloads, or create a fresh one.
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB via Mongoose, reusing an existing connection when one
 * is already open or pending to prevent multiple connections during development.
 * Safe to call in every server-side request.
 *
 * @returns Promise resolving to the Mongoose instance.
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return immediately if a live connection already exists.
  if (cached.conn) {
    return cached.conn;
  }

  // Initiate the connection only once;
  // return existing connection promise, if one is in progress...
  // subsequent calls share the same promise.
  if (!cached.promise) {
    // Validate MongoDB URI exists
    if (!MONGODB_URI) {
      throw new Error(
          'Please define the MONGODB_URI environment variable in .env.local'
      );
    }
    const options = {
      // Disable command buffering so operations fail fast when disconnected
      // rather than queuing silently.
      bufferCommands: false,
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Waiting for connection to establish
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so the next call can attempt a fresh connection.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
