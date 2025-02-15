import mongoose from "mongoose";

const connectDb=async()=>{
    try {
         const connect=await mongoose.connect(process.env.MONGO_URL);
         console.log(`mongoDb connected${mongoose.connection.host}`);
    } catch (error) {
        console.log(`mongoDb error ${error}`);
        
    }
};

export default connectDb;