import { Config, Common, Data, Plugin_Path } from "../components/index.js";
import { repoCheck } from "../model/index.js";

const GithubStatic = `resources/Github/GithubStatic.json`;

export class MonitorTask extends plugin {
  constructor() {
    super({
      name: "星点签名:监控github仓库状态",
      event: "message",
      priority: -20,
      rule: [
        {
          reg: /^#?(星点签名)?检测(仓库|github)更新(推送)?$/i,
          fnc: "Monitor",
        },
      ],
    });
    if (Config.other.GithubPush) {
      this.task = {
        name: "星点签名:仓库更新检测",
        cron: "0 0/5 * * * ? ",
        log: false,
        fnc: () => {
          this.MonitorTask(true);
        },
      };
    }
  }

  async Monitor(e) {
    await this.MonitorTask(false, e);
  }

  async MonitorTask(Auto = false, e = null) {
    if (!Auto) {
      await this.SelectMonitor(e);
      return true;
    }

    if (await redis.get(`starlight-qsign:Github:PushStatus`)) {
      return true;
    } else {
      await redis.set(
        `starlight-qsign:Github:PushStatus`,
        JSON.stringify({ PushStatus: 1 }),
      );
      await redis.expire(`starlight-qsign:Github:PushStatus`, 60 * 4 - 5);
    }

    Data.createDir(GithubStatic, Plugin_Path, true);
    let GithubStaticJson = Data.readJSON(GithubStatic, Plugin_Path);

    try {
      await repoCheck(GithubStatic, Plugin_Path);

      const updatedData = Data.readJSON(GithubStatic, Plugin_Path);

      if (GithubStaticJson.sha !== updatedData.sha) {
        logger.info(logger.magenta(">>>已更新GithubStatic.json"));

        const image = await Common.render(
          "repoPush/index",
          { commitInfo: updatedData },
          { e, scale: 1.4 },
        );

        let firstMasterQQ = Config.masterQQ[0];
        if (!isNaN(firstMasterQQ) && firstMasterQQ.toString().length <= 11) {
          await Bot.pickFriend(firstMasterQQ).sendMsg(image);
        }
      }
    } catch (error) {
      logger.error("仓库更新检测出错:", error);
      return true;
    }
    return true;
  }

  async SelectMonitor(e) {
    try {
      await repoCheck(GithubStatic, Plugin_Path);

      const updatedData = Data.readJSON(GithubStatic, Plugin_Path);

      logger.info(logger.magenta(">>>手动检测星点签名仓库最新代码"));

      const image = await Common.render(
        "repoPush/index",
        { commitInfo: updatedData },
        { e, scale: 1.4 },
      );

      await e.reply(image);
    } catch (error) {
      logger.error("手动检测出错:", error);
    }
    return true;
  }
}
