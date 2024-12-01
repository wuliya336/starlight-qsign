import { Config, Render, Data, Version } from '../components/index.js'
import { SignUtil } from '../models/index.js'
import { plugin, redis, Bot, segment, logger } from '../components/Base/index.js'

export class sign extends plugin {
  constructor () {
    super({
      name: '星点签名:签名信息列表状态',
      event: 'message',
      priority: -20,
      rule: [
        {
          reg: /^(#)?(公共(api)?(签名)?(api)?|api(列表|签名)|45)$/i,
          fnc: 'list'
        }
      ]
    })
  }

  async list (e) {
    if (!Config.sign.list) return false

    let redisKey
    if (e.isGroup) {
      redisKey = `Yz:starlight-qsign:List:${e.group_id}:CD`
      if (!(await SignUtil.checkRedisStatus(redis, redisKey, e))) return false
    }

    const replyMessage = [
      '真是没救了,你个小杂鱼',
      [segment.face(175)]
    ]
    await e.reply(replyMessage, true, { at: true })

    Data.sleep(500)
    await e.reply('正在获取公共签名API列表信息，请稍候...', true, { recallMsg: 5 })

    try {
      const { providers, updateTime } = await SignUtil.getSignData(
        Config.sign.remote
      )
      if (!providers) {
        throw new Error('获取公共签名API信息失败')
      }

      const initMsg = []
      SignUtil.initMsg(initMsg, e.self_id)

      const resolvedProviders = await Promise.all(
        providers.map(async (provider) => {
          return {
            ...provider,
            items: await Promise.all(
              provider.items.map(item => SignUtil.checkSignStatus(item))
            )
          }
        })
      )

      if (Config.sign.render || Version.name === 'Karin') {
        const img = await Render.render(
          'sign/list',
          {
            providers: resolvedProviders,
            updateTime,
            initMsg
          },
          { e, scale: 1.2 }
        )
        await e.reply(img)
      } else {
        const outputs = []
        for (const provider of resolvedProviders) {
          SignUtil.addMessage(outputs, `由 ${provider.provider} 提供:`, e.self_id)
          if (provider.memo) {
            SignUtil.addMessage(outputs, `备注: ${provider.memo}`, e.self_id)
          }
          for (const item of provider.items) {
            SignUtil.addMessage(outputs, SignUtil.generateItemMessage(item), e.self_id)
          }
        }
        SignUtil.addMessage(outputs, `数据更新于: ${updateTime}`, e.self_id)
        const allMessages = [...initMsg, ...outputs]
        await this.reply(await Bot.makeForwardMsg(allMessages))
      }

      if (e.isGroup) {
        await redis.del(redisKey)
      }
      return true
    } catch (error) {
      logger.error(error)
      if (e.isGroup) {
        await redis.del(redisKey)
      }
      await e.reply('获取公共签名API信息失败')
      return false
    }
  }
}
