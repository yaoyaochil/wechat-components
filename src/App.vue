<template>
  <wechat-menu @submitMenuData="getMenu"></wechat-menu>
</template>

<script setup lang="ts">
import wechatMenu from '@/components/wechat-menu.vue'
const getMenu = (data: any) => {
  console.log(data)
}
</script>


<style scoped>
</style>
