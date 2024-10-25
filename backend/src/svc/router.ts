import express from "express";
import { nodeRouter } from "~src/svc/modules/node/router";
import { sessionRouter } from "~src/svc/modules/session/router";

export const router = express.Router();

router.use("/node", nodeRouter);
router.use("/session", sessionRouter);
