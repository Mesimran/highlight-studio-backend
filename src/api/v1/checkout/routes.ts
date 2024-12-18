import express from 'express'
import AuthHandler from '../../../../middleware/v1/authHandler'
import MainCheckoutController from './controller'

const checkoutRouter=express.Router()

checkoutRouter.post('/redirect', (request: express.Request, response: express.Response,next:express.NextFunction) =>
  MainCheckoutController.updatePaymentStatus(request, response,next)
)

checkoutRouter.post('/',AuthHandler.authMiddleware,
(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    MainCheckoutController.create(request,response,next)
})

export default checkoutRouter