<template>
  <DashboardLayout>
    <template #title>
      Módulos Adicionales
    </template>

    <!-- Modal de confirmación de cancelación -->
    <Teleport to="body">
      <div v-if="moduloACancelar" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="moduloACancelar = null"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900 mb-1">¿Cancelar módulo?</h3>
              <p class="text-sm text-slate-600 mb-4">
                Estás por cancelar <strong>{{ moduloACancelar?.nombre }}</strong>. El módulo seguirá
                activo hasta el final del periodo de facturación actual y no se realizarán más cobros.
              </p>
              <div class="flex gap-3 justify-end">
                <button
                  @click="moduloACancelar = null"
                  class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Mantener módulo
                </button>
                <button
                  @click="confirmarCancelacion"
                  :disabled="cancelando"
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  <span v-if="cancelando">Cancelando...</span>
                  <span v-else>Sí, cancelar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Módulos Adicionales</h2>
        <p class="text-slate-600">Expande las capacidades de tu negocio con módulos a la carta</p>
      </div>
      <router-link
        to="/planes"
        class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-all duration-200"
      >
        <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Ver mi plan
      </router-link>
    </div>

    <!-- Banner plan COMPLETO -->
    <div v-if="esPlanCompleto" class="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <h3 class="text-base font-semibold text-indigo-900 mb-1">Todos los módulos incluidos en tu Bundle Completo</h3>
          <p class="text-sm text-indigo-700">
            Tu plan incluye acceso a todos los módulos sin costo adicional.
            No necesitas contratar ninguno por separado.
          </p>
        </div>
      </div>
    </div>

    <!-- Resumen de módulos activos (solo plan BASE con módulos contratados) -->
    <div v-if="!esPlanCompleto && modulosStore.modulosActivos.length > 0" class="mb-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p class="text-sm text-slate-500 mb-1">Módulos activos</p>
          <p class="text-2xl font-bold text-slate-900">
            {{ modulosStore.modulosActivos.length }}
            <span class="text-base font-normal text-slate-500">
              módulo{{ modulosStore.modulosActivos.length !== 1 ? 's' : '' }}
            </span>
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-slate-500 mb-1">Costo adicional mensual</p>
          <p class="text-2xl font-bold text-indigo-600">
            ${{ modulosStore.totalMensualModulos.toLocaleString('es-MX') }}
            <span class="text-base font-normal text-slate-500">MXN/mes</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="modulosStore.loading && !modulosStore.cargado" class="flex items-center justify-center py-16">
      <div class="flex flex-col items-center gap-3">
        <svg class="animate-spin w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-slate-500 text-sm">Cargando módulos...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="modulosStore.error" class="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700 mb-6">
      {{ modulosStore.error }}
      <button @click="modulosStore.cargarModulos(true)" class="ml-2 underline font-medium">Reintentar</button>
    </div>

    <!-- Catálogo de módulos por categoría -->
    <div v-else class="space-y-8">
      <div v-for="categoria in categorias" :key="categoria.id">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span class="w-1 h-5 rounded-full" :class="categoria.color"></span>
          {{ categoria.nombre }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="modulo in modulosPorCategoria(categoria.id)"
            :key="modulo.clave"
            class="bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            :class="modulo.activado ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200'"
          >
            <!-- Header de tarjeta -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-start gap-3">
                <!-- Icono -->
                <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="modulo.activado ? 'bg-indigo-100' : 'bg-slate-100'"
                >
                  <svg class="w-5 h-5" :class="modulo.activado ? 'text-indigo-600' : 'text-slate-500'"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      :d="getIconPath(modulo.clave)" />
                  </svg>
                </div>
                <!-- Nombre -->
                <div>
                  <h4 class="text-sm font-semibold text-slate-900 leading-tight">{{ modulo.nombre }}</h4>
                  <p class="text-xs text-slate-500 mt-0.5">{{ formatPrecio(modulo.precioMensual) }}/mes</p>
                </div>
              </div>

              <!-- Badge de estado -->
              <div v-if="modulo.incluidoEnPlan" class="flex-shrink-0">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Incluido
                </span>
              </div>
              <div v-else-if="modulo.activado">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Activo
                </span>
              </div>
            </div>

            <!-- Descripción -->
            <p class="text-xs text-slate-600 leading-relaxed mb-4">{{ modulo.descripcion }}</p>

            <!-- Fecha de activación (si está activo y no incluido en plan) -->
            <div v-if="modulo.activado && !modulo.incluidoEnPlan && modulo.fechaActivacion"
              class="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Activo desde {{ formatFecha(modulo.fechaActivacion) }}
            </div>

            <!-- Acciones -->
            <div class="mt-auto">
              <!-- Incluido en plan COMPLETO: no action needed -->
              <div v-if="modulo.incluidoEnPlan"
                class="w-full py-2 text-center text-xs font-medium text-purple-600 bg-purple-50 rounded-lg border border-purple-200">
                Incluido en Bundle Completo
              </div>

              <!-- Activo y comprado individualmente: cancelar -->
              <button
                v-else-if="modulo.activado"
                @click="pedirCancelacion(modulo)"
                :disabled="modulosStore.loading"
                class="w-full py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar módulo
              </button>

              <!-- No activo: contratar -->
              <button
                v-else
                @click="activar(modulo.clave)"
                :disabled="activando === modulo.clave"
                class="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <svg v-if="activando !== modulo.clave" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>{{ activando === modulo.clave ? 'Redirigiendo...' : `Contratar — $${formatPrecio(modulo.precioMensual)}/mes` }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA upgrade si está en plan BASE -->
    <div v-if="!esPlanCompleto && !modulosStore.loading" class="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold mb-1">¿Necesitas todos los módulos?</h3>
          <p class="text-sm text-indigo-100">
            El Bundle Completo incluye todos los módulos por <strong>$1,199/mes</strong> —
            ahorra hasta ${{ ahorroBundle.toLocaleString('es-MX') }} MXN si los contratas por separado.
          </p>
        </div>
        <router-link
          to="/pricing"
          class="flex-shrink-0 inline-flex items-center px-5 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
        >
          Ver Bundle Completo
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { useModulosStore } from '@/stores/modulosStore'
import { usePlanesStore } from '@/stores/planesStore'

const modulosStore = useModulosStore()
const planesStore = usePlanesStore()

const moduloACancelar = ref(null)
const cancelando = ref(false)
const activando = ref(null)

// ─── Plan ───────────────────────────────────────────────────────────────────
const esPlanCompleto = computed(() =>
  planesStore.limites?.tipoPlan?.toUpperCase() === 'COMPLETO' ||
  planesStore.limites?.tipoPlan?.toUpperCase() === 'PREMIUM'
)

// Ahorro si contrata todo por separado vs Bundle Completo
const ahorroBundle = computed(() => {
  const totalSeparado = modulosStore.modulos.reduce((s, m) => s + (m.precioMensual || 0), 0)
  return Math.max(0, totalSeparado - 1199)
})

// ─── Categorías ─────────────────────────────────────────────────────────────
const categorias = [
  { id: 'comunicacion',    nombre: 'Comunicación',      color: 'bg-blue-500' },
  { id: 'pagos',           nombre: 'Pagos',              color: 'bg-emerald-500' },
  { id: 'reportes',        nombre: 'Reportes y Análisis',color: 'bg-amber-500' },
  { id: 'personalizacion', nombre: 'Personalización',    color: 'bg-pink-500' },
  { id: 'expansion',       nombre: 'Expansión de Capacidad', color: 'bg-violet-500' },
]

const categoriaMap = {
  email_recordatorios: 'comunicacion',
  sms_whatsapp:        'comunicacion',
  cobros_online:       'pagos',
  reportes_avanzados:  'reportes',
  branding_email:      'personalizacion',
  usuarios_extra:      'expansion',
  multi_sucursal:      'expansion',
  citas_extra:         'expansion',
  servicios_extra:     'expansion',
}

const modulosPorCategoria = (categoriaId) =>
  modulosStore.modulos.filter(m => categoriaMap[m.clave] === categoriaId)

// ─── Iconos (SVG path) ──────────────────────────────────────────────────────
const iconPaths = {
  email_recordatorios: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  sms_whatsapp:        'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  cobros_online:       'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  reportes_avanzados:  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  usuarios_extra:      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  multi_sucursal:      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  branding_email:      'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  citas_extra:         'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  servicios_extra:     'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
}

const getIconPath = (clave) =>
  iconPaths[clave] || 'M13 10V3L4 14h7v7l9-11h-7z'

// ─── Formatters ─────────────────────────────────────────────────────────────
const formatPrecio = (precio) =>
  precio ? precio.toLocaleString('es-MX') : '0'

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Acciones ────────────────────────────────────────────────────────────────
const activar = async (clave) => {
  activando.value = clave
  try {
    await modulosStore.activarModulo(clave)
  } catch {
    // el store ya loguea el error
  } finally {
    activando.value = null
  }
}

const pedirCancelacion = (modulo) => {
  moduloACancelar.value = modulo
}

const confirmarCancelacion = async () => {
  if (!moduloACancelar.value) return
  cancelando.value = true
  try {
    await modulosStore.cancelarModulo(moduloACancelar.value.clave)
    moduloACancelar.value = null
  } catch {
    // el store ya loguea el error
  } finally {
    cancelando.value = false
  }
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    modulosStore.cargarModulos(),
    planesStore.cargarLimites(),
  ])
})
</script>
