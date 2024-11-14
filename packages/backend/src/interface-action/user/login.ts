import { 业务行为 } from '@lsby/net-core'
import { Either } from '@lsby/ts-fp-data'
import { Kysely } from 'kysely'
import { DB } from '../../types/db'
import { 检查用户存在 } from '../check/check-user-exist'
import { 检查用户密码 } from '../check/check-user-pwd'

type 输入 = {
  kysely: Kysely<DB>
  name: string
  pwd: string
  signJwt: (a: { userId: string }) => string
}
type 错误 = '用户不存在' | '密码错误'
type 输出 = {
  token: string
}

export class 登录 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var 结果 = await 业务行为
      .混合组合多项([new 检查用户存在(), new 检查用户密码()])
      .映射结果((a) => ({ token: 参数.signJwt({ userId: a.用户.id }) }))
      .运行业务行为({ kysely: 参数.kysely, 用户名: 参数.name, 输入密码: 参数.pwd })
    return 结果
  }
}
