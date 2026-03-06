<template>
  <div v-if="!oculto" class="mb-6">

    <!-- Bienvenida -->
    <div class="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 mb-4 text-white shadow-lg relative overflow-hidden">
      <!-- Blobs decorativos -->
      <div class="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="text-4xl flex-shrink-0 drop-shadow">🎉</div>
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
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            :class="tareas.negocioConfigurado ? 'bg-green-100' : 'bg-indigo-50'"
          >
            {{ tareas.negocioConfigurado ? '✅' : '⚙️' }}
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
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            :class="tareas.serviciosAgregados ? 'bg-green-100' : 'bg-blue-50'"
          >
            {{ tareas.serviciosAgregados ? '✅' : '🔧' }}
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
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            :class="tareas.clientesRegistrados ? 'bg-green-100' : 'bg-purple-50'"
          >
            {{ tareas.clientesRegistrados ? '✅' : '👥' }}
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
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            :class="tareas.primeracitaCreada ? 'bg-green-100' : 'bg-amber-50'"
          >
            {{ tareas.primeracitaCreada ? '✅' : '📅' }}
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
        <div class="text-3xl">🏆</div>
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
