import { YamlReader, Version } from '../components/index.js'
import SignUtil from './signUtil.js'
import Protocol from './protocol.js'

const SwitchUtils = {
  /**
   * TRSS-Yunzai 签名地址修改方法
   */
  async isTrss (newAddr) {
    const yamlPath = `${Version.Path}/config/ICQQ.yaml`
    const yamlReader = new YamlReader(yamlPath, false)
    try {
      const botConfig = yamlReader.get('bot')
      if (botConfig && typeof botConfig === 'object') {
        botConfig.sign_api_addr = newAddr
        yamlReader.set('bot', botConfig)
        await yamlReader.save()
      }
    } catch {}
  },

  /**
   * Miao-Yunzai 签名地址修改方法
   */
  async isMiao (newAddr) {
    const yamlPath = `${Version.Path}/config/config/bot.yaml`
    const yamlReader = new YamlReader(yamlPath, false)
    try {
      const keyPath = 'sign_api_addr'
      if (yamlReader.has(keyPath)) {
        yamlReader.set(keyPath, newAddr)
        await yamlReader.save()
      }
    } catch {}
  },

  /**
   * 获取延迟最低的状态正常签名地址
   */
  async getSignAddr () {
    try {
      const signData = await SignUtil.getSignData(true)
      if (!signData || !signData.providers) {
        return null
      }

      const allItems = signData.providers.flatMap((provider) => provider.items)
      const validatedItems = allItems.filter((item) => item.status === '✅正常')

      if (validatedItems.length === 0) {
        return null
      }

      validatedItems.sort((a, b) => {
        const delayA = parseInt(a.delay.replace('ms', ''), 10) || Infinity
        const delayB = parseInt(b.delay.replace('ms', ''), 10) || Infinity
        return delayA - delayB
      })

      const bestItem = validatedItems[0]
      const baseUrl = bestItem.url
      const key = bestItem.key !== '❎' ? bestItem.key : null
      const ver = await Protocol.version()

      const params = new URLSearchParams()
      if (key) params.append('key', key)
      if (ver && ver !== '未知') params.append('ver', ver)

      return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
    } catch (error) {
      console.error('获取签名地址失败:', error)
      return null
    }
  }
}

export default SwitchUtils
