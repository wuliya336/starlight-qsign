/* eslint-disable camelcase */
import axios from 'axios'
import { Data, Version } from '../components/index.js'
import fs from 'fs'
import path from 'path'

const SignUtil = {
  addMessage (msgArray, content, self_id) {
    msgArray.push({
      message: content,
      nickname: '星点签名',
      user_id: self_id
    })
  },

  /**
   * 构造请求签名数据
   */
  async fetchRemoteData (url, options = {}) {
    const {
      key = '',
      uin = '114514',
      qua = 'V1_AND_SQ_9.0.70_6698_YYB_D',
      cmd = 'wtlogin.login',
      seq = '2233',
      buffer = '020348010203040506',
      withParams = true
    } = options

    let requestUrl = url

    if (withParams) {
      const queryParams = [
        key && key !== '❎' ? `key=${key}` : null,
        `uin=${uin}`,
        `qua=${qua}`,
        `cmd=${cmd}`,
        `seq=${seq}`,
        `buffer=${buffer}`
      ]
        .filter(Boolean)
        .join('&')

      requestUrl = `${url}?${queryParams}`
    }

    try {
      const response = await axios.get(requestUrl, {
        timeout: 5000,
        headers: { 'User-Agent': 'starlght-qsign' }
      })

      if (response.status === 200) {
        return { data: response.data, headers: response.headers, success: true }
      } else {
        return { data: null, headers: response.headers, success: false }
      }
    } catch (error) {
      return { data: null, headers: null, success: false }
    }
  },

  fetchLocalData (filename) {
    try {
      return Data.readJSON(filename, Version.Plugin_Path)
    } catch (error) {
      return true
    }
  },
  /**
 * 解析签名数据
 * */
  processProviderData (data) {
    return Object.entries(data).map(([provider, items]) => ({
      provider,
      items: Object.entries(items || {})
        .filter(([name]) => name !== 'memo')
        .map(([name, info]) => ({
          name,
          url: info.url,
          key: info.key || '❎',
          check: info.check ?? null
        })),
      memo: items?.memo || null
    }))
  },

  /**
   * 群组冷却
   */
  async checkRedisStatus(redis, redisKey, e) {
    const isTriggered = !!(await redis.get(redisKey));
    if (isTriggered) {
      await e.reply("你已执行过该命令，请稍后再试", true);
      return false;
    }

    await redis.set(redisKey, "1");
    await redis.expire(redisKey, 20);
    return true;
  },

  /**
   * 格式化日期
   */
  formatDate (date) {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  },

  /**
   * 获取更新时间
   */
  getUpdateTime (isRemote, response) {
    if (isRemote) {
      const lastModified = response?.headers?.['last-modified']
      if (lastModified) {
        const date = new Date(lastModified)
        return this.formatDate(date)
      }
    } else {
      try {
        const localFilePath = path.join(Version.Plugin_Path, 'signlist.json')
        const stats = fs.statSync(localFilePath)
        const mtime = stats.mtime
        return this.formatDate(new Date(mtime))
      } catch (error) {
      }
    }

    return '未知'
  },
  /**
 * 初始化消息
 * */
  initMsg (msg, self_id) {
    this.addMessage(msg, '公共签名API列表', self_id)
    this.addMessage(
      msg,
      '提示:\nICQQ版本≤0.6.10的请先在根目录执行以下脚本添加协议配置:',
      self_id
    )
    this.addMessage(
      msg,
      'curl -sL Gitee.com/haanxuan/QSign/raw/main/ver | bash',
      self_id
    )
  },

  async processSignData (data, isRemote, response) {
    const providerData = this.processProviderData(data)
    const signCheckPromises = providerData.map((provider) =>
      Promise.all(
        provider.items.map(async (item) => {
          return this.checkSignStatus(item)
        })
      ).then((items) => {
        provider.items = items
        return provider
      })
    )

    const updatedProviders = await Promise.all(signCheckPromises)
    return {
      providers: updatedProviders,
      updateTime: this.getUpdateTime(isRemote, response)
    }
  },

  async getSignData (isRemote = true) {
    try {
      const { data, headers, success } = isRemote
        ? await this.fetchRemoteData(
          'https://pan.wuliya.cn/d/Yunzai-Bot/data/signlist.json',
          { withParams: false }
        )
        : { data: this.fetchLocalData('signlist.json'), success: true }

      if (!success || !data) {
        throw new Error(isRemote ? '获取云端列表失败' : '获取本地列表失败')
      }

      return await this.processSignData(data, isRemote, isRemote ? { headers } : null)
    } catch (error) {
      return false
    }
  },

  async checkSignStatus (item) {
    try {
      const startTime = Date.now()
      const { success } = await this.fetchRemoteData(item.url, {
        key: item.key || '',
        withParams: true
      })
      const endTime = Date.now()
      const delay = endTime - startTime

      item.status = success ? '✅正常' : '❎异常'
      item.delay = success ? `${delay}ms` : '❌超时'
    } catch (error) {
      console.error('Check sign status failed:', error)
      item.status = '❎异常'
      item.delay = '❌超时'
    }

    return item
  }
}

export default SignUtil
