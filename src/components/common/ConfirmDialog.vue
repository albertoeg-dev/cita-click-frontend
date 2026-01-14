<template>
  <Modal v-model="show" :title="title" size="sm" :closable="!loading">
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="text-gray-700 mb-2">{{ message }}</p>
      <p v-if="description" class="text-sm text-gray-500">{{ description }}</p>
    </div>

    <template #footer>
      <button
        @click="cancelar"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar
      </button>
      <button
        @click="confirmar"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        {{ confirmText }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirmar acción',
  },
  message: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: 'Confirmar',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const show = ref(false)
const loading = ref(false)

const open = () => {
  show.value = true
  loading.value = false
}

const close = () => {
  if (!loading.value) {
    show.value = false
  }
}

const confirmar = () => {
  emit('confirm')
}

const cancelar = () => {
  if (!loading.value) {
    emit('cancel')
    close()
  }
}

const setLoading = (value) => {
  loading.value = value
}

defineExpose({
  open,
  close,
  setLoading,
})
</script>
