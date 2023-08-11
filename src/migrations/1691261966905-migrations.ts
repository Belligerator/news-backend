import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1691261966905 implements MigrationInterface {
    public name: string = 'Migrations1691261966905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` varchar(255) NOT NULL, \`language\` enum ('cs', 'en') NOT NULL, \`title\` varchar(255) NOT NULL, \`order\` int NOT NULL DEFAULT '10', PRIMARY KEY (\`id\`, \`language\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`article_type\` enum ('news', 'story') NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`parent\` int NULL, \`timestamp\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article_content\` (\`id\` int NOT NULL AUTO_INCREMENT, \`article_id\` int NOT NULL, \`language\` enum ('cs', 'en') NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` longtext NOT NULL, \`coverImage\` varchar(255) NULL, \`date_of_publication\` datetime NOT NULL, INDEX \`language\` (\`language\`), INDEX \`date_of_publication_idx\` (\`date_of_publication\`), FULLTEXT INDEX \`IDX_fulltext\` (\`title\`, \`body\`), INDEX \`article_id\` (\`article_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`push_token\` (\`token\` varchar(255) NOT NULL, \`language\` enum ('cs', 'en') NOT NULL DEFAULT 'cs', \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`token\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article__tag\` (\`article_id\` int NOT NULL, \`tag_id\` varchar(255) NOT NULL, \`tag_language\` enum ('cs', 'en') NOT NULL, INDEX \`IDX_74fd901c12ea1b6d4eea6885d2\` (\`article_id\`), INDEX \`IDX_5a8ded7416c4f8d2ec4c0d6b1f\` (\`tag_id\`, \`tag_language\`), PRIMARY KEY (\`article_id\`, \`tag_id\`, \`tag_language\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_c27e451a84c599d6164080b0f7a\` FOREIGN KEY (\`parent\`) REFERENCES \`article\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`article_content\` ADD CONSTRAINT \`FK_695e2a3fb3e8f1995d703d5b91c\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article__tag\` ADD CONSTRAINT \`FK_74fd901c12ea1b6d4eea6885d2c\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`article__tag\` ADD CONSTRAINT \`FK_5a8ded7416c4f8d2ec4c0d6b1f4\` FOREIGN KEY (\`tag_id\`, \`tag_language\`) REFERENCES \`tag\`(\`id\`,\`language\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article__tag\` DROP FOREIGN KEY \`FK_5a8ded7416c4f8d2ec4c0d6b1f4\``);
        await queryRunner.query(`ALTER TABLE \`article__tag\` DROP FOREIGN KEY \`FK_74fd901c12ea1b6d4eea6885d2c\``);
        await queryRunner.query(`ALTER TABLE \`article_content\` DROP FOREIGN KEY \`FK_695e2a3fb3e8f1995d703d5b91c\``);
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_c27e451a84c599d6164080b0f7a\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a8ded7416c4f8d2ec4c0d6b1f\` ON \`article__tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_74fd901c12ea1b6d4eea6885d2\` ON \`article__tag\``);
        await queryRunner.query(`DROP TABLE \`article__tag\``);
        await queryRunner.query(`DROP TABLE \`push_token\``);
        await queryRunner.query(`DROP INDEX \`article_id\` ON \`article_content\``);
        await queryRunner.query(`DROP INDEX \`IDX_fulltext\` ON \`article_content\``);
        await queryRunner.query(`DROP INDEX \`date_of_publication_idx\` ON \`article_content\``);
        await queryRunner.query(`DROP INDEX \`language\` ON \`article_content\``);
        await queryRunner.query(`DROP TABLE \`article_content\``);
        await queryRunner.query(`DROP TABLE \`article\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }

}
