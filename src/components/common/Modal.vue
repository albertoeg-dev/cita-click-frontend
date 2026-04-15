<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click.self="cerrar">
      <div class="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="cerrar"></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-md transform transition-all"
          :class="sizeClass"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-4 sm:p-6 border-b">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ title }}
            </h3>
            <button
              v-if="closable"
              @click="cerrar"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-4 py-4 sm:p-6">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end gap-3 px-4 py-3 sm:p-6 border-t bg-gray-50">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value),
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClass = computed(() => {
  const sizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    full: 'sm:max-w-4xl',
  }
  return sizes[props.size]
})

const cerrar = () => {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
