import mongoose from "mongoose";
import AnotherError from "../../../../utils/errors/anotherError";
import { ILoginBody, IUserCreate } from "./interface";
import MainAuthDatabase from "./database";
import { signJwt } from "../../../../utils/jwtUtils";
import express from 'express'
import { createError } from "../../../../utils/errors/createError";
import { sendEmail } from "../../../../utils/mailer";
import { variables } from "../../../../config/envLoader";
import { generateToken } from "../../../../utils/forgetPassword";

class MainAuthService {
  static async register(data: IUserCreate, next: express.NextFunction) {
    const { name, email, password, phone, userType = "user" } = data;
    const userExists = await MainAuthService.userExists(email);

    if (userExists) {
      return next(createError({ status: 400, message: "user already exists" }));
    }
    const result = await MainAuthDatabase.register(data);
    // const accessToken = signJwt(
    //   {
    //     name: result.name,
    //     email: result.email,
    //     userType: result.userType,
    //     userId: result._id,
    //   },
    //   300
    // )

    const token = generateToken(email);
    const verificationLink = `${variables.BASE_URL}/api/v1/auth/verifyEmail?token=${encodeURIComponent(token)}`;

    const emailBody = `
    <h1>Email Verification</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
  `;
    await sendEmail(email, "email verification", emailBody, next);
    return {
      data: { _id: result._id, name, email, userType },
      // access_token: accessToken,
    };
  }

  static async userExists(id: string | mongoose.Schema.Types.ObjectId) {
    const result = await MainAuthDatabase.userExists(id as string);
    return result;
  }

  static async login(data: ILoginBody, next: express.NextFunction) {
    const { email, password } = data;
    console.log("inside login body ");
    const userExists = await MainAuthDatabase.userExists(email);
    if (!userExists) {
      return next(createError({ status: 400, message: "user not exists" }));
    }
    const result = await MainAuthDatabase.loginUser(email, password, next);
    if (result) {
      const accessToken = signJwt(
        {
          name: result.name,
          email: result.email,
          userType: result.userType,
          userId: result._id,
        },
        300
      );
      const { _id, name, userType } = result;
      return {
        data: { _id, name, email, userType },
        access_token: accessToken,
      };
    }
  }
}

export default MainAuthService