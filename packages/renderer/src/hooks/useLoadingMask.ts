import { ElLoading } from 'element-plus'

export const useLoadingMask = () => {
  let loadingInstance:any = null

  const showLoadingMask = () => {
    loadingInstance = ElLoading.service({ fullscreen: true })
  }

  const hideLoadingMask = () => loadingInstance.close()

  return {
    showLoadingMask,
    hideLoadingMask
  }
}
