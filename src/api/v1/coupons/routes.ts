import { Router } from 'express';
import MainCouponController from './controller';
import AuthHandler from '../../../../middleware/v1/authHandler';
import UserTypeHandler from '../../../../middleware/v1/getUserType';
import express from 'express'
const couponRouter = Router();

couponRouter.post('/',AuthHandler.authMiddleware,UserTypeHandler.checkAdmin,
(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    MainCouponController.create(request,response,next)
}
)
//my changes
couponRouter.get(
    '/',
    AuthHandler.authMiddleware,
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
        MainCouponController.getAll(request, response, next);
    }
);

couponRouter.get(
    '/:id',
    AuthHandler.authMiddleware,
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
        MainCouponController.getById(request, response, next);
    }
);

couponRouter.put(
    '/:id',
    AuthHandler.authMiddleware,
    UserTypeHandler.checkAdmin,
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
        MainCouponController.update(request, response, next);
    }
);

couponRouter.delete(
    '/:id',
    AuthHandler.authMiddleware,
    UserTypeHandler.checkAdmin,
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
        MainCouponController.delete(request, response, next);
    }
);
// couponRouter.get('/coupons/:id', CouponController.getCoupon);
// couponRouter.put('/coupons/:id', CouponController.updateCoupon);
// couponRouter.delete('/coupons/:id', CouponController.deleteCoupon);
// couponRouter.get('/coupons', CouponController.getAllCoupons);

export default couponRouter;
