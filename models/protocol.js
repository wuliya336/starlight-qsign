import { Config } from '../components/index.js'

const Protocol = {
  /**
   * 获取机器人 QQ 号（优先从 e 中获取）
   */
  getBotUin (e) {
    if (e?.self_id) {
      return e.self_id
    }

    const uinArray = Config.uin
    if (Array.isArray(uinArray)) {
      return uinArray.find((uin) => uin !== 'stdin') || null
    }

    return null
  },
  async name (e) {
    const uin = this.getBotUin(e)
    if (!uin) return '未知'
    return Bot[uin]?.version?.name || '未知'
  },

  async version (e) {
    const uin = this.getBotUin(e)
    if (!uin) return '未知'
    return Bot[uin]?.apk?.ver || '未知'
  },


  async signAddr (e) {
    const uin = this.getBotUin(e)
    if (!uin) return '未知'
    return Bot[uin]?.sig?.sign_api_addr || '未知'
  }
}

export default Protocol
