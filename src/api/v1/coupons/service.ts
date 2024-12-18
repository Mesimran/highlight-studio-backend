import couponModel from "../../../../DB/models/coupons";
import { ICoupons } from "../../../../DB/interfaces/coupons";
import express from "express";
import { createError } from "../../../../utils/errors/createError";
import { productModel } from "../../../../DB/models/productModel";
import userModel from "../../../../DB/models/user";
import { ObjectId } from "mongoose";
class MainCouponService {
  static async create(data: Partial<ICoupons>, next: express.NextFunction) {
    const {
      couponCode,
      discount,
      applicableFor,
      useType,
      minCartValue,
      expiryDate,
      couponLimit,
    } = data;
    const currentDate = new Date();
    if (expiryDate && expiryDate < currentDate) {
      return next(createError({ status: 400, message: "expiry date" }));
    }
    if (applicableFor) {
      if (typeof applicableFor === "object") {
        if (applicableFor.selectedIds) {
          for await (const id of applicableFor.selectedIds) {
            const product = await productModel.exists({ _id: id });
            if (!product) {
              return next(
                createError({ status: 400, message: "product not found" })
              );
            }
          }
        }
      }
    }
    const newCoupon = new couponModel({
      couponCode,
      discount,
      applicableFor,
      useType,
      minCartValue,
      expiryDate,
      couponLimit,
    });
    const result = await newCoupon.save();
    return result;
  }
  static async getAll(next: express.NextFunction) {
    const result = await couponModel.find();
    if (!result) {
      return next(createError({ status: 404, message: "No coupons found" }));
    }
    return result;
  }
  //my changes
  static async getById(id: string, next: express.NextFunction) {
    const result = await couponModel.findById(id);
    if (!result) {
      return next(createError({ status: 404, message: "Coupon not found" }));
    }
    return result;
  }

  static async update(
    id: string,
    data: Partial<ICoupons>,
    next: express.NextFunction
  ) {
    const {
      couponCode,
      discount,
      applicableFor,
      useType,
      minCartValue,
      expiryDate,
      couponLimit,
    } = data;

    const currentDate = new Date();
    if (expiryDate && expiryDate < currentDate) {
      return next(
        createError({ status: 400, message: "Expiry date is in the past" })
      );
    }
    if (
      applicableFor &&
      typeof applicableFor === "object" &&
      applicableFor.selectedIds
    ) {
      for await (const id of applicableFor.selectedIds) {
        const product = await productModel.exists({ _id: id });
        if (!product) {
          return next(
            createError({ status: 400, message: "Product not found" })
          );
        }
      }
    }

    const result = await couponModel.findByIdAndUpdate(
      id,
      {
        couponCode,
        discount,
        applicableFor,
        useType,
        minCartValue,
        expiryDate,
        couponLimit,
      },
      { new: true }
    );

    if (!result) {
      return next(createError({ status: 404, message: "Coupon not found" }));
    }
    return result;
  }

  static async delete(id: string, next: express.NextFunction) {
    const result = await couponModel.findByIdAndDelete(id);
    if (!result) {
      return next(createError({ status: 404, message: "Coupon not found" }));
    }
    return result;
  }

  static async incrementCount(couponId: string | ObjectId, userId: string | ObjectId,next:express.NextFunction) {
    const coupon = await couponModel.findOne({ _id: couponId })
    if (coupon) {
      console.log(userId)

      const user = await userModel.findOne({ _id: userId })
      if (!user) {
        return next(createError({status:400,message:"user not found"}))
      }
      const result = await couponModel.updateOne(
        {
          _id: couponId,
          'userId.userId': userId,
        },
        {
          $inc: {
            usedCount: 1,
            'userId.$.count': 1,
          },
        },
        {
          new: true,
        }
      )

      if (result.modifiedCount === 0) {
        await couponModel.updateOne(
          {
            _id: couponId,
          },
          {
            $push: {
              userId: {
                userId,
                count: 1,
              },
            },
            $inc: {
              usedCount: 1,
            },
          },
          {
            new: true,
          }
        )
      }
      return result
    }
  }
}

export default MainCouponService;
