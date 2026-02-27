<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Ingresos</h3>
      <div class="p-3 bg-green-100 rounded-full">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
    </div>

    <div v-else-if="ingresos" class="space-y-4">
      <!-- Ingreso mensual -->
      <div>
        <p class="text-sm text-gray-600">Este mes</p>
        <p class="text-3xl font-bold text-gray-900">{{ formatearMoneda(ingresos.ingresoMensual) }}</p>
        <div v-if="ingresos.diferenciaMesAnterior" class="flex items-center mt-1">
          <svg
            v-if="ingresos.diferenciaMesAnterior > 0"
            class="w-4 h-4 text-green-500 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <svg
            v-else-if="ingresos.diferenciaMesAnterior < 0"
            class="w-4 h-4 text-red-500 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span
            :class="[
              'text-sm font-medium',
              ingresos.diferenciaMesAnterior > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ formatearPorcentaje(ingresos.diferenciaMesAnterior) }}
          </span>
          <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
        </div>
      </div>

      <!-- Ingreso semanal y diario -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p class="text-xs text-gray-600">Esta semana</p>
          <p class="text-lg font-semibold text-gray-900">{{ formatearMoneda(ingresos.ingresoSemanal) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Promedio/día</p>
          <p class="text-lg font-semibold text-gray-900">{{ formatearMoneda(ingresos.ingresoDiarioPromedio) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <p class="text-sm">No hay datos disponibles</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ingresos: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const formatearMoneda = (valor) => {
  if (!valor && valor !== 0) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(valor)
}

const formatearPorcentaje = (valor) => {
  if (!valor && valor !== 0) return '0%'
  const signo = valor > 0 ? '+' : ''
  return `${signo}${valor.toFixed(1)}%`
}
</script>
