import mongoose from "mongoose";
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to MongoDB")
    } catch (error:any) {
        console.log("error connecting to mongodb", error.message)
    }
}

export default connectToDB;