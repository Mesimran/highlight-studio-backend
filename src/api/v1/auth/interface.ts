import { IUser } from "../../../../DB/interfaces/user";

export interface IUserCreate extends Omit<IUser,"_id"|'orders'|'password'>{
    password?:string
}
export interface ILoginBody {
    email: string
    password: string
  }