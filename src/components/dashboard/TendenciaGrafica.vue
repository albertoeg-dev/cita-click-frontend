<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Tendencia Semanal</h3>
      <div class="flex items-center space-x-4 text-sm">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
          <span class="text-gray-600">Citas</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span class="text-gray-600">Ingresos</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="tendencia && tendencia.length > 0" class="space-y-4">
      <!-- Gráfica simple con barras -->
      <div class="relative h-64">
        <div
          v-for="(dato, index) in tendencia"
          :key="index"
          class="absolute bottom-0 flex flex-col items-center"
          :style="{ left: `${(index / (tendencia.length - 1)) * 100}%`, transform: 'translateX(-50%)' }"
        >
          <!-- Barra de citas -->
          <div class="flex items-end space-x-1 mb-2">
            <div
              class="w-6 bg-indigo-500 rounded-t transition-all hover:bg-indigo-600"
              :style="{ height: `${calcularAltura(dato.citas, maxCitas)}px` }"
              :title="`${dato.citas} citas`"
            ></div>
            <div
              class="w-6 bg-green-500 rounded-t transition-all hover:bg-green-600"
              :style="{ height: `${calcularAltura(dato.ingresos, maxIngresos)}px` }"
              :title="formatearMoneda(dato.ingresos)"
            ></div>
          </div>

          <!-- Etiqueta de fecha -->
          <p class="text-xs text-gray-600 mt-1">{{ formatearFecha(dato.fecha) }}</p>
        </div>
      </div>

      <!-- Estadísticas resumidas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p class="text-xs text-gray-600">Total Citas (7 días)</p>
          <p class="text-xl font-bold text-indigo-600">{{ totalCitas }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Total Ingresos (7 días)</p>
          <p class="text-xl font-bold text-green-600">{{ formatearMoneda(totalIngresos) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <p class="text-sm">No hay datos de tendencia disponibles</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tendencia: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const MAX_HEIGHT = 200 // Altura máxima en px

const maxCitas = computed(() => {
  if (!props.tendencia || props.tendencia.length === 0) return 1
  return Math.max(...props.tendencia.map(d => d.citas), 1)
})

const maxIngresos = computed(() => {
  if (!props.tendencia || props.tendencia.length === 0) return 1
  return Math.max(...props.tendencia.map(d => parseFloat(d.ingresos)), 1)
})

const totalCitas = computed(() => {
  if (!props.tendencia || props.tendencia.length === 0) return 0
  return props.tendencia.reduce((sum, d) => sum + d.citas, 0)
})

const totalIngresos = computed(() => {
  if (!props.tendencia || props.tendencia.length === 0) return 0
  return props.tendencia.reduce((sum, d) => sum + parseFloat(d.ingresos), 0)
})

const calcularAltura = (valor, max) => {
  if (!valor || !max) return 0
  return (valor / max) * MAX_HEIGHT
}

const formatearFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })
}

const formatearMoneda = (valor) => {
  if (!valor && valor !== 0) return '$0'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor)
}
</script>
