"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const process_controller_1 = require("../controllers/process.controller");
const router = (0, express_1.Router)();
router.post("/", process_controller_1.processController);
exports.default = router;
