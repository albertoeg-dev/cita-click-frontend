<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Dos selects: Horas y Minutos -->
    <div class="flex items-center gap-1">
      <!-- Select Horas -->
      <select
        :value="selectedHour"
        @change="onHourChange"
        :disabled="disabled"
        class="flex-1 border rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 bg-white appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="hasError ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'"
      >
        <option value="" disabled>HH</option>
        <option
          v-for="h in hours"
          :key="h.value"
          :value="h.value"
        >{{ h.label }}</option>
      </select>

      <span class="text-lg font-bold text-gray-400 select-none">:</span>

      <!-- Select Minutos -->
      <select
        :value="selectedMinute"
        @change="onMinuteChange"
        :disabled="disabled"
        class="flex-1 border rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 bg-white appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="hasError ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'"
      >
        <option value="" disabled>MM</option>
        <option
          v-for="m in minutes"
          :key="m.value"
          :value="m.value"
        >{{ m.label }}</option>
      </select>
    </div>

    <!-- Error message -->
    <p v-if="hasError" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Help text -->
    <p v-else-if="help" class="mt-1 text-sm text-gray-500">
      {{ help }}
    </p>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

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
  // Compatibilidad con props anteriores
  min: { type: String, default: '00:00' },
  max: { type: String, default: '23:59' },
  step: { type: Number, default: 5 },
  id: {
    type: String,
    default: () => `timepicker-${Math.random().toString(36).substr(2, 9)}`,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'change'])

// Opciones de horas 00–23
const hours = Array.from({ length: 24 }, (_, i) => ({
  value: String(i).padStart(2, '0'),
  label: String(i).padStart(2, '0'),
}))

// Opciones de minutos cada 5 min: 00, 05, 10 … 55
const minutes = Array.from({ length: 12 }, (_, i) => ({
  value: String(i * 5).padStart(2, '0'),
  label: String(i * 5).padStart(2, '0'),
}))

// Parsear modelValue → partes separadas
const parseValue = (val) => {
  if (!val) return { h: '', m: '' }
  const parts = val.split(':')
  const h = parts[0]?.padStart(2, '0') ?? ''
  // Redondear minutos al múltiplo de 5 más cercano
  const rawM = parseInt(parts[1] ?? '0')
  const roundedM = !isNaN(rawM) ? Math.round(rawM / 5) * 5 : 0
  const m = String(Math.min(roundedM, 55)).padStart(2, '0')
  return { h, m }
}

const selectedHour = ref(parseValue(props.modelValue).h)
const selectedMinute = ref(parseValue(props.modelValue).m)

watch(() => props.modelValue, (val) => {
  const { h, m } = parseValue(val)
  selectedHour.value = h
  selectedMinute.value = m
})

const hasError = computed(() => !!props.error)

const emitValue = () => {
  if (!selectedHour.value || selectedMinute.value === '') return
  const val = `${selectedHour.value}:${selectedMinute.value}`
  emit('update:modelValue', val)
  emit('change', val)
}

const onHourChange = (e) => {
  selectedHour.value = e.target.value
  emitValue()
}

const onMinuteChange = (e) => {
  selectedMinute.value = e.target.value
  emitValue()
}
</script>
