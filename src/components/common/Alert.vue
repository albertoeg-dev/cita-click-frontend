<template>
  <div v-if="show" :class="['alert', `alert-${type}`]">
    <div class="flex-1">
      <p class="font-medium">{{ message }}</p>
    </div>
    <button
      @click="close"
      class="text-xl cursor-pointer hover:opacity-70"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const show = ref(true)

const close = () => {
  show.value = false
}

watch(() => props.message, () => {
  show.value = true
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>