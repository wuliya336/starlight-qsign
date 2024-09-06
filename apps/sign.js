import common from '../../../lib/common/common.js';
import { Config, Data, Plugin_Path } from '../components/index.js';
import axios from 'axios';

export class sign extends plugin {
  constructor() {
    super({
      name: '星点签名插件',
      event: 'message',
      priority: Infinity,
      rule: [
        {
          reg: /^(#)?(公共(api)?(签名)?(api)?|api(列表|签名)|45)$/i,
          fnc: 'list',
        }
      ],
    });
  }

  async list(e) {
    if (!Config.signlist) return false;

    await e.reply('正在获取公共签名API列表信息，请稍候...', true);

    const concurrentLimit = Config.concurrent_limit || 0;
    const urls = Config.remoteurls;

    let providers;
    let responses;

    if (!Config.remote) {
      providers = Data.readJSON('signlist.json', Plugin_Path);
      if (!providers) {
        await e.reply('本地文件不存在，请稍后再尝试');
        return false;
      }

      const { time, ...signList } = providers;
      providers = signList;
    } else {
      responses = await Promise.all(urls.map(({ name, url }) =>
        axios.get(url, { timeout: 5000 })
          .then(response => ({ name, data: response.data }))
          .catch(() => ({ name, error: true }))
      ));

      const successfulResponse = responses.find(({ error }) => !error);
      if (!successfulResponse) {
        await e.reply('获取公共签名API列表信息失败，请稍后重试');
        return false;
      }

      providers = successfulResponse.data;
    }

    const userAgent = 'starlight-qsign';
    let msg = ['公共签名API列表'];

    for (const [provider, providerInfo] of Object.entries(providers)) {
      msg.push(`由 ${provider} 提供:`);
      let providerMsgs = [];
      let tasks = Object.entries(providerInfo).flatMap(([key, url]) => {
        if (key === 'memo') {
          msg.push(`备注: ${providerInfo.memo}`);
          return [];
        }
        return [() =>
          axios.get(url, { headers: { 'User-Agent': userAgent }, timeout: 5000 })
            .then(response => {
              const status = response.status === 200 ? '✅ 正常' : '❎ 异常';
              const delay = `${Date.now() - start}ms`;
              return `${key}: ${status} ${delay}\n${url}`;
            })
            .catch(() => `${key}: ❎ 异常 超时\n${url}`)
        ];
      });

      let results = [];
      if (concurrentLimit > 0) {
        for (let i = 0; i < tasks.length; i += concurrentLimit) {
          const batch = tasks.slice(i, i + concurrentLimit).map(task => task());
          results.push(...await Promise.all(batch));
        }
      } else {
        results = await Promise.all(tasks.map(task => task()));
      }

      providerMsgs.push(results.join('\n'));
      msg.push(providerMsgs.join('\n'));
    }

    const requestTime = providers.time || "未知";
    msg.push(`数据更新于: ${requestTime}`);

    await e.reply(common.makeForwardMsg(e, msg, '点击查看公共签名API列表'));
    return true;
  }
}
