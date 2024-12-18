import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../interfaces/product";

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  productMRP: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  productSP: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
  },
  tags: {
    type: [String],
    required: true,
  },
  wattage: {
    type: Number,
    required: true,
  },
  colorTemperature: {
    type: Number,
    required: true,
  },
});

export const productModel=mongoose.model<IProduct>("product_collections",productSchema)
