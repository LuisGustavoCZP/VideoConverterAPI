import Express from "express";

/**
 * User Creation Controller
 * @param {{response:{status:number, data:any}, error:Error}} controllerData
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns 
 */
export async function responseHandler (controllerData, req, res, next) 
{
    const {error, response} = controllerData;

    if (res.headersSent)
    {
        return;
    }

    if(error) return next(error);
    else if (response) res.status(response.status).json({data: response.data});
}