import { In, EntityManager } from "typeorm";
import { Session } from "../session/entities/session";
import { conf } from "~src/config/settings";
import { Node, NodeType } from "~src/svc/modules/node/entitites/node";

const nodeRepository = conf.DATA_SOURCE.getRepository(Node);
const sessionRepository = conf.DATA_SOURCE.getRepository(Session);

export const createNode = async (data: {
  sessionId: number;
  title: string;
  type: NodeType;
  order: number;
  parentId?: number | null;
  icon?: string;
  isOpen?: boolean;
  isRoot?: boolean;
}): Promise<Node> => {
  const {
    sessionId,
    title,
    type,
    order,
    parentId,
    icon,
    isOpen = true,
    isRoot = false,
  } = data;

  const session = await sessionRepository.findOne({ where: { id: sessionId } });
  if (!session) throw new Error("Session not found");

  const node = nodeRepository.create({
    title,
    type,
    order,
    icon,
    isOpen,
    session,
    isRoot,
  });

  if (parentId) {
    const parentNode = await nodeRepository.findOne({ where: { id: parentId } });
    if (!parentNode) throw new Error("Parent node not found");
    node.parent = parentNode;
  }

  await nodeRepository.save(node);
  return node;
};

export const getNodesBySession = async (
  sessionId: number,
  type?: NodeType,
): Promise<Node[]> => {
  const queryBuilder = nodeRepository
    .createQueryBuilder("node")
    .leftJoinAndSelect("node.session", "session")
    .leftJoinAndSelect("node.children", "children")
    .where("session.id = :sessionId", { sessionId });

  if (type) {
    queryBuilder.andWhere("node.type = :type", { type });
  }

  return queryBuilder
    .orderBy("node.order", "ASC")
    .addOrderBy("children.order", "ASC")
    .getMany();
};

export const adjustSiblingOrders = async (
  parentId: number | null,
  manager: EntityManager,
) => {
  const siblings = await manager.find(Node, {
    where: { parentId: In([parentId]) },
    order: { order: "ASC" },
  });

  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling.order !== i) {
      sibling.order = i;
      await manager.update(Node, { id: sibling.id }, { order: i });
    }
  }
};
