import { NextFunction, Request, Response } from "express";
import multer, { Field, Options, DiskStorageOptions } from "multer";
import path from "path";

const TEMP_FILE_PATH = "upload";

const MAX_FILE_SIZE = 150*1024*1024;

const STORAGE_OPTIONS : DiskStorageOptions = {
    destination: function (req: Request, file, next) 
    {
        next(null, path.basename(TEMP_FILE_PATH));
    },
    filename: function (req: Request, file, next) 
    {
        const endPoint = (file.originalname.lastIndexOf(".") - 1 >>> 0) + 2;
        let fileExtension = file.originalname.slice(endPoint);
        let fileName = file.originalname.slice(0, endPoint-1);
        next(null, `${Date.now()}_${fileName}.${fileExtension.toLowerCase()}`);
    }
};

const storage = multer.diskStorage(STORAGE_OPTIONS);

export function fileUpload (type="single", fields:string | Field[] ="file")
{
    const options : Options = {
        storage: storage,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    };

    const upload = (multer(options) as any)[type](fields);

    return function (req: Request, res: Response, next: NextFunction) 
    {
        upload(req, res, function (err: any) 
        {
            /*if (err instanceof multer.MulterError) 
            {
                const status = 400;
                const text = JSON.stringify({messages:[`files:${err.message}`]});
        
                //res.status(status).send(text);
                //const log = new LogError(0, Date.now(), {}, status, {origin: "server", text: text});
                //LogSystem.add(log);
                //return;
            } 
            else if (err) 
            {
                const status = 400;
                const text = JSON.stringify({messages:[`files:${err.message}`]});

                //res.status(status).send(text);
                //const log = new LogError(0, Date.now(), {}, status, {origin: "server", text: text});
                //LogSystem.add(log);
                //return;
            }*/

            next();
        })
    }
}