import { ref, computed } from '@vue/composition-api'

export default {
  setup (props) {
    const filtersParams = ref('')
    const filtersLsit = ref([])
    const searchText = ref('')
    const result = ref([])

    const onSelected = () => {

    }

    return {
      searchText,
      result,
      onSelected
    }
  }
}
