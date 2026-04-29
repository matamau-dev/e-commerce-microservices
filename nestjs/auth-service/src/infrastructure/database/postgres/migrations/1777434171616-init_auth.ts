import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuth1777434171616 implements MigrationInterface {
    name = 'InitAuth1777434171616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sessions_role_enum" AS ENUM('super_admin', 'admin', 'supervisor', 'cliente')`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "role" "public"."sessions_role_enum" NOT NULL, "refresh_token" character varying NOT NULL, "device_info" character varying, "ip_address" character varying, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "revoked_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "token" text NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c2b3ed5a8f0e4972e358985038" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "login_attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "email" character varying NOT NULL, "success" boolean NOT NULL, "ip_address" character varying, "device_info" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_070e613c8f768b1a70742705c5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "two_factor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "secret" character varying NOT NULL, "is_enabled" boolean NOT NULL DEFAULT false, "verified_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_162c7f53b41b84102a8e06eff18" UNIQUE ("user_id"), CONSTRAINT "PK_d9e707ebc943c110fcaab7cdd8c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "two_factor"`);
        await queryRunner.query(`DROP TABLE "login_attempts"`);
        await queryRunner.query(`DROP TABLE "revoked_tokens"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TYPE "public"."sessions_role_enum"`);
    }

}
