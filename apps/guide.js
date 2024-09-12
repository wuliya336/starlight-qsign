import common from '../../../lib/common/common.js';

export class guide extends plugin {
    constructor() {
      super({
        name: '星点签名',
        event: 'message',
        priority: -20,
        rule: [
          {
            reg:  /^(#)?(签名|api|星点签名)?(使用教程)$/i,
            fnc: 'Guide',
          },
        ],
      });
    }

    async Guide(e) {
        const msg = [
          'Miao-Yunzai配置方法',
          '打开 Miao-Yunzai 配置文件 bot.yaml\n填写sign_api_addr: [签名地址]\n[签名地址]为45中的URL',
          'TRSS-Yunzai配置方法',
          '在终端输入#安装ICQQ-Plugin(如果没安装)\n接着输入#QQ签名 [签名地址]\n[签名地址]为45中的URL'
        ];
        await e.reply(common.makeForwardMsg(e, msg, `点击查看签名使用教程`));
        return true;
      }
    }