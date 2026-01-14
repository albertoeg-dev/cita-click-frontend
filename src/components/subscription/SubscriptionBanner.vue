<template>
  <div v-if="showBanner" :class="bannerClass">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-4">
        <!-- Icon -->
        <div :class="iconWrapperClass">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="suscripcion?.estadoPago === 'vencido'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            <path v-else-if="needsUrgentAttention" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>

        <!-- Message -->
        <div>
          <p class="text-sm font-semibold" :class="textClass">
            {{ bannerMessage }}
          </p>
          <p v-if="showDetails" class="text-xs mt-1" :class="subTextClass">
            Plan: <span class="font-medium">{{ planName }}</span>
            <span v-if="suscripcion?.enPeriodoPrueba"> • Período de prueba</span>
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          v-if="showPaymentButton"
          @click="goToPayment"
          class="px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          Realizar pago
        </button>
        <button
          v-if="!suscripcion?.enPeriodoPrueba && suscripcion?.cuentaActiva"
          @click="viewSubscription"
          class="px-4 py-2 bg-opacity-20 bg-white hover:bg-opacity-30 rounded-lg font-medium text-sm transition-colors"
          :class="textClass"
        >
          Ver detalles
        </button>
        <button
          @click="dismissBanner"
          class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSuscripcionStore } from '../../stores/suscripcionStore'

const router = useRouter()
const suscripcionStore = useSuscripcionStore()
const dismissed = ref(false)

// Cargar información de suscripción al montar
onMounted(() => {
  suscripcionStore.cargarInfoSuscripcion()
})

const suscripcion = computed(() => suscripcionStore.info)

// Generar mensaje del banner basado en el estado
const bannerMessage = computed(() => {
  if (!suscripcion.value) return ''

  const estado = suscripcion.value.estadoPago
  const enPrueba = suscripcion.value.enPeriodoPrueba
  const diasPrueba = suscripcion.value.diasRestantesPrueba
  const diasVencimiento = suscripcion.value.diasRestantesVencimiento

  // Casos de error crítico
  if (estado === 'vencido') {
    return 'Tu suscripción ha vencido. Realiza el pago para continuar usando el servicio.'
  }
  if (estado === 'suspendido') {
    return 'Tu cuenta está suspendida. Contacta con soporte para más información.'
  }
  // Solo mostrar "cuenta inactiva" si NO está en prueba Y NO está con estado pendiente_pago
  // (El estado pendiente_pago es normal para el plan Premium que requiere pago inmediato)
  if (!suscripcion.value.cuentaActiva && estado !== 'pendiente_pago' && estado !== 'trial') {
    return 'Tu cuenta está inactiva. Verifica tu método de pago.'
  }
  // Si está pendiente de pago (plan Premium), mostrar mensaje específico
  if (estado === 'pendiente_pago') {
    return 'Completa el pago de tu suscripción para comenzar a usar el sistema.'
  }

  // Período de prueba - Mostrar solo 1 día antes de que termine (día 6 de 7)
  if (enPrueba && diasPrueba === 1) {
    return 'Tu período de prueba termina mañana. Activa tu suscripción para continuar.'
  }

  // Suscripción activa - Mostrar 5 días antes del cobro
  if (!enPrueba && diasVencimiento !== null && diasVencimiento >= 1 && diasVencimiento <= 5) {
    if (diasVencimiento === 1) {
      return 'El cobro de tu suscripción se realizará mañana. Verifica que tu método de pago esté actualizado.'
    } else {
      return `El cobro de tu suscripción se realizará en ${diasVencimiento} días. Verifica que tu método de pago esté actualizado.`
    }
  }

  return ''
})

// Determinar si se debe mostrar el banner
const showBanner = computed(() => {
  if (dismissed.value) return false
  if (!suscripcion.value) return false

  const estado = suscripcion.value.estadoPago
  const enPrueba = suscripcion.value.enPeriodoPrueba
  const diasPrueba = suscripcion.value.diasRestantesPrueba
  const diasVencimiento = suscripcion.value.diasRestantesVencimiento

  // Siempre mostrar si hay problemas (excepto pendiente_pago que es normal para Premium)
  if (estado === 'vencido' || estado === 'suspendido') {
    return true
  }
  // Mostrar si cuenta inactiva pero NO por pendiente_pago (que es normal para Premium)
  if (!suscripcion.value.cuentaActiva && estado !== 'pendiente_pago' && estado !== 'trial') {
    return true
  }
  // Mostrar si está pendiente de pago
  if (estado === 'pendiente_pago') {
    return true
  }

  // Período de prueba: mostrar solo 1 día antes (día 6 de 7)
  if (enPrueba && diasPrueba === 1) {
    return true
  }

  // Suscripción activa: mostrar 5 días antes del cobro
  if (!enPrueba && diasVencimiento !== null && diasVencimiento >= 1 && diasVencimiento <= 5) {
    return true
  }

  return false
})

// Determinar el nivel de urgencia
const needsUrgentAttention = computed(() => {
  if (!suscripcion.value) return false
  return (
    suscripcion.value.estadoPago === 'vencido' ||
    suscripcion.value.diasRestantesVencimiento === 1
  )
})

// Clases CSS dinámicas basadas en el estado
const bannerClass = computed(() => {
  const estado = suscripcion.value?.estadoPago
  if (estado === 'vencido' || estado === 'suspendido') {
    return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
  }
  if (needsUrgentAttention.value) {
    return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
  }
  return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
})

const iconWrapperClass = computed(() => {
  const estado = suscripcion.value?.estadoPago
  if (estado === 'vencido' || estado === 'suspendido') {
    return 'w-10 h-10 bg-red-800 rounded-full flex items-center justify-center'
  }
  if (needsUrgentAttention.value) {
    return 'w-10 h-10 bg-yellow-700 rounded-full flex items-center justify-center'
  }
  return 'w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center'
})

const textClass = computed(() => 'text-white')
const subTextClass = computed(() => 'text-white text-opacity-90')

const showDetails = computed(() => {
  return suscripcion.value?.cuentaActiva
})

const showPaymentButton = computed(() => {
  return !suscripcion.value?.cuentaActiva ||
         suscripcion.value?.estadoPago === 'vencido' ||
         suscripcion.value?.estadoPago === 'pendiente_pago'
})

const planName = computed(() => {
  const plan = suscripcion.value?.plan
  if (!plan) return 'N/A'
  const planNames = {
    'basico': 'Básico',
    'profesional': 'Profesional',
    'premium': 'Premium'
  }
  return planNames[plan.toLowerCase()] || plan
})

const dismissBanner = () => {
  dismissed.value = true
}

const goToPayment = () => {
  router.push('/planes')
}

const viewSubscription = () => {
  router.push('/planes')
}
</script>

<style scoped>
/* Animación de entrada del banner */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

div[class*="bg-gradient-to-r"] {
  animation: slideDown 0.3s ease-out;
}
</style>
