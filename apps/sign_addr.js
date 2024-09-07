import { getPlatformInfo, getSignApiAddr } from "../model/protocol.js";
import { Common } from '../components/index.js'

export class addr extends plugin {
  constructor() {
    super({
      name: '星点签名插件',
      event: 'message',
      priority: Infinity,
      rule: [
        {
          reg: /^(#)?(星点(签名)?)?(查询)?签名地址$/i,
          fnc: 'addr',
        }
      ],
    });
  }

  async addr(e) {
    const platformInfo = getPlatformInfo(e);
    let signApiAddr = '未知';

    if (platformInfo === 'ICQQ') {
      signApiAddr = getSignApiAddr();
    }

    return await Common.render('sign/addr/index', {
      signApiAddr,
      platformInfo
    }, { e, scale: 1.4 });
  }
}
