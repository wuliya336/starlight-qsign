import { plugin } from '../components/Base/index.js'
import { Render, Version } from '../components/index.js'
import { Protocol } from '../models/index.js'

export class addr extends plugin {
  constructor () {
    super({
      name: '星点签名:查询签名地址',
      event: 'message',
      priority: -20,
      rule: [
        {
          reg: /^(#)?(星点签名|starlight-qsign)(查(询|看))?签名地址$/i,
          fnc: 'addr'
        }
      ]
    })
  }

  async addr (e) {
    if (!this.e.isMaster) {
      return true
    }
    if (Version.name === 'karin') {
      await e.reply('暂不支持karin')
      return true
    }


    const name = await Protocol.name(e) || '未知'

    let signAddr
    if (name === 'ICQQ') {
      signAddr = await Protocol.signAddr(e) || '未知'
    } else {
      signAddr = '未配置签名地址或不支持此适配器'
    }

    const img = await Render.render(
      'sign/addr',
      { name, signAddr },
      { e, scale: 1.4 }
    )
    await e.reply(img)
    return true
  }
}
