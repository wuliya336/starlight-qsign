import fs from "node:fs";
import chalk from "chalk";
import { Version } from "./components/index.js";

let ret = [];

const files = fs
  .readdirSync("./plugins/starlight-qsign/apps")
  .filter((file) => file.endsWith(".js"));

files.forEach((file) => {
  ret.push(import(`./apps/${file}`));
});

ret = await Promise.allSettled(ret);

let apps = {};
for (let i in files) {
  let name = files[i].replace(".js", "");

  if (ret[i].status != "fulfilled") {
    logger.error(`载入插件错误：${logger.red(name)}`);
    logger.error(ret[i].reason);
    continue;
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
}

logger.info(chalk.green(`---------=.=---------`));
logger.info(chalk.green(`星点签名插件${Version.ver}载入成功^_^`));
logger.info(chalk.blue(`已跑路，仅保证功能可用`));
logger.info(chalk.green(`---------------------`));
export { apps };
