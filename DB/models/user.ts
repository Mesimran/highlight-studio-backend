import mongoose from "mongoose";
import {IUser} from '../interfaces/user'
const userSchema=new mongoose.Schema<IUser>({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        unique:true
    },
    orders:{
        type:[String|| mongoose.Schema.Types.ObjectId]
    },
    password:{
        type:String
    },
    userType:{
        type:String,
        enum:['pri_admin','user']
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active',
    },
    isVerified:{
        type:Boolean,
    },
    addresses:{
        type:[String]
    }
})

const userModel=mongoose.model<IUser>('user_collections',userSchema)

export default userModel