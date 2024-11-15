import axios from "axios";
import { Data } from "../components/index.js";

async function repoCheck(filePath, pluginPath) {
  try {
    const res = await axios.get(
      "https://api.github.com/repos/wuliya336/starlight-qsign/commits",
    );
    const commit = res.data[0];

    const authorName = commit.commit.author.name;
    const authorEmail = commit.commit.author.email;
    const committerName = commit.commit.committer.name;
    const committerEmail = commit.commit.committer.email;
    const commitMessage = commit.commit.message;

    if (
      (committerName.includes("GitHub Action") ||
        committerEmail === "actions@github.com") &&
      commitMessage.includes("GitHub Actions")
    ) {
      return;
    }

    const UTC_Date = commit.commit.committer.date;
    const cnTime = new Date(UTC_Date).toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour12: false,
    });

    const commitMessageTitle = commitMessage.split("\n")[0];

    const commitInfo = {
      author: authorName,
      committer: committerName,
      date: cnTime,
      message: commitMessageTitle,
    };

    Data.writeJSON(filePath, commitInfo, "\t", pluginPath);
  } catch (error) {
    console.error("获取最新提交出错:", error);
  }
}

export default repoCheck;
