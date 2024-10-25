import { z } from "zod";
import { NodeType } from "~src/svc/modules/node/entitites/node";

export const CreateNodeSchema = z.object({
  title: z.string(),
  type: z.nativeEnum(NodeType),
  order: z.number(),
  parentId: z.number().nullable().optional(),
  icon: z.string().optional(),
  isOpen: z.boolean().optional(),
});

export const UpdateNodeSchema = z.object({
  title: z.string().optional(),
  parentId: z.number().nullable().optional(),
  order: z.number().optional(),
  icon: z.string().optional(),
  isOpen: z.boolean().optional(),
});
