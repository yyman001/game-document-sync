import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

/* 运行外部应用 */
function runApp (exePath: string, args: string[] = []): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child: ChildProcessWithoutNullStreams = spawn(exePath, args)

    child.on('error', (error) => {
      reject(error)
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`App process exited with code ${code}`))
      }
    })
  })
}

/* 该方法运行获取应用初始化一些信息 */
function launchAppWithMonitoring (exePath: string, args: string[] = []): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child: ChildProcessWithoutNullStreams = spawn(exePath, args)

    // 监听应用程序的标准输出
    child.stdout.on('data', (data) => {
      console.log(`App stdout: ${data.toString()}`)
      // 在这里可以处理应用程序的输出
    })

    // 监听应用程序的错误输出
    child.stderr.on('data', (data) => {
      console.error(`App stderr: ${data.toString()}`)
      // 在这里可以处理应用程序的错误输出
    })

    child.on('error', (error) => {
      reject(error)
    })

    child.on('close', (code) => {
      if (code === 0) {
        console.log('App exited successfully')
        // 在应用程序正常结束时执行自定义内容
        // 例如，你可以在这里触发其他操作
        resolve()
      } else {
        console.error(`App process exited with code ${code}`)
        // 在应用程序异常结束时执行自定义内容
        // 例如，你可以在这里处理错误情况
        reject(new Error(`App process exited with code ${code}`))
      }
    })
  })
}

export { runApp, launchAppWithMonitoring }
