import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('recipe')
    .addColumn('uri', 'varchar', (col) => col.primaryKey())
    .addColumn('cid', 'varchar', (col) => col.notNull())
    .addColumn('author_did', 'varchar', (col) => col.notNull())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('servings', 'integer')
    .addColumn('cook_time_minutes', 'integer')
    .addColumn('thumbnail_url', 'varchar')
    .addColumn('tags', 'text')
    .addColumn('visibility', 'varchar', (col) => col.notNull().defaultTo('published'))
    .addColumn('created_at', 'varchar', (col) => col.notNull())
    .addColumn('indexed_at', 'varchar', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('recipe_author_did_idx')
    .on('recipe')
    .column('author_did')
    .execute()

  await db.schema
    .createIndex('recipe_visibility_idx')
    .on('recipe')
    .column('visibility')
    .execute()

  await db.schema
    .createIndex('recipe_created_at_idx')
    .on('recipe')
    .column('created_at')
    .execute()

  console.log('✅ Recipe 테이블 생성 완료')
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('recipe').execute()
}
