<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <button
      @click="isOpen = !isOpen"
      class="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
    >
      <span class="font-medium text-gray-900 pr-4 text-sm">{{ question }}</span>
      <svg
        class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-show="isOpen"
      class="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100"
    >
      <div class="pt-4">
        {{ answer }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
})

const isOpen = ref(false)
</script>
