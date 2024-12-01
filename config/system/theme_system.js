import { Data, Version } from "../../components/index.js";
import fs from "fs";

let Theme = {
  async getThemeCfg() {
    let dirPath = `${Version.Plugin_Path}/resources/help/theme/`;
    let resPath = "{{_res_path}}/help/theme/";

    let mainImagePath = `${resPath}main.png`;
    let bgImagePath = `${resPath}bg.jpg`;

    if (!fs.existsSync(`${dirPath}main.png`)) {
      throw new Error("[星点签名]背景图片不存在.");
    }

    if (!fs.existsSync(`${dirPath}bg.jpg`)) {
      bgImagePath = null;
    }

    let styleConfig = {};
    try {
      styleConfig = (await Data.importModule(`${dirPath}config.js`)).style || {};
    } catch (e) {
      logger.warn("[星点签名]配置文件confog.js不存在.");
    }

    return {
      main: mainImagePath,
      bg: bgImagePath,
      style: styleConfig,
    };
  },
  async getThemeData(diyStyle, sysStyle) {
    let helpConfig = { ...diyStyle, ...sysStyle };
    let colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2));
    let colWidth = Math.min(
      500,
      Math.max(100, parseInt(helpConfig?.colWidth) || 265)
    );
    let width = Math.min(2500, Math.max(800, colCount * colWidth + 30));
    let theme = await Theme.getThemeCfg();
    let themeStyle = theme.style || {};
    let ret = [
      `
    body{background-image:url(${theme.bg});width:${width}px;}
    .container{background-image:url(${theme.main});width:${width}px;}
    .help-table .td,.help-table .th{width:${100 / colCount}%}
    `,
    ];
    let css = function (sel, css, key, def, fn) {
      let val = diyStyle[key] ?? sysStyle[key] ?? themeStyle[key] ?? def;
      if (fn) {
        val = fn(val);
      }
      ret.push(`${sel}{${css}:${val}}`);
    };
    css(".help-title,.help-group", "color", "fontColor", "#ceb78b");
    css(".help-title,.help-group", "text-shadow", "fontShadow", "none");
    css(".help-desc", "color", "descColor", "#eee");
    css(".cont-box", "background", "contBgColor", "rgba(43, 52, 61, 0.8)");
    css(".cont-box", "backdrop-filter", "contBgBlur", 3, (n) =>
      diyStyle.bgBlur === false ? "none" : `blur(${n}px)`
    );
    css(".help-group", "background", "headerBgColor", "rgba(34, 41, 51, .4)");
    css(
      ".help-table .tr:nth-child(odd)",
      "background",
      "rowBgColor1",
      "rgba(34, 41, 51, .2)"
    );
    css(
      ".help-table .tr:nth-child(even)",
      "background",
      "rowBgColor2",
      "rgba(34, 41, 51, .4)"
    );
    return {
      style: `<style>${ret.join("\n")}</style>`,
      colCount,
    };
  },
};
export default Theme;
