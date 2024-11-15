import axios from "axios";
import { Data } from "../components/index.js";

async function repoCheck(filePath, pluginPath) {
  try {
    const res = await axios.get(
      "https://api.github.com/repos/wuliya336/starlight-qsign/commits"
    );
    const commit = res.data[0];

    const { name: committerName, email: committerEmail } = commit.commit.committer;
    const { name: authorName } = commit.commit.author;
    const commitMessage = commit.commit.message;

    if (
      committerName.includes("GitHub Action") ||
      committerEmail === "actions@github.com"
    ) {
      return;
    }

    const commitInfo = {
      author: authorName,
      committer: committerName,
      date: new Date(commit.commit.committer.date).toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour12: false,
      }),
      message: commitMessage.split("\n")[0],
    };

    Data.writeJSON(filePath, commitInfo, "\t", pluginPath);
  } catch (error) {
    console.error("获取最新提交出错:", error);
  }
}

export default repoCheck;
