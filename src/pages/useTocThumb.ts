import type { TTocItem } from './TOC.vue'
import { useAnchorObserver } from './useAnchorObserver'

export type TOCThumb = [top: number, height: number]
export function useTocThumb(containerRef: Ref<HTMLElement | null>, tocList: TTocItem[]): Ref<TOCThumb> {
  const headings = tocList.map(item => item.link.split('#')[1])
  const active = useAnchorObserver(headings, false)
  const pos = ref<TOCThumb>([0, 0])

  watch(active, () => {
    if (active.value.length === 0 || !containerRef.value || containerRef.value.clientHeight === 0) {
      pos.value = [0, 0]
      return
    }

    let upper = Number.MAX_VALUE
    let lower = 0

    for (const item of active.value) {
      const element = containerRef.value?.querySelector<HTMLElement>(`a[href="#${item}"]`)
      if (!element)
        continue

      const styles = getComputedStyle(element)
      upper = Math.min(upper, element.offsetTop + Number.parseFloat(styles.paddingTop))
      lower = Math.max(lower, element.offsetTop + element.clientHeight - Number.parseFloat(styles.paddingBottom))
    }

    pos.value = [upper, lower - upper]
  })

  return pos
}
