<template>
  <DashboardLayout>
    <template #title>
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Citas
      </div>
    </template>

    <template #headerActions>
      <button @click="abrirModalCrear" class="btn btn-primary btn-sm">
        + Nueva Cita
      </button>
    </template>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">Gestión de Citas</h2>
      <p class="text-slate-600">Administra todas las citas de tu negocio</p>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <DatePicker
          v-model="filtros.fecha"
          label="Filtrar por fecha"
          @change="aplicarFiltros"
        />
        <Select
          v-model="filtros.estado"
          label="Estado"
          :options="opcionesEstado"
          @change="aplicarFiltros"
        />
        <button @click="limpiarFiltros" class="btn btn-secondary self-end">
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="citasStore.loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="citasStore.citas.length === 0 && !filtros.fecha && !filtros.estado"
      title="Sin citas aún"
      description="Comienza creando tu primera cita para gestionar las reservas de tus clientes"
    >
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </template>
      <template #action>
        <button @click="abrirModalCrear" class="btn btn-primary">
          + Crear Primera Cita
        </button>
      </template>
    </EmptyState>

    <!-- No results -->
    <EmptyState
      v-else-if="citasStore.citas.length === 0"
      title="No se encontraron citas"
      description="No hay citas que coincidan con los filtros seleccionados"
    >
      <template #action>
        <button @click="limpiarFiltros" class="btn btn-secondary">
          Limpiar filtros
        </button>
      </template>
    </EmptyState>

    <!-- Lista de Citas -->
    <div v-else class="space-y-4">
      <div
        v-for="cita in citasStore.citas"
        :key="cita.id"
        class="card-hover"
      >
        <div class="flex items-start justify-between">
          <!-- Información de la cita -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <Badge :variant="getEstadoVariant(cita.estado)">
                {{ ESTADOS_CITA_LABELS[cita.estado] }}
              </Badge>
              <span class="text-sm text-gray-500">
                {{ formatearFechaHora(cita.fechaHora) }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Cliente -->
              <div>
                <p class="text-xs text-gray-500 mb-1">Cliente</p>
                <div class="flex items-center gap-2">
                  <div class="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 font-semibold text-xs">
                      {{ obtenerIniciales(cita.cliente?.nombre, cita.cliente?.apellidoPaterno) }}
                    </span>
                  </div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatearNombreCompleto(cita.cliente?.nombre, cita.cliente?.apellidoPaterno, cita.cliente?.apellidoMaterno) }}
                  </p>
                </div>
              </div>

              <!-- Servicio -->
              <div>
                <p class="text-xs text-gray-500 mb-1">Servicio</p>
                <p class="text-sm font-medium text-gray-900">{{ cita.servicio?.nombre }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatearDuracion(cita.servicio?.duracion) }} - {{ formatearPrecio(cita.servicio?.precio) }}
                </p>
              </div>

              <!-- Notas -->
              <div v-if="cita.notas">
                <p class="text-xs text-gray-500 mb-1">Notas</p>
                <p class="text-sm text-gray-700 truncate">{{ cita.notas }}</p>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex flex-col gap-2 ml-4">
            <!-- Cambiar estado -->
            <div v-if="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'" class="flex gap-2">
              <button
                v-if="cita.estado === 'PENDIENTE'"
                @click="cambiarEstado(cita, 'CONFIRMADA')"
                class="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                title="Confirmar cita"
              >
                Confirmar
              </button>
              <button
                v-if="cita.estado === 'CONFIRMADA'"
                @click="cambiarEstado(cita, 'COMPLETADA')"
                class="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                title="Marcar como completada"
              >
                Completar
              </button>
            </div>

            <!-- Editar y Cancelar -->
            <div class="flex gap-2">
              <button
                v-if="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'"
                @click="abrirModalEditar(cita)"
                class="text-sm text-blue-600 hover:text-blue-900"
              >
                Editar
              </button>
              <button
                v-if="cita.estado !== 'CANCELADA'"
                @click="confirmarCancelar(cita)"
                class="text-sm text-red-600 hover:text-red-900"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen por estado -->
    <div v-if="citasStore.citas.length > 0" class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card bg-yellow-50 border-yellow-200">
        <p class="text-xs text-yellow-900 font-medium">Pendientes</p>
        <p class="text-2xl font-bold text-yellow-900">{{ citasStore.citasPendientes.length }}</p>
      </div>
      <div class="card bg-blue-50 border-blue-200">
        <p class="text-xs text-blue-900 font-medium">Confirmadas</p>
        <p class="text-2xl font-bold text-blue-900">{{ citasStore.citasConfirmadas.length }}</p>
      </div>
      <div class="card bg-green-50 border-green-200">
        <p class="text-xs text-green-900 font-medium">Completadas</p>
        <p class="text-2xl font-bold text-green-900">{{ citasStore.citasCompletadas.length }}</p>
      </div>
      <div class="card bg-red-50 border-red-200">
        <p class="text-xs text-red-900 font-medium">Canceladas</p>
        <p class="text-2xl font-bold text-red-900">{{ citasStore.citasCanceladas.length }}</p>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <Modal
      v-model="modalAbierto"
      :title="modoEdicion ? 'Editar Cita' : 'Crear Nueva Cita'"
      size="2xl"
      :closable="!guardando"
    >
      <AppointmentForm
        ref="appointmentFormRef"
        :cita="citaSeleccionada"
        :loading="guardando"
        @submit="guardarCita"
        @cancel="cerrarModal"
      />
    </Modal>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Cancelar cita"
      :message="`¿Estás seguro de que deseas cancelar esta cita?`"
      description="Esta acción cambiará el estado de la cita a CANCELADA."
      confirm-text="Cancelar cita"
      @confirm="cancelarCita"
      @cancel="citaACancelar = null"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCitasStore } from '../stores/citasStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import AppointmentForm from '../components/features/AppointmentForm.vue'
import Modal from '../components/common/Modal.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import DatePicker from '../components/common/DatePicker.vue'
import Select from '../components/common/Select.vue'
import Badge from '../components/common/Badge.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { formatearNombreCompleto, formatearPrecio, formatearDuracion, formatearFechaHora } from '../utils/formatters'
import { ESTADOS_CITA_LABELS } from '../utils/constants'

const citasStore = useCitasStore()
const toast = useToast()

// Referencias
const appointmentFormRef = ref(null)
const confirmDialogRef = ref(null)

// Estado del componente
const modalAbierto = ref(false)
const modoEdicion = ref(false)
const citaSeleccionada = ref(null)
const citaACancelar = ref(null)
const guardando = ref(false)

// Filtros
const filtros = ref({
  fecha: '',
  estado: '',
})

const opcionesEstado = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'CONFIRMADA', label: 'Confirmadas' },
  { value: 'COMPLETADA', label: 'Completadas' },
  { value: 'CANCELADA', label: 'Canceladas' },
]

// Métodos
const cargarCitas = async () => {
  try {
    console.log('[AppointmentsPage] Cargando citas')
    await citasStore.cargarCitas(filtros.value.fecha, filtros.value.estado)
  } catch (error) {
    console.error('[AppointmentsPage] Error al cargar citas:', error)
    toast.error('Error al cargar citas', error.message || 'Intenta de nuevo')
  }
}

const aplicarFiltros = async () => {
  console.log('[AppointmentsPage] Aplicando filtros:', filtros.value)
  await cargarCitas()
}

const limpiarFiltros = async () => {
  console.log('[AppointmentsPage] Limpiando filtros')
  filtros.value = {
    fecha: '',
    estado: '',
  }
  await cargarCitas()
}

const obtenerIniciales = (nombre, apellido) => {
  const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : ''
  const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : ''
  return inicial1 + inicial2
}

const getEstadoVariant = (estado) => {
  const variants = {
    PENDIENTE: 'warning',
    CONFIRMADA: 'info',
    COMPLETADA: 'success',
    CANCELADA: 'danger',
  }
  return variants[estado] || 'default'
}

const abrirModalCrear = () => {
  console.log('[AppointmentsPage] Abriendo modal para crear')
  modoEdicion.value = false
  citaSeleccionada.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (cita) => {
  console.log('[AppointmentsPage] Abriendo modal para editar:', cita)
  modoEdicion.value = true
  citaSeleccionada.value = { ...cita }
  modalAbierto.value = true
}

const cerrarModal = () => {
  console.log('[AppointmentsPage] Cerrando modal')
  modalAbierto.value = false
  modoEdicion.value = false
  citaSeleccionada.value = null
  guardando.value = false
}

const guardarCita = async (datos) => {
  guardando.value = true

  try {
    console.log('[AppointmentsPage] Guardando cita:', datos)

    if (modoEdicion.value) {
      await citasStore.actualizarCita(citaSeleccionada.value.id, datos)
      toast.success('Cita actualizada', 'La cita se actualizó correctamente')
    } else {
      await citasStore.crearCita(datos)
      toast.success('Cita creada', 'La cita se creó correctamente')
    }

    cerrarModal()
  } catch (error) {
    console.error('[AppointmentsPage] Error al guardar cita:', error)
    toast.error(
      'Error al guardar',
      error.message || 'No se pudo guardar la cita'
    )
  } finally {
    guardando.value = false
  }
}

const cambiarEstado = async (cita, nuevoEstado) => {
  try {
    console.log('[AppointmentsPage] Cambiando estado de cita:', cita.id, 'a', nuevoEstado)
    await citasStore.cambiarEstadoCita(cita.id, nuevoEstado)
    toast.success('Estado actualizado', `La cita se marcó como ${ESTADOS_CITA_LABELS[nuevoEstado]}`)
  } catch (error) {
    console.error('[AppointmentsPage] Error al cambiar estado:', error)
    toast.error(
      'Error al cambiar estado',
      error.message || 'No se pudo cambiar el estado'
    )
  }
}

const confirmarCancelar = (cita) => {
  console.log('[AppointmentsPage] Solicitando confirmación para cancelar:', cita)
  citaACancelar.value = cita
  confirmDialogRef.value?.open()
}

const cancelarCita = async () => {
  if (!citaACancelar.value) return

  confirmDialogRef.value?.setLoading(true)

  try {
    console.log('[AppointmentsPage] Cancelando cita:', citaACancelar.value)
    await citasStore.cancelarCita(citaACancelar.value.id)
    toast.success('Cita cancelada', 'La cita se canceló correctamente')
    confirmDialogRef.value?.close()
    citaACancelar.value = null
  } catch (error) {
    console.error('[AppointmentsPage] Error al cancelar cita:', error)
    toast.error(
      'Error al cancelar',
      error.message || 'No se pudo cancelar la cita'
    )
  } finally {
    confirmDialogRef.value?.setLoading(false)
  }
}

// Lifecycle
onMounted(() => {
  console.log('[AppointmentsPage] Componente montado')
  cargarCitas()
})
</script>
