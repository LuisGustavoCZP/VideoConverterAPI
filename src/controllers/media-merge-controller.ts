import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path = require("path");
import mediaManager from "../utils/media-manager";

const OUTPUT_FILE_PATH = path.basename("output");

async function mediaMergeController (req: Request, res: Response, next: NextFunction)
{
    try {
        //const id = uuid();
        
        if(!req.files) throw new Error("files: empty");

        //console.log(req.files);
        const [video] : Express.Multer.File[] = (req.files as any)["video"];
        const [audio] : Express.Multer.File[] = (req.files as any)["audio"];
        
        const result = await mediaManager.mergeMedias(video, audio);
        await fs.rm(video.path);
        await fs.rm(audio.path);

        next({ response: { status: 200, data: result }});
    } catch (error: any) {
        next({ error });
    }
}

export default mediaMergeController;