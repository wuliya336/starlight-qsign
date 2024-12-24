import { Version, Init } from './components/index.js'
import { logger } from './components/Base/index.js'
import chalk from 'chalk'

let apps
let startTime = Date.now()

if (Version.name !== 'Karin') {
  apps = await Init().catch(error =>
    logger.error(chalk.bgRgb(255, 0, 0).white.bold(' 初始化失败: ') + chalk.redBright(error))
  )
}

let loadTime = Date.now() - startTime

const loadTimeColor = loadTime < 100
  ? chalk.green.bold
  : loadTime < 500
    ? chalk.yellow.bold
    : chalk.red.bold

export { apps }

const separator = chalk.rgb(80, 200, 120).bold('★'.repeat(30))

logger.info(separator)
if (Version.name === 'Karin') {
  logger.info(
    chalk.bgRgb(0, 120, 255).white.bold(' 尊贵的Karin用户 ')
  )
}
logger.info(
  chalk.rgb(255, 215, 0).bold(`✨ 星点签名插件 v${Version.ver} 已成功载入 ✨`)
)
logger.info(
  chalk.bgRgb(255, 165, 0).black.bold(' 提示: ') +
    chalk.rgb(255, 140, 0)(' 已跑路，仅保证功能可用，慎重使用！')
)

logger.info(
  chalk.bgRgb(0, 0, 0).white.bold(' 载入耗时: ') +
    loadTimeColor(`${loadTime}ms`)
)
logger.info(separator)
