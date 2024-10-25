import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MetadataBase } from "~src/svc/modules/common/entities/metadata";
import { Session } from "~src/svc/modules/session/entities/session";

export enum NodeType {
  FOLDER = "folder",
  ITEM = "item",
}

@Entity("node")
export class Node extends MetadataBase {
  @Column({ type: "varchar", nullable: false })
  @Index()
  title!: string;

  @Column({
    type: "enum",
    enum: NodeType,
    nullable: false,
  })
  type!: NodeType;

  @Column({ type: "varchar", nullable: true })
  icon?: string;

  @Column({ type: "boolean", default: false })
  isRoot: boolean = false;

  @Column({ type: "boolean", default: true })
  isOpen: boolean = true;

  @Column({ type: "int", nullable: false })
  order!: number;

  @Column({ name: "sessionId", type: "int", nullable: false })
  sessionId!: number;

  @Column({ name: "parentId", type: "int", nullable: true })
  parentId!: number | null;

  @ManyToOne(() => Session, (session) => session.nodes, {
    nullable: false,
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "sessionId" })
  session!: Session;

  @ManyToOne(() => Node, (node) => node.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parentId" })
  parent?: Node | null;

  @OneToMany(() => Node, (node) => node.parent)
  children?: Node[];
}
