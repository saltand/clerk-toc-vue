<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import TocItem from './TocItem.vue'
import { useTocThumb } from './useTocThumb'

export interface TTocItem {
  title: string
  link: string
  depth: number
}

const { tocList } = defineProps<{
  tocList: TTocItem[]
}>()

const containerRef = useTemplateRef('containerRef')

const pos = useTocThumb(containerRef, tocList)

const svg = ref<{
  path: string
  width: number
  height: number
}>({
  path: '',
  width: 0,
  height: 0,
})

let observer: ResizeObserver | null = null

onMounted(() => {
  if (!containerRef.value)
    return

  const container = containerRef.value
  function onResize() {
    if (container.clientHeight === 0)
      return
    let w = 0
    let h = 0
    const d: string[] = []
    for (let i = 0; i < tocList.length; i++) {
      const element: HTMLElement | null = container.querySelector(`a[href="#${tocList[i].link.slice(1)}"]`)
      if (!element)
        continue

      const styles = getComputedStyle(element)
      const offset = (tocList[i].depth - 1) * 16 + 1
      const top = element.offsetTop + Number.parseFloat(styles.paddingTop)
      const bottom = element.offsetTop + element.clientHeight - Number.parseFloat(styles.paddingBottom)

      w = Math.max(offset, w)
      h = Math.max(h, bottom)

      d.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`)
      d.push(`L${offset} ${bottom}`)
      svg.value = {
        path: d.join(' '),
        width: w + 1,
        height: h,
      }
    }
  }
  observer = new ResizeObserver(onResize)
  onResize()
  observer.observe(container)
})

onUnmounted(() => {
  if (observer)
    observer.disconnect()
})

const svgMask = computed(
  () =>
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.value.width} ${svg.value.height}"><path d="${svg.value.path}" stroke="black" stroke-width="1" fill="none" /></svg>`)}`,
)
</script>

<template>
  <div ref="containerRef" class="min-h-0 relative">
    <div
      v-if="svg.height > 0"
      class="start-4 top-0 absolute z-1"
      :style="{
        width: `${svg.width}px`,
        height: `${svg.height}px`,
        maskImage: `url(${svgMask})`,
        WebkitMaskImage: svgMask,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }"
    >
      <div
        role="none" class="bg-#1f66f4 transition-all" :style="{
          height: `${pos[1]}px`,
          marginTop: `${pos[0]}px`,
        }"
      />
    </div>

    <div class="m-4 flex flex-col">
      <TocItem v-for="(item, index) in tocList" :key="item.title" :item="item" :upper="tocList[index - 1]?.depth || item.depth" :lower="tocList[index + 1]?.depth || item.depth" />
    </div>
  </div>
</template>
