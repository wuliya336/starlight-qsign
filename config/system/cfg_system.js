export const cfgSchema = {
  starlight_qsign: {
    title: "功能设置",
    cfg: {
      signlist: {
        title: "公共签名列表",
        key: "公共签名列表",
        def: true,
        desc: "是否开启签名列表",
        fileName: "sign",
      },
      remote: {
        title: "远程功能",
        key: "远程功能",
        def: true,
        desc: "是否开启远程功能，开启后将从服务器获取数据",
        fileName: "sign",
      },
      GithubPush: {
        title: "仓库更新检测推送",
        key: "仓库更新检测推送",
        def: false,
        desc: "是否开启仓库更新检测推送，开启后将定时检测仓库更新并推送",
        fileName: "sign",
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
