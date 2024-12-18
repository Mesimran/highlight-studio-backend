import express from 'express';
import StatusCodes from '../../../../config/constants/statusCodes'; 
import MainCouponService from './service';

class MainCouponController {
    static async create(request: express.Request, response: express.Response, next: express.NextFunction) {
    
            const data = request.body;
            const result = await MainCouponService.create(data,next)
            if(result){
                const payload = {
                    status: true,
                    content: result
                };
                return response.status(StatusCodes.OK).json(payload);
            }
    }
    //my changes
    static async getAll(request: express.Request, response: express.Response, next: express.NextFunction) {

        const result = await MainCouponService.getAll(next);
        if (result) {
            const payload = {
                status: true,
                content: result
            };
            return response.status(StatusCodes.OK).json(payload);
        }
    }
    static async getById(request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;
        const result = await MainCouponService.getById(id, next);
        if (result) {
            const payload = {
                status: true,
                content: result
            };
            return response.status(StatusCodes.OK).json(payload);
        }
    }

    static async update(request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;
        const data = request.body;
        const result = await MainCouponService.update(id, data, next);
        if (result) {
            const payload = {
                status: true,
                content: result
            };
            return response.status(StatusCodes.OK).json(payload);
        }
    }

    static async delete(request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;
        const result = await MainCouponService.delete(id, next);
        if (result) {
            const payload = {
                status: true,
                content: result
            };
            return response.status(StatusCodes.OK).json(payload);
        }
    }
    static async getCoupon(request: express.Request, response: express.Response, next: express.NextFunction){
        
    }

    // static async getCoupon(request: express.Request, response: express.Response, next: express.NextFunction) {
    //         const { id } = request.params;
    //         const result = await couponService.getCoupon(id);
    //         const payload = {
    //             status: true,
    //             content: result
    //         };
    //         return response.status(StatusCodes.OK).json(payload);
        
    // }

    // static async updateCoupon(request: express.Request, response: express.Response, next: express.NextFunction) {
    
    //         const { id } = request.params;
    //         const data = request.body;
    //         const result = await couponService.updateCoupon(id, data);
    //         const payload = {
    //             status: true,
    //             content: result
    //         };
    //         return response.status(StatusCodes.OK).json(payload);
    
    // }

    // static async deleteCoupon(request: express.Request, response: express.Response, next: express.NextFunction) {
    
    //         const { id } = request.params;
    //         const result = await couponService.deleteCoupon(id);
    //         const payload = {
    //             status: true,
    //             content: result
    //         };
    //         return response.status(StatusCodes.OK).json(payload);
        
    // }

    // static async getAllCoupons(request: express.Request, response: express.Response, next: express.NextFunction) {
      
    //         const result = await couponService.getAllCoupons();
    //         const payload = {
    //             status: true,
    //             content: result
    //         };
    //         return response.status(StatusCodes.OK).json(payload);
       
    // }

}

export default MainCouponController
