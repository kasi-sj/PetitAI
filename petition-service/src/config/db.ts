import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";

export const prisma = new PrismaClient();

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};
