export type NodeType = "folder" | "item";

export interface Node {
  id: number;
  title: string;
  type: NodeType;
  parentId: number | null;
  order: number;
  isOpen: boolean;
  isRoot: boolean;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  children?: Node[];
}