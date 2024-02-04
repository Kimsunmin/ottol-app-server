import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705988827029 implements MigrationInterface {
  name = 'Migration1705988827029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lotto_search_history" RENAME COLUMN "winner_rank" TO "win_rank"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lotto_search_history" RENAME COLUMN "win_rank" TO "winner_rank"`,
    );
  }
}
