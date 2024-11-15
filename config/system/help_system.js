export const helpCfg = {
  title: "星点签名帮助",
  subTitle: "Yunzai-Bot & starlight-qsign",
  columnCount: 3,
  colWidth: 265,
  theme: "all",
  themeExclude: ["default"],
  style: {
    fontColor: "#d3bc8e",
    descColor: "#eee",
    contBgColor: "rgba(6, 21, 31, .5)",
    contBgBlur: 3,
    headerBgColor: "rgba(6, 21, 31, .4)",
    rowBgColor1: "rgba(6, 21, 31, .2)",
    rowBgColor2: "rgba(6, 21, 31, .35)",
  },
};

export const helpList = [
  {
    group: "[]内为必填项,{}内为可选项",
  },
  {
    group: "拓展命令",
    list: [
      {
        icon: 75,
        title: "#API列表或45",
        desc: "从云端获取公共签名API列表信息并发送",
      },
      {
        icon: 35,
        title: "#星点签名查询签名地址",
        desc: "查询当前实例ICQQ的签名地址",
      },
    ],
  },
  {
    group: "管理命令，仅主人可用",
    auth: "master",
    list: [
      {
        icon: 95,
        title: "#星点签名(插件)(强制)更新",
        desc: "更新插件本体",
      },
      {
        icon: 85,
        title: "#星点签名设置",
        desc: "管理命令",
      },
    ],
  },
];

export const isSys = true;
