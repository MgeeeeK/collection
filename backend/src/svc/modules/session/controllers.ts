import { Request, Response } from "express";
import { getNodesBySession } from "~src/svc/modules/node/utils";
import { createOrGetSession } from "~src/svc/modules/session/db-helper";

export const getCollectionState = async (req: Request, res: Response) => {
  try {
    const userUUID = req.headers["x-user-uuid"] as string;
    const session = await createOrGetSession(userUUID);

    const nodes = await getNodesBySession(session.id);

    return res.status(200).json({ nodes });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch collection state",
      error: (error as Error).message,
    });
  }
};
