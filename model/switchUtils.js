import { YamlReader, Version, Config } from '../components/index.js'
import SignUtil from './signUtil.js'
import Restart from './restart.js'

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
        await Restart.restart()
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
        await Restart.restart()
      }
    } catch {}
  },

  /**
   * 获取延迟最低的状态正常签名地址
   */
  async getSuccessSignAddr () {
    try {
      const useRemote = Config.sign.remote
      const signData = await SignUtil.getSignData(useRemote)
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

      return validatedItems[0].url
    } catch {
      return null
    }
  }
}

export default SwitchUtils
