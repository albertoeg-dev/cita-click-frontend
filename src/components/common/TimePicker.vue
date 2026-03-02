<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Spinner HH : MM -->
    <div
      class="inline-flex items-center gap-1 border rounded-lg px-3 py-2 bg-white transition-colors"
      :class="hasError ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'"
    >
      <!-- Horas -->
      <div class="flex flex-col items-center">
        <button
          type="button"
          @click="changeHours(1)"
          :disabled="disabled"
          tabindex="-1"
          class="w-7 h-6 flex items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <input
          ref="hoursRef"
          type="text"
          inputmode="numeric"
          :value="hoursDisplay"
          @input="onHoursInput"
          @blur="normalizeHours"
          @keydown="onHoursKeydown"
          :disabled="disabled"
          maxlength="2"
          placeholder="HH"
          class="w-9 text-center text-lg font-semibold text-gray-800 bg-transparent border-none outline-none leading-tight py-0.5"
        />
        <button
          type="button"
          @click="changeHours(-1)"
          :disabled="disabled"
          tabindex="-1"
          class="w-7 h-6 flex items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Separador -->
      <span class="text-xl font-bold text-gray-500 select-none -mt-0.5">:</span>

      <!-- Minutos -->
      <div class="flex flex-col items-center">
        <button
          type="button"
          @click="changeMinutes(5)"
          :disabled="disabled"
          tabindex="-1"
          class="w-7 h-6 flex items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <input
          ref="minutesRef"
          type="text"
          inputmode="numeric"
          :value="minutesDisplay"
          @input="onMinutesInput"
          @blur="normalizeMinutes"
          @keydown="onMinutesKeydown"
          :disabled="disabled"
          maxlength="2"
          placeholder="MM"
          class="w-9 text-center text-lg font-semibold text-gray-800 bg-transparent border-none outline-none leading-tight py-0.5"
        />
        <button
          type="button"
          @click="changeMinutes(-5)"
          :disabled="disabled"
          tabindex="-1"
          class="w-7 h-6 flex items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Indicador AM/PM -->
      <span class="text-xs font-semibold text-gray-400 ml-1 select-none self-center w-6 text-center">
        {{ period }}
      </span>
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
import { ref, computed, watch } from 'vue'

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
  // Mantenidos para compatibilidad
  min: { type: String, default: '00:00' },
  max: { type: String, default: '23:59' },
  step: { type: Number, default: 30 },
  id: {
    type: String,
    default: () => `timepicker-${Math.random().toString(36).substr(2, 9)}`,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'change'])

const hoursRef = ref(null)
const minutesRef = ref(null)

const parseValue = (val) => {
  if (!val) return { h: null, m: null }
  const parts = val.split(':')
  const h = parseInt(parts[0])
  const m = parseInt(parts[1])
  return {
    h: !isNaN(h) && h >= 0 && h <= 23 ? h : null,
    m: !isNaN(m) && m >= 0 && m <= 59 ? m : null,
  }
}

const internalH = ref(parseValue(props.modelValue).h)
const internalM = ref(parseValue(props.modelValue).m)

watch(() => props.modelValue, (val) => {
  const { h, m } = parseValue(val)
  internalH.value = h
  internalM.value = m
})

const hoursDisplay = computed(() =>
  internalH.value !== null ? String(internalH.value).padStart(2, '0') : ''
)

const minutesDisplay = computed(() =>
  internalM.value !== null ? String(internalM.value).padStart(2, '0') : ''
)

const period = computed(() => {
  if (internalH.value === null) return '--'
  return internalH.value < 12 ? 'AM' : 'PM'
})

const hasError = computed(() => !!props.error)

const emitValue = () => {
  if (internalH.value === null && internalM.value === null) {
    emit('update:modelValue', '')
    emit('change', '')
    return
  }
  const h = internalH.value ?? 0
  const m = internalM.value ?? 0
  const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  emit('update:modelValue', val)
  emit('change', val)
}

// --- Horas ---
const changeHours = (delta) => {
  const current = internalH.value ?? 0
  internalH.value = ((current + delta) % 24 + 24) % 24
  emitValue()
}

const onHoursInput = (e) => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
  e.target.value = raw
  if (raw === '') {
    internalH.value = null
    return
  }
  const n = Number(raw)
  if (n >= 0 && n <= 23) internalH.value = n
  // Saltar a minutos al escribir 2 dígitos
  if (raw.length === 2) minutesRef.value?.focus()
}

const normalizeHours = () => {
  if (internalH.value === null) internalH.value = 0
  emitValue()
  emit('blur')
}

const onHoursKeydown = (e) => {
  if (e.key === 'ArrowUp') { e.preventDefault(); changeHours(1) }
  if (e.key === 'ArrowDown') { e.preventDefault(); changeHours(-1) }
  if (e.key === ':' || e.key === 'Tab') minutesRef.value?.focus()
}

// --- Minutos ---
const changeMinutes = (delta) => {
  const current = internalM.value ?? 0
  internalM.value = ((current + delta) % 60 + 60) % 60
  emitValue()
}

const onMinutesInput = (e) => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
  e.target.value = raw
  if (raw === '') {
    internalM.value = null
    return
  }
  const n = Number(raw)
  if (n >= 0 && n <= 59) internalM.value = n
}

const normalizeMinutes = () => {
  if (internalM.value === null) internalM.value = 0
  emitValue()
  emit('blur')
}

const onMinutesKeydown = (e) => {
  if (e.key === 'ArrowUp') { e.preventDefault(); changeMinutes(5) }
  if (e.key === 'ArrowDown') { e.preventDefault(); changeMinutes(-5) }
}
</script>
