<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="modalTitle"
    size="lg"
    :closable="true"
  >
    <!-- Contenido -->
    <div class="space-y-4">
      <!-- Mensaje principal -->
      <p class="text-gray-700">
        {{ modalMessage }}
      </p>

      <!-- Beneficios de la feature -->
      <div v-if="beneficios && beneficios.length > 0" class="mt-4">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">Lo que obtendrás:</h4>
        <ul class="space-y-2">
          <li
            v-for="(beneficio, index) in beneficios"
            :key="index"
            class="flex items-start gap-2 text-sm text-gray-600"
          >
            <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ beneficio }}</span>
          </li>
        </ul>
      </div>

      <!-- Comparación de planes (si planRequerido está definido) -->
      <div v-if="planRequerido" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-900">Tu plan actual</p>
            <p class="text-lg font-bold text-blue-900">{{ planActual }}</p>
          </div>
          <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div>
            <p class="text-sm font-medium text-blue-900">Plan requerido</p>
            <p class="text-lg font-bold text-blue-900">{{ planRequeridoNombre }}</p>
          </div>
        </div>
      </div>

      <!-- Información adicional para Q2 2026 features -->
      <div v-if="feature === 'sms_whatsapp'" class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-medium text-yellow-900">Próximamente</p>
            <p class="text-xs text-yellow-700">Esta funcionalidad estará disponible a partir de Q2 2026</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con acciones -->
    <template #footer>
      <button
        @click="$emit('update:modelValue', false)"
        class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Cerrar
      </button>
      <button
        @click="irAPlanes"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Ver Planes
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanFeatures } from '@/composables/usePlanFeatures'
import Modal from './Modal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  feature: {
    type: String,
    required: true,
    validator: (value) => ['reportes_avanzados', 'sms_whatsapp', 'soporte_prioritario'].includes(value),
  },
  customTitle: {
    type: String,
    default: '',
  },
  customMessage: {
    type: String,
    default: '',
  },
  customBeneficios: {
    type: Array,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const { planActual, tipoPlan } = usePlanFeatures()

// Configuración de mensajes por feature
const featureConfig = {
  reportes_avanzados: {
    titulo: 'Reportes Avanzados No Disponibles',
    mensaje: 'Los reportes avanzados con exportación a PDF y Excel están disponibles en los planes Profesional y Premium.',
    planRequerido: 'profesional',
    beneficios: [
      'Reportes diarios, semanales y mensuales',
      'Exportación a PDF y Excel',
      'Análisis detallado por estado de citas',
      'Servicios más solicitados',
      'Identificación de clientes frecuentes',
      'Métricas de ingresos y rendimiento',
    ],
  },
  sms_whatsapp: {
    titulo: 'Notificaciones Automáticas',
    mensaje: 'Las notificaciones por SMS y WhatsApp estarán disponibles en el plan Premium a partir de Q2 2026.',
    planRequerido: 'premium',
    beneficios: [
      'Recordatorios automáticos de citas',
      'Confirmaciones por WhatsApp',
      'Mensajes de seguimiento post-servicio',
      'Notificaciones de cambios en tiempo real',
      'Plantillas personalizables',
    ],
  },
  soporte_prioritario: {
    titulo: 'Soporte Prioritario',
    mensaje: 'El soporte prioritario con respuesta garantizada en menos de 6 horas está disponible solo en el plan Premium.',
    planRequerido: 'premium',
    beneficios: [
      'Respuesta garantizada en menos de 6 horas',
      'Chat directo con el equipo de soporte',
      'Asistencia personalizada',
      'Llamadas de emergencia',
      'Asesoría en optimización del negocio',
    ],
  },
}

const config = computed(() => featureConfig[props.feature] || {})

const modalTitle = computed(() => props.customTitle || config.value.titulo || 'Funcionalidad No Disponible')

const modalMessage = computed(() => props.customMessage || config.value.mensaje || 'Esta funcionalidad no está disponible en tu plan actual.')

const beneficios = computed(() => props.customBeneficios || config.value.beneficios || [])

const planRequerido = computed(() => config.value.planRequerido || null)

const planRequeridoNombre = computed(() => {
  const nombres = {
    basico: 'Básico',
    profesional: 'Profesional',
    premium: 'Premium',
  }
  return nombres[planRequerido.value] || 'Premium'
})

const irAPlanes = () => {
  emit('update:modelValue', false)
  router.push({
    path: '/planes',
    query: {
      feature: props.feature,
      from: router.currentRoute.value.path,
    },
  })
}
</script>
