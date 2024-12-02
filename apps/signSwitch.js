import { Version, Config } from '../components/index.js'
import { SwitchUtils, WatchLog } from '../models/index.js'
import { plugin, redis } from '../components/Base/index.js'

export class signSwitch extends plugin {
  constructor () {
    super({
      name: '星点签名:自动切换',
      event: 'message',
      rule: [
        {
          reg: /^(#)?(星点签名|starlight-qsign)(切换)(地址)?$/i,
          fnc: 'switchSign',
          permission: 'master'
        }
      ]
    })

    this.keywords = ['签名api异常']
    this.redisKey = 'Yz:starlight-qsign:lock'
    this.logPath = `${Version.Path}/logs/error.log`
    this.lastLog = null

    if (Config.sign.autoSwitch) {
      WatchLog.watchLog(this.logPath, this.keywords, (line) =>
        this.onLog(line)
      )
    }
  }

  onLog (line) {
    if (!Config.sign.autoSwitch || line === this.lastLog) return

    if (Version.name === 'Karin') {
      logger.warn(`版本 ${Version.name} 检测到,但暂不兼容`)
      return
    }

    this.lastLog = line
    logger.warn('检测到签名异常，正在切换并重启...')
    this.switchAndRestart()
  }

  async switchSign () {
    try {
      await this.switchAndRestart()
    } catch (error) {}
  }

  async switchAndRestart () {
    const locked = await redis.get(this.redisKey)
    if (locked) return

    try {
      await redis.set(this.redisKey, 1)
      await redis.expire(this.redisKey, 3600)

      const newAddr = await SwitchUtils.getSuccessSignAddr()
      if (!newAddr) return

      if (Version.name === 'TRSS-Yunzai') {
        logger.warn(`${Version.name} 切换签名地址: ${newAddr}`)
        await SwitchUtils.isTrss(newAddr)
      } else if (Version.name === 'Miao-Yunzai') {
        logger.warn(`${Version.name} 切换签名地址: ${newAddr}`)
        await SwitchUtils.isMiao(newAddr)
      } else if (Version.name === 'Karin') {
        logger.warn(`暂不支持${Version.name}`)
      } else {
        logger.warn(`不支持的崽的类型: ${Version.name}`)
      }
    } catch (error) {
      logger.error('切换签名时发生错误:', error)
    } finally {
      await redis.del(this.redisKey)
    }
  }
}
