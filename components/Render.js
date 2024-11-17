import Version from "./Version.js";
import { Plugin_Path, Plugin_Name } from "./Path.js";
import Cfg from "./Cfg.js";

export default async function (path, params, cfg) {
  let { e } = cfg;
  if (!e.runtime) {
    console.log("未找到e.runtime，请升级至最新版Yunzai");
  }
  return e.runtime.render(`${Plugin_Name}`, path, params, {
    retType: cfg.retMsgId ? "msgId" : "default",
    beforeRender({ data }) {
      let resPath = data.pluResPath;
      const layoutPath = `${Plugin_Path}/resources/common/layout/`;
      return {
        ...data,
        _res_path: resPath,
        _layout_path: layoutPath,
        _tpl_path: `${Plugin_Path}/resources/common/tpl/`,
        defaultLayout: layoutPath + "default.html",
        elemLayout: layoutPath + "elem.html",
        sys: {
          scale: Cfg.scale(cfg.scale || 1),
          copyright: `Created By ${Version.name}<span class="version">${Version.yunzai}</span> & ${Plugin_Name}<span class="version">${Version.ver}</span>`,
        },
      };
    },
  });
}
