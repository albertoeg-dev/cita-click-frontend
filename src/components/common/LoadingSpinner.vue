<template>
  <div class="flex items-center justify-center">
    <div class="animate-spin">
      <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
    </div>
    <span class="ml-3 text-gray-600">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Cargando...',
  },
})
</script>