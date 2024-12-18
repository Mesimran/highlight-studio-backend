import express from "express";
import AnotherError from "../../utils/errors/anotherError";
import { IAuthData } from "./authHandler";
import { createError } from "../../utils/errors/createError";

declare global {
  namespace Express {
    interface Request {
      authData?: IAuthData | any;
    }
  }
}

class UserTypeHandler {
  static async checkAdmin(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    if (!request.authData?.isAuth) {
      return next(createError({status:400,message:"need signin"}))
    }
    if (request.authData.userType !== "pri_admin") {
      return next(createError({status:400,message:"admin only"}))
    }
    return next();
  }

  static async checkSecAdmin(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    if (!request.authData?.isAuth) {
      throw new AnotherError("NEED_SIGNIN", "Login");
    }

    if (!["pri_admin", "sec_admin"].includes(request.authData.userType)) {
      return next(createError({status:400,message:"admin only"}))
    }
    return next();
  }

  static async checkReviewer(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    if (!request.authData?.isAuth) {
      throw new AnotherError("NEED_SIGNIN", "Login");
    }

    if (
      !["pri_admin", "sec_admin", "reviewer"].includes(
        request.authData.userType
      )
    ) {
      throw new AnotherError("NOT_ALLOWED_ACCESS", "Reviewers and Admins Only");
    }

    return next();
  }
}

export default UserTypeHandler;
