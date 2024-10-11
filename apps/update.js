import { update as Update } from "../../other/update.js";
import { Plugin_Name } from "../components/index.js"; 

const RepoUrl = "https://github.com/wuliya336/starlight-img";

export class update extends plugin {
  constructor() {
    super({
      name: "星点图片:更新",
      event: "message",
      priority: -20,
      rule: [
        {
          reg: /(#)?(星点图片|starlight)(插件)?(强制)?更新$/i,
          fnc: "update"
        },
        {
          reg: /^#星点图片(插件)?更新日志$/i, 
          fnc: "sendLog"
        }
      ]
    });
  }

 /* 覆写getRemoteUrl、gitErrUrl、getLog函数 */
  async initUpdate(e, Plugin_Name, RepoUrl) {
    const update_fun = new Update(e);

    Object.assign(update_fun, {
      getRemoteUrl: () => RepoUrl,  
      gitErrUrl: () => RepoUrl,   

      getLog: async (...args) => {
        console.log(`getLog called for plugin: ${Plugin_Name}`);
        const log = await Update.prototype.getLog.apply(update_fun, args);

        if (log && log.data) {
          log.data = log.data.map(node => ({
            ...node,
            nickname: "星点图片",  
            user_id: Bot.uin,  
          }));
        }

        return log;
      }
    });

    return update_fun;
  }


  async update(e = this.e) {
    if (!this.e.isMaster) return false;
    e.msg = `#${e.msg.includes("强制") ? "强制" : ""}更新starlight-img`;

    const up = await this.initUpdate(e, Plugin_Name, RepoUrl);
    up.e = e;

    return up.update(); 
  }

  async sendLog(e = this.e) {
    if (!this.e.isMaster) return false;

    const up = await this.initUpdate(e, Plugin_Name, RepoUrl);
    up.e = e;

    const logMsg = await up.getLog(Plugin_Name);

    if (!logMsg || !logMsg.data) {
      return false;
    }

    const updatedNodes = logMsg.data.map(node => ({
      ...node,
      message: node.message
    }));
    return e.reply(await Bot.makeForwardMsg(updatedNodes));
  }
}
