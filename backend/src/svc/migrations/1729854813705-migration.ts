import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1729854813705 implements MigrationInterface {
    name = 'Migration1729854813705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "session" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "uuid" character varying NOT NULL,
                CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1063954fd0fa5e655cc482fb5c" ON "session" ("createdAt")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4b1511ab37f27d6f11242b81c9" ON "session" ("updatedAt")
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."node_type_enum" AS ENUM('folder', 'item')
        `);
        await queryRunner.query(`
            CREATE TABLE "node" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "type" "public"."node_type_enum" NOT NULL,
                "icon" character varying,
                "isOpen" boolean NOT NULL DEFAULT true,
                "order" integer NOT NULL,
                "sessionId" integer NOT NULL,
                "parentId" integer,
                CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6f75127243765e8305a3dd0717" ON "node" ("createdAt")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_71d1b33ac75c2b33eaec1b1def" ON "node" ("updatedAt")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7204c77952e8c70fc6c0d5e26b" ON "node" ("title")
        `);
        await queryRunner.query(`
            ALTER TABLE "node"
            ADD CONSTRAINT "FK_3b33fa3ae3914f1d212eaebe856" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "node"
            ADD CONSTRAINT "FK_ba001b660671bf4233abd7e7955" FOREIGN KEY ("parentId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "node" DROP CONSTRAINT "FK_ba001b660671bf4233abd7e7955"
        `);
        await queryRunner.query(`
            ALTER TABLE "node" DROP CONSTRAINT "FK_3b33fa3ae3914f1d212eaebe856"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7204c77952e8c70fc6c0d5e26b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_71d1b33ac75c2b33eaec1b1def"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6f75127243765e8305a3dd0717"
        `);
        await queryRunner.query(`
            DROP TABLE "node"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."node_type_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4b1511ab37f27d6f11242b81c9"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1063954fd0fa5e655cc482fb5c"
        `);
        await queryRunner.query(`
            DROP TABLE "session"
        `);
    }

}
