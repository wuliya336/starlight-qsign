import common from '../../../lib/common/common.js';

export class info extends plugin {
  constructor() {
    super({
      name: '星点签名插件',
      event: 'message',
      priority: Infinity,
      rule: [
        {
          reg: /^(#)?(项目地址|插件库)$/i,
          fnc: 'info',
        },
      ],
    });
  }

  async info(e) {
    const project = [
      '云崽及其衍生Bot',
      'v3原版云崽: https://gitee.com/Le-niao/Yunzai-Bot\n喵版云崽: https://gitee.com/yoimiya-kokomi/Yunzai-Bot\n喵崽: https://gitee.com/yoimiya-kokomi/Miao-Yunzai\n时雨崽: https://gitee.com/TimeRainStarSky/Yunzai\n柠檬崽: https://gitee.com/ningmengchongshui/azai-bot',
      '必备插件',
      '喵喵插件: https://gitee.com/yoimiya-kokomi/miao-plugin\n锅巴插件: https://gitee.com/guoba-yunzai/guoba-plugin\n逍遥图鉴插件: https://gitee.com/Ctrlcvs/xiaoyao-cvs-plugin\n图鉴(Atlas)插件: https://github.com/Nwflower/atlas'
    ];
    
    const plugin_repo = [
      'https://gitee.com/Hikari666/Yunzai-Bot-plugins-index'
    ];

    // 根据用户输入的内容判断要发送哪个消息
    if (e.msg.includes('插件库')) {
      await e.reply(plugin_repo);
    } else if (e.msg.includes('项目地址')) {
      await e.reply(common.makeForwardMsg(e, project, '点击查看项目地址'));
    }
    
    return true;
  }
}
