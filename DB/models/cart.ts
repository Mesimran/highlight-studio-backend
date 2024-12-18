import mongoose from "mongoose";
import { ICartEntity, ICartItem } from "../interfaces/cart";


/**
 * @referenceToBeChanged
 */
const cartEntitySchema=new mongoose.Schema<ICartEntity>({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product_collections',
    },
    productMRP:{
        type:Number
    },
    productSP:{
        type:Number
    },
    productName:{
        type:String
    },
    productCategory:{
      type:String
    }
})

const cartSchema=new mongoose.Schema<ICartItem>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_collections',
      },
      entityDetails: cartEntitySchema,
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      paymentStatus: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        required: true,
      },
      updatedAt: {
        type: Date,
        required: true,
        default: new Date(),
      },
})

const cartModel=mongoose.model<ICartItem>("cart_collections",cartSchema)

export default cartModel