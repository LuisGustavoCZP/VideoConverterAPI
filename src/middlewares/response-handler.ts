import Express, { Request, Response, NextFunction } from "express";
import IControllerData from "../schemas/controller-data";

export async function responseHandler (controllerData: IControllerData, req: Request, res: Response, next: NextFunction) 
{
    const {error, response} = controllerData;

    if (res.headersSent)
    {
        return;
    }

    if(error) return next(error);
    else if (response) {
        
        if (response.data && Buffer.isBuffer(response.data)) res.status(response.status).send(response.data);
        else res.status(response.status).json({data: response.data});
    }
}