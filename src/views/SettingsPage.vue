<template>
  <DashboardLayout>
    <template #title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuración
        </div>
        <span class="text-sm text-slate-500 ml-8 mt-1">Administra tu cuenta, negocio y horarios</span>
      </div>
    </template>

    <!-- Tabs -->
    <div class="card mb-6">
      <div class="flex gap-4 border-b border-slate-200 overflow-x-auto">
        <!-- Mi Perfil -->
        <button
          @click="activeTab = 'user'"
          :class="[
            'px-4 py-3 font-medium transition-all border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap',
            activeTab === 'user'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mi Perfil
        </button>
        <!-- Perfil del Negocio -->
        <button
          @click="activeTab = 'profile'"
          :class="[
            'px-4 py-3 font-medium transition-all border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap',
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Perfil del Negocio
        </button>
        <!-- Horarios -->
        <button
          @click="activeTab = 'hours'"
          :class="[
            'px-4 py-3 font-medium transition-all border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap',
            activeTab === 'hours'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Horarios de Atención
        </button>
      </div>
    </div>

    <!-- Tab: Mi Perfil (usuario) -->
    <div v-show="activeTab === 'user'" class="animate-fadeIn">

      <!-- Loading -->
      <div v-if="cargandoPerfil" class="card flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ── Columna izquierda: Formulario ── -->
        <div class="lg:col-span-2 card">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-900 mb-1">Mi Información Personal</h3>
            <p class="text-sm text-slate-600">Actualiza tus datos personales y contraseña</p>
          </div>

          <form @submit.prevent="guardarPerfilUsuario" class="space-y-5">
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input v-model="perfilForm.nombre" type="text" required
                class="input w-full" placeholder="Tu nombre" />
            </div>

            <!-- Apellidos -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Apellido Paterno <span class="text-red-500">*</span>
                </label>
                <input v-model="perfilForm.apellidoPaterno" type="text" required
                  class="input w-full" placeholder="Apellido paterno" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Apellido Materno</label>
                <input v-model="perfilForm.apellidoMaterno" type="text"
                  class="input w-full" placeholder="Apellido materno" />
              </div>
            </div>

            <!-- Email (siempre visible, siempre solo lectura) -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
              <div class="relative">
                <input :value="perfilForm.email" type="email" disabled
                  class="input w-full bg-slate-50 text-slate-500 cursor-not-allowed pr-10" />
                <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">El correo no se puede modificar</p>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input v-model="perfilForm.telefono" type="tel"
                class="input w-full" placeholder="+52 55 1234 5678" />
            </div>

            <!-- Cambio de contraseña (solo usuarios locales) -->
            <div v-if="!esUsuarioGoogle" class="pt-5 border-t border-slate-200">
              <h4 class="text-sm font-semibold text-slate-900 mb-4">Cambiar contraseña</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña actual</label>
                  <input v-model="perfilForm.passwordActual" type="password"
                    class="input w-full" placeholder="Tu contraseña actual" autocomplete="current-password" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Nueva contraseña</label>
                  <input v-model="perfilForm.passwordNueva" type="password"
                    class="input w-full" placeholder="Mínimo 6 caracteres" autocomplete="new-password" />
                </div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Deja ambos campos vacíos si no deseas cambiar la contraseña</p>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 pt-2">
              <button type="submit" :disabled="guardandoUsuario"
                class="btn btn-primary flex items-center gap-2">
                <svg v-if="guardandoUsuario" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ guardandoUsuario ? 'Guardando...' : 'Guardar cambios' }}
              </button>
              <button type="button" @click="resetPerfilForm" class="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- ── Columna derecha: Tarjeta de cuenta ── -->
        <div class="space-y-4">

          <!-- Avatar e identificación -->
          <div class="card text-center">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
                        flex items-center justify-center mx-auto mb-4 shadow-md">
              <span class="text-3xl font-bold text-white select-none">
                {{ (perfilForm.nombre || authStore.user?.nombre || '?').charAt(0).toUpperCase() }}
              </span>
            </div>

            <h4 class="text-base font-semibold text-slate-900 leading-snug">
              {{ [perfilForm.nombre, perfilForm.apellidoPaterno].filter(Boolean).join(' ') || '—' }}
            </h4>
            <p class="text-sm text-slate-400 mt-0.5 break-all">{{ perfilForm.email || '—' }}</p>

            <!-- Badge tipo de cuenta -->
            <div class="mt-4">
              <span v-if="esUsuarioGoogle"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                       bg-blue-50 text-blue-700 border border-blue-200">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Cuenta Google
              </span>
              <span v-else
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                       bg-slate-100 text-slate-600 border border-slate-200">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Cuenta local
              </span>
            </div>
          </div>

          <!-- Detalles adicionales -->
          <div class="card space-y-3">
            <h5 class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Información de cuenta</h5>

            <div class="flex items-start gap-2.5 text-sm">
              <svg class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="text-slate-600 break-all">{{ perfilForm.email || '—' }}</span>
            </div>

            <div v-if="perfilForm.telefono" class="flex items-center gap-2.5 text-sm">
              <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span class="text-slate-600">{{ perfilForm.telefono }}</span>
            </div>

            <div class="flex items-center gap-2.5 text-sm pt-2 border-t border-slate-100">
              <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span class="text-slate-500 text-xs">
                {{ esUsuarioGoogle ? 'Contraseña gestionada por Google' : 'Contraseña local activa' }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Tab: Perfil del Negocio -->
    <div v-show="activeTab === 'profile'" class="animate-fadeIn">
      <div class="card">
        <div class="mb-6">
          <h3 class="text-lg font-bold text-slate-900 mb-1">Información del Negocio</h3>
          <p class="text-sm text-slate-600">Actualiza los datos de tu negocio</p>
        </div>

        <!-- Loading State -->
        <div v-if="businessStore.loading && !businessStore.negocio" class="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>

        <!-- Formulario -->
        <BusinessProfileForm
          v-else
          :negocio="businessStore.negocio"
          :loading="guardandoPerfil"
          @submit="guardarPerfil"
          @cancel="cancelarEdicionPerfil"
        />
      </div>
    </div>

    <!-- Tab: Horarios de Atención -->
    <div v-show="activeTab === 'hours'" class="animate-fadeIn">
      <div class="card">
        <HorariosForm
          :horarios="businessStore.horarios"
          :loading="businessStore.loading"
          @crear="crearHorario"
          @actualizar="actualizarHorario"
          @eliminar="eliminarHorario"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBusinessStore } from '../stores/businessStore'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import BusinessProfileForm from '../components/features/BusinessProfileForm.vue'
import HorariosForm from '../components/features/HorariosForm.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const businessStore = useBusinessStore()
const authStore = useAuthStore()
const toast = useToast()

// Estado
const activeTab = ref('user')
const guardandoPerfil = ref(false)
const guardandoUsuario = ref(false)
const cargandoPerfil = ref(false)

// Computed
const esUsuarioGoogle = computed(() => {
  return authStore.user?.authProvider === 'google'
})

// Formulario perfil usuario
const perfilForm = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  email: '',
  telefono: '',
  passwordActual: '',
  passwordNueva: '',
})

const resetPerfilForm = () => {
  const u = authStore.user || {}
  perfilForm.value = {
    nombre: u.nombre || '',
    apellidoPaterno: u.apellidoPaterno || '',
    apellidoMaterno: u.apellidoMaterno || '',
    // El email viene del store; si cargarPerfil falló, tomar del localStorage vía authStore.user
    email: u.email || '',
    telefono: u.telefono || '',
    passwordActual: '',
    passwordNueva: '',
  }
}

const guardarPerfilUsuario = async () => {
  guardandoUsuario.value = true
  try {
    const datos = {
      nombre: perfilForm.value.nombre,
      apellidoPaterno: perfilForm.value.apellidoPaterno,
      apellidoMaterno: perfilForm.value.apellidoMaterno || null,
      telefono: perfilForm.value.telefono || null,
    }
    // Incluir cambio de contraseña solo si se llenó
    if (perfilForm.value.passwordNueva) {
      datos.passwordActual = perfilForm.value.passwordActual
      datos.passwordNueva = perfilForm.value.passwordNueva
    }
    await authStore.actualizarPerfil(datos)
    toast.success('Perfil actualizado', 'Tu información se actualizó correctamente')
    // Limpiar campos de contraseña
    perfilForm.value.passwordActual = ''
    perfilForm.value.passwordNueva = ''
  } catch (error) {
    console.error('[SettingsPage] Error al guardar perfil usuario:', error)
    toast.error('Error al guardar', error.message || 'No se pudo actualizar el perfil')
  } finally {
    guardandoUsuario.value = false
  }
}

// Métodos - Perfil
const guardarPerfil = async (datos) => {
  guardandoPerfil.value = true

  try {

    if (businessStore.negocio?.id) {
      // Actualizar negocio existente
      await businessStore.actualizarNegocio(datos)
      toast.success('Perfil actualizado', 'La información del negocio se actualizó correctamente')
    } else {
      // Crear nuevo negocio (primera vez)
      toast.info('Creando negocio', 'Creando el perfil del negocio por primera vez')
      // Nota: El backend no tiene endpoint de creación, solo actualización
      // En un escenario real, el negocio se crearía al registrarse el usuario
      await businessStore.actualizarNegocio(datos)
      toast.success('Perfil guardado', 'La información del negocio se guardó correctamente')
    }
  } catch (error) {
    console.error('[SettingsPage] Error al guardar perfil:', error)
    toast.error('Error al guardar', error.message || 'No se pudo guardar la información')
  } finally {
    guardandoPerfil.value = false
  }
}

const cancelarEdicionPerfil = () => {
  // Recargar datos originales
  cargarDatos()
}

// Métodos - Horarios
const crearHorario = async (datos) => {
  // No mostrar notificación aquí, se manejará en HorariosForm para batch
  try {
    await businessStore.crearHorario(datos)
  } catch (error) {
    console.error('[SettingsPage] Error al crear horario:', error)
    throw error
  }
}

const actualizarHorario = async (id, datos) => {
  try {
    await businessStore.actualizarHorario(id, datos)
    toast.success('Horario actualizado', 'El horario se actualizó correctamente')
  } catch (error) {
    console.error('[SettingsPage] Error al actualizar horario:', error)
    toast.error('Error al actualizar', error.message || 'No se pudo actualizar el horario')
  }
}

const eliminarHorario = async (id) => {
  try {
    await businessStore.eliminarHorario(id)
    toast.success('Horario eliminado', 'El horario se eliminó correctamente')
  } catch (error) {
    console.error('[SettingsPage] Error al eliminar horario:', error)
    toast.error('Error al eliminar', error.message || 'No se pudo eliminar el horario')
  }
}

// Cargar datos
const cargarDatos = async () => {
  try {
    await Promise.all([
      businessStore.cargarNegocio(),
      businessStore.cargarHorarios(),
    ])
  } catch (error) {
    console.error('[SettingsPage] Error al cargar datos:', error)
    toast.error('Error al cargar', error.message || 'No se pudieron cargar los datos')
  }
}

// Lifecycle
onMounted(async () => {
  // Cargar perfil completo del usuario para tener apellidos y teléfono
  cargandoPerfil.value = true
  try {
    await authStore.cargarPerfil()
    resetPerfilForm()
  } finally {
    cargandoPerfil.value = false
  }
  cargarDatos()
})
</script>
