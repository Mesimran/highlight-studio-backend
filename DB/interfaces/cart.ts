import { ObjectId } from "mongoose"

export type ICartEntity={
    productId:string|ObjectId
    productName:string
    productCategory:string
    productMRP:number
    productSP:number
}
export interface ICartItem{
    userId: string | ObjectId
    entityDetails: ICartEntity
    quantity: number
    paymentStatus: boolean
    createdAt: Date
    updatedAt: Date
}

export type ICartUpdate = Partial<ICartItem>

export type ICartCreate={
    userId: string | ObjectId
    entityDetails: ICartEntity
    quantity: number
}