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
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {{ negocio.ciudad }}
          </span>
          <span v-if="negocio.telefono" class="text-xs text-gray-400 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            {{ negocio.telefono }}
          </span>
        </div>
      </div>
    </div>

    <!-- Breadcrumb de "Agendar cita" -->
    <div class="bg-indigo-600">
      <div class="max-w-4xl mx-auto px-4 py-2">
        <p class="text-indigo-100 text-sm font-medium text-center">
          <svg class="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Reserva tu cita en línea — Es gratis y solo toma un minuto
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
