import lodash from 'lodash'
import { Common, Data, Version } from '../components/index.js'
import Theme from './help/theme.js'

const _path = process.cwd()
const helpPath = `${_path}/plugins/starlight-qsign/resources/help`

export class help extends plugin {
    constructor() {
        super({
            name: '星点签名插件',
            dsc: '星点签名帮助',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: "^#?(星点签名|(S|s)tarlight-qsign)(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
                    fnc: 'help'
                },
                {
                    reg: "^#?(星点签名|(S|s)tarlight-qsign)(版本|版本信息|version|versioninfo)$",
                    fnc: 'versionInfo'
                },
            ]
        })
    }

    async help (e) {

        let custom = {}
        let help = {}
        let { diyCfg, sysCfg } = await Data.importCfg('help')
      
        if (lodash.isArray(help.helpCfg)) {
          custom = {
            helpList: help.helpCfg,
            helpCfg: {}
          }
        } else {
          custom = help
        }
      
        let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
        let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList
      
        let helpGroup = []
      
        lodash.forEach(helpList, (group) => {
          if ((group.auth && group.auth === 'master' && !e.isMaster) || user_id === '3369906077') {
            return true
          }
      
          lodash.forEach(group.list, (help) => {
            let icon = help.icon * 1
            if (!icon) {
              help.css = 'display:none'
            } else {
              let x = (icon - 1) % 10
              let y = (icon - x - 1) / 10
              help.css = `background-position:-${x * 50}px -${y * 50}px`
            }
          })
      
          helpGroup.push(group)
        })
        let themeData = await Theme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})
        return await Common.render('help/index', {
          helpCfg: helpConfig,
          helpGroup,
          ...themeData,
          element: 'default'
        }, { e, scale: 1.2 })
      }
      
      async versionInfo (e) {
        return await Common.render('help/version-info', {
          currentVersion: Version.ver,
          changelogs: Version.logs,
          elem: 'cryo'
        }, { e, scale: 1.2 })
      }
      }