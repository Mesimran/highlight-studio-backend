import express from 'express'
import StatusCodes from '../../../../config/constants/statusCodes';
import MainCheckoutService from './service';
import { variables } from '../../../../config/envLoader';

class MainCheckoutController{
    static async create(request:express.Request,response:express.Response,next:express.NextFunction){
        const { vendor, code } = request.query;

        console.log("coupon code from query", code);

        const result = await MainCheckoutService.create({
          paymentVendor: vendor as string,
          couponCode: code ? (code as string) : undefined,
          userId: request.authData?.userId as string,
        },next);

        const payload = {
          status: true,
          content: result,
        };

        return response.status(StatusCodes.CREATED).json(payload);
    }

    static async updatePaymentStatus(request: express.Request, response: express.Response,next:express.NextFunction) {
      const { transactionId } = request.body
      console.log(12)
  
      if (request.body.code === 'PAYMENT_SUCCESS') {
        const updatedStatus = await MainCheckoutService.updatePaymentStatus(transactionId,next)
        if (updatedStatus) {
          return response.redirect(`${variables.FE_URL}/payments/success?q=${transactionId}`)
        }
      }
  
      return response.redirect(`${variables.FE_URL}/payments/failure?q=${request.body.transactionId}`)
    }
}

export default MainCheckoutController