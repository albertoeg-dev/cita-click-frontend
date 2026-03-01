<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
      />

      <!-- Icon slot -->
      <div v-if="$slots.icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <slot name="icon"></slot>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error && showError" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Help text -->
    <p v-else-if="help" class="mt-1 text-sm text-gray-500">
      {{ help }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue'

const slots = useSlots()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
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
  min: {
    type: [String, Number],
    default: undefined,
  },
  max: {
    type: [String, Number],
    default: undefined,
  },
  step: {
    type: [String, Number],
    default: undefined,
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`,
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const showError = ref(false)

const inputClasses = computed(() => {
  const leftPadding = slots.icon ? 'pl-10' : 'pl-3'
  const baseClasses = `block w-full ${leftPadding} pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors`
  const stateClasses = props.error && showError.value
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
  const disabledClasses = props.disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : 'bg-white'

  return `${baseClasses} ${stateClasses} ${disabledClasses}`
})

const handleInput = (event) => {
  const value = props.type === 'number' ? event.target.valueAsNumber : event.target.value
  emit('update:modelValue', value)
}

const handleBlur = (event) => {
  showError.value = true
  emit('blur', event)
}
</script>
