<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      :id="id"
      type="date"
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      :min="min"
      :max="max"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
    />

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
import { ref, computed } from 'vue'
import { obtenerFechaActual } from '../../utils/formatters'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
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
  required: {
    type: Boolean,
    default: false,
  },
  min: {
    type: String,
    default: undefined,
  },
  max: {
    type: String,
    default: undefined,
  },
  disablePast: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: () => `datepicker-${Math.random().toString(36).substr(2, 9)}`,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'change'])

const showError = ref(false)

const inputClasses = computed(() => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors'
  const stateClasses = props.error && showError.value
    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
  const disabledClasses = props.disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : 'bg-white'

  return `${baseClasses} ${stateClasses} ${disabledClasses}`
})

// Si disablePast está activo, establecer min a hoy
const minDate = computed(() => {
  if (props.disablePast && !props.min) {
    return obtenerFechaActual()
  }
  return props.min
})

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = (event) => {
  showError.value = true
  emit('blur', event)
}
</script>
