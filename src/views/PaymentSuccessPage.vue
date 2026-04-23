<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full">
      <!-- Loading -->
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Verificando tu pago...</p>
      </div>

      <!-- Formulario datos fiscales -->
      <div v-else-if="mostrarFormFactura">
        <DatosFiscalesForm
          :datos-iniciales="datosIniciales"
          @guardado="onDatosFiscalesGuardados"
          @omitir="onOmitirFactura"
        />
      </div>

      <!-- Success: Módulo -->
      <div v-else-if="estado === 'complete' && tipoCompra === 'modulo'" class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <!-- Icono de éxito -->
        <div class="flex justify-center mb-6">
          <div class="bg-indigo-100 rounded-full p-4">
            <svg class="h-16 w-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">
          ¡Módulo activado!
        </h1>
        <p class="text-center text-lg font-semibold text-indigo-700 mb-2">
          {{ moduloNombre || moduloClave }}
        </p>
        <p class="text-center text-gray-600 mb-8">
          Tienes <strong>7 días gratuitos</strong> para probarlo. El primer cobro se realizará al finalizar el período de prueba.
        </p>

        <!-- Info del pago -->
        <div v-if="customerEmail" class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="font-semibold text-gray-900 mb-4">Detalles de tu módulo</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Módulo:</span>
              <span class="font-medium">{{ moduloNombre || moduloClave }}</span>
            </div>
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

        <!-- Próximos pasos módulo -->
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
          <h3 class="font-semibold text-indigo-900 mb-2">¿Qué sigue?</h3>
          <ul class="space-y-2 text-sm text-indigo-800">
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 flex-shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              El módulo ya está disponible en tu cuenta — puedes usarlo ahora mismo
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 flex-shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Tienes 7 días gratis — el cobro inicia después de ese período
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 flex-shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Puedes cancelar en cualquier momento desde la sección de Módulos
            </li>
          </ul>
        </div>

        <!-- Pregunta de factura -->
        <div class="border border-gray-200 rounded-xl p-5 mb-6">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800 mb-3">¿Requieres factura por este pago?</p>
              <div class="flex gap-3">
                <button
                  @click="solicitarFactura"
                  class="flex-1 border-2 border-indigo-600 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Sí, necesito factura
                </button>
                <button
                  @click="irAModulos"
                  class="flex-1 border-2 border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  No, gracias
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones módulo -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="irAModulos"
            class="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Ver mis módulos
          </button>
          <button
            @click="irAlDashboard"
            class="flex-1 bg-slate-50 text-slate-700 border border-slate-200 py-3 px-6 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>

      <!-- Success: Plan -->
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

        <!-- Siguiente paso plan -->
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
              Puedes agregar módulos adicionales desde el Marketplace
            </li>
          </ul>
        </div>

        <!-- Pregunta de factura -->
        <div class="border border-gray-200 rounded-xl p-5 mb-6">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800 mb-3">¿Requieres factura por este pago?</p>
              <div class="flex gap-3">
                <button
                  @click="solicitarFactura"
                  class="flex-1 border-2 border-indigo-600 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Sí, necesito factura
                </button>
                <button
                  @click="irAlDashboard"
                  class="flex-1 border-2 border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  No, gracias
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones plan -->
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
            Ver módulos adicionales
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
import DatosFiscalesForm from '../components/features/DatosFiscalesForm.vue'
import datosFiscalesService from '../services/datosFiscalesService'

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
const tipoCompra = ref(null)      // 'modulo' | null (plan)
const moduloClave = ref(null)
const moduloNombre = ref(null)

// Factura
const mostrarFormFactura = ref(false)
const datosIniciales = ref(null)
const destinoTrasFactura = ref('dashboard') // a dónde ir después del form

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
    tipoCompra.value = data.tipo || null
    moduloClave.value = data.modulo_clave || null

    // Si el pago fue exitoso, recargar stores para reflejar el nuevo estado
    if (data.status === 'complete') {
      await Promise.all([
        suscripcionStore.cargarInfoSuscripcion(),
        planesStore.cargarTodo(),
        modulosStore.cargarModulos(true),
      ])

      // Obtener nombre del módulo si aplica
      if (data.tipo === 'modulo' && data.modulo_clave) {
        const mod = modulosStore.modulos.find(m => m.clave === data.modulo_clave)
        if (mod) moduloNombre.value = mod.nombre
      }
    }
  } catch (err) {
    error.value = stripeError.value || 'Error al verificar el estado del pago'
  }
})

const irAlDashboard = () => {
  router.push({ name: 'Dashboard' })
}

const irAModulos = () => {
  router.push({ name: 'Marketplace' })
}

const reintentar = () => {
  window.location.reload()
}

const contactarSoporte = () => {
  window.location.href = 'mailto:soporte@citaclick.com.mx'
}

// ─── Factura ────────────────────────────────────────────────────────────────

const solicitarFactura = async () => {
  destinoTrasFactura.value = tipoCompra.value === 'modulo' ? 'modulos' : 'dashboard'
  // Intentar prellenar con datos previos si existen
  try {
    const resp = await datosFiscalesService.obtener()
    datosIniciales.value = resp.data || null
  } catch {
    datosIniciales.value = null
  }
  mostrarFormFactura.value = true
}

const onDatosFiscalesGuardados = () => {
  mostrarFormFactura.value = false
  if (destinoTrasFactura.value === 'modulos') {
    irAModulos()
  } else {
    irAlDashboard()
  }
}

const onOmitirFactura = () => {
  mostrarFormFactura.value = false
  if (destinoTrasFactura.value === 'modulos') {
    irAModulos()
  } else {
    irAlDashboard()
  }
}
</script>
