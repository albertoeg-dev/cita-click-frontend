<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
      <!-- Logo o iniciales -->
      <div
        v-if="negocio.logoUrl"
        class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
      >
        <img :src="negocio.logoUrl" :alt="negocio.nombre" class="w-full h-full object-cover" />
      </div>
      <div
        v-else
        class="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0"
      >
        <span class="text-2xl font-bold text-white">
          {{ iniciales }}
        </span>
      </div>

      <!-- Nombre y descripción -->
      <div class="min-w-0">
        <h1 class="text-xl font-bold text-gray-900 truncate">{{ negocio.nombre }}</h1>
        <p v-if="negocio.descripcion" class="text-sm text-gray-500 mt-0.5 line-clamp-2">
          {{ negocio.descripcion }}
        </p>
        <div class="flex items-center gap-3 mt-1">
          <span v-if="negocio.ciudad" class="text-xs text-gray-400 flex items-center gap-1">
            📍 {{ negocio.ciudad }}
          </span>
          <span v-if="negocio.telefono" class="text-xs text-gray-400 flex items-center gap-1">
            📞 {{ negocio.telefono }}
          </span>
        </div>
      </div>
    </div>

    <!-- Breadcrumb de "Agendar cita" -->
    <div class="bg-indigo-600">
      <div class="max-w-4xl mx-auto px-4 py-2">
        <p class="text-indigo-100 text-sm font-medium text-center">
          📅 Reserva tu cita en línea — Es gratis y solo toma un minuto
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  negocio: {
    type: Object,
    required: true,
  },
})

const iniciales = computed(() => {
  if (!props.negocio.nombre) return '?'
  return props.negocio.nombre
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
})
</script>
