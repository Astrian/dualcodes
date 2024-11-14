import { JSON状态接口类型, JSON解析插件 } from '@lsby/net-core'
import { Task } from '@lsby/ts-fp-data'
import { z } from 'zod'
import { Global } from '../../../global/global'

export default new JSON状态接口类型(
  '/api/dualcodes/load',
  'post',
  [
    new Task(async () => {
      return await Global.getItem('kysely-plugin')
    }),
    new Task(async () => {
      return new JSON解析插件(
        z.object({
          callPwd: z.string(),
          id: z.string(),
        }),
        {},
      )
    }),
  ],
  z.object({
    data: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  z.enum(['THE_CALL_PASSWORD_IS_INCORRECT', 'DATA_DOES_NOT_EXIST']),
)
