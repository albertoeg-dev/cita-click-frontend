<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Horarios de Atención</h3>
        <p class="text-sm text-gray-600">Configura los días y horarios en que tu negocio atiende</p>
      </div>
      <button
        @click="abrirModalAgregar"
        :disabled="loading"
        class="btn btn-primary btn-sm"
      >
        + Agregar Horario
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner size="md" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="horarios.length === 0"
      title="Sin horarios configurados"
      description="Agrega los días y horarios en que tu negocio está disponible para atender clientes"
    >
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </template>
      <template #action>
        <button @click="abrirModalAgregar" class="btn btn-primary">
          + Agregar Primer Horario
        </button>
      </template>
    </EmptyState>

    <!-- Lista de Horarios -->
    <div v-else class="space-y-3">
      <div
        v-for="horario in horariosOrdenados"
        :key="horario.id"
        class="card-hover flex items-center justify-between"
      >
        <!-- Información del horario -->
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0 w-24">
            <Badge :variant="horario.activo ? 'success' : 'default'">
              {{ DIAS_SEMANA_LABELS[horario.diaSemana] }}
            </Badge>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">
              {{ formatearHora(horario.horaApertura) }} - {{ formatearHora(horario.horaCierre) }}
            </span>
          </div>
          <div v-if="!horario.activo" class="text-xs text-gray-500">
            (Inactivo)
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex gap-2">
          <button
            @click="abrirModalEditar(horario)"
            class="text-sm text-blue-600 hover:text-blue-900"
            :disabled="loading"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminar(horario)"
            class="text-sm text-red-600 hover:text-red-900"
            :disabled="loading"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Resumen -->
    <div v-if="horarios.length > 0" class="card bg-green-50 border-green-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-green-900 font-medium">Horarios configurados</p>
          <p class="text-2xl font-bold text-green-900">{{ horarios.length }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-green-900 font-medium">Días activos</p>
          <p class="text-2xl font-bold text-green-900">{{ horariosActivos.length }}</p>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar - Interfaz mejorada -->
    <Modal
      v-model="modalAbierto"
      :title="modoEdicion ? 'Editar Horario' : 'Configurar Horarios'"
      size="lg"
      :closable="!guardando"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Selector de días (solo para modo agregar) -->
        <div v-if="!modoEdicion">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Selecciona los días <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="dia in DIAS_SEMANA_OPTIONS"
              :key="dia.value"
              type="button"
              @click="toggleDia(dia.value)"
              :disabled="guardando"
              :class="[
                'px-4 py-3 border-2 rounded-lg font-medium text-sm transition-all relative',
                formData.diasSeleccionados.includes(dia.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : isDiaConfigurado(dia.value)
                  ? 'border-green-500 bg-green-50 text-green-700 hover:border-green-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              ]"
            >
              <svg v-if="formData.diasSeleccionados.includes(dia.value)" class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="isDiaConfigurado(dia.value)" class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ dia.label }}
            </button>
          </div>
          <p v-if="errors.dias" class="mt-2 text-sm text-red-600">{{ errors.dias }}</p>
          <p class="mt-2 text-xs text-gray-500">Puedes seleccionar múltiples días con el mismo horario</p>
        </div>

        <!-- Día único para modo edición -->
        <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm font-medium text-blue-900">
            Editando horario de: <strong>{{ DIAS_SEMANA_LABELS[formData.diaSemana] }}</strong>
          </p>
        </div>

        <!-- Horarios en grid de 2 columnas -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Horario de atención
          </label>
          <div class="grid grid-cols-2 gap-4">
            <TimePicker
              v-model="formData.horaInicio"
              label="Apertura"
              :error="errors.horaInicio"
              :required="true"
              :disabled="guardando"
              @change="validateField('horaInicio')"
            />

            <TimePicker
              v-model="formData.horaFin"
              label="Cierre"
              :error="errors.horaFin"
              :required="true"
              :disabled="guardando"
              @change="validateField('horaFin')"
            />
          </div>
        </div>

        <!-- Activo checkbox con mejor diseño -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <label for="activo" class="font-medium text-gray-900">
              Horario activo
            </label>
            <p class="text-xs text-gray-500">El negocio estará disponible en estos horarios</p>
          </div>
          <div class="relative inline-block w-12 mr-2 align-middle select-none">
            <input
              v-model="formData.activo"
              type="checkbox"
              id="activo"
              :disabled="guardando"
              class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all"
            />
            <label
              for="activo"
              class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              :class="{ 'bg-blue-500': formData.activo }"
            ></label>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="cerrarModal"
            :disabled="guardando"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="guardando || !isFormValid"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <LoadingSpinner v-if="guardando" size="sm" />
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ modoEdicion ? 'Actualizar Horario' : `Guardar ${formData.diasSeleccionados.length} Horario${formData.diasSeleccionados.length !== 1 ? 's' : ''}` }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Eliminar horario"
      :message="`¿Estás seguro de que deseas eliminar el horario del ${DIAS_SEMANA_LABELS[horarioAEliminar?.diaSemana]}?`"
      description="Esta acción no se puede deshacer."
      confirm-text="Eliminar"
      @confirm="eliminarHorario"
      @cancel="horarioAEliminar = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TimePicker from '../common/TimePicker.vue'
import Badge from '../common/Badge.vue'
import Modal from '../common/Modal.vue'
import ConfirmDialog from '../common/ConfirmDialog.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import EmptyState from '../common/EmptyState.vue'
import { validarHorario, requerido } from '../../utils/validators'
import { DIAS_SEMANA_LABELS, DIAS_SEMANA } from '../../utils/constants'
import { useToast } from '../../composables/useToast'

const props = defineProps({
  horarios: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['crear', 'actualizar', 'eliminar'])

// Composables
const toast = useToast()

// Referencias
const confirmDialogRef = ref(null)

// Estado
const modalAbierto = ref(false)
const modoEdicion = ref(false)
const horarioSeleccionado = ref(null)
const horarioAEliminar = ref(null)
const guardando = ref(false)

const formData = ref({
  diaSemana: '',
  diasSeleccionados: [],  // Para modo agregar múltiple
  horaInicio: '',
  horaFin: '',
  activo: true,
})

const errors = ref({
  diaSemana: '',
  dias: '',
  horaInicio: '',
  horaFin: '',
})

// Opciones de días
const DIAS_SEMANA_OPTIONS = DIAS_SEMANA.map((dia, index) => ({
  value: index,
  label: DIAS_SEMANA_LABELS[index],
}))

// Computed
const horariosOrdenados = computed(() => {
  return [...props.horarios].sort((a, b) => a.diaSemana - b.diaSemana)
})

const horariosActivos = computed(() => {
  return props.horarios.filter(h => h.activo)
})

const isFormValid = computed(() => {
  const tieneHorarios = requerido(formData.value.horaInicio) && requerido(formData.value.horaFin)

  if (modoEdicion.value) {
    return formData.value.diaSemana !== '' && tieneHorarios
  } else {
    return formData.value.diasSeleccionados.length > 0 && tieneHorarios
  }
})

// Verificar si un día ya tiene horario configurado
const isDiaConfigurado = (diaValue) => {
  return props.horarios.some(h => h.diaSemana === diaValue)
}

// Métodos
const toggleDia = (diaValue) => {
  const index = formData.value.diasSeleccionados.indexOf(diaValue)
  if (index > -1) {
    formData.value.diasSeleccionados.splice(index, 1)
  } else {
    formData.value.diasSeleccionados.push(diaValue)
  }
  // Limpiar error si hay días seleccionados
  if (formData.value.diasSeleccionados.length > 0) {
    errors.value.dias = ''
  }
}

const formatearHora = (hora) => {
  if (!hora) return ''
  // Si viene en formato HH:mm:ss, quedarse solo con HH:mm
  return hora.substring(0, 5)
}

const validateField = (field) => {

  switch (field) {
    case 'diaSemana':
      errors.value.diaSemana = formData.value.diaSemana !== '' ? '' : 'Debes seleccionar un día'
      break
    case 'horaInicio':
      errors.value.horaInicio = requerido(formData.value.horaInicio) ? '' : 'La hora de inicio es requerida'
      break
    case 'horaFin':
      errors.value.horaFin = requerido(formData.value.horaFin) ? '' : 'La hora de fin es requerida'
      if (formData.value.horaInicio && formData.value.horaFin) {
        if (formData.value.horaFin <= formData.value.horaInicio) {
          errors.value.horaFin = 'La hora de fin debe ser posterior a la hora de inicio'
        }
      }
      break
  }
}

const validateForm = () => {

  const validation = validarHorario({
    ...formData.value,
    diaSemana: Number(formData.value.diaSemana),
  })

  if (!validation.valido) {
    errors.value = { ...errors.value, ...validation.errores }
  }

  return validation.valido
}

const abrirModalAgregar = () => {
  modoEdicion.value = false
  horarioSeleccionado.value = null
  resetForm()
  modalAbierto.value = true
}

const abrirModalEditar = (horario) => {
  modoEdicion.value = true
  horarioSeleccionado.value = horario
  formData.value = {
    diaSemana: String(horario.diaSemana),
    horaInicio: formatearHora(horario.horaApertura),
    horaFin: formatearHora(horario.horaCierre),
    activo: horario.activo,
  }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  modoEdicion.value = false
  horarioSeleccionado.value = null
  guardando.value = false
  resetForm()
}

const handleSubmit = async () => {

  if (!validateForm()) {
    return
  }

  guardando.value = true

  const horaInicio = formData.value.horaInicio + ':00' // Agregar segundos
  const horaFin = formData.value.horaFin + ':00'
  const activo = formData.value.activo

  try {
    if (modoEdicion.value) {
      // Modo edición: actualizar un solo horario
      const datos = {
        diaSemana: Number(formData.value.diaSemana),
        horaInicio,
        horaFin,
        activo,
      }
      emit('actualizar', horarioSeleccionado.value.id, datos)
      toast.success('Horario actualizado', 'El horario se actualizó correctamente')
    } else {
      // Modo crear: crear múltiples horarios
      const cantidadDias = formData.value.diasSeleccionados.length
      let exitosos = 0
      let errores = 0

      for (const dia of formData.value.diasSeleccionados) {
        try {
          const datos = {
            diaSemana: Number(dia),
            horaInicio,
            horaFin,
            activo,
          }
          emit('crear', datos)
          exitosos++
        } catch (error) {
          console.error('[HorariosForm] Error al crear horario:', error)
          errores++
        }
      }

      // Mostrar una sola notificación al final
      if (errores === 0) {
        const mensaje = cantidadDias === 1
          ? 'El horario se agregó correctamente'
          : `Se agregaron ${cantidadDias} horarios correctamente`
        toast.success('Horarios guardados', mensaje)
      } else if (exitosos > 0) {
        toast.warning('Guardado parcial', `Se guardaron ${exitosos} de ${cantidadDias} horarios`)
      } else {
        toast.error('Error al guardar', 'No se pudieron guardar los horarios')
      }
    }
    cerrarModal()
  } catch (error) {
    console.error('[HorariosForm] Error al guardar:', error)
    toast.error('Error', error.message || 'Ocurrió un error al guardar')
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (horario) => {
  horarioAEliminar.value = horario
  confirmDialogRef.value?.open()
}

const eliminarHorario = () => {
  if (!horarioAEliminar.value) return

  emit('eliminar', horarioAEliminar.value.id)
  confirmDialogRef.value?.close()
  horarioAEliminar.value = null
}

const resetForm = () => {
  formData.value = {
    diaSemana: '',
    diasSeleccionados: [],
    horaInicio: '',
    horaFin: '',
    activo: true,
  }
  errors.value = {
    diaSemana: '',
    dias: '',
    horaInicio: '',
    horaFin: '',
  }
}

defineExpose({
  abrirModalAgregar,
})
</script>

<style scoped>
/* Toggle switch customizado */
.toggle-checkbox:checked {
  right: 0;
  border-color: #3b82f6;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #3b82f6;
}
.toggle-label {
  transition: background-color 0.2s ease;
}
.toggle-checkbox {
  transition: all 0.2s ease;
  right: 1.5rem;
}
</style>
