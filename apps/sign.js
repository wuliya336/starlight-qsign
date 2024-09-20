import common from '../../../lib/common/common.js';
import { Config, Data, Plugin_Path } from '../components/index.js';
import axios from 'axios';

export class sign extends plugin {
  constructor() {
    super({
      name: '星点签名插件',
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

    await e.reply('正在获取公共签名API列表信息，请稍候...', true);

    const concurrentLimit = Config.concurrent_limit || 0;
    let providers;
    let requestTime = "未知";
    const urls = Config.remoteurls;


    const localData = Data.readJSON('signlist.json', Plugin_Path);
    if (localData) {
      providers = localData;
    } else {
      return false;
    }


if (Config.remote) {
  axios.get('https://api.github.com/repos/wuliya336/starlight-qsign/commits', {
    params: {
      path: 'signlist.json',
      sha: 'api',
      per_page: 1,
    },
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
  .then(response => {
    if (response.status === 200 && response.data.length > 0) {
      const commit = response.data[0];
      const commitDate = new Date(commit.commit.committer.date);
      commitDate.setHours(commitDate.getHours() + 8); 
      requestTime = commitDate.toISOString().split('T')[0];
    }
  })
  .catch(error => {
  });

  const responses = await Promise.all(
    urls.map(({ name, url }) =>
      axios.get(url, { timeout: 5000, proxy: false })
        .then(response => ({ name, data: response.data }))
        .catch(() => ({ name, error: true }))
    )
  );

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


    const userAgent = 'starlight-qsign';

    let msg = [
      '公共签名API列表:',
      '提示:',
      'ICQQ版本≤0.6.10的请先在根目录执行以下脚本添加协议配置:',
      'curl -sL https://gitlab.com/v17360963/starlight-qsign/-/raw/qsign/qsign.sh | tr -d \'\\r\' | bash'
    ];


    for (const [provider, providerInfo] of Object.entries(providers)) {
      if (provider === 'date') continue; 

      msg.push(`由 ${provider} 提供:`); 


      if (providerInfo.memo) {
        msg.push(`备注: ${providerInfo.memo}`);
      }

      let providerMsg = []; 

      let tasks = Object.entries(providerInfo).map(([key, url]) => {
        if (key === 'memo') {
          return null;
        }
        return async () => {
          const start = Date.now();
          try {
            const response = await axios.get(url, { headers: { 'User-Agent': userAgent }, timeout: 5000 });
            const status = response.status === 200 ? '✅ 正常' : '❎ 异常';
            const delay = `${Date.now() - start}ms`;
            return `${key}: ${status} ${delay}\n${url}`;
          } catch {
            return `${key}: ❎ 异常 超时\n${url}`;
          }
        };
      }).filter(task => task);

      const results = concurrentLimit > 0
        ? (await Promise.all(tasks.map(task => task()))) 
        : await Promise.all(tasks.map(task => task())); 

      providerMsg.push(...results); 

      msg.push(providerMsg.join('\n')); 
    }

    msg.push(`数据更新于: ${requestTime}`);
    await e.reply(common.makeForwardMsg(e, msg, '点击查看公共签名API列表'));
    return true;
  }
}
