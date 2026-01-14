<template>
  <DashboardLayout>
    <template #title>
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Configuración
      </div>
    </template>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">Configuración</h2>
      <p class="text-slate-600">Administra la información y horarios de tu negocio</p>
    </div>

    <!-- Tabs -->
    <div class="card mb-6">
      <div class="flex gap-4 border-b border-slate-200">
        <button
          @click="activeTab = 'profile'"
          :class="[
            'px-4 py-3 font-medium transition-all border-b-2 -mb-px flex items-center gap-2',
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
        <button
          @click="activeTab = 'hours'"
          :class="[
            'px-4 py-3 font-medium transition-all border-b-2 -mb-px flex items-center gap-2',
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
          :show-preview="true"
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
import { ref, onMounted } from 'vue'
import { useBusinessStore } from '../stores/businessStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import BusinessProfileForm from '../components/features/BusinessProfileForm.vue'
import HorariosForm from '../components/features/HorariosForm.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const businessStore = useBusinessStore()
const toast = useToast()

// Estado
const activeTab = ref('profile')
const guardandoPerfil = ref(false)

// Métodos - Perfil
const guardarPerfil = async (datos) => {
  guardandoPerfil.value = true

  try {
    console.log('[SettingsPage] Guardando perfil del negocio:', datos)

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
  console.log('[SettingsPage] Cancelando edición del perfil')
  // Recargar datos originales
  cargarDatos()
}

// Métodos - Horarios
const crearHorario = async (datos) => {
  try {
    console.log('[SettingsPage] Creando horario:', datos)
    await businessStore.crearHorario(datos)
    toast.success('Horario agregado', 'El horario se agregó correctamente')
  } catch (error) {
    console.error('[SettingsPage] Error al crear horario:', error)
    toast.error('Error al agregar', error.message || 'No se pudo agregar el horario')
  }
}

const actualizarHorario = async (id, datos) => {
  try {
    console.log('[SettingsPage] Actualizando horario:', id, datos)
    await businessStore.actualizarHorario(id, datos)
    toast.success('Horario actualizado', 'El horario se actualizó correctamente')
  } catch (error) {
    console.error('[SettingsPage] Error al actualizar horario:', error)
    toast.error('Error al actualizar', error.message || 'No se pudo actualizar el horario')
  }
}

const eliminarHorario = async (id) => {
  try {
    console.log('[SettingsPage] Eliminando horario:', id)
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
    console.log('[SettingsPage] Cargando datos del negocio')
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
onMounted(() => {
  console.log('[SettingsPage] Componente montado')
  cargarDatos()
})
</script>
