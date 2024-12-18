import mongoose from 'mongoose'
import { ICheckout } from '../interfaces/checkout'

const checkoutSchema = new mongoose.Schema<ICheckout>({
  transactionId: {
    type: String,
    required: true,
  },
  cartItems: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    ref: 'cart_collections',
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  paymentVendor: {
    type: String,
    enum: ['phonepe']
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'coupon_collections',
  },
  transactionValue: {
    type: Number,
    required: true,
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

const checkoutModel = mongoose.model<ICheckout>('checkout_collections', checkoutSchema)

export default checkoutModel
