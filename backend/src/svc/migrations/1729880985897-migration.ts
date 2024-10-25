import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1729880985897 implements MigrationInterface {
    name = 'Migration1729880985897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "node"
            ADD "isRoot" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "node" DROP COLUMN "isRoot"
        `);
    }

}
