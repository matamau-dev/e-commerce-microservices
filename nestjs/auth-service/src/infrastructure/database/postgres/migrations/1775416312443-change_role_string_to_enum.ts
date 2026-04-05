import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRoleStringToEnum1775416312443 implements MigrationInterface {
    name = 'ChangeRoleStringToEnum1775416312443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."sessions_role_enum" AS ENUM('super_admin', 'admin', 'supervisor', 'vendedor', 'comprador')`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "role" "public"."sessions_role_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."sessions_role_enum"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "role" character varying NOT NULL`);
    }

}
