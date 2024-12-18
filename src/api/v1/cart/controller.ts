import express from 'express'
import MainCartService from './service'
import StatusCodes from '../../../../config/constants/statusCodes'
class MainCartController{
    static async create(request:express.Request,response:express.Response,next:express.NextFunction){
        const result = await MainCartService.create({
            ...request.body,
            userId: request.authData?.userId,
          },next)
      
          const payload = {
            status: true,
            content: result,
          }
      
          return response.status(StatusCodes.CREATED).json(payload)
    }

    static async update(request: express.Request, response: express.Response,next:express.NextFunction) {
      const { id } = request.params
      const { quantity, paymentStatus } = request.body
  
      const result = await MainCartService.update(id, { quantity, paymentStatus, userId: request.authData?.userId },next)
  
      const payload = {
        status: true,
        content: result,
      }
  
      return response.status(StatusCodes.OK).json(payload)
    }

    static async remove(request: express.Request, response: express.Response,next:express.NextFunction) {
      const { id } = request.params
      const result = await MainCartService.remove(id,next)
  
      const payload = {
        status: true,
        content: result,
      }
  
      return response.status(StatusCodes.OK).json(payload)
    }

    static async get(request: express.Request, response: express.Response,next:express.NextFunction) {
      const result = await MainCartService.getAll(request.authData?.userId as string)
      const payload = {
        status: true,
        content: result,
      }
  
      return response.status(StatusCodes.OK).json(payload)
    }

    static async getOne(request: express.Request, response: express.Response,next:express.NextFunction) {
      const { id } = request.params
  
      const result = await MainCartService.getOne(id, request.authData?.userId as string)
  
      const payload = {
        status: true,
        content: result,
      }
  
      return response.status(StatusCodes.OK).json(payload)
    }
}

export default MainCartController