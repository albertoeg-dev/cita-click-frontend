<template>
  <div class="horario-selector">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="text-sm text-gray-600 mt-2">Cargando horarios disponibles...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <svg class="mx-auto h-8 w-8 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-sm text-red-800">{{ error }}</p>
    </div>

    <!-- Sin horarios disponibles -->
    <div v-else-if="!hayHorarios && !loading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
      <svg class="mx-auto h-8 w-8 text-yellow-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <p class="text-sm text-yellow-800">No hay horarios disponibles para esta fecha</p>
      <p class="text-xs text-yellow-700 mt-1">Intenta con otra fecha o verifica los horarios de atención</p>
    </div>

    <!-- Horarios disponibles -->
    <div v-else class="space-y-3">
      <!-- Duración total -->
      <div v-if="duracionTotal > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-xs text-blue-900">
            <span class="font-semibold">Duración:</span> {{ duracionTotal }} min ({{ formatearDuracion(duracionTotal) }})
          </p>
        </div>
      </div>

      <!-- Horarios recomendados -->
      <div v-if="horariosRecomendados.length > 0" class="bg-white rounded-lg border border-green-200 p-3 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-xs font-semibold text-gray-700 flex items-center">
            <svg class="w-3.5 h-3.5 text-green-600 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Horarios recomendados
          </h4>
          <span class="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{{ horariosRecomendados.length }}</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          <button
            v-for="horario in horariosRecomendados"
            :key="horario.horaInicio"
            type="button"
            @click="seleccionar(horario)"
            :class="[
              'relative py-2.5 px-3 rounded text-sm font-semibold font-mono flex items-center justify-center transition-all duration-150 min-h-[36px]',
              esSeleccionado(horario)
                ? 'bg-green-600 text-white shadow-sm ring-1 ring-green-500'
                : 'bg-green-50 text-green-800 hover:bg-green-100 hover:shadow-sm border border-green-200 hover:border-green-400'
            ]"
          >
            <svg v-if="esSeleccionado(horario)" class="w-3 h-3 absolute top-0.5 right-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ formatearHora(horario.horaInicio) }}</span>
          </button>
        </div>
      </div>

      <!-- Otros horarios -->
      <div v-if="otrosHorarios.length > 0" class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-xs font-semibold text-gray-700">
            Otros horarios
          </h4>
          <span class="text-[10px] font-medium text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">{{ otrosHorarios.length }}</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          <button
            v-for="horario in otrosHorarios"
            :key="horario.horaInicio"
            type="button"
            @click="seleccionar(horario)"
            :class="[
              'relative py-2.5 px-3 rounded text-sm font-semibold font-mono flex items-center justify-center transition-all duration-150 min-h-[36px]',
              esSeleccionado(horario)
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-sm border border-gray-300 hover:border-indigo-400'
            ]"
          >
            <svg v-if="esSeleccionado(horario)" class="w-3 h-3 absolute top-0.5 right-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ formatearHora(horario.horaInicio) }}</span>
          </button>
        </div>
      </div>

      <!-- Horario seleccionado (Purple card that user liked) -->
      <div v-if="modelValue" class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-3 shadow-md">
        <div class="flex items-center justify-between text-white">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-[10px] font-medium opacity-90">Seleccionado</p>
              <p class="text-base font-bold">{{ modelValue.etiqueta }}</p>
            </div>
          </div>
          <svg class="w-7 h-7 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  horarios: {
    type: Array,
    default: () => []
  },
  horariosRecomendados: {
    type: Array,
    default: () => []
  },
  otrosHorarios: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  duracionTotal: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const hayHorarios = computed(() => props.horarios.length > 0)

const seleccionar = (horario) => {
  emit('update:modelValue', horario)
}

const esSeleccionado = (horario) => {
  return props.modelValue?.horaInicio === horario.horaInicio
}

const formatearHora = (hora) => {
  // hora viene como "HH:mm:ss" o "HH:mm"
  return hora.substring(0, 5) // Retorna "HH:mm"
}

const formatearDuracion = (minutos) => {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60

  if (horas > 0 && mins > 0) {
    return `${horas}h ${mins}min`
  } else if (horas > 0) {
    return `${horas}h`
  } else {
    return `${mins}min`
  }
}
</script>

<style scoped>
.horario-selector {
  @apply w-full;
}
</style>
