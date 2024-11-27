import { Config, Render, Data, Version } from '../components/index.js'
import { SignUtil } from '../model/index.js'
import { plugin, redis, Bot, segment } from '../components/Base/index.js'

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
      ...(Version.name === 'Karin' ? [] : [segment.face(175)])
    ]
    await e.reply(replyMessage)

    Data.sleep(500)
    await e.reply('正在获取公共签名API列表信息，请稍候...', true)

    try {
      const { providers, updateTime } = await SignUtil.getSignData(
        Config.sign.remote
      )
      if (!providers) {
        throw new Error('获取公共签名API信息失败')
      }

      const outputs = []
      const initMsg = []
      SignUtil.initMsg(initMsg, e.self_id)

      if (Version.name === 'Karin') {
        const providersWithStatus = providers.map(provider => {
          return {
            ...provider,
            items: provider.items.map(async (item) => {
              if (item.check !== false) {
                const updatedItem = await SignUtil.checkSignStatus(item)
                return {
                  ...updatedItem
                }
              } else {
                return item
              }
            })
          }
        })

        const resolvedProviders = await Promise.all(
          providersWithStatus.map(async provider => {
            return {
              ...provider,
              items: await Promise.all(provider.items)
            }
          })
        )

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
        return true
      }

      for (const provider of providers) {
        const providerOutput = []
        SignUtil.addMessage(providerOutput, `由 ${provider.provider} 提供:`, e.self_id)
        if (provider.memo) {
          SignUtil.addMessage(providerOutput, `备注: ${provider.memo}`, e.self_id)
        }

        for (const item of provider.items) {
          if (item.check === false) {
            SignUtil.addMessage(
              providerOutput,
              `名称: ${item.name}\n地址: ${item.url}`,
              e.self_id
            )
            continue
          }

          const updatedItem = await SignUtil.checkSignStatus(item)

          SignUtil.addMessage(
            providerOutput,
            `名称: ${updatedItem.name}\n地址: ${updatedItem.url}\n密钥: ${updatedItem.key}\n状态: ${updatedItem.status}\n延迟: ${updatedItem.delay}`,
            e.self_id
          )
        }
        outputs.push(...providerOutput)
      }

      SignUtil.addMessage(outputs, `数据更新于: ${updateTime}`, e.self_id)

      if (Config.sign.render) {
        const img = await Render.render(
          'sign/list',
          {
            providers,
            updateTime,
            initMsg
          },
          { e, scale: 1.2 }
        )
        await e.reply(img)
        return true
      } else {
        const allMessages = [...initMsg, ...outputs]
        await this.reply(await Bot.makeForwardMsg(allMessages))
      }
      if (e.isGroup) {
        await redis.del(redisKey)
      }
      return true
    } catch (error) {
      console.error(error)
      await e.reply('获取公共签名API信息失败')
      return false
    }
  }
}
