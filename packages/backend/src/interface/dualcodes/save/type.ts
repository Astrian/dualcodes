import { JSON状态接口类型, JSON解析插件 } from '@lsby/net-core'
import { Task } from '@lsby/ts-fp-data'
import { z } from 'zod'
import { Global } from '../../../global/global'

export default new JSON状态接口类型(
  '/api/dualcodes/save',
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
          data: z.string(),
        }),
        {},
      )
    }),
  ],
  z.object({}),
  z.enum(['THE_CALL_PASSWORD_IS_INCORRECT']),
)
