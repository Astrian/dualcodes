import fs from 'node:fs'
import path from 'path'
import tsToZod from 'ts-to-zod'
import ts from 'typescript'

function 寻找顶级类型节点全文(源文件: ts.SourceFile, 节点名称: string) {
  var Generated节点全文: string = ''
  ts.forEachChild(源文件, function 查询器(node) {
    if (ts.isTypeAliasDeclaration(node)) {
      if (node.name.text === 节点名称) {
        Generated节点全文 = node.getText(源文件)
      }
    }
    ts.forEachChild(node, 查询器)
  })
  return Generated节点全文
}

function main() {
  const tsconfig路径 = path.resolve(import.meta.dirname, '../../tsconfig.json')
  const tsconfig内容 = ts.parseConfigFileTextToJson(tsconfig路径, fs.readFileSync(tsconfig路径, 'utf8'))
  const 解析后的tsconfig = ts.parseJsonConfigFileContent(tsconfig内容.config, ts.sys, path.resolve(tsconfig路径, '..'))
  const 项目 = ts.createProgram(解析后的tsconfig.fileNames, 解析后的tsconfig.options)

  var 类型定义文件 = 项目.getSourceFiles().filter((a) => a.fileName.includes('src/types/db.ts'))[0]
  if (!类型定义文件) return
  var 类型定义文件全文 = 类型定义文件.getFullText()

  // Generated 表示可选的, 直接替换掉
  var Generated节点全文: string = 寻找顶级类型节点全文(类型定义文件, 'Generated')
  var 类型定义文件全文 = 类型定义文件全文.replaceAll(Generated节点全文, '').replace(/Generated<(.*)>/g, '$1')

  // Timestamp 表示时间, 转换器无法识别复杂形式, 直接替换为 Date
  var Timestamp节点全文: string = 寻找顶级类型节点全文(类型定义文件, 'Timestamp')
  var 类型定义文件全文 = 类型定义文件全文.replaceAll(Timestamp节点全文, 'export type Timestamp = Date')

  var 转换结果 = tsToZod.generate({
    sourceText: 类型定义文件全文,
  })

  fs.writeFileSync(path.resolve(import.meta.dirname, '../../src/types/db-zod.ts'), 转换结果.getZodSchemasFile(''))
}
main()
