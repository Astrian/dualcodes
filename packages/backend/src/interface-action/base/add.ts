import { 业务行为 } from '@lsby/net-core'
import { Either, Right } from '@lsby/ts-fp-data'

type 输入 = {
  a: number
  b: number
}
type 错误 = never
type 输出 = {
  res: number
}

export class 加法 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    return new Right({ res: 参数.a + 参数.b })
  }
}
