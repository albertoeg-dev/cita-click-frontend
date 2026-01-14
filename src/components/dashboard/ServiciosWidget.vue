<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Servicios Más Solicitados</h3>
      <div class="p-3 bg-purple-100 rounded-full">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
    </div>

    <div v-else-if="servicios && servicios.serviciosMasSolicitados?.length > 0" class="space-y-3">
      <div
        v-for="(servicio, index) in servicios.serviciosMasSolicitados"
        :key="servicio.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center space-x-3 flex-1">
          <!-- Posición -->
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
              index === 0 ? 'bg-yellow-100 text-yellow-700' :
              index === 1 ? 'bg-gray-100 text-gray-700' :
              index === 2 ? 'bg-orange-100 text-orange-700' :
              'bg-purple-100 text-purple-700'
            ]"
          >
            {{ index + 1 }}
          </div>

          <!-- Info del servicio -->
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ servicio.nombre }}</p>
            <p class="text-xs text-gray-600">{{ servicio.cantidadCitas }} citas</p>
          </div>

          <!-- Ingreso generado -->
          <div class="text-right">
            <p class="text-sm font-semibold text-green-600">{{ formatearMoneda(servicio.ingresoGenerado) }}</p>
          </div>
        </div>
      </div>

      <!-- Total de servicios activos -->
      <div v-if="servicios.totalServiciosActivos" class="pt-3 border-t border-gray-200">
        <p class="text-xs text-gray-600">
          Total de servicios activos:
          <span class="font-semibold text-gray-900">{{ servicios.totalServiciosActivos }}</span>
        </p>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
      </svg>
      <p class="text-sm">No hay servicios con citas completadas</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  servicios: {
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
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor)
}
</script>
