import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfile1776049948499 implements MigrationInterface {
    name = 'AddProfile1776049948499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "user_name" TO "profile_id"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" TO "UQ_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "name_original" character varying NOT NULL, "type_file" character varying NOT NULL, "user_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_23371445bd80cb3e413089551bf" UNIQUE ("profile_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_id" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_23371445bd80cb3e413089551bf" UNIQUE ("profile_id")`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_23371445bd80cb3e413089551bf" TO "UQ_074a1f262efaca6aba16f7ed920"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "profile_id" TO "user_name"`);
    }

}
