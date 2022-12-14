import { ref, provide } from 'vue'
export default function () {
  const searchText = ref<string>('')

  const searchProvide = () => {
    provide('search', {
      searchText
    })
  }

  return {
    searchProvide
  }
}
