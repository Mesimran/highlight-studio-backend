import express from 'express'
import MainCartController from './controller'
import AuthHandler from '../../../../middleware/v1/authHandler'
const cartRouter=express.Router()

cartRouter.post('/',AuthHandler.authMiddleware,(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    MainCartController.create(request,response,next)
})

cartRouter.put('/:id', AuthHandler.authMiddleware, (request: express.Request, response: express.Response,next:express.NextFunction) =>
  MainCartController.update(request, response,next)
)

cartRouter.get('/', AuthHandler.authMiddleware, (request: express.Request, response: express.Response,next:express.NextFunction) =>
  MainCartController.get(request, response,next)
)

cartRouter.get('/:id', AuthHandler.authMiddleware, (request: express.Request, response: express.Response,next:express.NextFunction) =>
  MainCartController.getOne(request, response,next)
)

cartRouter.delete('/:id', AuthHandler.authMiddleware, (request: express.Request, response: express.Response,next:express.NextFunction) =>
  MainCartController.remove(request, response,next)
)
export default cartRouter