# <center>starlight-qsign</center>

![星点签名](https://count.kjchmc.cn/get/@starlight-qsign?theme=moebooru)<br>
[![Github](https://img.shields.io/badge/Github-星点签名-black?style=flat-square&logo=github)](https://github.com/wuliya336/starlight-qsign)[![云崽bot](https://img.shields.io/badge/云崽-v3.0.0-black?style=flat-square&logo=dependabot)](https://gitee.com/Le-niao/Yunzai-Bot)[![Q群](https://img.shields.io/badge/group-272040396-blue)](https://gitee.com/Le-niao/Yunzai-Bot)<br>
`starlight-qsign`是一个`Yunzai-Bot`的扩展插件，提供公共签名列表，45解决方案功能<br>

---

<mark>本插件，已跑路，仅保证功能可用</mark><br>
如有问题请提交`issue`<br>

## 安装与更新

### `Yunzai-Bot`

#### 使用`Github`

```bash
git clone --depth=1 https://github.com/wuliya336/starlight-qsign ./plugins/starlight-qsign/
```

#### 使用`Github`镜像

```bash
git clone --depth=1 https://gh.wuliya336.top/github.com/wuliya336/starlight-qsign ./plugins/starlight-qsign/
```

### `手工安装`

**手工下载安装包，解压后将`starlight-qsign-master`更名为`starlight-qsign`，然后放置在`Yunzai`的`plugins`目录内<br>**

**虽然此方式能够使用，不利于后续升级，故不推荐使用<br>**

### `Karin`

### 使用`Github`

```bash
git clone --depth=1 https://github.com/wuliya336/starlight-qsign ./plugins/karin-plugin-starlight-qsign/
```

### 使用`Github`镜像

```bash
git clone --depth=1 https://gh.wuliya336.top/github.com/wuliya336/starlight-qsign ./plugins/karin-plugin-starlight-qsign/
```

### `手工安装`

**手工下载安装包，解压后将`starlight-qsign-master`更名为`karin-plugin-starlight-qsign`，然后放置在`Karin`的`plugins`目录内<br>**

**虽然此方式能够使用，不利于后续升级，故不推荐使用<br>**

## 安装依赖
```bash
pnpm install --filter=starlight-qsign
```

## 使用帮助
其他内容请查看[官方文档](https://docs.wuliya.cn)

## 本插件支持本地与远程切换

**对机器人发送`#星点签名帮助`可获取本插件帮助<br>**

### 如何修改签名地址信息

**一. 修改`插件根目录`signlist.json`文件,请参考json数组<br>**

```json
{
  "author": {
    "name": {
      "url": "signurl",
      "key": "key"
      "check": false
    },
    "memo": "示例"
  }
}
```

#### 参数说明

##### 本插件支持本地与远程

| 参数    | 说明         | 备注                   |
| ------- | ------------ | ---------------------- |
| author  | 提供者名称   | 如: example            |
| name    | 签名版本     | 如: 9.0.60             |
| key     | 签名密钥     | 如: 114514 ,没有可不填 |
| signurl | 签名地址     | 如: http://example.com |
| check   | 是否跳过检测 | 如: true               |
| memo    | 备注         | 无 ,不需要可不填       |

**二. 如需同步到远程请提交issue即可<br>**
[issue](https://github.com/wuliya336/starlight-qsign/issues/1)

## 贡献

**如需贡献请拉取`dev`分支并提交PR**

## 更新计划

- [x] 获取当前实例签名地址
- [x] 检测签名异常自动切换签名
- [x] 备注信息

# 资源

- [Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai) : 喵版Yunzai [Gitee](https://gitee.com/yoimiya-kokomi/Miao-Yunzai)
  / [Github](https://github.com/yoimiya-kokomi/Miao-Yunzai)
- [Yunzai-V3](https://github.com/yoimiya-kokomi/Yunzai-Bot) ：Yunzai V3 - 喵喵维护版（使用 icqq）
- [Yunzai-V3](https://gitee.com/Le-niao/Yunzai-Bot) ：Yunzai V3 - 乐神原版（使用 oicq）
