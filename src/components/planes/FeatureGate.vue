<template>
  <div v-if="!loading">
    <!-- Si tiene acceso, mostrar el contenido -->
    <slot v-if="hasAccess"></slot>

    <!-- Si no tiene acceso, mostrar mensaje de upgrade -->
    <div v-else>
      <slot name="locked">
        <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6 text-center">
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>

          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ title || 'Funcionalidad Bloqueada' }}
          </h3>

          <p class="text-gray-600 mb-4">
            {{ message || obtenerMensaje(feature) }}
          </p>

          <div v-if="showUpgradeButton" class="flex justify-center gap-3">
            <router-link
              to="/planes"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Actualizar Plan
            </router-link>

            <a
              v-if="showLearnMore"
              href="#"
              @click.prevent="$emit('learn-more')"
              class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Conocer más
            </a>
          </div>
        </div>
      </slot>
    </div>
  </div>

  <!-- Loading state -->
  <div v-else class="flex justify-center items-center py-8">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span class="ml-3 text-gray-600">Verificando acceso...</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlanFeatures } from '@/composables/usePlanFeatures'

const props = defineProps({
  /**
   * Funcionalidad requerida para mostrar el contenido
   */
  feature: {
    type: String,
    required: true
  },
  /**
   * Título personalizado para el mensaje de bloqueo
   */
  title: {
    type: String,
    default: null
  },
  /**
   * Mensaje personalizado para el mensaje de bloqueo
   */
  message: {
    type: String,
    default: null
  },
  /**
   * Mostrar botón de actualizar plan
   */
  showUpgradeButton: {
    type: Boolean,
    default: true
  },
  /**
   * Mostrar botón de conocer más
   */
  showLearnMore: {
    type: Boolean,
    default: false
  }
})

defineEmits(['learn-more'])

const { tieneFuncionalidad, obtenerMensaje } = usePlanFeatures()

const hasAccess = ref(false)
const loading = ref(true)

const verificarAcceso = async () => {
  loading.value = true
  try {
    hasAccess.value = await tieneFuncionalidad(props.feature)
  } catch (error) {
    console.error('[FeatureGate] Error al verificar acceso:', error)
    hasAccess.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verificarAcceso()
})
</script>
