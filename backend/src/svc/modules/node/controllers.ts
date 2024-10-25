import { Request, Response } from "express";
import { CreateNodeSchema, UpdateNodeSchema } from "~src/svc/modules/node/schemas";
import { adjustSiblingOrders, createNode } from "~src/svc/modules/node/utils";
import {
  createOrGetSession,
  triggerStateUpdate,
} from "~src/svc/modules/session/db-helper";
import { conf } from "~src/config/settings";
import { Node } from "~src/svc/modules/node/entitites/node";

export const createNewNode = async (req: Request, res: Response) => {
  try {
    const userUUID = req.headers["x-user-uuid"] as string;
    const session = await createOrGetSession(userUUID);

    const validatedData = CreateNodeSchema.parse(req.body);
    const newNode = await createNode({
      sessionId: session.id,
      ...validatedData,
    });

    await triggerStateUpdate(userUUID);
    return res.status(201).json(newNode);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to create node",
      error: (error as Error).message,
    });
  }
};

export const updateExistingNode = async (req: Request, res: Response) => {
  const queryRunner = conf.DATA_SOURCE.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userUUID = req.headers["x-user-uuid"] as string;
    const nodeId = parseInt(req.params.nodeId);
    const updates = UpdateNodeSchema.parse(req.body);

    const node = await queryRunner.manager.findOne(Node, { where: { id: nodeId } });
    if (!node) {
      throw new Error("Node not found");
    }

    const oldParentId = node.parentId;

    node.parentId = updates.parentId ?? node.parentId;
    node.order = updates.order ?? node.order;
    await queryRunner.manager.save(node);

    if (oldParentId !== node.parentId) {
      await adjustSiblingOrders(oldParentId, queryRunner.manager);
    }

    await adjustSiblingOrders(node.parentId, queryRunner.manager);

    await queryRunner.commitTransaction();
    await triggerStateUpdate(userUUID);
    return res.status(200).json(node);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(400).json({
      success: false,
      message: "Failed to update node",
      error: (error as Error).message,
    });
  } finally {
    await queryRunner.release();
  }
};
