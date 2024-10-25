import express from "express";
import { getCollectionState } from "~src/svc/modules/session/controllers";

export const sessionRouter = express.Router();

sessionRouter.get("/state", getCollectionState);
