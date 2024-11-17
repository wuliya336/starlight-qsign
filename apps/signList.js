import { Config, Common, Data } from "../components/index.js";
import { SignUtil } from "../model/index.js";

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
    if (!Config.sign.list) return false;

    let redisKey;
    if (e.isGroup) {
      redisKey = `starlight-qsign:List:${e.group_id}:CD`;
      if (!(await SignUtil.checkRedisStatus(redis, redisKey, e))) return false;
    }
    await e.reply("没救了", true);
    Data.sleep(500);
    await e.reply("正在获取公共签名API列表信息，请稍候...", true);

    let providers;
    let updateTime;

    try {
      if (Config.remote) {
        const { data, success } = await SignUtil.fetchRemoteData(
          "https://pan.wuliya.cn/d/Yunzai-Bot/data/signlist.json",
          { withParams: false },
        );
        if (!success || !data) {
          logger.error("获取云端列表失败");
          throw new Error("云端列表获取失败");
        }
        providers = SignUtil.processProviderData(data);
        updateTime = SignUtil.getUpdateTime(true, data);
      } else {
        const localData = SignUtil.fetchLocalData("signlist.json");
        if (!localData) {
          throw new Error("本地列表获取失败");
        }
        providers = SignUtil.processProviderData(localData);
        updateTime = SignUtil.getUpdateTime(false);
      }

      const outputs = [];
      const initMsg = [];
      SignUtil.initMsg(initMsg);

      for (const provider of providers) {
        const providerOutput = [];

        SignUtil.addMessage(providerOutput, `由 ${provider.provider} 提供:`);
        if (provider.memo) {
          SignUtil.addMessage(providerOutput, `备注: ${provider.memo}`);
        }

        for (const item of provider.items) {
          if (item.check === false) {
            SignUtil.addMessage(
              providerOutput,
              `名称: ${item.name}\n地址: ${item.url}`,
            );
            continue;
          }

          try {
            const startTime = Date.now();

            const { data, success } = await SignUtil.fetchRemoteData(item.url, {
              key: item.key || "",
              withParams: true,
            });

            const endTime = Date.now();
            const delay = endTime - startTime;

            if (success) {
              item.status = "✅正常";
              item.delay = `${delay}ms`;
            } else {
              item.status = "❎异常";
              item.delay = "❌超时";
            }
          } catch {
            item.status = "❎异常";
            item.delay = "❌超时";
          }

          SignUtil.addMessage(
            providerOutput,
            `名称: ${item.name}\n地址: ${item.url}\n密钥: ${item.key}\n状态: ${item.status}\n延迟: ${item.delay}`,
          );
        }
        outputs.push(...providerOutput);
      }

      SignUtil.addMessage(outputs, `数据更新于: ${updateTime}`);

      if (Config.render) {
        return await Common.render(
          "sign/list",
          {
            providers,
            updateTime,
            initMsg,
          },
          { e, scale: 1.2 },
        );
      } else {
        await e.reply(await Bot.makeForwardMsg(outputs));
      }

      if (e.isGroup) {
        await redis.del(redisKey);
      }
      return true;
    } catch (error) {
      await e.reply("获取公共签名API信息失败");
      return false;
    }
  }
}
