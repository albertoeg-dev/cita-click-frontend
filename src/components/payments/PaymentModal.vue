<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full transform transition-all">
            <!-- Header -->
            <div class="border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Procesar Pago</h3>
                <button
                  @click="close"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="px-6 py-4">
              <!-- Información de la cita -->
              <div v-if="cita" class="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Detalles de la Cita</h4>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">Cliente:</span> {{ cita.clienteNombre }}</p>
                  <p><span class="font-medium">Servicio:</span> {{ cita.servicioNombre }}</p>
                  <p><span class="font-medium">Fecha:</span> {{ formatearFecha(cita.fechaHora) }}</p>
                  <p><span class="font-medium">Precio:</span> {{ formatearPrecio(cita.precioServicio) }} MXN</p>
                </div>
              </div>

              <!-- Verificación de Stripe Connect -->
              <div v-if="!stripeConnectReady" class="mb-6">
                <div class="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-medium text-yellow-800">Stripe Connect no configurado</h3>
                      <p class="mt-1 text-sm text-yellow-700">
                        Necesitas configurar tu cuenta de Stripe Connect para recibir pagos.
                      </p>
                      <router-link
                        to="/integrations"
                        class="mt-3 inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
                      >
                        Configurar ahora
                        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Formulario de pago -->
              <div v-else-if="!paymentSuccess">
                <form @submit.prevent="procesarPago">
                  <!-- Monto -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Monto a cobrar
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        v-model.number="form.amount"
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        class="input pl-8"
                        placeholder="0.00"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">MXN</span>
                    </div>
                  </div>

                  <!-- Descripción -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Descripción (opcional)
                    </label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="input"
                      placeholder="Pago por servicio de..."
                    ></textarea>
                  </div>

                  <!-- Email del cliente -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email del cliente
                    </label>
                    <input
                      v-model="form.customerEmail"
                      type="email"
                      required
                      class="input"
                      placeholder="cliente@ejemplo.com"
                    />
                  </div>

                  <!-- Detalles del cargo -->
                  <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal:</span>
                        <span class="font-medium text-gray-900">{{ formatearPrecio(form.amount) }} MXN</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Comisión plataforma (5%):</span>
                        <span class="font-medium text-gray-900">{{ formatearPrecio(calcularComision()) }} MXN</span>
                      </div>
                      <div class="border-t border-blue-300 pt-2 flex justify-between">
                        <span class="font-semibold text-gray-900">Recibirás:</span>
                        <span class="font-bold text-blue-600">{{ formatearPrecio(calcularNeto()) }} MXN</span>
                      </div>
                    </div>
                  </div>

                  <!-- Botones -->
                  <div class="flex gap-3 justify-end">
                    <button
                      type="button"
                      @click="close"
                      class="btn-secondary"
                      :disabled="procesando"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="btn-primary"
                      :disabled="procesando || !form.amount || form.amount < 1"
                    >
                      <LoadingSpinner v-if="procesando" size="sm" class="mr-2" />
                      {{ procesando ? 'Procesando...' : 'Crear Solicitud de Pago' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Éxito -->
              <div v-else class="text-center py-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">¡Solicitud de Pago Creada!</h3>
                <p class="text-gray-600 mb-4">
                  Se ha enviado la solicitud de pago al cliente.
                </p>
                <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p class="text-sm text-gray-600 mb-2">Link de pago:</p>
                  <div class="flex items-center gap-2">
                    <input
                      :value="paymentLink"
                      readonly
                      class="input text-sm flex-1"
                    />
                    <button
                      @click="copiarLink"
                      class="btn-secondary text-sm"
                    >
                      {{ copiado ? 'Copiado!' : 'Copiar' }}
                    </button>
                  </div>
                </div>
                <button @click="close" class="btn-primary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import paymentsService from '../../services/paymentsService'
import stripeConnectService from '../../services/stripeConnectService'
import { useToast } from '../../composables/useToast'
import { formatearPrecio } from '../../utils/formatters'
import LoadingSpinner from '../common/LoadingSpinner.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cita: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const toast = useToast()

// Estado
const procesando = ref(false)
const paymentSuccess = ref(false)
const paymentLink = ref('')
const copiado = ref(false)
const stripeConnectReady = ref(false)

// Formulario
const form = ref({
  amount: null,
  description: '',
  customerEmail: ''
})

// Verificar estado de Stripe Connect
const verificarStripeConnect = async () => {
  try {
    const response = await stripeConnectService.getStatus()
    if (response.success && response.data) {
      stripeConnectReady.value = response.data.readyForPayments || false
    }
  } catch (error) {
    console.error('Error al verificar Stripe Connect:', error)
    stripeConnectReady.value = false
  }
}

// Watchers
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    paymentSuccess.value = false
    copiado.value = false

    // Pre-llenar con datos de la cita
    if (props.cita) {
      form.value.amount = props.cita.precioServicio || null
      form.value.description = `Pago por ${props.cita.servicioNombre || 'servicio'}`
      form.value.customerEmail = props.cita.clienteEmail || ''
    } else {
      form.value.amount = null
      form.value.description = ''
      form.value.customerEmail = ''
    }

    await verificarStripeConnect()
  }
})

// Computed
const calcularComision = () => {
  if (!form.value.amount) return 0
  return form.value.amount * 0.05
}

const calcularNeto = () => {
  if (!form.value.amount) return 0
  return form.value.amount - calcularComision()
}

// Methods
const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const procesarPago = async () => {
  if (!form.value.amount || form.value.amount < 1) {
    toast.error('Monto inválido', 'El monto debe ser mayor a $1.00')
    return
  }

  procesando.value = true

  try {
    const payload = {
      usuarioId: authStore.user.id,
      amount: form.value.amount,
      currency: 'mxn',
      customerEmail: form.value.customerEmail,
      customerName: props.cita?.clienteNombre || null,
      description: form.value.description || `Pago por servicio`,
      citaId: props.cita?.id || null,
      platformFeePercentage: 5.0
    }

    const response = await paymentsService.createPayment(payload)

    if (response.success) {
      paymentSuccess.value = true

      // Generar link de pago (en producción esto vendría del backend)
      const clientSecret = response.data.clientSecret
      const paymentId = response.data.paymentId
      paymentLink.value = `${window.location.origin}/pay/${paymentId}?cs=${clientSecret}`

      toast.success('Solicitud creada', 'El cliente puede proceder con el pago')
      emit('success', response.data)
    } else {
      throw new Error(response.message || 'Error al crear el pago')
    }
  } catch (error) {
    console.error('Error al procesar pago:', error)
    toast.error('Error', error.response?.data?.message || error.message || 'No se pudo crear la solicitud de pago')
  } finally {
    procesando.value = false
  }
}

const copiarLink = async () => {
  try {
    await navigator.clipboard.writeText(paymentLink.value)
    copiado.value = true
    toast.success('Copiado', 'Link copiado al portapapeles')
    setTimeout(() => {
      copiado.value = false
    }, 3000)
  } catch (error) {
    console.error('Error al copiar:', error)
    toast.error('Error', 'No se pudo copiar el link')
  }
}

const close = () => {
  if (!procesando.value) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
