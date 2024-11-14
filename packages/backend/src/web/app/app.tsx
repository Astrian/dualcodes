import React, { useContext, useState } from 'react'
import { 上下文描述 } from '../ctx/ctx'
import { usePost } from '../global/global'

function 主页(): React.JSX.Element {
  const 上下文 = useContext(上下文描述)
  const [数字a, 设置数字a] = useState<number>(1)
  const [数字b, 设置数字b] = useState<number>(2)
  const [数据, _刷新数据, _设置正确数据, _设置错误数据] = usePost('/api/base/add', { a: 数字a, b: 数字b })

  const 更新数字a = (e: React.ChangeEvent<HTMLInputElement>): void => 设置数字a(Number(e.target.value))
  const 更新数字b = (e: React.ChangeEvent<HTMLInputElement>): void => 设置数字b(Number(e.target.value))

  if (数据 == null) return <div>加载中...</div>
  if (数据.status === 'fail') return <div>发生错误: {数据.data}</div>

  return (
    <div className="text-center m-5 flex flex-col justify-center h-screen">
      <div className="mb-4">
        <span>数字 a: </span>
        <input type="number" value={数字a} onChange={更新数字a} placeholder="输入数字 a" className="ml-2 p-1 w-24" />
      </div>
      <div className="mb-4">
        <span>数字 b: </span>
        <input type="number" value={数字b} onChange={更新数字b} placeholder="输入数字 b" className="ml-2 p-1 w-24" />
      </div>
      <p className="text-lg mb-5">a + b 的结果: {数据.data.res}</p>
      <div>
        <button onClick={退出登录} className="p-2 bg-blue-500 text-white border-none rounded">
          退出登录
        </button>
      </div>
    </div>
  )

  async function 退出登录(): Promise<void> {
    await 上下文.客户端.退出登录()
    window.location.reload()
  }
}

function 登录页({ on登录 }: { on登录: (e: boolean) => void }): React.JSX.Element {
  const 上下文 = useContext(上下文描述)

  return (
    <div className="max-w-md mx-auto p-8 border border-gray-300 rounded-lg shadow-lg bg-gray-50">
      <h1 className="text-center mb-5 text-gray-800">登录</h1>
      <form>
        <div className="mb-5">
          <label htmlFor="用户名" className="block mb-2 font-bold">
            用户名:
          </label>
          <input
            type="text"
            id="用户名"
            name="用户名"
            required
            className="w-full p-2 rounded border border-gray-300 box-border"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="密码" className="block mb-2 font-bold">
            密码:
          </label>
          <input
            type="password"
            id="密码"
            name="密码"
            required
            className="w-full p-2 rounded border border-gray-300 box-border"
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
          onMouseOver={(e) => (e.currentTarget.className = 'w-full p-3 rounded bg-blue-700 text-white font-semibold')}
          onMouseOut={(e) => (e.currentTarget.className = 'w-full p-3 rounded bg-blue-600 text-white font-semibold')}
          onClick={登录按钮点击事件}
        >
          登录
        </button>
      </form>
    </div>
  )

  async function 登录按钮点击事件(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault()
    const 用户名 = (document.getElementById('用户名') as HTMLInputElement).value
    const 密码 = (document.getElementById('密码') as HTMLInputElement).value

    const 结果 = await 上下文.客户端.登录(用户名, 密码)
    if (结果.status === 'fail') return alert(结果.data)
    on登录(true)
  }
}

export function App(): React.JSX.Element {
  const 上下文 = useContext(上下文描述)
  const [已登录, 设置已登录] = useState(上下文.客户端.已登录())

  return (
    <上下文描述.Provider value={上下文}>
      {!已登录 ? <登录页 on登录={(e: boolean) => 设置已登录(e)}></登录页> : <主页></主页>}
    </上下文描述.Provider>
  )
}
