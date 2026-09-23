import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  numericId: number;
  code: string;
  originalUrl: string;
  createdAt: Date;
}

const urlSchema = new Schema<IUrl>({
  numericId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const UrlModel = mongoose.model<IUrl>("Url", urlSchema);
