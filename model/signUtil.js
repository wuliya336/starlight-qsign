import axios from "axios";
import { Data, Plugin_Path } from "../components/index.js";

const SignUtil = {
  addMessage(msgArray, content) {
    msgArray.push({
      message: content,
      nickname: "星点签名",
      user_id: Bot.uin,
    });
  },
  async fetchRemoteData(url, options = {}) {
    const {
      key = "",
      uin = "123456789",
      qua = "V1_AND_SQ_9.0.70_6698_YYB_D",
      cmd = "wtlogin.login",
      seq = "2233",
      buffer = "020348010203040506",
      withParams = true,
    } = options;

    let requestUrl = url;

    if (withParams) {
      const queryParams = [
        key && key !== "❎︎" ? `key=${key}` : null,
        `uin=${uin}`,
        `qua=${qua}`,
        `cmd=${cmd}`,
        `seq=${seq}`,
        `buffer=${buffer}`,
      ]
        .filter(Boolean)
        .join("&");

      requestUrl = `${url}?${queryParams}`;
    }

    try {
      const response = await axios.get(requestUrl, {
        timeout: 5000,
        headers: { "User-Agent": "starlght-qsign" },
      });

      if (response.status === 200) {
        const responseData = response.data;

        if (withParams) {
          const isSuccess = responseData.code === 0;
          return { data: responseData, success: isSuccess };
        } else {
          return { data: responseData, success: true };
        }
      } else {
        return { data: null, success: false };
      }
    } catch (error) {
      return { data: null, success: false };
    }
  },

  fetchLocalData(filename) {
    try {
      return Data.readJSON(filename, Plugin_Path);
    } catch {
      return null;
    }
  },

  processProviderData(data) {
    return Object.entries(data).map(([provider, items]) => ({
      provider,
      items: Object.entries(items || {})
        .filter(([name]) => name !== "memo")
        .map(([name, info]) => ({
          name,
          url: info.url,
          key: info.key || "❎︎",
          check: info.check ?? null,
        })),
      memo: items?.memo || null,
    }));
  },

  async checkRedisStatus(redis, redisKey, e) {
    const isTriggered = (await redis.get(redisKey)) === "0";
    if (isTriggered) {
      await e.reply("你已执行过该命令请勿重新触发", true);
      return false;
    }
    await redis.set(redisKey, "0");
    await redis.expire(redisKey, 20);
    return true;
  },

  getUpdateTime(isRemote, response) {
    if (isRemote && response?.headers) {
      const lastModified = response.headers["last-modified"];
      if (lastModified) {
        const date = new Date(lastModified);
        return date.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
    } else {
      const modifiedTime = Data.getFileModifiedTime(
        "signlist.json",
        Plugin_Path,
      );
      if (modifiedTime) {
        const date = new Date(modifiedTime);
        return date.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
    }
    return "未知";
  },

  initializeMessages(msg) {
    this.addMessage(msg, "公共签名API列表");
    this.addMessage(
      msg,
      "提示:\nICQQ版本≤0.6.10的请先在根目录执行以下脚本添加协议配置:",
    );
    this.addMessage(
      msg,
      "curl -sL Gitee.com/haanxuan/QSign/raw/main/ver | bash",
    );
  },
};

export default SignUtil;
