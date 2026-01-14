<template>
  <router-view />
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import Toast from './components/common/Toast.vue'

const toastRef = ref(null)

onMounted(() => {
  const instance = getCurrentInstance()
  if (instance && toastRef.value) {
    instance.appContext.config.globalProperties.$toast = toastRef.value
  }
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>