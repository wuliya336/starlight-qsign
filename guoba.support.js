import { Config, Plugin_Name } from "./components/index.js";

// 支持锅巴
export function supportGuoba() {
  return {
    // 插件信息，将会显示在前端页面
    // 如果你的插件没有在插件库里，那么需要填上补充信息
    // 如果存在的话，那么填不填就无所谓了，填了就以你的信息为准
    pluginInfo: {
      name: `${Plugin_Name}`,
      title: "星点签名插件",
      author: "@shiwuliya",
      authorLink: "https://github.com/shiwuliya",
      link: `https://github.com/wuliya336/${Plugin_Name}`,
      isV3: true,
      isV2: false,
      showInMenu: "auto",
      description: "一个Yunzai-Bot V3的扩展插件, 提供公共签名列表功能",
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: "mdi:sign",
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      iconColor: "rgb(188, 202, 224)",
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      // iconPath: path.join(_paths.pluginRoot, 'resources/images/icon.png'),
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [
        {
          component: "Divider",
          label: "签名设置",
        },
        {
          field: "sign.list",
          label: "签名列表",
          bottomHelpMessage: "是否开启公共签名列表",
          component: "Switch",
        },
        {
          field: "sign.remote",
          label: "云端",
          bottomHelpMessage: "是否开启从云端获取签名地址信息",
          component: "Switch",
        },
        {
          field: "sign.render",
          label: "图片渲染",
          helpMessage: "可用于无法制作转发消息的协议端",
          bottomHelpMessage: "是否开启公共签名列表图片渲染",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "其他设置",
        },
        {
          field: "other.GithubPush",
          label: "仓库更新检测推送",
          bottomHelpMessage:
            "是否开启仓库更新检测推送，开启后将定时检测仓库更新并推送",
          component: "Switch",
        },
        {
          field: "other.renderScale",
          label: "渲染精度",
          component: "inputNumber",
          bottomHelpMessage:
            "可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度",
          component: "InputNumber",
          required: true,
          componentProps: {
            min: 50,
            max: 200,
            placeholder: "请输入渲染精度",
          },
        },
      ],
      getConfigData() {
        return {
          sign: Config.sign,
          other: Config.other,
        };
      },

      setConfigData(data, { Result }) {
        for (let key in data) {
          Config.modify(...key.split("."), data[key]);
        }
        return Result.ok({}, "Ciallo～(∠・ω< )⌒☆");
      },
    },
  };
}
