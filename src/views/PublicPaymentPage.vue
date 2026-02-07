<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
          CC
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Cita Click</h1>
        <p class="text-gray-600">Pago Seguro</p>
      </div>

      <!-- Loading State -->
      <div v-if="cargando" class="bg-white rounded-lg shadow-xl p-8">
        <div class="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p class="mt-4 text-gray-600">Cargando información del pago...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-xl p-8">
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Error al Cargar el Pago</h3>
          <p class="text-gray-600 mb-6">{{ errorMensaje }}</p>
          <a href="/" class="btn-primary">
            Volver al Inicio
          </a>
        </div>
      </div>

      <!-- Payment Success -->
      <div v-else-if="pagoCompletado" class="bg-white rounded-lg shadow-xl p-8">
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h3>
          <p class="text-gray-600 mb-6">
            Tu pago ha sido procesado correctamente.
          </p>

          <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h4 class="font-semibold text-gray-900 mb-3">Detalles del Pago</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Monto:</span>
                <span class="font-semibold">{{ formatearPrecio(payment.amount) }} {{ payment.currency.toUpperCase() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">ID de Transacción:</span>
                <span class="font-mono text-xs">{{ payment.id }}</span>
              </div>
              <div v-if="payment.description" class="flex justify-between">
                <span class="text-gray-600">Concepto:</span>
                <span>{{ payment.description }}</span>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-6">
            Recibirás un correo de confirmación en breve.
          </p>
        </div>
      </div>

      <!-- Payment Form -->
      <div v-else class="bg-white rounded-lg shadow-xl overflow-hidden">
        <!-- Payment Info -->
        <div class="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h2 class="text-xl font-bold mb-2">Información del Pago</h2>
          <div class="space-y-1 text-sm opacity-90">
            <p v-if="payment.description">
              <span class="font-semibold">Concepto:</span> {{ payment.description }}
            </p>
            <p v-if="payment.customerName">
              <span class="font-semibold">Cliente:</span> {{ payment.customerName }}
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-white/20">
            <p class="text-sm opacity-75">Total a Pagar</p>
            <p class="text-3xl font-bold">{{ formatearPrecio(payment.amount) }} {{ payment.currency.toUpperCase() }}</p>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="p-6">
          <form @submit.prevent="procesarPago">
            <!-- Stripe Payment Element Container -->
            <div id="payment-element" class="mb-6">
              <!-- Stripe Payment Element se montará aquí -->
            </div>

            <!-- Error Message -->
            <div v-if="errorPago" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-red-800">Error al procesar el pago</p>
                  <p class="text-sm text-red-700 mt-1">{{ errorPago }}</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="procesando || !stripeReady"
              class="w-full btn-primary py-4 text-lg font-semibold"
            >
              <LoadingSpinner v-if="procesando" size="sm" class="mr-2" />
              {{ procesando ? 'Procesando...' : `Pagar ${formatearPrecio(payment.amount)} ${payment.currency.toUpperCase()}` }}
            </button>

            <!-- Powered by Stripe -->
            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500">
                Pago seguro procesado por
                <span class="font-semibold text-indigo-600">Stripe</span>
              </p>
              <div class="flex items-center justify-center gap-2 mt-2">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs text-gray-500">Conexión segura SSL</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-600">
          ¿Tienes problemas con el pago?
          <a href="mailto:soporte@citaclick.com" class="text-indigo-600 hover:text-indigo-800 font-medium">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import api from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { formatearPrecio } from '../utils/formatters'

const route = useRoute()

// Estado
const cargando = ref(true)
const error = ref(false)
const errorMensaje = ref('')
const errorPago = ref('')
const procesando = ref(false)
const pagoCompletado = ref(false)
const stripeReady = ref(false)

// Datos del pago
const payment = ref({
  id: '',
  amount: 0,
  currency: 'mxn',
  description: '',
  customerName: '',
  clientSecret: ''
})

// Stripe
let stripe = null
let elements = null
let paymentElement = null

// Inicializar Stripe
const inicializarStripe = async () => {
  try {
    // Cargar Stripe (usa tu clave pública)
    // IMPORTANTE: Cambiar a clave de producción en producción
    stripe = await loadStripe('pk_test_51QZLcNP7lLM2TT73VuiJgLCADlJJ4LvxiDKJ3GQJBB7FGkgQMYO8IYIKjMWQ7Tg2LXhMIgjfxFLqxIBUJlRjlpOl00Wyk5lE7g')

    if (!stripe) {
      throw new Error('No se pudo cargar Stripe')
    }

    // Crear Elements instance
    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      }
    }

    elements = stripe.elements({
      clientSecret: payment.value.clientSecret,
      appearance
    })

    // Crear y montar Payment Element
    paymentElement = elements.create('payment', {
      layout: 'tabs'
    })

    paymentElement.mount('#payment-element')

    paymentElement.on('ready', () => {
      stripeReady.value = true
    })

    paymentElement.on('change', (event) => {
      if (event.error) {
        errorPago.value = event.error.message
      } else {
        errorPago.value = ''
      }
    })

  } catch (err) {
    console.error('[PublicPayment] Error al inicializar Stripe:', err)
    error.value = true
    errorMensaje.value = 'No se pudo inicializar el sistema de pagos'
  }
}

// Cargar información del pago
const cargarPago = async () => {
  cargando.value = true
  error.value = false

  try {
    const paymentId = route.params.paymentId
    const clientSecret = route.query.cs

    if (!paymentId || !clientSecret) {
      throw new Error('Información de pago incompleta')
    }

    // En un caso real, harías una llamada al backend para obtener los detalles del pago
    // Por ahora, usamos el clientSecret del query param
    payment.value = {
      id: paymentId,
      amount: 0, // Se obtendrá del backend
      currency: 'mxn',
      description: '',
      customerName: '',
      clientSecret: clientSecret
    }

    // Obtener detalles del pago desde el backend
    const response = await api.get(`/v1/payments/${paymentId}`, {
      // Esta llamada no requiere autenticación para permitir que el cliente final pague
      headers: {
        'X-Public-Payment': 'true'
      }
    })

    if (response.data.success) {
      const paymentData = response.data.data
      payment.value = {
        id: paymentData.id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description || 'Pago de servicio',
        customerName: paymentData.customerName || '',
        clientSecret: clientSecret
      }

      // Verificar si el pago ya fue completado
      if (paymentData.status === 'SUCCESS' || paymentData.status === 'SUCCEEDED') {
        pagoCompletado.value = true
        cargando.value = false
        return
      }

      // Inicializar Stripe
      await inicializarStripe()
    } else {
      throw new Error(response.data.message || 'No se pudo cargar el pago')
    }

  } catch (err) {
    console.error('[PublicPayment] Error al cargar pago:', err)
    error.value = true
    errorMensaje.value = err.response?.data?.message || err.message || 'No se pudo cargar la información del pago'
  } finally {
    cargando.value = false
  }
}

// Procesar pago
const procesarPago = async () => {
  if (!stripe || !elements) {
    errorPago.value = 'Sistema de pagos no inicializado'
    return
  }

  procesando.value = true
  errorPago.value = ''

  try {
    // Confirmar el pago con Stripe
    const { error: submitError } = await elements.submit()

    if (submitError) {
      throw submitError
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?payment_id=${payment.value.id}`,
      },
      redirect: 'if_required'
    })

    if (confirmError) {
      throw confirmError
    }

    // Si llegamos aquí sin redirección, el pago fue exitoso
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      pagoCompletado.value = true
    }

  } catch (err) {
    console.error('[PublicPayment] Error al procesar pago:', err)
    errorPago.value = err.message || 'No se pudo procesar el pago. Por favor, intenta nuevamente.'
  } finally {
    procesando.value = false
  }
}

onMounted(async () => {
  await cargarPago()
})
</script>

<style scoped>
/* Estilos para el Payment Element de Stripe */
#payment-element {
  min-height: 200px;
}

/* Animación de carga */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeIn 0.3s ease-out;
}
</style>
