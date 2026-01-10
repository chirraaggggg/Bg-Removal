import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // If already connected, reuse connection (important for serverless)
        if (mongoose.connection.readyState >= 1) {
            console.log("Database already connected");
            return;
        }

        // Set mongoose options for better serverless performance
        mongoose.set('strictQuery', false);

        mongoose.connection.on('connected', () => {
            console.log("Database connected successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("Database connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("Database disconnected");
        });

        // Connect with additional options for serverless
        await mongoose.connect(`${process.env.MONGODB_URI}/AlphaEraser`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        console.log("MongoDB connection established");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
}

export default connectDB;