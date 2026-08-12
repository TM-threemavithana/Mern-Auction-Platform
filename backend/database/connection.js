import mongoose from "mongoose";

export const connection = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "MERN_AUCTION_PLATFORM",
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Database connected.");
};
