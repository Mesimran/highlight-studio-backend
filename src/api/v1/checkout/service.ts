import { ObjectId } from "mongoose";
import express from 'express'
import MainCartService from "../cart/service";
import { createError } from "../../../../utils/errors/createError";
import couponModel from "../../../../DB/models/coupons";
import { generateRandomString } from "../../../../utils/generateRandomString";
import checkoutModel from "../../../../DB/models/checkout";
import { initPayment } from "../../../../payments/phonepe";
import cartModel from "../../../../DB/models/cart";
import MainCouponService from "../coupons/service";
class MainCheckoutService{
    static async create(data: { userId: string | ObjectId; couponCode?: string; paymentVendor: string },next:express.NextFunction){
        const { userId, couponCode, paymentVendor = 'phonepe' } = data

        const cartItems = await MainCartService.getAll(userId)
        if (cartItems.length < 1 ) {
            return next(createError({status:400,message:"cart empty"}))
        }

        const couponRec = await couponModel.findOne({ couponCode })
        if (couponCode) {
          if (!couponRec) {
            return next(createError({status:400,message:"coupon record not found"}))
          }
          const currentDate = new Date()
          if (currentDate >= couponRec.expiryDate) {
            return next(createError({status:400,message:"coupon expired"}))
          }
          if (couponRec.status === 'inactive') {
            return next(createError({status:400,message:"coupon inactive"}))
          }
        }

        if (couponRec?.useType) {
          const currentCount = couponRec.usersCount.find(c => c.userId == userId)?.count
          if (typeof currentCount !== 'undefined') {
            if (currentCount >= couponRec.useType) {
              return next(createError({status:400,message:"coupon limit exceed"}))
            }
          }
        }
        
        if (couponRec?.couponLimit) {
          if (couponRec.usedCount >= couponRec.couponLimit) {
            return next(createError({status:400,message:"coupon limit exceed"}))
          }
        }
        
        let cartValue=0 // used for getting cart value at the end for payment
        let totalCartValue=0 // for checking condition
        let discountedAmount=0
        let notDiscountedAmount=0 // used to get amount which is not for discount
        let discountedProductsAmount=0 // used to get amount which is for discount
        cartItems.map(async item=>{
          totalCartValue+=(item.entityDetails.productSP*item.quantity)
        })
        if(couponRec?.minCartValue&&totalCartValue>=couponRec?.minCartValue){
          cartItems.map(async item=>{
            if(typeof couponRec?.applicableFor==='object'){
              if(couponRec.applicableFor.selectedIds.includes(item.entityDetails.productId.toString())){
               discountedProductsAmount+=(item.entityDetails.productSP*item.quantity)
              }
              else{
                // products which are not in selectedId
                notDiscountedAmount+=(item.entityDetails.productSP*item.quantity)
              }
            }
            else if(typeof couponRec.applicableFor==='string'){
              // with category
              if(item.entityDetails.productCategory==couponRec.applicableFor){
                discountedProductsAmount+=(item.entityDetails.productSP*item.quantity)
              }
              else{
                notDiscountedAmount+=(item.entityDetails.productSP*item.quantity)
              }
            }
            else if(typeof couponRec.applicableFor==='undefined'){
              // applicable for whole cart
              discountedProductsAmount+=(item.entityDetails.productSP*item.quantity)
            }
          })
        }else if(couponRec?.minCartValue&&totalCartValue<couponRec?.minCartValue){
          return next(createError({status:400,message:"cart value not sufficient"}))
        }
        else if(typeof couponCode==='undefined'){
          cartValue=totalCartValue
        }
       
        // reduce amount for discount
        if(couponRec?.discount.type==='flat'){
          discountedProductsAmount-=couponRec.discount.value
        }
        if(couponRec?.discount.type==='percentage'){
          const maxDiscount=couponRec.discount.maxDiscount
          let discount=Number(discountedProductsAmount*couponRec.discount.value)/100
          discount=Math.min(discount,maxDiscount as number)
          discountedProductsAmount-=discount
        }

        const transactionId = generateRandomString()
        const allItemsId = cartItems.map(item => item._id)

        if(couponCode){
          cartValue=discountedProductsAmount+notDiscountedAmount
        }else{
          cartValue=totalCartValue
        }

        const result=await checkoutModel.create({
          transactionId,
          transactionValue:Math.round(cartValue),
          cartItems:allItemsId,
          paymentStatus:false,
          paymentVendor,
          couponId:couponCode ? couponRec?._id : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        cartValue=Math.round(cartValue)
        console.log(cartValue, 'cartValue')

        const payment = await initPayment(transactionId, cartValue,next)
      return {
        _id: result._id,
        redirectInfo: payment.data.instrumentResponse.redirectInfo,
      }
    }

    static async updatePaymentStatus(transactionId: string,next:express.NextFunction) {
      const checkoutDetails = await checkoutModel.findOne({ transactionId })
  
      if (!checkoutDetails) {
        return next(createError({status:400,message:"transaction details not found"}))
      }
      const couponId = checkoutDetails.couponId
  
      const result = await checkoutModel.updateOne(
        { transactionId },
        {
          $set: {
            paymentStatus: true,
          },
        }
      )
  
      let cartUser = await cartModel.findById(checkoutDetails.cartItems[0])
  
  
      if (!cartUser) {
        return next(createError({status:400,message:"empty cart"}))
      }
  
      if (couponId) {
        await MainCouponService.incrementCount(couponId, cartUser.userId,next)
      }

      /**
       * @DeliveryEndPoints 
       */
  
      // for await (const item of checkoutDetails.cartItems) {
      //   const cartItemDetails = await cartModel.findOne({ _id: item })
  
      //   if (!cartItemDetails) {
      //     return next(createError({status:400,message:""}))
      //   }
  
      //   const { entityType, testId } = cartItemDetails.entityDetails
  
      //   const { testName, testType } = cartItemDetails.entityDetails.testDetails
  
      //   await buyingCartModel.updateOne(
      //     {
      //       _id: item,
      //     },
      //     {
      //       $set: {
      //         paymentStatus: true,
      //       },
      //     }
      //   )
  
      //   // create tests
  
      //   for (let index = 0; index < cartItemDetails.quantity; index++) {
      //     const newTest = await MainTestService.randomPrivateTest(cartItemDetails.userId, testName, testType)
  
      //     const testCreated = await MainTestService.create(newTest, cartItemDetails.userId)
  
      //     // const testCreated = await MainTestService.randomPublicTest(cartItemDetails.userId, testType, testName)
      //     const currentDate = new Date()
      //     const endTime = new Date(currentDate.setFullYear(currentDate.getFullYear() + 2))
  
      //     const enrolledTestDetails = await enrolledTestModel.create({
      //       testId: testCreated._id,
      //       userId: cartItemDetails.userId,
      //       transactionId,
      //       paymentStatus: 'confirmed',
      //       testSchedule: {
      //         endTime: endTime,
      //       },
      //     })
      //     console.log(enrolledTestDetails)
      //   }
      // }
  
      // for await (const item of checkoutDetails.cartCourseItems) {
      //   const cartItemDetails = await courseBuyingModel.findOne({ _id: item })
      //   if (!cartItemDetails) {
      //     return next(createError({status:400,message:""}))
      //   }
      //   await courseBuyingModel.updateOne(
      //     {
      //       _id: item,
      //     },
      //     {
      //       $set: {
      //         paymentStatus: true,
      //       },
      //     }
      //   )
      //   const courseData = await courseBuyingModel.findById(checkoutDetails.cartCourseItems[0])
      //   const courseId = courseData?.entityDetails.courseId
      //   const enrolledCourse = await enrolledCourseModel.create({
      //     courseId: courseId,
      //     userId: cartUser.userId,
      //     paymentStatus: 'confirmed',
      //     transactionId,
      //   })
      // }
  
      if (result) {
        return true
      }
      return false
    }
}

export default MainCheckoutService