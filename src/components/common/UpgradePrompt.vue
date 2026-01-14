<template>
  <div v-if="show" :class="containerClass">
    <!-- Icon -->
    <div v-if="showIcon" class="flex-shrink-0">
      <svg v-if="variant === 'blocking'" class="h-6 w-6" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <svg v-else class="h-6 w-6" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <h3 v-if="title" class="text-sm font-semibold" :class="titleClass">
        {{ title }}
      </h3>
      <p class="text-sm" :class="messageClass">
        {{ message }}
      </p>

      <!-- Action button -->
      <div v-if="showAction" class="mt-3">
        <router-link
          :to="actionLink"
          :class="buttonClass"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          {{ actionText }}
        </router-link>
      </div>
    </div>

    <!-- Close button (solo para variant=warning) -->
    <div v-if="dismissible && variant === 'warning'" class="ml-auto pl-3">
      <button
        @click="$emit('dismiss')"
        class="-mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-orange-50"
      >
        <span class="sr-only">Cerrar</span>
        <svg class="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'warning', // 'warning', 'blocking', 'info'
    validator: (value) => ['warning', 'blocking', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  showAction: {
    type: Boolean,
    default: true
  },
  actionText: {
    type: String,
    default: 'Actualizar Plan'
  },
  actionLink: {
    type: String,
    default: '/plan'
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])

const containerClass = computed(() => {
  const base = 'rounded-lg p-4 flex items-start gap-3'

  if (props.variant === 'blocking') {
    return `${base} bg-red-50 border-2 border-red-200`
  } else if (props.variant === 'info') {
    return `${base} bg-blue-50 border border-blue-200`
  } else {
    return `${base} bg-orange-50 border border-orange-200`
  }
})

const iconClass = computed(() => {
  if (props.variant === 'blocking') return 'text-red-600'
  if (props.variant === 'info') return 'text-blue-600'
  return 'text-orange-600'
})

const titleClass = computed(() => {
  if (props.variant === 'blocking') return 'text-red-900'
  if (props.variant === 'info') return 'text-blue-900'
  return 'text-orange-900'
})

const messageClass = computed(() => {
  const base = props.title ? 'mt-1' : ''
  if (props.variant === 'blocking') return `${base} text-red-800`
  if (props.variant === 'info') return `${base} text-blue-800`
  return `${base} text-orange-800`
})

const buttonClass = computed(() => {
  if (props.variant === 'blocking') {
    return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  } else if (props.variant === 'info') {
    return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
  } else {
    return 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
  }
})
</script>
