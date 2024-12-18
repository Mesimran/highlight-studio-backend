import express from 'express'
import MainAuthService from './service'
import StatusCodes from '../../../../config/constants/statusCodes'
import MainAuthDatabase from './database'
import userModel from '../../../../DB/models/user'
import { decryptToken, generateToken } from '../../../../utils/forgetPassword'
import { sendEmail } from '../../../../utils/mailer'
import { createError } from '../../../../utils/errors/createError'
class MainAuthController{
    static async register(request:express.Request,response:express.Response,next:express.NextFunction){
        const result=await MainAuthService.register(request.body,next)
        if(result){
          const payload = {
            status: true,
            content: result,
          }
      
          return response.status(StatusCodes.CREATED).json(payload)
        }
    }

    static async login(request:express.Request,response:express.Response,next:express.NextFunction){
      const { email, password } = request.body

    const result = await MainAuthService.login(request.body,next)
      if(result){
        response.cookie('access_token', result.access_token, {
          httpOnly: true,
          // secure: true,
        })
    
        const payload = {
          status: true,
          content: result,
        }
    
        return response.status(StatusCodes.OK).json(payload)
      }
    }

    static async getAllUser(request: express.Request, response: express.Response){
      const result=await MainAuthDatabase.getAllUser()
      const payload = {
        status: true,
        content: result,
      }
  
      return response.status(StatusCodes.OK).json(payload)
    }
    
    /**
     * @updateResetButtonLink
     */
    static async forgetPassword(request: express.Request, response: express.Response,next:express.NextFunction) {
      const { userEmail } = request.body
      const userExists = await userModel.findOne({ email: userEmail })
      console.log(userEmail)
      console.log(userExists)
      if (userExists) {
        const encryptedEmail = generateToken(userEmail)
        await sendEmail(
          userEmail,
          'Reset Password Link',
          `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Password Reset</title>
            <style>
              body {
                font-family: sans-serif;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 400px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              h1 {
                color: #568cea;
              }
              .button {
                display: inline-block;
                background-color: #5a8ce1;
                color: #fff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-bottom: 1rem;
              }
              .logo {
                width: 300px;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img
                src="https://plus.unsplash.com/premium_photo-1681487746049-c39357159f69?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Logo"
                class="logo"
              />
              <h1>Forgot Your Password?</h1>
              <p>
                Don't worry, we've got you covered! Click the button below to reset your password.
              </p>
              <a href="https://vulcans.in/reset-password?email=${encodeURIComponent(encryptedEmail)}" class="button">Reset Password</a>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
          </body>
          </html>`,next
        )
        const payload = {
          status: true,
          content: 'email sent',
        }
  
        return response.status(201).json(payload)
      } else {
        console.log('user not found , please Register')
        return response.status(404).json('user not found , Please Resgister')
      }
    }

    static async updatePassword(request: express.Request, response: express.Response,next:express.NextFunction) {
      const { encryptedEmail, password } = request.body
      const decryptEmail = decryptToken(encryptedEmail.toString())
      if (decryptEmail) {
        const result = await MainAuthDatabase.updatePassword(decryptEmail.toString(), password)
        const payload = {
          status: true,
          content: result,
        }
  
        return response.status(201).json(payload)
      } else {
        return next(createError({status:400,message:"token expired"}))
      }
    }

    static async verifyEmail(request: express.Request, response: express.Response,next:express.NextFunction){
      const {token}=request.query
      if(!token){
        return next(createError({status:400,message:"token not provided"}))
      }
      const email=decryptToken(token as string)
      if(!email){
        return next(createError({status:400,message:"token expired or email not provided or invalid"}))
      }
      const result=await MainAuthDatabase.verifyUser(email)
      return response.status(200).json({message:"user Verified"})
    }
}

export default MainAuthController