let Update
const PLUGIN_NAME = "starlight-qsign"
try {
  Update = (await import("../../other/update.js")).update
} catch {
  logger.warn("[starlight-qsign] 导入本体更新模块失败，将无法使用更新命令")
}



export class XDUpdate extends plugin {
    constructor() {
        super({
            name: '星点签名:更新',
            event: 'message',
            priority: -20,
            rule: [
                {
                    reg: '^#*(starlight-qsign|星点签名)(插件)?(强制)?更新$',
                    fnc: 'update',
                    permission: 'master'
                }
            ]
        })
    }
    async update(e = this.e) {
        const Type = e.msg.includes("强制") ? "#强制更新" : "#更新"
        e.msg = Type + PLUGIN_NAME
        const up = new Update(e)
        up.e = e
        return up.update()
      }
    
      async updateLog(e = this.e) {
        e.msg = "#更新日志" + PLUGIN_NAME
        const up = new Update(e)
        up.e = e
        return up.updateLog()
      }
    }
    