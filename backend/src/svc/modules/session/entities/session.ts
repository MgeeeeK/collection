import { Entity, Column, OneToMany } from "typeorm";
import { MetadataBase } from "~src/svc/modules/common/entities/metadata";
import { Node } from "~src/svc/modules/node/entitites/node";

@Entity("session")
export class Session extends MetadataBase {
  @Column({ type: "varchar", nullable: false })
  uuid!: string;

  @OneToMany(() => Node, (node) => node.session, {
    cascade: true,
    eager: false,
  })
  nodes!: Node[];
}
