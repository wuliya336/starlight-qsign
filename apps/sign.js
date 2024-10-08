import common from '../../../lib/common/common.js';
import { Config, Data, Plugin_Path } from '../components/index.js';
import axios from 'axios';

export class sign extends plugin {
  constructor() {
    super({
      name: '星点签名:签名信息列表状态',
      event: 'message',
      priority: -20,
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

    await e.reply('没救了', true);
    await common.sleep(500);
    await e.reply('正在获取公共签名API列表信息，请稍候...', true);

    const concurrentLimit = Config.concurrent_limit || 0;
    let providers;
    let requestTime = "未知";
    const urls = Config.remoteurls;
    const msg = [];

    const localData = Data.readJSON('signlist.json', Plugin_Path);
    if (localData) {
      providers = localData;
    } else {
      return false;
    }

    if (Config.remote) {
      requestTime = await this.getCommitDate();

      const responses = await this.fetch_sign(urls, concurrentLimit);
      const successfulResponse = responses.find(({ error }) => !error);
      if (successfulResponse) {
        providers = successfulResponse.data;
      } else {
        await e.reply('获取公共签名API列表信息失败，请稍后重试');
        return false;
      }
    } else {
      requestTime = localData.date || requestTime;
    }

    this.addMessage(msg, '公共签名API列表');
    this.addMessage(msg, '提示:\nICQQ版本≤0.6.10的请先在根目录执行以下脚本添加协议配置:');
    this.addMessage(msg, 'bash <(curl -L https://blog.wuliya.cn/2024/09/21/%E5%8D%8F%E8%AE%AE%E7%89%88%E6%9C%AC%E4%BF%A1%E6%81%AF/version.sh)');

    for (const [provider, providerInfo] of Object.entries(providers)) {
      if (provider === 'date') continue;

      this.addMessage(msg, `由 ${provider} 提供:`);

      if (providerInfo.memo) {
        this.addMessage(msg, `备注: ${providerInfo.memo}`);
      }

      const results = await this.checkProviderApis(providerInfo);
      if (results.length > 0) {
        this.addMessage(msg, results.join('\n'));
      }
    }

    this.addMessage(msg, `数据更新于: ${requestTime}`);

    await e.reply(await Bot.makeForwardMsg(msg));

    return true;
  }

  async getCommitDate() {
    const response = await axios.get('https://api.github.com/repos/wuliya336/starlight-qsign/commits', {
      params: {
        path: 'signlist.json',
        sha: 'api',
        per_page: 1,
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (response.status === 200 && response.data.length > 0) {
      const commit = response.data[0];
      const commitDate = new Date(commit.commit.committer.date);
      commitDate.setHours(commitDate.getHours() + 8); 
      return commitDate.toISOString().split('T')[0];
    }
    return "未知";
  }

  addMessage(msgArray, content) {
    msgArray.push({
      message: content,
      nickname: '星点签名',
      user_id: Bot.uin,
    });
  }

  async checkProviderApis(providerInfo) {
    const tasks = Object.entries(providerInfo).map(([key, url]) => {
      if (key === 'memo') return null;
      return this.fetchApiStatus(key, url);
    }).filter(Boolean); 

    return await Promise.all(tasks);
  }

  async fetchApiStatus(key, url) {
    const start = Date.now();
    const response = await axios.get(url, { headers: { 'User-Agent': 'starlight-qsign' }, timeout: 5000 });
    const status = response.status === 200 ? '✅ 正常' : '❎ 异常';
    const delay = `${Date.now() - start}ms`;
    return `${key}: ${status} ${delay}\n${url}`;
  }

  async fetch_sign(urls, limit) {
    const results = [];

    if (limit === 0) {
      return Promise.allSettled(
        urls.map(({ name, url }) =>
          axios.get(url, { timeout: 5000, proxy: false })
            .then(response => ({ name, data: response.data }))
            .catch(() => ({ name, error: true }))
        )
      );
    }

    const queue = [];
    for (const { name, url } of urls) {
      const requestPromise = axios.get(url, { timeout: 5000, proxy: false })
        .then(response => ({ name, data: response.data }))
        .catch(() => ({ name, error: true }));

      queue.push(requestPromise);

      if (queue.length >= limit) {
        const result = await Promise.race(queue);
        results.push(result);
        queue.splice(queue.indexOf(result), 1);
      }
    }

    results.push(...(await Promise.all(queue)));
    return results;
  }
}
