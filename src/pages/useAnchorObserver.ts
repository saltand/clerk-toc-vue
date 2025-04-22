export function useAnchorObserver(watch: string[], single: boolean = false) {
  const activeAnchor = ref<string[]>([])
  let observer: IntersectionObserver | null = null
  let onScroll: () => void = () => {}

  onMounted(() => {
    let visible: string[] = []
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !visible.includes(entry.target.id)) {
            visible = [...visible, entry.target.id]
          }
          else if (!entry.isIntersecting && visible.includes(entry.target.id)) {
            visible = visible.filter(v => v !== entry.target.id)
          }
        }

        if (visible.length > 0)
          activeAnchor.value = visible
      },
      {
        // rootMargin: single ? '-80px 0% -70% 0%' : `-20px 0% -40% 0%`,
        threshold: 1,
      },
    )

    onScroll = () => {
      const element = document.scrollingElement
      if (!element)
        return

      if (element.scrollTop === 0 && single) {
        activeAnchor.value = watch.slice(0, 1)
      }
      else if (element.scrollTop + element.clientHeight >= element.scrollHeight - 6) {
        activeAnchor.value = activeAnchor.value.length > 0 && !single ? watch.slice(watch.indexOf(activeAnchor.value[0])) : watch.slice(-1)
      }
    }

    for (const heading of watch) {
      const element = document.getElementById(heading)

      if (element)
        observer.observe(element)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    observer?.disconnect()
  })

  return single ? computed(() => activeAnchor.value.slice(0, 1)) : activeAnchor
}
