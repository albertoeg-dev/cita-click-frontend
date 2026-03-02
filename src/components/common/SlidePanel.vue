<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/40 z-40"
        @click="handleBackdropClick"
      ></div>
    </Transition>

    <!-- Panel -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="modelValue"
        class="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:w-[480px] lg:w-[560px] bg-white shadow-2xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
          <h2 class="text-lg font-semibold text-slate-900 truncate pr-4">{{ title }}</h2>
          <button
            v-if="closable"
            @click="handleClose"
            class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar panel"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body (scrollable) -->
        <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-6">
          <slot />
        </div>

        <!-- Footer slot (opcional) -->
        <div
          v-if="$slots.footer"
          class="flex-shrink-0 border-t border-slate-200 px-5 sm:px-6 py-4 bg-slate-50"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const handleClose = () => {
  if (!props.closable) return
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.closable) return
  handleClose()
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true }
)
</script>
