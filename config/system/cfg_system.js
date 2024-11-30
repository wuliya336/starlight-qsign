export const cfgSchema = {
  sign: {
    title: '签名设置',
    cfg: {
      list: {
        title: '签名列表',
        key: '签名列表',
        def: true,
        desc: '是否开启公共签名列表',
        fileName: 'sign'
      },
      render: {
        title: '图片渲染',
        key: '图片渲染',
        def: false,
        desc: '是否开启公共签名列表图片渲染',
        fileName: 'sign'
      },
      remote: {
        title: '远程功能',
        key: '远程功能',
        def: true,
        desc: '是否开启远程功能，开启后将从服务器获取数据',
        fileName: 'sign'
      },
      autoSwitch: {
        title: '切换签名功能',
        key: '切换签名功能',
        def: true,
        desc: '是否开启自动切换签名功能，开启后将检查签名是否异常，异常时自动切换',
        fileName: 'sign'
      }
    }
  },
  other: {
    title: '其他设置',
    cfg: {
      renderScale: {
        title: '渲染精度',
        key: '渲染精度',
        type: 'num',
        def: 100,
        input: (n) => Math.min(200, Math.max(50, n * 1 || 100)),
        desc: '可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度',
        fileName: 'other'
      }
    }
  }
}
