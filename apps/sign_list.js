import common from "../../../lib/common/common.js";
import { Config, Data, Plugin_Path } from "../components/index.js";
import axios from "axios";

export class sign extends plugin {
  constructor() {
    super({
      name: "星点签名:签名信息列表状态",
      event: "message",
      priority: -20,
      rule: [
        {
          reg: /^(#)?(公共(api)?(签名)?(api)?|api(列表|签名)|45)$/i,
          fnc: "list",
        },
      ],
    });
  }

  async list(e) {
    if (!Config.signlist) {
      return false;
    }
    await e.reply("没救了", true);
    await common.sleep(500);
    await e.reply("正在获取公共签名API列表信息，请稍候...", true);

    const msg = [];
    let providers;
    let updateTime = "未知";

    if (Config.remote) {
      // 远程模式
      const response = await axios.post(
        "https://api.wuliya336.top/api/starlight-qsign",
        {
          timeout: 10000,
          headers: {
            "User-Agent": "starlght-qsign",
          },
        },
      );

      if (response.status === 200 && response.data.code === 200) {
        providers = response.data.data;
        updateTime = response.data.更新时间;
      } else {
        await e.reply("获取公共签名API云端列表信息失败，请稍后重试");
        return false;
      }
    } else {
      // 本地模式
      const localData = Data.readJSON("signlist.json", Plugin_Path);
      if (!localData) {
        await e.reply("获取公共签名API本地列表信息失败，请稍后重试");
        return false;
      }
      providers = localData;
      updateTime = localData.date || updateTime;
    }

    this.addMessage(msg, "公共签名API列表");
    this.addMessage(
      msg,
      "提示:\nICQQ版本≤0.6.10的请先在根目录执行以下脚本添加协议配置:",
    );
    this.addMessage(
      msg,
      "curl -sL Gitee.com/haanxuan/QSign/raw/main/ver | bash",
    );

    if (Config.remote) {
      // 远程模式
      for (const providerInfo of providers) {
        this.addMessage(msg, `由 ${providerInfo.昵称} 提供:`);

        if (providerInfo.备注) {
          this.addMessage(msg, `备注: ${providerInfo.备注}`);
        }
        const resultsMsg = [];
        for (const result of providerInfo.检测结果) {
          resultsMsg.push(
            `${result.名称}: ${result.状态} ${result.延迟}\n${result.地址} `,
          );
        }
        this.addMessage(msg, resultsMsg.join("\n"));
      }
    } else {
      // 本地模式
      for (const [provider, providerInfo] of Object.entries(providers)) {
        if (provider === "date") continue;

        this.addMessage(msg, `由 ${provider} 提供:`);

        if (providerInfo.memo) {
          this.addMessage(msg, `备注: ${providerInfo.memo}`);
        }
        const checkResults = await this.checkLocalApiStatus(providerInfo);
        this.addMessage(msg, checkResults.join("\n"));
      }
    }

    this.addMessage(msg, `数据更新于: ${updateTime}`);

    await e.reply(await Bot.makeForwardMsg(msg));
    return true;
  }

  addMessage(msgArray, content) {
    msgArray.push({
      message: content,
      nickname: "星点签名",
      user_id: Bot.uin,
    });
  }

  async checkLocalApiStatus(providerInfo) {
    const results = [];

    for (const [name, url] of Object.entries(providerInfo)) {
      if (name === "memo") continue;

      try {
        const start = Date.now();
        const response = await axios.get(url, { timeout: 5000 });
        const status = response.status === 200 ? "✅ 正常" : "❎ 异常";
        const delay = `${Date.now() - start}ms`;
        results.push(`${name}: ${status} ${delay}\n${url} `);
      } catch (error) {
        results.push(`${name}: ❎ 异常 超时\n${url} `);
      }
    }

    return results;
  }
}
