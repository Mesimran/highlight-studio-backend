import express from 'express'
import AuthHandler from '../../../../middleware/v1/authHandler'
import UserTypeHandler from '../../../../middleware/v1/getUserType'
import MainProductController from './controller'

const productRouter=express.Router()

productRouter.post('/',AuthHandler.authMiddleware,UserTypeHandler.checkAdmin,
(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    MainProductController.create(request,response,next)
});
productRouter.get('/:_id', AuthHandler.authMiddleware, 
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
    MainProductController.get(request, response, next);
});

productRouter.get('/', AuthHandler.authMiddleware, 
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
    MainProductController.getAll(request, response, next);
});

productRouter.put('/:_id', AuthHandler.authMiddleware, UserTypeHandler.checkAdmin, 
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
    MainProductController.update(request, response, next);
});

productRouter.delete('/:_id', AuthHandler.authMiddleware, UserTypeHandler.checkAdmin, 
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
    MainProductController.delete(request, response, next);
});
 export default productRouter;