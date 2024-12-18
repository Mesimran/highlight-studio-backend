import { ObjectId } from "mongoose";

export interface ICoupons {
  couponCode: string;
  discount: 
    | {
        type: 'percentage'; // For discounts in percentage
        value: number; // Example: 10 for 10%
        maxDiscount?: number; // Optional field for max discount limit
      }
    | {
        type: 'flat'; // For discounts in amount
        value: number; // Example: 200 for $200 off
      };
  usedCount: number;
  status: 'active' | 'inactive';
  applicableFor?: 
    | {
        selectedIds: Array<string | ObjectId>;
      }
    | string;
  minCartValue: number; // Condition for minimum cart value
  expiryDate: Date;
  useType: number; // Specific for user
  usersCount: { userId: ObjectId; count: number }[];
  couponLimit: number; // Specific for coupon
  createdAt: Date;
  updatedAt: Date;
}
