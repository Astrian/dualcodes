import { execSync } from 'child_process'
import nodeWatch from 'node-watch'
import * as path from 'path'

var args = process.argv.slice(2)
var watchPath = args[0]
var cmd = args[1]

if (!watchPath) throw new Error('没有提供监视路径')
if (!cmd) throw new Error('没有提供命令')

function 任务() {
  console.log('========生成开始========')
  try {
    console.log('执行', cmd)
    execSync(`${cmd}`, { stdio: 'inherit' })
  } catch (e: unknown) {
    console.error(`错误: ${String(e)}`)
    console.log('========生成结束========')
  }
  console.log('========生成结束========')
}
任务()

var 定时器句柄: NodeJS.Timeout
var 状态: '执行中' | '空闲中' | '等待稍后执行' = '空闲中'
var 延时 = 1000
var 执行堆积 = false
nodeWatch(
  path.resolve(watchPath),
  {
    recursive: true,
    filter: (name) => {
      console.log('文件变化: ' + name)

      var 忽略 = false

      if (name.includes('src/interface/interface-list.ts')) 忽略 = true
      if (name.includes('src\\interface\\interface-list.ts')) 忽略 = true
      if (name.includes('src/types/interface-type.ts')) 忽略 = true
      if (name.includes('src\\types\\interface-type.ts')) 忽略 = true

      if (忽略) {
        console.log('忽略')
        return false
      }

      return true
    },
  },
  function () {
    switch (状态) {
      case '执行中':
        console.log('正在执行中, 本次事件将会在稍后执行')
        执行堆积 = true
        return
      case '等待稍后执行':
        console.log('正在等待稍后执行, 本次事件将会在稍后与当前事件一并执行')
        clearTimeout(定时器句柄)
        break
      case '空闲中':
        console.log('正在空闲中, 本次事件将会在稍后执行')
        状态 = '等待稍后执行'
        break
      default:
        throw new Error('意外的状态')
    }

    定时器句柄 = setTimeout(function f() {
      状态 = '执行中'
      任务()
      状态 = '空闲中'
      if (执行堆积) {
        执行堆积 = false
        f()
      }
    }, 延时)
  },
)
