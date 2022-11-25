import { useRoute } from 'vue-router'
import { ref, unref, watch } from 'vue'

export const scrollMod = Symbol('')

export default function useScroll () {
  const route = useRoute()
  const scroll = ref()
  const scrollTop = (height = 0) => {
    unref(scroll).$el.scrollTop = height
  }

  watch(
    () => route.path,
    path => {
      console.warn('path:', path)
      scrollTop()
    }
  )

  return {
    scroll,
    scrollTop
  }
}
