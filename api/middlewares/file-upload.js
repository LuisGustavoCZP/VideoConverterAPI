import multer from "multer";
import { filePathTemp } from "../configs/index.js";

const MAX_FILE_SIZE = 150*1024*1024;

const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) 
        {
            cb(null, filePathTemp);
        },
        filename: function (req, file, cb) 
        {
            const endPoint = (file.originalname.lastIndexOf(".") - 1 >>> 0) + 2;
            let fileExtension = file.originalname.slice(endPoint);
            let fileName = file.originalname.slice(0, endPoint-1);
            cb(null, fileName+"_"+Date.now()+'.'+fileExtension.toLowerCase());
        }
    }
);

export function fileUpload (type="single", fields="file")
{
    const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE }})[type](fields);

    return function (req, res, next) 
    {
        upload(req, res, function (err) 
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