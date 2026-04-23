<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full text-center">

      <!-- Icono de éxito -->
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mb-2">¡Cita confirmada!</h1>
      <p class="text-gray-500 mb-8">
        Tu cita ha sido agendada exitosamente en <strong>{{ negocio?.nombre }}</strong>.
        Revisa tu correo electrónico para más detalles.
      </p>

      <!-- Detalles de la cita -->
      <div class="bg-white rounded-xl border border-gray-200 p-5 text-left mb-6">
        <h2 class="font-semibold text-gray-700 text-sm mb-3">Detalles de tu reserva</h2>

        <div class="space-y-3">
          <!-- Fecha y hora -->
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <div>
              <p class="text-xs text-gray-400">Fecha y hora</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatFechaHora(cita?.fechaHora) }}</p>
            </div>
          </div>

          <!-- Duración -->
          <div v-if="cita?.fechaFin && cita?.fechaHora" class="flex items-start gap-3">
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <p class="text-xs text-gray-400">Duración estimada</p>
              <p class="text-sm font-semibold text-gray-900">{{ duracionMinutos }} minutos</p>
            </div>
          </div>

          <!-- Negocio -->
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <div>
              <p class="text-xs text-gray-400">Negocio</p>
              <p class="text-sm font-semibold text-gray-900">{{ negocio?.nombre }}</p>
              <p v-if="negocio?.telefono" class="text-xs text-gray-500">{{ negocio.telefono }}</p>
            </div>
          </div>

          <!-- Estado -->
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <p class="text-xs text-gray-400">Estado</p>
              <span class="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                Confirmada
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Aviso de email -->
      <p class="text-xs text-gray-400 mb-6">
        Recibirás un correo de confirmación con los detalles de tu cita.
        Si necesitas cancelar o reprogramar, comunícate directamente con el negocio.
      </p>

      <!-- Botón de nueva reserva -->
      <button
        @click="$emit('nueva-reserva')"
        class="text-indigo-600 text-sm font-medium hover:underline"
      >
        ← Agendar otra cita
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cita: { type: Object, default: null },
  negocio: { type: Object, default: null },
})

defineEmits(['nueva-reserva'])

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

const duracionMinutos = computed(() => {
  if (!props.cita?.fechaHora || !props.cita?.fechaFin) return 0
  const inicio = new Date(props.cita.fechaHora)
  const fin = new Date(props.cita.fechaFin)
  return Math.round((fin - inicio) / 60000)
})
</script>
