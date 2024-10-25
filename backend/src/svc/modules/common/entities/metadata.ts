import {
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class MetadataBase {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @CreateDateColumn()
  @Index()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  @Index()
  readonly updatedAt!: Date;
}
