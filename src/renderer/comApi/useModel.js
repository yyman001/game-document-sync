import { ref } from '@vue/composition-api'
export default function useModel () {
  const isVisible = ref(false)

  const onModelOpen = () => {
    isVisible.value = true
  }

  const onModelClose = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    onModelOpen,
    onModelClose
  }
}
