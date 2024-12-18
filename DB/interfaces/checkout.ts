import { ObjectId } from 'mongoose'

export interface ICheckout {
  transactionId: string
  cartItems: Array<string | ObjectId>
  paymentStatus: boolean
  couponId?: string
  paymentVendor: 'phonepe'
  transactionValue: number
  createdAt: Date
  updatedAt: Date
}

export type ICheckoutUpdate = Partial<ICheckout>
