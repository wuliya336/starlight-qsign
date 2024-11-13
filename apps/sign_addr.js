import { getPlatformInfo, getSignApiAddr } from "../model/index.js";
import { Common } from "../components/index.js";

export class addr extends plugin {
  constructor() {
    super({
      name: "星点签名:签名地址",
      event: "message",
      priority: -20,
      rule: [
        {
          reg: /^(#)?(星点(签名)?)?(查询)?签名地址$/i,
          fnc: "addr",
        },
      ],
    });
  }

  async addr(e) {
    if (!this.e.isMaster) {
      return true;
    }
    const platformInfo = getPlatformInfo(e);
    let signApiAddr = "未知";

    if (platformInfo === "ICQQ") {
      signApiAddr = getSignApiAddr();
    }

    return await Common.render(
      "sign/addr",
      {
        signApiAddr,
        platformInfo,
      },
      { e, scale: 1.4 },
    );
  }
}
