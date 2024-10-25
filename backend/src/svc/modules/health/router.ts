import express from "express";

import { getHealthCheck } from "~src/svc/modules/health/controllers";

export const healthRouter = express.Router();

healthRouter.get("", getHealthCheck);
