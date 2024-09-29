import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

export async function connectDB() {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(connectionInstance.connection.host, "database connected successfully")

    } catch (error) {
        console.error("mongoDB connection failed", error);
    }

}