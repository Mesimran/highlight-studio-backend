import mongoose, { ObjectId } from 'mongoose';
import { ICoupons } from '../interfaces/coupons';

/**
 * Small corrections are pending
 * correctionRequired
 * @Done
 */
const couponSchema = new mongoose.Schema<ICoupons>({
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'flat'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
      required: false,
      validate: {
        validator: function (this: ICoupons, value: number) {
          return this.discount.type !== 'flat' || value == null;
        },
        message: 'maxDiscount should only be specified for percentage discount type',
      },
    },
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  applicableFor: {
    type: mongoose.Schema.Types.Mixed,
  },
  minCartValue: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  usersCount: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_collections',
    },
    count: {
      type: Number,
      default: 1,
    },
  }],
  couponLimit: {
    type: Number,
    default: 1,
  },
  useType: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default : new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const couponModel = mongoose.model<ICoupons>('coupon_collections', couponSchema);

export default couponModel;
