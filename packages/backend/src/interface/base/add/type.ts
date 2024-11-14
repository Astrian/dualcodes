import { JSON状态接口类型, JSON解析插件 } from '@lsby/net-core'
import { Task } from '@lsby/ts-fp-data'
import { z } from 'zod'

export default new JSON状态接口类型(
  '/api/base/add',
  'post',
  [
    new Task(async () => {
      return new JSON解析插件(
        z.object({
          a: z.number(),
          b: z.number(),
        }),
        {},
      )
    }),
  ],
  z.object({
    res: z.number(),
  }),
  z.never(),
)
