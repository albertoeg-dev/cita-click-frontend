<template>
  <div>
    <div v-if="servicios.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-lg">Este negocio no tiene servicios disponibles en este momento.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <button
        v-for="servicio in servicios"
        :key="servicio.id"
        @click="toggleServicio(servicio)"
        :class="[
          'text-left p-4 rounded-xl border-2 transition-all duration-150 focus:outline-none',
          estaSeleccionado(servicio)
            ? 'border-indigo-600 bg-indigo-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
        ]"
      >
        <div class="flex justify-between items-start gap-2">
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-gray-900 text-sm">{{ servicio.nombre }}</h3>
            <p v-if="servicio.descripcion" class="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {{ servicio.descripcion }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-xs text-gray-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ servicio.duracionMinutos }} min
              </span>
              <span v-if="servicio.precio" class="text-xs font-medium text-indigo-600">
                ${{ formatPrecio(servicio.precio) }}
              </span>
              <span v-else class="text-xs text-green-600 font-medium">
                Gratis
              </span>
            </div>
          </div>
          <!-- Check icon -->
          <div
            :class="[
              'w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors',
              estaSeleccionado(servicio)
                ? 'bg-indigo-600 border-indigo-600'
                : 'border-gray-300'
            ]"
          >
            <svg v-if="estaSeleccionado(servicio)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </button>
    </div>

    <!-- Resumen de selección -->
    <div
      v-if="seleccionados.length > 0"
      class="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-indigo-900">
            {{ seleccionados.length }} servicio{{ seleccionados.length !== 1 ? 's' : '' }} seleccionado{{ seleccionados.length !== 1 ? 's' : '' }}
          </p>
          <p class="text-xs text-indigo-600 mt-0.5">
            Duración total: {{ duracionTotal }} min
            <span v-if="precioTotal > 0"> · Total: ${{ formatPrecio(precioTotal) }}</span>
          </p>
        </div>
        <button
          @click="$emit('continuar')"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Continuar →
        </button>
      </div>
    </div>

    <!-- Botón continuar si hay selección pero no es visible arriba -->
    <div v-else class="text-center py-4">
      <p class="text-sm text-gray-400">Selecciona al menos un servicio para continuar</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  servicios: {
    type: Array,
    required: true,
  },
  seleccionados: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:seleccionados', 'continuar'])

function estaSeleccionado(servicio) {
  return props.seleccionados.some(s => s.id === servicio.id)
}

function toggleServicio(servicio) {
  const yaSeleccionado = estaSeleccionado(servicio)
  if (yaSeleccionado) {
    emit('update:seleccionados', props.seleccionados.filter(s => s.id !== servicio.id))
  } else {
    emit('update:seleccionados', [...props.seleccionados, servicio])
  }
}

const duracionTotal = computed(() =>
  props.seleccionados.reduce((sum, s) => sum + (s.duracionMinutos || 0), 0)
)

const precioTotal = computed(() =>
  props.seleccionados.reduce((sum, s) => sum + parseFloat(s.precio || 0), 0)
)

function formatPrecio(precio) {
  return parseFloat(precio).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
</script>
