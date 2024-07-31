import common from '../../../lib/common/common.js';
import { Config } from '../components/index.js';
import axios from 'axios';

// 定义插件类
export class Index extends plugin {
  constructor() {
    super({
      name: '星点签名插件',
      event: 'message',
      priority: -33699,
      rule: [
        {
          reg: /^(#)?(公共(api)?(签名)?(api)?|api(列表|签名)|45)$/i,
          fnc: 'list',
        }
      ],
    });
  }

  // 获取公共签名API列表
  async list(e) {
    if (!Config.signlist) return false;

    // 向用户发送正在获取数据的提示
    await e.reply('正在从云端获取公共签名API列表信息，请稍候...', true);

    const concurrentLimit = Config.concurrent_limit || 0; // 获取并发请求限制
    const urls = [
      { name: 'Gitlab', url: 'https://gitlab.com/v17360963/starlight-qsign/raw/api/signlist.json' },
      { name: 'GitHub', url: 'https://github.com/wuliya336/starlight-qsign/raw/api/signlist.json' },
      { name: 'Gitee', url: 'https://gitee.com/OverTimeBunny/starlight-qsign/raw/api/signlist.json' }
    ];

    try {
      // 发起并行请求
      const responses = await Promise.all(urls.map(async ({ name, url }) => {
        try {
          const response = await axios.get(url, { timeout: 5000 }); // 设置超时时间
          return { name, data: response.data };
        } catch (error) {
          console.error(`从 ${name} 获取数据失败:`, error.message);
          return { name, error };
        }
      }));

      // 查找第一个成功的响应
      const successfulResponse = responses.find(({ error }) => !error);
      if (!successfulResponse) {
        await e.reply('获取公共签名API列表云端信息失败，请稍后重试');
        console.error('所有 API 请求均失败');
        return false;
      }

      const { name, data: providers } = successfulResponse;
      const userAgent = 'starlight-qsign'; // 设置User-Agent
      let msg = ['公共签名API列表'];

      // 遍历提供者及其API信息
      for (const [provider, providerInfo] of Object.entries(providers)) {
        msg.push(`由 ${provider} 提供:`);
        let providerMsgs = [];
        let tasks = Object.entries(providerInfo).flatMap(([key, url]) => {
          if (key === 'memo') {
            msg.push(`备注: ${providerInfo.memo}`);
            return [];
          }
          return [(async () => {
            const start = Date.now();
            try {
              const response = await axios.get(url, { headers: { 'User-Agent': userAgent }, timeout: 5000 });
              const status = response.status === 200 ? '✅ 正常' : '❎ 异常';
              const delay = `${Date.now() - start}ms`;
              return `${key}: ${status} ${delay}\n${url}`;
            } catch (error) {
              return `${key}: ❎ 异常 timeout\n${url}`;
            }
          })()];
        });

        // 执行并发请求
        let results = [];
        if (concurrentLimit > 0) {
          for (let i = 0; i < tasks.length; i += concurrentLimit) {
            const batch = tasks.slice(i, i + concurrentLimit);
            try {
              results.push(...(await Promise.all(batch)));
            } catch (batchError) {
              console.error('处理并发请求时出错:', batchError.message);
            }
          }
        } else {
          try {
            results = await Promise.all(tasks);
          } catch (allError) {
            console.error('处理所有任务时出错:', allError.message);
          }
        }

        providerMsgs.push(results.join('\n'));
        msg.push(providerMsgs.join('\n'));
      }

      // 添加数据更新时间
      const requestTime = new Date().toLocaleString('zh-CN', { hour12: false });
      msg.push(`数据更新于: ${requestTime}`);

      // 发送最终的回复消息
      await e.reply(common.makeForwardMsg(e, msg, '点击查看公共签名API列表'));
      return true;
    } catch (error) {
      // 捕获任何未处理的错误
      console.error('获取公共签名API列表时发生错误:', error.message);
      await e.reply('获取公共签名API列表时发生错误，请稍后重试');
      return false;
    }
  }
}
