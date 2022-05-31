import { ref } from '@vue/composition-api'

export default function () {
  const searchText = ref('')
  const onSearch = ($event) => {
    searchText.value = $event.target.value
  }

  return {
    searchText,
    onSearch
  }
}
