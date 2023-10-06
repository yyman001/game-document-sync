import { ref, Ref } from 'vue'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

export default function useRunApp() {
  const appStatus: Ref<string> = ref('unstart')
  const startTime: Ref<number> = ref(0)
  const endTime: Ref<number> = ref(0)
  const offsetTime: Ref<number> = ref(0)

  let childProcess: ChildProcessWithoutNullStreams | null = null

  function startApp(
    exePath: string,
    args: Record<string, any>,
    onCloseCallback?: ((data: any) => void) | null
  ): void {
    if (appStatus.value !== 'loading') {
      appStatus.value = 'loading'
      startTime.value = Date.now()

      const onCloseCallbackArgs = args // 使用传入的参数作为回调参数

      childProcess = spawn(exePath, [])

      childProcess.on('close', (code) => {
        console.log('应用程序已成功关闭')
        appStatus.value = 'unstart'
        endTime.value = Date.now()
        offsetTime.value = endTime.value - startTime.value

        if (onCloseCallback) {
          onCloseCallback(onCloseCallbackArgs) // 调用回调函数并传递参数
        }
      })
    }
  }

  function stopApp(): void {
    if (childProcess) {
      childProcess.kill()
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
