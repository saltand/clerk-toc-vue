<script setup lang="ts">
import type { TTocItem } from './TOC.vue'
import Toc from './TOC.vue'

const tocList: TTocItem[] = [
  {
    title: '标题1',
    link: '#1',
    depth: 1,
  },
  {
    title: '标题1-1',
    link: '#1-1',
    depth: 2,
  },
  {
    title: '标题2',
    link: '#2',
    depth: 1,
  },
  {
    title: '标题2-1',
    link: '#2-1',
    depth: 2,
  },
  {
    title: '标题2-2',
    link: '#2-2',
    depth: 2,
  },
  {
    title: '标题2-2-1',
    link: '#2-2-1',
    depth: 3,
  },
]
</script>

<template>
  <div class="flex">
    <Toc :toc-list="tocList" class="h-screen w-60 top-0 sticky overflow-y-auto" />
    <div class="p-4 flex-1">
      <div v-for="item in tocList" :key="item.link">
        <h1 :id="item.link.slice(1)" class="text-2xl font-bold mb-2 mt-4" :style="{ 'scroll-margin-top': '80px' }">
          {{ item.title }}
        </h1>
        <p class="text-gray-700 h-100">
          这里是关于 "{{ item.title }}" 的内容... <br>
          添加一些足够长的占位内容来测试滚动。 <br>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
