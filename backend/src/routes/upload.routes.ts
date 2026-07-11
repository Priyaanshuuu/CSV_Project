import { Router } from "express";
import { uploadCSV } from "../middleware/upload.middleware";
import { uploadCSVController } from "../controllers/upload.controller";

const router = Router();

router.post("/", uploadCSV.single("file"), uploadCSVController);

export default router;