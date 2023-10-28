import Express from "express";

/**
 * User Creation Controller
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns 
 */
export async function inspectorHandler (req, res, next) 
{
    const startTime = Date.now();
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    req.log = {
        startTime,
        url
    }

    next();
}