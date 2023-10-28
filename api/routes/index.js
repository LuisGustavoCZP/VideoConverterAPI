import { Router } from "express";
import { fileUpload } from "../middlewares/file-upload";
import { inspectorHandler } from "../middlewares/inspector-handler";
import { responseHandler } from "../middlewares/response-handler";
import { errorHandler } from "../middlewares/error-handler";

const uploadFields = [
    {
        name: 'image', maxCount: 1
    },
    {
        name: 'audios'
    }
];

const router = Router();

router.use(inspectorHandler);
router.post("/upload", fileUpload("fields", uploadFields, uploadController));
router.use(responseHandler);
router.use(errorHandler);

export default router;