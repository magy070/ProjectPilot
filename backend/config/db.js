import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    // In production, we might want to retry rather than crashing, 
    // but failing fast is correct for environment provisioning check.
    process.exit(1);
  }
};

export default connectDB;
