<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Citas</h3>
      <div class="p-3 bg-indigo-100 rounded-full">
        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="citas" class="space-y-4">
      <!-- Total del mes -->
      <div>
        <p class="text-sm text-gray-600">Este mes</p>
        <p class="text-3xl font-bold text-gray-900">{{ citas.totalMes }}</p>
        <p class="text-xs text-gray-500 mt-1">citas programadas</p>
      </div>

      <!-- Semana y hoy -->
      <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p class="text-xs text-gray-600">Esta semana</p>
          <p class="text-2xl font-semibold text-gray-900">{{ citas.totalSemana }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Hoy</p>
          <p class="text-2xl font-semibold text-gray-900">{{ citas.totalHoy }}</p>
        </div>
      </div>

      <!-- Estadísticas de demanda -->
      <div v-if="citas.diaMayorDemanda || citas.horaMayorDemanda" class="pt-4 border-t border-gray-200">
        <p class="text-xs font-semibold text-gray-700 mb-2">Mayor demanda</p>
        <div class="grid grid-cols-2 gap-4">
          <div v-if="citas.diaMayorDemanda">
            <p class="text-xs text-gray-600">Día</p>
            <p class="text-sm font-medium text-indigo-600">{{ citas.diaMayorDemanda }}</p>
          </div>
          <div v-if="citas.horaMayorDemanda">
            <p class="text-xs text-gray-600">Hora</p>
            <p class="text-sm font-medium text-indigo-600">{{ citas.horaMayorDemanda }}</p>
          </div>
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
  citas: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
