import fs from 'fs'
import readline from 'readline'

/**
 * 监听日志文件方法
 */

const WatchLog = {
  watchLog: (logPath, keywords, onLogDetected, interval = 1000) => {
    let lastSize = getInitialLogSize(logPath)

    function getInitialLogSize (path) {
      try {
        const stats = fs.statSync(path)
        return stats.size
      } catch (error) {
        return 0
      }
    }

    function isRelevantLog (line) {
      return keywords.some((keyword) => line.includes(keyword))
    }

    setInterval(() => {
      let currentSize
      try {
        currentSize = fs.statSync(logPath).size
      } catch (error) {
        return
      }

      if (currentSize > lastSize) {
        const stream = fs.createReadStream(logPath, {
          encoding: 'utf8',
          start: lastSize,
          end: currentSize
        })

        const rl = readline.createInterface({
          input: stream
        })

        rl.on('line', (line) => {
          if (isRelevantLog(line)) {
            onLogDetected(line)
          }
        })

        rl.on('close', () => {
          lastSize = currentSize
        })

        rl.on('error', () => {})
      }
    }, interval)
  }
}

export default WatchLog
