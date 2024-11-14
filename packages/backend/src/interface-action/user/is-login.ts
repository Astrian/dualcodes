import { 业务行为 } from '@lsby/net-core'
import { Either, Right } from '@lsby/ts-fp-data'

type 输入 = {
  userId?: string | undefined
}
type 错误 = never
type 输出 = {
  isLogin: boolean
}

export class 用户已登录 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var userId = 参数.userId
    if (userId == null) return new Right({ isLogin: false })
    return new Right({ isLogin: true })
  }
}
