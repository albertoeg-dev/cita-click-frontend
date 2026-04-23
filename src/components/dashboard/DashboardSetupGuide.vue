<template>
  <div v-if="!oculto" class="mb-6">

    <!-- Bienvenida -->
    <div class="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 mb-4 text-white shadow-lg relative overflow-hidden">
      <!-- Blobs decorativos -->
      <div class="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-xl">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
          </div>
          <div>
            <h2 class="text-xl font-bold leading-tight">
              ¡Bienvenido{{ nombreUsuario ? `, ${nombreUsuario}` : '' }}!
            </h2>
            <p class="text-white/85 text-sm mt-1">
              Tu negocio ya está activo. Sigue estos pasos para tener todo listo y empezar a recibir citas.
            </p>
          </div>
        </div>

        <!-- Botón cerrar (solo cuando todo esté completo) -->
        <button
          v-if="todasCompletadas"
          @click="cerrar"
          class="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1 rounded"
          title="Cerrar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Barra de progreso -->
      <div class="relative mt-4">
        <div class="flex items-center justify-between text-xs text-white/80 mb-1.5">
          <span>{{ tareasCompletadas }} de {{ tareasTotales }} pasos completados</span>
          <span class="font-semibold">{{ Math.round(progreso) }}%</span>
        </div>
        <div class="w-full bg-white/25 rounded-full h-2">
          <div
            class="bg-white h-2 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${progreso}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Tarjetas de configuración -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">

      <!-- Paso 1: Configurar negocio -->
      <div
        class="rounded-xl border-2 p-4 transition-all duration-200"
        :class="tareas.negocioConfigurado
          ? 'border-green-200 bg-green-50'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'"
      >
        <div class="flex items-start gap-3">
          <!-- Ícono de estado -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="tareas.negocioConfigurado ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-500'"
          >
            <svg v-if="tareas.negocioConfigurado" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Paso 1</span>
              <span
                v-if="tareas.negocioConfigurado"
                class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full"
              >Completado</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900">Configura tu negocio</h4>
            <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {{ tareas.negocioConfigurado
                ? 'Tu perfil y horarios están configurados.'
                : 'Define el nombre, tipo y horarios de atención de tu negocio.' }}
            </p>
          </div>
        </div>

        <div v-if="!tareas.negocioConfigurado" class="mt-3 flex justify-end">
          <button
            @click="irConTour('/settings', 'configurar-horarios')"
            class="flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg transition-colors"
          >
            Configurar
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Paso 2: Agregar servicios -->
      <div
        class="rounded-xl border-2 p-4 transition-all duration-200"
        :class="tareas.serviciosAgregados
          ? 'border-green-200 bg-green-50'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="tareas.serviciosAgregados ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'"
          >
            <svg v-if="tareas.serviciosAgregados" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Paso 2</span>
              <span
                v-if="tareas.serviciosAgregados"
                class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full"
              >Completado</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900">Agrega tus servicios</h4>
            <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {{ tareas.serviciosAgregados
                ? `Tienes ${serviciosStore.servicios.length} servicio(s) disponible(s).`
                : 'Define los servicios que ofreces para que tus clientes puedan reservar.' }}
            </p>
          </div>
        </div>

        <div v-if="!tareas.serviciosAgregados" class="mt-3 flex justify-end">
          <button
            @click="irConTour('/services', 'agregar-servicio')"
            class="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors"
          >
            Agregar
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Paso 3: Registrar clientes -->
      <div
        class="rounded-xl border-2 p-4 transition-all duration-200"
        :class="tareas.clientesRegistrados
          ? 'border-green-200 bg-green-50'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="tareas.clientesRegistrados ? 'bg-green-100 text-green-600' : 'bg-purple-50 text-purple-500'"
          >
            <svg v-if="tareas.clientesRegistrados" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Paso 3</span>
              <span
                v-if="tareas.clientesRegistrados"
                class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full"
              >Completado</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900">Registra tus clientes</h4>
            <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {{ tareas.clientesRegistrados
                ? `Tienes ${clientesStore.clientes.length} cliente(s) registrado(s).`
                : 'Importa o agrega manualmente tus clientes para empezar a agendar.' }}
            </p>
          </div>
        </div>

        <div v-if="!tareas.clientesRegistrados" class="mt-3 flex justify-end">
          <button
            @click="irConTour('/clients', 'agregar-cliente')"
            class="flex items-center gap-1.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-lg transition-colors"
          >
            Agregar
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Paso 4: Primera cita -->
      <div
        class="rounded-xl border-2 p-4 transition-all duration-200"
        :class="tareas.primeracitaCreada
          ? 'border-green-200 bg-green-50'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="tareas.primeracitaCreada ? 'bg-green-100 text-green-600' : 'bg-amber-50 text-amber-500'"
          >
            <svg v-if="tareas.primeracitaCreada" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Paso 4</span>
              <span
                v-if="tareas.primeracitaCreada"
                class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full"
              >Completado</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900">Crea tu primera cita</h4>
            <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {{ tareas.primeracitaCreada
                ? '¡Ya tienes citas en tu sistema!'
                : 'Agenda tu primera cita y comprueba lo fácil que es usar CItaClick.' }}
            </p>
          </div>
        </div>

        <div v-if="!tareas.primeracitaCreada" class="mt-3 flex justify-end">
          <button
            @click="irConTour('/appointments', 'agregar-cita')"
            class="flex items-center gap-1.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 px-4 py-1.5 rounded-lg transition-colors"
          >
            Crear cita
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

    </div>

    <!-- Mensaje final cuando todo está completo -->
    <div
      v-if="todasCompletadas"
      class="mt-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 flex items-center justify-center bg-green-200 rounded-xl flex-shrink-0">
          <svg class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-green-900">¡Configuración completa!</p>
          <p class="text-xs text-green-700 mt-0.5">
            Tu negocio está listo para operar. ¡Éxito con CItaClick!
          </p>
        </div>
        <button
          @click="cerrar"
          class="text-xs font-semibold text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useBusinessStore } from '../../stores/businessStore'
import { useServiciosStore } from '../../stores/serviciosStore'
import { useClientesStore } from '../../stores/clientesStore'
import { useCitasStore } from '../../stores/citasStore'
import { useOnboardingStore } from '../../stores/onboardingStore'

const router = useRouter()
const authStore = useAuthStore()
const businessStore = useBusinessStore()
const serviciosStore = useServiciosStore()
const clientesStore = useClientesStore()
const citasStore = useCitasStore()
const onboardingStore = useOnboardingStore()

const emit = defineEmits(['close'])

const oculto = ref(false)

// Nombre del usuario para la bienvenida
const nombreUsuario = computed(() => {
  return authStore.user?.nombre || ''
})

// Estado de cada tarea
const tareas = computed(() => ({
  negocioConfigurado: !!(businessStore.negocio?.nombre && businessStore.horarios?.length > 0),
  serviciosAgregados: serviciosStore.servicios.length > 0,
  clientesRegistrados: clientesStore.clientes.length > 0,
  primeracitaCreada: citasStore.citas.length > 0,
}))

const tareasTotales = computed(() => 4)

const tareasCompletadas = computed(() =>
  Object.values(tareas.value).filter(Boolean).length
)

const progreso = computed(() =>
  (tareasCompletadas.value / tareasTotales.value) * 100
)

const todasCompletadas = computed(() =>
  tareasCompletadas.value === tareasTotales.value
)

// Navegar a la ruta y activar el tour spotlight
const irConTour = (ruta, tourTarget) => {
  onboardingStore.activarTour(tourTarget)
  router.push(ruta)
}

// Cerrar la guía (guarda en localStorage para no volver a mostrarla)
const cerrar = () => {
  oculto.value = true
  localStorage.setItem('dashboard_setup_guide_cerrado', 'true')
  emit('close')
}

onMounted(() => {
  const guardado = localStorage.getItem('dashboard_setup_guide_cerrado')
  if (guardado === 'true' && todasCompletadas.value) {
    oculto.value = true
  }
})
</script>
