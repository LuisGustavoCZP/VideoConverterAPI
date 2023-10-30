import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path = require("path");
import mediaManager from "../utils/media-manager";

const OUTPUT_FILE_PATH = path.basename("output");

async function videoCodecController (req: Request, res: Response, next: NextFunction)
{
    try {
        const id = uuid();
        
        if(!req.files) throw new Error("files: empty");

        //console.log(req.files);
        const videos : Express.Multer.File[] = (req.files as any)["videos"];
        const results = new Array<ArrayBuffer>();

        for (let i = 0; i < videos.length; i++)
        {
            const file = videos[i];
            const outFilePath = `${OUTPUT_FILE_PATH}/${file.filename.split("_")[1]}`;
            const result = await mediaManager.convertVideoCoded(file.path);
            await fs.rm(file.path);
            results[i] = result;
        }

        next({ response: { status: 200, data: { id }} });
    } catch (error: any) {
        next({ error });
    }
}

export default videoCodecController;