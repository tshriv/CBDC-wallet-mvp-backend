import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        // Use MONGO_URI env variable for MongoDB Atlas connection string
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wallet_app');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;
