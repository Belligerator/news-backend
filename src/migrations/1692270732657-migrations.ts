import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1692270732657 implements MigrationInterface {
    public name: string = 'Migrations1692270732657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_content\` CHANGE \`coverImage\` \`cover_image\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_content\` CHANGE \`cover_image\` \`coverImage\` varchar(255) NULL`);
    }

}
