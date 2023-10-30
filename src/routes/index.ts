import express, { Router } from "express";
import { fileUpload } from "../middlewares/file-upload";
import { inspectorHandler } from "../middlewares/inspector-handler";
import { responseHandler } from "../middlewares/response-handler";
import { errorHandler } from "../middlewares/error-handler";
import videoCodecController from "../controllers/video-codec-controller";
import mediaMergeController from "../controllers/media-merge-controller";
import path from "path";

const codecFields = [
    {
        name: 'videos'
    },
];

const mergeFields = [
    {
        name: 'video', maxCount: 1
    },
    {
        name: 'audio', maxCount: 1
    },
];

const router = Router();

router.use(inspectorHandler);
router.get("/", express.static(path.basename("static")));

router.post("/codec", fileUpload("fields", codecFields), videoCodecController);
router.post("/merge", fileUpload("fields", mergeFields), mediaMergeController);

router.use(responseHandler);
router.use(errorHandler);

export default router;