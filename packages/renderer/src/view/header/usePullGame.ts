import { ref, unref } from 'vue'
import { storeToRefs } from 'pinia'
import useModal from '@/hooks/useModal'
import { useDocFormStoreWhitOut } from '@/store/doc'
import { fullGame, fullGameTable } from '@/utils/pullGame'

export const usePullGame = function () {
  const docFrom = useDocFormStoreWhitOut()
  const {
    // TODO: 获取游戏名
    // gameName,
    gameDocPath
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
  }

  const onClickRow = (record: any) => {
    console.log('onClickRow', record)
    // TODO: 详细更新表单信息
    gameDocPath.value = record.content
    onModalClose()
  }

  const getGameInfoForSteamId = async (steamId: string) => {
    if (!steamId || unref(isPulling)) return
    setPullStatus(true)
    const rtx = await fullGame(steamId)
    if (rtx === null) {
      return
    }

    console.log('rtx:', rtx)
    dataSource.value = rtx

    setPullStatus(false)
    onModalOpen()
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
