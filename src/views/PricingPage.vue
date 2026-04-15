<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Elige el plan perfecto para tu negocio
        </h1>
        <p class="text-base sm:text-xl text-gray-600">
          Comienza con 7 días de prueba gratis, sin tarjeta de crédito
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Planes -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="plan in planes"
          :key="plan.id"
          class="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
          :class="{ 'ring-2 ring-blue-600 scale-105': plan.popular }"
        >
          <!-- Badge "Más Popular" -->
          <div v-if="plan.popular" class="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
            Más Popular
          </div>

          <div class="p-4 sm:p-8">
            <!-- Nombre del plan -->
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.nombre }}</h3>
            <p class="text-gray-600 mb-6">{{ plan.descripcion }}</p>

            <!-- Precio -->
            <div class="mb-6">
              <span class="text-3xl sm:text-5xl font-bold text-gray-900">${{ plan.precio }}</span>
              <span class="text-gray-600 ml-2">{{ plan.moneda }}/mes</span>
            </div>

            <!-- Botón -->
            <button
              @click="seleccionarPlan(plan.id)"
              :disabled="procesandoPlan === plan.id"
              class="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200"
              :class="plan.popular
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-800 hover:bg-gray-900'"
            >
              <span v-if="procesandoPlan === plan.id">
                Procesando...
              </span>
              <span v-else>
                Comenzar ahora
              </span>
            </button>

            <!-- Características -->
            <div class="mt-8 space-y-4">
              <p class="text-sm font-semibold text-gray-900 mb-3">Características incluidas:</p>
              <ul class="space-y-3">
                <li
                  v-for="(caracteristica, index) in plan.caracteristicas"
                  :key="index"
                  class="flex items-start"
                >
                  <svg class="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">{{ caracteristica }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Garantía -->
      <div class="mt-16 text-center">
        <div class="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-green-50 px-6 sm:px-8 py-4 rounded-2xl sm:rounded-full">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <div class="text-left">
            <p class="font-semibold text-gray-900">Garantía de satisfacción</p>
            <p class="text-sm text-gray-600">Cancela en cualquier momento, sin compromisos</p>
          </div>
        </div>
      </div>

      <!-- FAQ Rápido -->
      <div class="mt-16 max-w-3xl mx-auto">
        <h3 class="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h3>
        <div class="space-y-4">
          <details class="bg-white p-6 rounded-lg shadow">
            <summary class="font-semibold cursor-pointer">¿Puedo cambiar de plan después?</summary>
            <p class="mt-3 text-gray-600">Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu panel de control.</p>
          </details>
          <details class="bg-white p-6 rounded-lg shadow">
            <summary class="font-semibold cursor-pointer">¿Qué métodos de pago aceptan?</summary>
            <p class="mt-3 text-gray-600">Aceptamos tarjetas de crédito/débito, OXXO y transferencia SPEI a través de Stripe.</p>
          </details>
          <details class="bg-white p-6 rounded-lg shadow">
            <summary class="font-semibold cursor-pointer">¿Hay contrato o permanencia?</summary>
            <p class="mt-3 text-gray-600">No, todos nuestros planes son sin contrato. Puedes cancelar cuando quieras.</p>
          </details>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStripe } from '../composables/useStripe'
import DashboardLayout from '../components/layout/DashboardLayout.vue'

const router = useRouter()
const { loading, error, obtenerPlanes, crearCheckoutSession } = useStripe()

const planes = ref([])
const procesandoPlan = ref(null)

onMounted(async () => {
  try {
    planes.value = await obtenerPlanes()
  } catch (err) {
    console.error('Error cargando planes:', err)
  }
})

const seleccionarPlan = async (planId) => {
  procesandoPlan.value = planId

  try {
    // Redirigir a la página de confirmación de suscripción
    router.push({
      name: 'SubscriptionCheckout',
      params: { planId },
      query: { plan: planId }
    })
  } catch (err) {
    console.error('Error seleccionando plan:', err)
    procesandoPlan.value = null
  }
}
</script>

<style scoped>
details summary::-webkit-details-marker {
  display: none;
}

details summary::marker {
  display: none;
}

details[open] summary {
  margin-bottom: 0.5rem;
}
</style>
