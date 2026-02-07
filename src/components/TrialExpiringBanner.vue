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
              ⏰ ¡Te quedan {{ diasRestantes }} días de prueba!
            </span>
            <span class="hidden md:inline">
              ⏰ Tu período de prueba termina en {{ diasRestantes }} día{{ diasRestantes > 1 ? 's' : '' }}. Registra tu tarjeta para continuar sin interrupciones.
            </span>
          </p>
        </div>
        <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <router-link
            to="/pricing"
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
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const bannerCerrado = ref(false)
const diasRestantes = ref(0)
const fechaFinTrial = ref(null)

// Calcular días restantes de trial
const calcularDiasRestantes = () => {
  if (!authStore.user?.trialEndsAt) {
    return 0
  }

  fechaFinTrial.value = new Date(authStore.user.trialEndsAt)
  const ahora = new Date()
  const diferencia = fechaFinTrial.value - ahora
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24))

  return Math.max(0, dias)
}

// Mostrar banner solo si:
// 1. No está cerrado manualmente
// 2. El usuario está en trial
// 3. Quedan 2 días o menos
const mostrarBanner = computed(() => {
  if (bannerCerrado.value) return false
  if (!authStore.user) return false
  if (authStore.user.trialUsed === false) return false // Ya usó trial
  if (!authStore.user.trialEndsAt) return false

  const dias = calcularDiasRestantes()
  diasRestantes.value = dias

  // Mostrar solo cuando falten 2 días o menos
  return dias > 0 && dias <= 2
})

const cerrarBanner = () => {
  bannerCerrado.value = true
  // Guardar en localStorage para que no vuelva a aparecer hoy
  localStorage.setItem('trial-banner-closed', new Date().toDateString())
}

onMounted(() => {
  // Verificar si ya cerró el banner hoy
  const cerradoHoy = localStorage.getItem('trial-banner-closed')
  if (cerradoHoy === new Date().toDateString()) {
    bannerCerrado.value = true
  }

  // Calcular días restantes inicialmente
  diasRestantes.value = calcularDiasRestantes()
})
</script>
