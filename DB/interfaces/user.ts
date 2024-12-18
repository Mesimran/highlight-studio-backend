import { ObjectId } from "mongoose"

/**
 * later many more needs to be added based on requirements
 */
/**
 * @orders arrray needs to be defined(later stage)
 */
export interface IUser{
    _id:string|ObjectId
    name:string
    password:string
    email:string
    phone:string
    orders:[]
    userType:'user'| 'pri_admin'
    status:'active'|'deleted'
    isVerified:boolean
    addresses:[string]
}
