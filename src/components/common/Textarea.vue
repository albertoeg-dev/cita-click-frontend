<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <textarea
      :id="id"
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      :class="textareaClasses"
    ></textarea>

    <!-- Character count -->
    <div v-if="maxlength" class="mt-1 flex justify-between">
      <p v-if="error && showError" class="text-sm text-red-600">
        {{ error }}
      </p>
      <p v-else-if="help" class="text-sm text-gray-500">
        {{ help }}
      </p>
      <p class="text-sm text-gray-500 ml-auto">
        {{ modelValue?.length || 0 }} / {{ maxlength }}
      </p>
    </div>

    <!-- Error or help text -->
    <template v-else>
      <p v-if="error && showError" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
      <p v-else-if="help" class="mt-1 text-sm text-gray-500">
        {{ help }}
      </p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  help: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 3,
  },
  maxlength: {
    type: Number,
    default: undefined,
  },
  id: {
    type: String,
    default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`,
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const showError = ref(false)

const textareaClasses = computed(() => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors resize-none'
  const stateClasses = props.error && showError.value
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
  const disabledClasses = props.disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : 'bg-white'

  return `${baseClasses} ${stateClasses} ${disabledClasses}`
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  showError.value = true
  emit('blur', event)
}
</script>
