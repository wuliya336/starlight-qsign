import { spawn } from 'child_process'
import { logger, redis } from '../components/Base/index.js'
function execCommand (command, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' })
    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

const simpleRestart = async () => {
  try {
    if (process.env.app_type === 'pm2') {
      await execCommand('pnpm', ['run', 'restart'])
    }
    process.exit()
  } catch (error) {
    Bot.makeLog('error', ['重启错误', { error: error.message }])
    logger.error('重启过程中出现错误:', error)
  }
}

const setRestartInfo = async (isExit) => {
  const restartInfo = {
    isExit,
    time: Date.now()
  }

  await redis.set('Yz:restart', JSON.stringify(restartInfo))
}

const restart = async () => {
  await setRestartInfo(false)
  await simpleRestart()
}

const Restart = {
  simpleRestart,
  setRestartInfo,
  restart
}

export default Restart
