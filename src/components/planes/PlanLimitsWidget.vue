<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Uso del Plan</h3>
      <span class="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
        {{ planesStore.nombrePlan }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="planesStore.loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="text-sm text-gray-500 mt-2">Cargando información del plan...</p>
    </div>

    <!-- Error -->
    <div v-else-if="planesStore.error" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-sm text-gray-600 mt-2">{{ planesStore.error }}</p>
      <button
        @click="planesStore.cargarUso()"
        class="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="planesStore.uso" class="space-y-4">
      <!-- Usuarios -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Usuarios</span>
          <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeUsuarios)" class="text-sm font-semibold">
            {{ planesStore.uso.totalUsuarios }} / {{ planesStore.formatearLimite(planesStore.uso.limiteUsuarios) }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeUsuarios)"
            class="h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(planesStore.uso.porcentajeUsuarios, 100)}%` }"
          ></div>
        </div>
        <p v-if="planesStore.uso.limiteUsuarios !== -1" class="text-xs text-gray-500 mt-1">
          {{ planesStore.uso.porcentajeUsuarios.toFixed(1) }}% utilizado
        </p>
      </div>

      <!-- Clientes -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Clientes</span>
          <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeClientes)" class="text-sm font-semibold">
            {{ planesStore.uso.totalClientes }} / {{ planesStore.formatearLimite(planesStore.uso.limiteClientes) }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeClientes)"
            class="h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(planesStore.uso.porcentajeClientes, 100)}%` }"
          ></div>
        </div>
        <p v-if="planesStore.uso.limiteClientes !== -1" class="text-xs text-gray-500 mt-1">
          {{ planesStore.uso.porcentajeClientes.toFixed(1) }}% utilizado
        </p>
      </div>

      <!-- Citas del Mes -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Citas este mes</span>
          <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeCitasMes)" class="text-sm font-semibold">
            {{ planesStore.uso.totalCitasMes }} / {{ planesStore.formatearLimite(planesStore.uso.limiteCitasMes) }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeCitasMes)"
            class="h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(planesStore.uso.porcentajeCitasMes, 100)}%` }"
          ></div>
        </div>
        <p v-if="planesStore.uso.limiteCitasMes !== -1" class="text-xs text-gray-500 mt-1">
          {{ planesStore.uso.porcentajeCitasMes.toFixed(1) }}% utilizado
        </p>
      </div>

      <!-- Servicios -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Servicios</span>
          <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeServicios)" class="text-sm font-semibold">
            {{ planesStore.uso.totalServicios }} / {{ planesStore.formatearLimite(planesStore.uso.limiteServicios) }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeServicios)"
            class="h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(planesStore.uso.porcentajeServicios, 100)}%` }"
          ></div>
        </div>
        <p v-if="planesStore.uso.limiteServicios !== -1" class="text-xs text-gray-500 mt-1">
          {{ planesStore.uso.porcentajeServicios.toFixed(1) }}% utilizado
        </p>
      </div>

      <!-- Alert si hay alguna advertencia -->
      <div v-if="planesStore.tieneAlerta" class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
        <div class="flex">
          <svg class="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <p class="text-sm text-orange-700 font-medium">
              Estás cerca del límite
            </p>
            <router-link to="/planes" class="text-sm text-orange-700 underline mt-1 inline-block">
              Actualizar plan
            </router-link>
          </div>
        </div>
      </div>

      <!-- Botón Ver Detalles -->
      <div class="pt-4 border-t border-gray-200">
        <router-link
          to="/planes"
          class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ver detalles del plan
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePlanesStore } from '@/stores/planesStore'

const planesStore = usePlanesStore()

onMounted(() => {
  planesStore.cargarUso()
})
</script>
