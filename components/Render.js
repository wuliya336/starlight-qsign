import { Version } from "./index.js";
import Cfg from "./Cfg.js";

export default async function (path, params, cfg) {
  let { e } = cfg;
  if (!e.runtime) {
    console.log("未找到e.runtime，请升级至最新版Yunzai");
  }
  return e.runtime.render("starlight-qsign", path, params, {
    retType: cfg.retMsgId ? "msgId" : "default",
    beforeRender({ data }) {
      let resPath = data.pluResPath;
      const layoutPath =
        process.cwd() + "/plugins/starlight-qsign/resources/common/layout/";
      return {
        ...data,
        _res_path: resPath,
        _layout_path: layoutPath,
        _tpl_path:
          process.cwd() + "/plugins/starlight-qsign/resources/common/tpl/",
        defaultLayout: layoutPath + "default.html",
        elemLayout: layoutPath + "elem.html",
        sys: {
          scale: Cfg.scale(cfg.scale || 1),
          copyright: `Created By ${Version.name}<span class="version">${Version.yunzai}</span> & starlight-qsign<span class="version">${Version.ver}</span>`,
        },
      };
    },
  });
}
