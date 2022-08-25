import { ref } from 'vue'

export default function useModal () {
  const isVisible = ref(false)

  const onModalOpen = () => {
    isVisible.value = true
  }

  const onModalClose = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    onModalOpen,
    onModalClose
  }
}

export interface Modal {
  isVisible?:boolean,
  onModalOpen: Function,
  onModalClose: Function,
}

export const modal = Symbol('')
