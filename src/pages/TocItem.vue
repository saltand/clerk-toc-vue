<script setup lang="ts">
import type { TTocItem } from './TOC.vue'

const { item, upper, lower } = defineProps<{
  item: TTocItem
  upper: number
  lower: number
}>()

function getItemOffset(depth: number): number {
  return depth - 1 <= 0 ? 0 : (depth - 1) * 16
}

const offset = computed(() => getItemOffset(item.depth))
const upperOffset = computed(() => {
  const diff = item.depth - upper
  if (diff <= 0)
    return 16
  else return 0
})
const lowerOffset = computed(() => {
  const diff = item.depth - upper
  if (diff <= 0)
    return 0
  else return 16
})
</script>

<template>
  <a :href="item.link" class="py-2 transition-colors [overflow-wrap:anywhere] relative first:pt-0 last:pb-0" :style="{ paddingInlineStart: `${offset}px` }">
    <svg
      v-if="item.depth !== upper"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      class="size-4 absolute -top-2"
      :style="{
        'inset-inline-start': `${Math.max(offset - 16, 0)}px`,
      }"
    >
      <line :x1="upperOffset" y1="0" :x2="lowerOffset" y2="16" class="stroke-gray-200" strokeWidth="1" />
    </svg>
    <div class="bg-gray-200 w-px inset-y-0 absolute z-0" :class="{ 'top-2': item.depth !== upper, 'bottom-2': item.depth !== lower }" />
    <div class="px-2">
      {{ item.title }}
    </div>
  </a>
</template>

<style scoped></style>
