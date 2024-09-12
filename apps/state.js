import common from '../../../lib/common/common.js';
import { Config } from '../components/index.js';

export class Stats extends plugin {
  constructor() {
    super({
      name: '星点签名插件',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '/^#?(星点)?(api|签名||starlight-qsign)(信息|统计)$/i',
          fnc: 'stats',
        },
      ],
    });
  }

  async stats(e) {
    if (!Config.state) return false
    let todayStats = {};
    let totalStats = {};
    const userAgent = 'statlight-qsign';
  
    await e.reply('正在获取统计信息，请稍候...', true);
  
    try {
      const configPath = './plugins/starlight-qsign/config/sate.yaml';
      const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
      const statsUrl = config.statsUrl;
  
      const statsResponse = await fetch(statsUrl, {
        headers: {
          'User-Agent': userAgent,
        },
      });
  
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        todayStats = statsData['今日访问量'];
        totalStats = statsData['总访问量'];
      } else {
        throw new Error('无法获取统计信息');
      }
    } catch (error) {
      console.error('获取统计信息时出错:', error);
      await e.reply('获取统计信息时出错，请稍后重试。');
      return true;
    }
  
    const todayStatsMsg = Object.entries(todayStats)
      .map(([key, value]) => `${key}: ${value || 'N/A'}`)
      .join('\n');
    const totalStatsMsg = Object.entries(totalStats)
      .map(([key, value]) => `${key}: ${value || 'N/A'}`)
      .join('\n');
    const msg = [
      '签名API统计',
      'API访问量(今日):',
      todayStatsMsg,
      'API访问量(总计):',
      totalStatsMsg,
    ];
    
    await e.reply(common.makeForwardMsg(e, msg, `点击查看签名API统计`));
    return true;
  }
}