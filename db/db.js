import mongoose from "mongoose";
import { MONGO_DB_URL } from "../config/index.js"

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_DB_URL);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
