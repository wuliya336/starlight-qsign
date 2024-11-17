export const cfgSchema = {
  sign: {
    title: "签名设置",
    cfg: {
      signlist: {
        title: "签名列表",
        key: "签名列表",
        def: true,
        desc: "是否开启公共签名列表",
        fileName: "sign",
      },
      render: {
        title: "图片渲染",
        key: "图片渲染",
        def: false,
        desc: "是否开启公共签名列表图片渲染",
        fileName: "sign",
      },
      remote: {
        title: "远程功能",
        key: "远程功能",
        def: true,
        desc: "是否开启远程功能，开启后将从服务器获取数据",
        fileName: "sign",
      },
    },
  },
  config: {
    title: "其他设置",
    cfg: {
      GithubPush: {
        title: "仓库更新检测推送",
        key: "仓库更新检测推送",
        def: false,
        desc: "是否开启仓库更新检测推送，开启后将定时检测仓库更新并推送",
        fileName: "config",
      },
      renderScale: {
        title: "渲染精度",
        key: "渲染精度",
        type: "num",
        def: 100,
        input: (n) => Math.min(200, Math.max(50, n * 1 || 100)),
        desc: "可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度",
        fileName: "config",
      },
    },
  },
};
