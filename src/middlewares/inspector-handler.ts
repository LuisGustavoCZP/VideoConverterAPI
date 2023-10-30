import Express, { NextFunction, Request, Response }  from "express";
import IRequestInfo from "../schemas/request-info";

export async function inspectorHandler (req: Request, res: Response, next: NextFunction) 
{
    const startTime = Date.now();
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    (req as IRequestInfo).info = {
        startTime,
        url
    }

    next();
}