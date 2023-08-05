import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1691261966905 implements MigrationInterface {
    public name: string = 'Migrations1691261966905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`push_token\` ADD \`language\` enum ('cs', 'en') NOT NULL DEFAULT 'cs' AFTER \`token\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`push_token\` DROP COLUMN \`language\``);
    }

}
