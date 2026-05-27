import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-leads-db';
    const maskedString = connString.replace(/:([^:@]+)@/, ':******@');
    console.log(`Connecting to database at: ${maskedString}`);
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};
