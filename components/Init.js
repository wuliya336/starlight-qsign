import fs from 'fs'
import Version from './Version.js'
import logger from './Base/logger.js'

export default async () => {
  const files = fs.readdirSync(`${Version.Plugin_Path}/apps`).filter(file => file.endsWith('.js'))
  let ret = []
  files.forEach(file => {
    ret.push(import(`../apps/${file}`))
  })

  ret = await Promise.allSettled(ret)

  const apps = {}
  for (const i in files) {
    const name = files[i].replace('.js', '')

    if (ret[i].status != 'fulfilled') {
      logger.error(`载入插件错误：${logger.red(name)}`)
      logger.error(ret[i].reason)
      continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
  }
  return apps
}