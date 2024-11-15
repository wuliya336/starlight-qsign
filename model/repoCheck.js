import axios from "axios";
import { Data } from "../components/index.js";

async function repoCheck(filePath, pluginPath) {
  try {
    const res = await axios.get(
      "https://api.github.com/repos/wuliya336/starlight-qsign/commits",
    );
    const commit = res.data[0];

    const UTC_Date = commit.commit.committer.date;
    const cnTime = new Date(UTC_Date).toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour12: false,
    });

    const commitMessageTitle = commit.commit.message.split("\n")[0];

    const commitInfo = {
      committer: commit.commit.committer.name,
      date: cnTime,
      message: commitMessageTitle,
    };

    Data.writeJSON(filePath, commitInfo, "\t", pluginPath);
  } catch (error) {
    console.error("获取最新提交出错:", error);
  }
}

export default repoCheck;
