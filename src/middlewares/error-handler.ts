import Express, { NextFunction, Request, Response } from "express";

function parseErrorMessage (message: string)
{
    const text = message.replace(/"/g, "");
    const errorTexts = text.split(",");
    const errors = errorTexts.map(errorText => errorText.split(":"));
    return errors;
}

/**
 * User Creation Controller
 * @param {Error} error
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns 
 */
export function errorHandler (error: Error, req: Request, res: Response, next: NextFunction)
{
    if (res.headersSent)
    {
        return next();
    }

    
    console.log(error);
    res.status(500).json({messages: [error.message]});
}