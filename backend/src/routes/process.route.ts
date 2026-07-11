import { Router } from "express";
import { processController } from "../controllers/process.controller";

const router = Router();

router.post("/", processController);

export default router;