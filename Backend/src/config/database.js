import mongoose from "mongoose";

async function connectToDB() {

    try {

        await mongoose.connect(process.env.MONGO_URI)
        // console.log("MONGO URI:", process.env.MONGO_URI)
        console.log("✅ MongoDB Connected")

    } catch (err) {

        console.error("❌ MongoDB connection failed:", err.message)
        process.exit(1)

    }

}

export default connectToDB