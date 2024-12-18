import express from 'express'
import MainAuthController from './controller'
import AuthHandler from '../../../../middleware/v1/authHandler'
import UserTypeHandler from '../../../../middleware/v1/getUserType'
const authRouter=express.Router()

/**
 * register user
 */
authRouter.post('/register',
(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    MainAuthController.register(request,response,next)
}
)

authRouter.post('/login', (request: express.Request, response: express.Response,next:express.NextFunction) =>
  MainAuthController.login(request, response,next)
)

authRouter.post('/forgetPassword', (request: express.Request, response: express.Response,next:express.NextFunction) =>
  MainAuthController.forgetPassword(request, response,next)
)

authRouter.put('/forgetPassword', (request: express.Request, response: express.Response,next:express.NextFunction) => {
    MainAuthController.updatePassword(request, response,next)
  })

authRouter.get('/allUser',AuthHandler.authMiddleware,UserTypeHandler.checkAdmin,(request: express.Request, response: express.Response)=>{
    MainAuthController.getAllUser(request,response)
})

authRouter.get('/verifyEmail',(request: express.Request, response: express.Response,next:express.NextFunction)=>{
    MainAuthController.verifyEmail(request,response,next)
})
export default authRouter