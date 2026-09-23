import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectMongo(): Promise<void> {
  await mongoose.connect(env.MONGO_URI);
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}
