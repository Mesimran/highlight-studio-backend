import express from 'express'
import { isValidObjectId } from "mongoose";
import { IUser } from "../../../../DB/interfaces/user";
import userModel from "../../../../DB/models/user";
import { ILoginBody, IUserCreate } from "./interface";
import { createError } from '../../../../utils/errors/createError';
import { hashPassword, matchHash } from '../../../../utils/hashPwd';

class MainAuthDatabase{
    static async register(data:IUserCreate){
      const {email,name,password,phone,userType="user",isVerified=false}=data
      let hashedPwd:string=""
      if(password){
      hashedPwd=await hashPassword(password)
      }
      const newUser=new userModel({
        email,
        name,
        phone,
        password:hashedPwd,
        userType,
        isVerified
      })
      const result = (await newUser.save()) as IUser
      return result
    }
    static async userExists(id: string) {
        let query = {}
        if (isValidObjectId(id)) {
          query = { _id: id }
        } else {
          query = { email: id }
        }
        const user = await userModel.findOne(query, { password: 0 })
        if (!user) return null
        return user
      }
    static async loginUser(email:string,password:string,next:express.NextFunction){
      const user = await userModel.findOne({ email })
      if (!user) {
        return next(createError({status:400,message:"user not exists"}))
      }
      if (user.status === 'deleted') {
        return next(createError({status:400,message:"deleted user"}))
      }
      if(!user.isVerified){
        return next(createError({status:400,message:"user not verified"}))
      }
      const passwordCorrect = await matchHash(password, user.password)
      if (!passwordCorrect) {
        return next(createError({status:400,message:"wrong password"}))
      }
      const { _id, userType, name } = user
      return { _id, name, email, userType }
    }

    static async getAllUser(){
      const result=await userModel.find({})
      return result
    }

    static async updatePassword(userEmail: string, password: string) {
      const hashedPwd = await hashPassword(password)
      const result = await userModel.updateOne({ email: userEmail }, { $set: { password: hashedPwd } })
      return result
    }

    static async verifyUser(email:string){
      const result=await userModel.updateOne({email:email},{$set:{isVerified:true}})
      return result
    }
}

export default MainAuthDatabase