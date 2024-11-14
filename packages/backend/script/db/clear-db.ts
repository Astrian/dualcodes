import { CompiledQuery, Kysely } from 'kysely'
import { DB } from '../../src/types/db'

export async function clearDB(db: Kysely<DB>): Promise<void> {
  var 删除语句 = (
    await db.executeQuery(
      CompiledQuery.raw(
        [
          // ..
          `SELECT name`,
          `FROM sqlite_master`,
          `WHERE type = 'table'`,
          `AND name NOT LIKE 'sqlite_%';`,
        ].join('\n'),
        [],
      ),
    )
  ).rows.map((row: any) => `DELETE FROM ${row.name};`)

  // 关闭外键约束
  await db.executeQuery(CompiledQuery.raw('PRAGMA foreign_keys = OFF;', []))

  // 开始事务
  await db.transaction().execute(async (trx) => {
    for (var statement of 删除语句) {
      await trx.executeQuery(CompiledQuery.raw(statement, []))
    }
  })

  // 打开外键约束
  await db.executeQuery(CompiledQuery.raw('PRAGMA foreign_keys = ON;', []))
}
