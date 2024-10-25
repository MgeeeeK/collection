import { Router } from "express";
import { createNewNode, updateExistingNode } from "~src/svc/modules/node/controllers";

export const nodeRouter = Router();

nodeRouter.post("/", createNewNode);
nodeRouter.put("/:nodeId", updateExistingNode);
