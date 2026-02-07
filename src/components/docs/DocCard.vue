<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div class="flex items-start justify-between gap-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>

        <!-- Plan Badges -->
        <div class="flex flex-wrap gap-2 flex-shrink-0">
          <span
            v-for="plan in planBadges"
            :key="plan"
            class="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
            :class="getPlanBadgeClass(plan)"
          >
            {{ plan }}
          </span>
        </div>
      </div>

      <!-- Premium Feature Badge -->
      <div v-if="premiumFeature" class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
        <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-white text-xs font-semibold">Premium</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Image Placeholder -->
      <div class="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 flex items-center justify-center h-40">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-2">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-xs text-gray-500">{{ imagePlaceholder }}</p>
        </div>
      </div>

      <!-- Steps -->
      <div class="space-y-3">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-start gap-3"
        >
          <div class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center mt-0.5">
            {{ index + 1 }}
          </div>
          <p class="text-sm text-gray-700 leading-relaxed flex-1">{{ step }}</p>
        </div>
      </div>

      <!-- Note -->
      <div v-if="note" class="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <p class="text-xs text-blue-800 leading-relaxed">{{ note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  planBadges: {
    type: Array,
    default: () => []
  },
  steps: {
    type: Array,
    required: true
  },
  imagePlaceholder: {
    type: String,
    required: true
  },
  premiumFeature: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    default: null
  }
})

const getPlanBadgeClass = (plan) => {
  const classes = {
    'BASICO': 'bg-gray-200 text-gray-700',
    'PROFESIONAL': 'bg-blue-100 text-blue-700',
    'PREMIUM': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
  }
  return classes[plan] || 'bg-gray-200 text-gray-700'
}
</script>
