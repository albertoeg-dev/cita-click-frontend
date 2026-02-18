<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <router-link to="/planes" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a planes
        </router-link>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Confirmar Suscripción</h1>
        <p class="text-xl text-gray-600">Estás a un paso de mejorar tu negocio</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="text-center">
          <LoadingSpinner size="lg" />
          <p class="mt-4 text-gray-600">Cargando información del plan...</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="planSeleccionado" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Plan Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Plan Summary Card -->
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-100">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm opacity-90 mb-1">Plan Seleccionado</p>
                  <h2 class="text-3xl font-bold">{{ planSeleccionado.nombre }}</h2>
                  <p class="mt-2 opacity-90">{{ planSeleccionado.descripcion }}</p>
                </div>
                <div class="text-right">
                  <p class="text-4xl font-bold">${{ planSeleccionado.precio }}</p>
                  <p class="text-sm opacity-75">{{ planSeleccionado.moneda }}/mes</p>
                </div>
              </div>
            </div>

            <!-- Características -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Todo lo que incluye:
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(caracteristica, index) in planSeleccionado.caracteristicas"
                  :key="index"
                  class="flex items-start"
                >
                  <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-gray-700">{{ caracteristica }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Billing Info -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Información de Facturación
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Frecuencia de cobro:</span>
                <span class="font-medium text-gray-900">Mensual</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Próximo cobro:</span>
                <span class="font-medium text-gray-900">{{ fechaProximoCobro }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Cancelación:</span>
                <span class="font-medium text-gray-900">En cualquier momento</span>
              </div>
            </div>

            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-blue-900">
                  Tu suscripción se renovará automáticamente cada mes. Puedes cancelar en cualquier momento desde tu panel de control.
                </p>
              </div>
            </div>
          </div>

          <!-- Security Features -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Pago Seguro</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">SSL Seguro</p>
                  <p class="text-xs text-gray-500">Cifrado 256-bit</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">PCI Compliant</p>
                  <p class="text-xs text-gray-500">Estándar bancario</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Datos Protegidos</p>
                  <p class="text-xs text-gray-500">No guardamos tarjetas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary & CTA -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Resumen del Pedido</h3>

            <!-- Price Breakdown -->
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Plan {{ planSeleccionado.nombre }}</span>
                <span class="font-medium text-gray-900">${{ planSeleccionado.precio }}</span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Período de prueba</span>
                <span class="font-medium text-green-600">7 días gratis</span>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between items-baseline">
                  <span class="text-sm text-gray-600">Precio mensual</span>
                  <div class="text-right">
                    <p class="text-3xl font-bold text-indigo-600">${{ planSeleccionado.precio }}</p>
                    <p class="text-xs text-gray-500 mt-1">por mes</p>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-semibold text-green-900">7 días de prueba gratis</p>
                </div>
                <p class="text-xs text-green-800 ml-7">
                  Tu tarjeta será cargada después del período de prueba
                </p>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Primer cobro:</span>
                  <span class="font-semibold text-gray-900">{{ calcularFechaPrimerCobro() }}</span>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <button
              @click="procederAlPago"
              :disabled="procesando"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <span v-if="procesando" class="flex items-center justify-center">
                <LoadingSpinner size="sm" class="mr-2" />
                Procesando...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Proceder al Pago Seguro
              </span>
            </button>

            <!-- Trust badges -->
            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500 mb-3">Procesado por</p>
              <div class="flex items-center justify-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" class="h-6 opacity-60" />
              </div>
            </div>

            <!-- Guarantee -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Garantía 100%</p>
                  <p class="text-xs text-gray-600 mt-1">
                    Cancela cuando quieras, sin preguntas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '../composables/useToast'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import pagoService from '../services/pagoService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Estado
const loading = ref(true)
const procesando = ref(false)
const planSeleccionado = ref(null)

// Computed
const fechaProximoCobro = computed(() => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 7) // 7 días de prueba
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

// Cargar plan seleccionado
const cargarPlan = async () => {
  loading.value = true

  try {
    const planId = route.params.planId || route.query.plan

    if (!planId) {
      throw new Error('No se especificó un plan')
    }

    // Obtener planes disponibles
    const response = await pagoService.obtenerPlanes()

    if (response.success) {
      planSeleccionado.value = response.data.find(p => p.id === planId)

      if (!planSeleccionado.value) {
        throw new Error('Plan no encontrado')
      }
    } else {
      throw new Error(response.message || 'Error al cargar planes')
    }

  } catch (error) {
    console.error('[SubscriptionCheckout] Error al cargar plan:', error)
    toast.error('Error', error.message || 'No se pudo cargar el plan seleccionado')

    // Redirigir a página de planes
    setTimeout(() => {
      router.push({ name: 'Pricing' })
    }, 2000)
  } finally {
    loading.value = false
  }
}

// Calcular fecha del primer cobro (7 días después)
const calcularFechaPrimerCobro = () => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 7)

  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return fecha.toLocaleDateString('es-MX', opciones)
}

// Proceder al pago
const procederAlPago = async () => {
  procesando.value = true

  try {
    // Crear sesión de checkout
    const response = await pagoService.crearCheckout({
      plan: planSeleccionado.value.id
    })

    if (response.success) {
      const checkoutData = response.data

      // Redirigir al Stripe Hosted Checkout
      if (checkoutData.url) {
        window.location.href = checkoutData.url
      } else {
        throw new Error('No se recibió URL de checkout')
      }
    } else {
      throw new Error(response.message || 'Error al crear sesión de pago')
    }

  } catch (error) {
    console.error('[SubscriptionCheckout] Error al proceder al pago:', error)
    toast.error('Error', error.response?.data?.message || error.message || 'No se pudo iniciar el proceso de pago')
    procesando.value = false
  }
}

onMounted(() => {
  cargarPlan()
})
</script>
