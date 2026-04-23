<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading inicial -->
    <div v-if="cargando" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Cargando información...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-md">
        <div class="flex justify-center mb-4">
          <svg class="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Enlace no válido</h1>
        <p class="text-gray-500">{{ error }}</p>
      </div>
    </div>

    <!-- Confirmación final -->
    <PublicConfirmacion
      v-else-if="paso === 'confirmacion'"
      :cita="citaConfirmada"
      :negocio="negocio"
    />

    <!-- Flujo principal de reserva -->
    <template v-else-if="negocio">
      <!-- Header del negocio -->
      <PublicNegocioInfo :negocio="negocio" />

      <div class="max-w-4xl mx-auto px-4 py-8">

        <!-- PASO 1: Seleccionar servicios -->
        <div v-if="paso === 'servicios'">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            1. Selecciona el servicio
          </h2>
          <PublicServiciosSelector
            :servicios="negocio.servicios"
            :seleccionados="serviciosSeleccionados"
            @update:seleccionados="serviciosSeleccionados = $event"
            @continuar="paso = 'calendario'"
          />
        </div>

        <!-- PASO 2: Seleccionar fecha/hora -->
        <div v-else-if="paso === 'calendario'">
          <div class="flex items-center gap-2 mb-4">
            <button
              @click="paso = 'servicios'"
              class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
            >
              ← Cambiar servicio
            </button>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            2. Elige fecha y hora
          </h2>
          <PublicCalendario
            :token="token"
            :servicio-ids="serviciosSeleccionados.map(s => s.id)"
            @seleccionar="seleccionarFechaHora"
          />
        </div>

        <!-- PASO 3: Datos del cliente y confirmación -->
        <div v-else-if="paso === 'checkout'">
          <div class="flex items-center gap-2 mb-4">
            <button
              @click="paso = 'calendario'"
              class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
            >
              ← Cambiar fecha/hora
            </button>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            3. Tus datos
          </h2>
          <PublicCheckout
            :servicios="serviciosSeleccionados"
            :fecha-hora="fechaHoraSeleccionada"
            :cargando-agendar="cargandoAgendar"
            @agendar="agendar"
          />
        </div>
      </div>

      <!-- Indicador de pasos -->
      <div v-if="paso !== 'confirmacion'" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
        <div class="max-w-4xl mx-auto flex justify-center gap-2">
          <div
            v-for="(p, i) in pasos"
            :key="p.key"
            class="flex items-center gap-1"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                pasoActualIndex >= i
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              ]"
            >{{ i + 1 }}</div>
            <span
              :class="[
                'text-xs hidden sm:inline',
                pasoActualIndex >= i ? 'text-indigo-600 font-medium' : 'text-gray-400'
              ]"
            >{{ p.label }}</span>
            <span v-if="i < pasos.length - 1" class="text-gray-300 mx-1">›</span>
          </div>
        </div>
      </div>
      <!-- Espaciado para el footer fijo -->
      <div v-if="paso !== 'confirmacion'" class="h-16"></div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import publicBookingService from '../services/publicBookingService'

import PublicNegocioInfo from '../components/public/PublicNegocioInfo.vue'
import PublicServiciosSelector from '../components/public/PublicServiciosSelector.vue'
import PublicCalendario from '../components/public/PublicCalendario.vue'
import PublicCheckout from '../components/public/PublicCheckout.vue'
import PublicConfirmacion from '../components/public/PublicConfirmacion.vue'

const route = useRoute()
const token = route.params.token

const negocio = ref(null)
const cargando = ref(true)
const error = ref(null)

const paso = ref('servicios') // 'servicios' | 'calendario' | 'checkout' | 'confirmacion'
const serviciosSeleccionados = ref([])
const fechaHoraSeleccionada = ref(null)
const citaConfirmada = ref(null)
const cargandoAgendar = ref(false)

const pasos = [
  { key: 'servicios', label: 'Servicio' },
  { key: 'calendario', label: 'Fecha y hora' },
  { key: 'checkout', label: 'Tus datos' },
]

const pasoActualIndex = computed(() => {
  return pasos.findIndex(p => p.key === paso.value)
})

onMounted(async () => {
  try {
    negocio.value = await publicBookingService.obtenerInfoNegocio(token)
  } catch (e) {
    const msg = e?.response?.data?.message
    error.value = msg || 'Este enlace de reservas no es válido o ha expirado.'
  } finally {
    cargando.value = false
  }
})

function seleccionarFechaHora(fechaHora) {
  fechaHoraSeleccionada.value = fechaHora
  paso.value = 'checkout'
}

async function agendar(datosCliente) {
  cargandoAgendar.value = true
  try {
    const payload = {
      servicioIds: serviciosSeleccionados.value.map(s => s.id),
      fechaHora: fechaHoraSeleccionada.value,
      clienteNombre: datosCliente.nombre,
      clienteEmail: datosCliente.email,
      clienteTelefono: datosCliente.telefono,
      notas: datosCliente.notas,
    }
    citaConfirmada.value = await publicBookingService.agendarCita(token, payload)
    paso.value = 'confirmacion'
  } catch (e) {
    const msg = e?.response?.data?.message || 'No se pudo agendar la cita. Por favor intenta de nuevo.'
    alert(msg)
  } finally {
    cargandoAgendar.value = false
  }
}
</script>
