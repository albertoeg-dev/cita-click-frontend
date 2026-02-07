<template>
  <div class="card bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-l-4 border-blue-600">
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Completa tu configuración
        </h3>
        <p class="text-sm text-slate-600">{{ tareasCompletadas }}/{{ tareasTotales }} pasos completados</p>
      </div>
      <button
        v-if="todasCompletadas"
        @click="cerrar"
        class="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="w-full bg-slate-200 rounded-full h-2">
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${progreso}%` }"
        ></div>
      </div>
    </div>

    <!-- Checklist -->
    <div class="space-y-2">
      <!-- Tarea 1: Configurar Negocio -->
      <div
        class="flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer"
        :class="tareas.negocioConfigurado ? 'bg-green-50 border border-green-200' : 'bg-white border border-slate-200 hover:border-blue-300'"
        @click="irA('/settings')"
      >
        <div class="flex-shrink-0 mt-0.5">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center transition-all"
            :class="tareas.negocioConfigurado ? 'bg-green-500' : 'bg-slate-200'"
          >
            <svg v-if="tareas.negocioConfigurado" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <p class="font-medium text-slate-900">Configura tu perfil de negocio</p>
          <p class="text-xs text-slate-600 mt-1">Agrega información básica y horarios de atención</p>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <!-- Tarea 2: Agregar Servicios -->
      <div
        class="flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer"
        :class="tareas.serviciosAgregados ? 'bg-green-50 border border-green-200' : 'bg-white border border-slate-200 hover:border-blue-300'"
        @click="irA('/services')"
      >
        <div class="flex-shrink-0 mt-0.5">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center transition-all"
            :class="tareas.serviciosAgregados ? 'bg-green-500' : 'bg-slate-200'"
          >
            <svg v-if="tareas.serviciosAgregados" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <p class="font-medium text-slate-900">Agrega tus servicios</p>
          <p class="text-xs text-slate-600 mt-1">Define los servicios que ofreces con precios y duración</p>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <!-- Tarea 3: Registrar Clientes -->
      <div
        class="flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer"
        :class="tareas.clientesRegistrados ? 'bg-green-50 border border-green-200' : 'bg-white border border-slate-200 hover:border-blue-300'"
        @click="irA('/clients')"
      >
        <div class="flex-shrink-0 mt-0.5">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center transition-all"
            :class="tareas.clientesRegistrados ? 'bg-green-500' : 'bg-slate-200'"
          >
            <svg v-if="tareas.clientesRegistrados" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <p class="font-medium text-slate-900">Registra a tus clientes</p>
          <p class="text-xs text-slate-600 mt-1">Agrega información de contacto de tus clientes</p>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <!-- Tarea 4: Crear Primera Cita -->
      <div
        class="flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer"
        :class="tareas.primeracitaCreada ? 'bg-green-50 border border-green-200' : 'bg-white border border-slate-200 hover:border-blue-300'"
        @click="irA('/appointments')"
      >
        <div class="flex-shrink-0 mt-0.5">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center transition-all"
            :class="tareas.primeracitaCreada ? 'bg-green-500' : 'bg-slate-200'"
          >
            <svg v-if="tareas.primeracitaCreada" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <p class="font-medium text-slate-900">Crea tu primera cita</p>
          <p class="text-xs text-slate-600 mt-1">Agenda una cita para comenzar a usar el sistema</p>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>

    <!-- Celebración cuando todo está completo -->
    <div v-if="todasCompletadas" class="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
      <div class="flex items-center gap-3">
        <div class="text-3xl">🎉</div>
        <div class="flex-1">
          <p class="font-bold text-green-900">¡Felicidades!</p>
          <p class="text-sm text-green-800">Has completado la configuración inicial. Ya puedes gestionar tu negocio.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBusinessStore } from '../../stores/businessStore'
import { useServiciosStore } from '../../stores/serviciosStore'
import { useClientesStore } from '../../stores/clientesStore'
import { useCitasStore } from '../../stores/citasStore'

const router = useRouter()
const businessStore = useBusinessStore()
const serviciosStore = useServiciosStore()
const clientesStore = useClientesStore()
const citasStore = useCitasStore()

const emit = defineEmits(['close'])

// Computed
const tareas = computed(() => ({
  negocioConfigurado: !!(businessStore.negocio?.nombre && businessStore.horarios?.length > 0),
  serviciosAgregados: serviciosStore.servicios.length > 0,
  clientesRegistrados: clientesStore.clientes.length > 0,
  primeracitaCreada: citasStore.citas.length > 0,
}))

const tareasTotales = computed(() => 4)

const tareasCompletadas = computed(() => {
  return Object.values(tareas.value).filter(Boolean).length
})

const progreso = computed(() => {
  return (tareasCompletadas.value / tareasTotales.value) * 100
})

const todasCompletadas = computed(() => {
  return tareasCompletadas.value === tareasTotales.value
})

// Métodos
const irA = (ruta) => {
  router.push(ruta)
}

const cerrar = () => {
  emit('close')
}
</script>
