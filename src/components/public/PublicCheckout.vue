<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

    <!-- Resumen de la reserva -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="font-semibold text-gray-800 mb-4">Resumen de tu reserva</h3>

      <!-- Servicios -->
      <div class="space-y-2 mb-4">
        <div
          v-for="servicio in servicios"
          :key="servicio.id"
          class="flex justify-between items-center text-sm"
        >
          <div>
            <span class="text-gray-800 font-medium">{{ servicio.nombre }}</span>
            <span class="text-gray-400 ml-2">⏱ {{ servicio.duracionMinutos }} min</span>
          </div>
          <span v-if="servicio.precio" class="text-gray-700 font-medium">
            ${{ formatPrecio(servicio.precio) }}
          </span>
          <span v-else class="text-green-600 text-xs font-medium">Gratis</span>
        </div>
      </div>

      <hr class="border-gray-100 mb-4" />

      <!-- Fecha y hora -->
      <div class="flex items-start gap-3 text-sm">
        <span class="text-xl">📅</span>
        <div>
          <p class="text-gray-500 text-xs">Fecha y hora</p>
          <p class="font-semibold text-gray-900">{{ formatFechaHora(fechaHora) }}</p>
        </div>
      </div>

      <!-- Total -->
      <div v-if="precioTotal > 0" class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span class="font-semibold text-gray-700">Total</span>
        <span class="text-xl font-bold text-indigo-600">${{ formatPrecio(precioTotal) }} MXN</span>
      </div>
    </div>

    <!-- Formulario de datos del cliente -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="font-semibold text-gray-800 mb-4">Tus datos de contacto</h3>

      <form @submit.prevent="enviarFormulario" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Ej: María García"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-400 mt-1">Te enviaremos la confirmación aquí</p>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            v-model="form.telefono"
            type="tel"
            placeholder="55 1234 5678"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Notas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea
            v-model="form.notas"
            rows="2"
            placeholder="Alguna indicación especial (opcional)"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- Botón confirmar -->
        <button
          type="submit"
          :disabled="cargandoAgendar"
          class="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="cargandoAgendar">
            <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Agendando...
          </span>
          <span v-else>✓ Confirmar reserva</span>
        </button>

        <p class="text-xs text-center text-gray-400">
          Al confirmar aceptas que el negocio puede contactarte sobre tu cita.
        </p>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  servicios: { type: Array, required: true },
  fechaHora: { type: String, required: true },
  cargandoAgendar: { type: Boolean, default: false },
})

const emit = defineEmits(['agendar'])

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  notas: '',
})

const precioTotal = computed(() =>
  props.servicios.reduce((sum, s) => sum + parseFloat(s.precio || 0), 0)
)

function formatPrecio(precio) {
  return parseFloat(precio).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatFechaHora(fechaHora) {
  if (!fechaHora) return ''
  const d = new Date(fechaHora)
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const dia = dias[d.getDay()]
  const fecha = `${String(d.getDate()).padStart(2, '0')} de ${MESES[d.getMonth()]} ${d.getFullYear()}`
  const hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${fecha} a las ${hora}`
}

function enviarFormulario() {
  if (!form.value.nombre.trim() || !form.value.email.trim()) return
  emit('agendar', { ...form.value })
}
</script>
