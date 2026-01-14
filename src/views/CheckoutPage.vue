<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Completar pago</h1>
        <p class="text-gray-600">Procesamiento seguro con Stripe</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Cargando checkout seguro...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <svg class="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-red-900">Error al cargar el checkout</h3>
            <p class="text-red-800 mt-1">{{ error }}</p>
            <button
              @click="volverAPlanes"
              class="mt-3 text-sm text-red-700 underline hover:text-red-900"
            >
              Volver a seleccionar plan
            </button>
          </div>
        </div>
      </div>

      <!-- Stripe Embedded Checkout Container -->
      <div v-show="!loading && !error" class="bg-white rounded-lg shadow-xl p-6">
        <div id="checkout" ref="checkoutElement"></div>
      </div>

      <!-- Security badges -->
      <div v-if="!loading && !error" class="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>Pago seguro con Stripe</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Cifrado SSL de 256 bits</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(null)
const checkoutElement = ref(null)

// Stripe Publishable Key (obtener de variables de entorno)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_tu_clave_aqui'

onMounted(async () => {
  try {
    const clientSecret = route.query.clientSecret

    if (!clientSecret) {
      throw new Error('No se proporcionó client secret')
    }

    // Cargar Stripe.js
    const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY)

    if (!stripe) {
      throw new Error('Error al cargar Stripe')
    }

    // Inicializar Stripe Embedded Checkout
    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret,
    })

    // Montar el checkout en el elemento
    checkout.mount('#checkout')

    loading.value = false
  } catch (err) {
    console.error('Error inicializando checkout:', err)
    error.value = err.message
    loading.value = false
  }
})

const volverAPlanes = () => {
  router.push({ name: 'Pricing' })
}
</script>

<style scoped>
#checkout {
  min-height: 400px;
}
</style>
