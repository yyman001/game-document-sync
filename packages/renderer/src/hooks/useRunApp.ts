import { ref, Ref } from 'vue'
import { spawn, ChildProcessWithoutNullStreams, exec, ExecException } from 'child_process'
import kill from 'tree-kill'

export default function useRunApp() {
  const appStatus: Ref<string> = ref('unstart')
  const startTime: Ref<number> = ref(0)
  const endTime: Ref<number> = ref(0)
  const offsetTime: Ref<number> = ref(0)
  let childProcess: ChildProcessWithoutNullStreams

  function startApp(
    exePath: string,
    args: Record<string, any>,
    onCloseCallback?: ((data: any) => void),
    // 兼容模式
    compatibleMode: boolean = false
  ): void {
    if (appStatus.value !== 'loading') {
      appStatus.value = 'loading'
      startTime.value = Date.now()

      const onCloseCallbackArgs = args // 使用传入的参数作为回调参数
      if (compatibleMode) {
        childProcess = exec(`"${exePath}"`) as ChildProcessWithoutNullStreams
      } else {
        childProcess = spawn(exePath, [])
      }

      childProcess.on('close', (code) => {
        console.log('应用程序已成功关闭')
        appStatus.value = 'unstart'
        endTime.value = Date.now()
        offsetTime.value = endTime.value - startTime.value

        if (onCloseCallback) {
          onCloseCallback(onCloseCallbackArgs) // 调用回调函数并传递参数
        }
      })

      childProcess.on('error', (error: ExecException) => {
        // 子进程执行出错
        console.error(`子进程执行出错: ${error.message}`)
      })
    }
  }

  function stopApp(compatibleMode: boolean = false): void {
    console.log('childProcess', childProcess)
    if (!childProcess) {
      console.error('应用程序未启动', childProcess)
      return
    }

    try {
      if (compatibleMode) {
        kill(childProcess.pid || 0, 'SIGKILL')
      } else {
        childProcess.kill('SIGINT')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    appStatus,
    startApp,
    stopApp,

    startTime,
    endTime,
    offsetTime
  }
}
