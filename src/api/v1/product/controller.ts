import express from 'express';
import StatusCodes from '../../../../config/constants/statusCodes'
import { get } from 'http';
import MainProductService from './service';
class MainProductController{
    static async create(request:express.Request,response:express.Response,next:express.NextFunction){
        const data=request.body
        const result=await MainProductService.create(data)
        const payload={
            status:true,
            content:result
        }
        return response.status(StatusCodes.OK).json(payload);
    }

    static async get(request:express.Request,response:express.Response,next:express.NextFunction){
        const {id} = request.params;
        const result = await MainProductService.get(id);
        const payload ={
        status:true,
        content:result
    }
     return response.status(StatusCodes.OK).json(payload);
}
    static async getAll(request:express.Request,response:express.Response,next:express.NextFunction){
        const {id} = request.params;
        const result = await MainProductService.getAll();
        const payload ={
        status:true,
        content:result
    }
     return response.status(StatusCodes.OK).json(payload);
}
    static async update(request:express.Request,response:express.Response,next:express.NextFunction){
        const {id} = request.params;
        const result = await MainProductService.update(id, 'data'); //need to fix 'data' as parameter
        const payload ={
        status:true,
        content:result
    }
     return response.status(StatusCodes.OK).json(payload);
}
    static async delete(request:express.Request,response:express.Response,next:express.NextFunction){
        const {id} = request.params;
        const result = await MainProductService.delete(id);
        const payload ={
        status:true,
        content:result
    }
     return response.status(StatusCodes.OK).json(payload);
}
}
export default MainProductController;