<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full">
      <!-- Loading -->
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Verificando tu pago...</p>
      </div>

      <!-- Success -->
      <div v-else-if="estado === 'complete'" class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <!-- Icono de éxito -->
        <div class="flex justify-center mb-6">
          <div class="bg-green-100 rounded-full p-4">
            <svg class="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Mensaje -->
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-4">
          ¡Pago exitoso!
        </h1>
        <p class="text-center text-gray-600 mb-8">
          Tu suscripción ha sido activada correctamente. Ya puedes disfrutar de todas las funciones de Cita Click.
        </p>

        <!-- Información del pago -->
        <div v-if="customerEmail" class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="font-semibold text-gray-900 mb-4">Detalles de tu compra</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Email de confirmación:</span>
              <span class="font-medium">{{ customerEmail }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">ID de sesión:</span>
              <span class="font-mono text-xs">{{ sessionId.substring(0, 20) }}...</span>
            </div>
          </div>
        </div>

        <!-- Siguiente paso -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 class="font-semibold text-blue-900 mb-2">¿Qué sigue?</h3>
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Recibirás un email de confirmación de Stripe
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Tu cuenta ha sido actualizada con las nuevas funcionalidades
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Puedes ver tu historial de pagos en tu perfil
            </li>
          </ul>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="irAlDashboard"
            class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ir al Dashboard
          </button>
          <button
            @click="irAModulos"
            class="flex-1 bg-indigo-50 text-indigo-700 border border-indigo-200 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
          >
            Ver mis módulos
          </button>
        </div>
      </div>

      <!-- Pending (OXXO, SPEI) -->
      <div v-else-if="estado === 'open'" class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div class="flex justify-center mb-6">
          <div class="bg-yellow-100 rounded-full p-4">
            <svg class="h-16 w-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-center text-gray-900 mb-4">
          Pago pendiente
        </h1>
        <p class="text-center text-gray-600 mb-8">
          Tu orden de pago ha sido creada. Una vez que se confirme el pago, activaremos tu suscripción automáticamente.
        </p>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 class="font-semibold text-yellow-900 mb-2">Instrucciones de pago</h3>
          <p class="text-sm text-yellow-800">
            Revisa tu email para obtener las instrucciones de pago. Te notificaremos cuando recibamos tu pago.
          </p>
        </div>

        <button
          @click="irAlDashboard"
          class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Entendido, ir al Dashboard
        </button>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div class="flex justify-center mb-6">
          <div class="bg-red-100 rounded-full p-4">
            <svg class="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-center text-gray-900 mb-4">
          Error al verificar el pago
        </h1>
        <p class="text-center text-gray-600 mb-8">
          {{ error }}
        </p>

        <div class="flex gap-4">
          <button
            @click="reintentar"
            class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
          <button
            @click="contactarSoporte"
            class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Contactar soporte
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStripe } from '../composables/useStripe'
import { useSuscripcionStore } from '../stores/suscripcionStore'
import { usePlanesStore } from '../stores/planesStore'
import { useModulosStore } from '../stores/modulosStore'

const route = useRoute()
const router = useRouter()
const { loading, error: stripeError, obtenerEstadoSesion } = useStripe()
const suscripcionStore = useSuscripcionStore()
const planesStore = usePlanesStore()
const modulosStore = useModulosStore()

const estado = ref(null)
const customerEmail = ref(null)
const sessionId = ref(null)
const error = ref(null)

onMounted(async () => {
  sessionId.value = route.query.session_id

  if (!sessionId.value) {
    error.value = 'No se proporcionó ID de sesión'
    loading.value = false
    return
  }

  try {
    const data = await obtenerEstadoSesion(sessionId.value)
    estado.value = data.status
    customerEmail.value = data.customer_email

    // Si el pago fue exitoso, recargar la info de suscripción y límites del plan
    // para que el dashboard refleje el nuevo plan inmediatamente
    if (data.status === 'complete') {
      await Promise.all([
        suscripcionStore.cargarInfoSuscripcion(),
        planesStore.cargarTodo(),
        modulosStore.cargarModulos(true),   // refresca módulos (plan o módulo individual)
      ])
    }
  } catch (err) {
    error.value = stripeError.value || 'Error al verificar el estado del pago'
  }
})

const irAlDashboard = () => {
  router.push({ name: 'Dashboard' })
}

const verHistorial = () => {
  router.push({ name: 'PaymentHistory' })
}

const irAModulos = () => {
  router.push({ name: 'Marketplace' })
}

const reintentar = () => {
  window.location.reload()
}

const contactarSoporte = () => {
  // Implementar según tu sistema de soporte
  window.location.href = 'mailto:soporte@citaclick.com.mx'
}
</script>
