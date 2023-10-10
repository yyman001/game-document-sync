import { ref, unref } from 'vue'
import { storeToRefs } from 'pinia'
import useModal from '@/hooks/useModal'
import { useDocFormStoreWhitOut } from '@/store/doc'
import { fullGame, fullGameTable } from '@/utils/pullGame'
import { ElMessage } from 'element-plus'
import { useLoadingMask } from '@/hooks/useLoadingMask'

export const usePullGame = function () {
  const { showLoadingMask, hideLoadingMask } = useLoadingMask()
  const docFrom = useDocFormStoreWhitOut()
  const {
    // TODO: 获取游戏名
    // gameName,
    gameDocFullPath
  } = storeToRefs(docFrom)

  const { isVisible, onModalOpen, onModalClose } = useModal()
  const isPulling = ref(false)

  const dataSource = ref<fullGameTable[]>([])
  const columns = [
    {
      title: '类型',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'Action',
      key: 'action'
    }
  ]

  const setPullStatus = (status: boolean) => {
    isPulling.value = status
    if (status) {
      showLoadingMask()
    } else {
      hideLoadingMask()
    }
  }

  const onClickRow = (record: any) => {
    console.log('onClickRow', record)
    // TODO: 详细更新表单信息
    gameDocFullPath.value = record.content
    onModalClose()
  }

  const getGameInfoForSteamId = async (steamId: string) => {
    if (!steamId || unref(isPulling)) {
      ElMessage({
        message: 'SteamId不能为空!',
        type: 'error'
      })
      return
    }
    setPullStatus(true)

    const rtx = await fullGame(steamId)
    setPullStatus(false)
    if (rtx === null) {
      ElMessage({
        message: '分析异常!',
        type: 'error'
      })
      return
    }

    console.log('rtx:', rtx)
    dataSource.value = rtx

    onModalOpen()
    ElMessage({
      message: '分析成功!',
      type: 'success'
    })
  }

  return {
    isGameModal: isVisible,
    onModalOpen,
    onModalClose,

    isPulling,
    setPullStatus,

    columns,
    dataSource,

    onClickRow,
    getGameInfoForSteamId
  }
}
