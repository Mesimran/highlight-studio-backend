import { ICartCreate, ICartUpdate } from "../../../../DB/interfaces/cart";
import express from 'express'
import userModel from "../../../../DB/models/user";
import { createError } from "../../../../utils/errors/createError";
import cartModel from "../../../../DB/models/cart";
import { ObjectId } from "mongoose";
class MainCartService{
    static async create(data:ICartCreate,next:express.NextFunction){
        const {quantity,userId,entityDetails}=data
        const userExists=await userModel.findOne({_id:userId})
        if(!userExists){
            return next(createError({status:400,message:"user not found"}))
        }
        const {productId,productMRP,productSP,productName}=entityDetails

        const productExists=await cartModel.findOne({
            $and:[{userId},{'entityDetails.productId':productId},{paymentStatus:false}]
        })
        if(productExists){
            await cartModel.updateOne({_id:productExists._id},{$inc:{quantity:1}})
            return MainCartService.getOne(productExists._id.toString(),userId)
        }
        else{
            return await cartModel.create({
                userId:userId,
                quantity:quantity,
                entityDetails:entityDetails,
                createdAt:new Date()
            })
        }
    }

    static async getOne(id:string|ObjectId,userId:string|ObjectId){
        const result=await cartModel.findOne({_id:id,userId}).populate({path:'entityDetails.productId',
        select:{
            productName:1,
            productMRP:1,
            productSP:1
        }
    })
    return result
    }

    static async update(id: string | ObjectId, data: ICartUpdate,next:express.NextFunction) {
        const { quantity, paymentStatus } = data
    
        const cartData = await cartModel.findOne({ _id: id })
    
        if (!cartData) {
          return next(createError({status:400,message:"cart not found"}))
        }
    
        const document: ICartUpdate = {
          updatedAt: new Date(),
        }
    
        if (typeof quantity !== 'undefined') {
          document.quantity = quantity
        }
    
        if (typeof paymentStatus !== 'undefined') {
          document.paymentStatus = paymentStatus
        }
    
        const result = await cartModel.updateOne({ _id: id }, { $set: { ...document } })
        return { ...cartData, quantity, paymentStatus }
      }

      static async remove(id: string | ObjectId,next:express.NextFunction) {
        const cartItem = await cartModel.findOne({ _id: id })
    
        if (!cartItem) {
            return next(createError({status:400,message:"cart not found"}))
        }
    
        return cartModel.deleteOne({ _id: id })
      }

      static async getAll(userId: string | ObjectId) {
        return cartModel.find({
          userId,
          paymentStatus: false,
        })
      }
}

export default MainCartService