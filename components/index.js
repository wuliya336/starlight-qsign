const Path = process.cwd();
const Plugin_Name = "starlight-qsign";
const Plugin_Path = `${Path}/plugins/${Plugin_Name}`;
import Version from "./Version.js";
import Data from "./Data.js";
import Common from "./Common.js";
import Cfg from "./Cfg.js";
import YamlReader from "./YamlReader.js";
import Config from "./Config.js";
export {
  Common,
  Data,
  Version,
  YamlReader,
  Config,
  Path,
  Plugin_Name,
  Plugin_Path,
  Cfg,
};
