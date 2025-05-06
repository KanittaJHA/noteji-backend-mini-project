import mongoose from "mongoose";

const connectDB = async (connectionString) => {
    try {
        await mongoose.connect(connectionString);
        console.log("MongoDB connected ✅");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;