import mongoose from "mongoose";

const DB_URI = process.env.DB_URI!;
const DB_NAME = process.env.DB_NAME!;

if (!DB_URI || !DB_NAME) {
    throw new Error(
        "DB_URI and DB_NAME are not defined in the environment variables"
    );
}

declare global {
    var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(DB_URI, {
                dbName: DB_NAME,
            })
            .then((mongoose) => {
                return mongoose;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
