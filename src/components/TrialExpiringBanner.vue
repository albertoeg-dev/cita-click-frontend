<template>
  <!-- Banner de aviso de trial expirando -->
  <div
    v-if="mostrarBanner"
    class="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg"
  >
    <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <span class="flex p-2 rounded-lg bg-white bg-opacity-20">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p class="ml-3 font-medium text-white truncate">
            <span class="md:hidden">
              ⏰ ¡Te queda{{ diasRestantes === 1 ? '' : 'n' }} {{ diasRestantes }} día{{ diasRestantes === 1 ? '' : 's' }} de prueba!
            </span>
            <span class="hidden md:inline">
              ⏰ Tu período de prueba termina
              <template v-if="diasRestantes === 1">mañana.</template>
              <template v-else>en {{ diasRestantes }} días.</template>
              Activa tu suscripción para continuar sin interrupciones.
            </span>
          </p>
        </div>
        <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <router-link
            to="/planes"
            class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-600 bg-white hover:bg-orange-50 transition-colors"
          >
            Activar Plan
          </router-link>
        </div>
        <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button
            type="button"
            @click="cerrarBanner"
            class="-mr-1 flex p-2 rounded-md hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
          >
            <span class="sr-only">Cerrar</span>
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuscripcionStore } from '../stores/suscripcionStore'

const suscripcionStore = useSuscripcionStore()
const bannerCerrado = ref(false)

// Carga información de suscripción si aún no está disponible
onMounted(async () => {
  // Respetar si el usuario ya cerró el banner hoy
  const cerradoHoy = localStorage.getItem('trial-banner-closed')
  if (cerradoHoy === new Date().toDateString()) {
    bannerCerrado.value = true
    return
  }

  // Cargar datos de suscripción si no están cargados
  if (!suscripcionStore.info) {
    try {
      await suscripcionStore.cargarInfoSuscripcion()
    } catch {
      // Silencioso: si falla la carga no mostramos el banner
    }
  }
})

// Días restantes de prueba (desde el store, siempre fresco del backend)
const diasRestantes = computed(() => {
  return suscripcionStore.info?.diasRestantesPrueba ?? 0
})

// Mostrar banner solo si:
// 1. No está cerrado manualmente
// 2. El negocio está en período de prueba
// 3. Quedan 2 días o menos (y al menos 1 día)
const mostrarBanner = computed(() => {
  if (bannerCerrado.value) return false
  if (!suscripcionStore.info) return false

  const enPrueba = suscripcionStore.info.enPeriodoPrueba
  const dias = diasRestantes.value

  return enPrueba && dias >= 1 && dias <= 2
})

const cerrarBanner = () => {
  bannerCerrado.value = true
  // Guardar en localStorage para que no vuelva a aparecer hoy
  localStorage.setItem('trial-banner-closed', new Date().toDateString())
}
</script>
