import { conf } from "~src/config/settings";
import { NodeType } from "~src/svc/modules/node/entitites/node";
import { createNode, getNodesBySession } from "~src/svc/modules/node/utils";
import { Session } from "~src/svc/modules/session/entities/session";

const sessionRepository = conf.DATA_SOURCE.getRepository(Session);

export async function triggerStateUpdate(userUUID: string) {
  try {
    const session = await createOrGetSession(userUUID);

    const nodes = await getNodesBySession(session.id);

    await conf.PUSHER_CLIENT.trigger(`collection-updates-${userUUID}`, "state-update", {
      nodes,
    });
  } catch (error) {
    console.error("Error triggering state update:", error);
    throw error;
  }
}

export const createOrGetSession = async (uuid: string): Promise<Session> => {
  let session = await sessionRepository.findOne({
    where: { uuid },
  });

  if (!session) {
    session = sessionRepository.create({ uuid });
    const root_node = {
      title: "root",
      type: NodeType.FOLDER,
      isOpen: true,
      parentId: null,
      order: 0,
      isRoot: true,
    };
    const savedSession = await sessionRepository.save(session);
    await createNode({
      sessionId: savedSession.id,
      ...root_node,
    });
  }

  return session;
};
