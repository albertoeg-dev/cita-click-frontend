<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Sección: Información de la Cita -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Información de la Cita</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Selector de Cliente -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Cliente <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.clienteId"
            @change="validateField('clienteId')"
            :disabled="loading"
            class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
            :class="errors.clienteId ? 'border-red-300' : 'border-gray-300'"
          >
            <option value="">Selecciona un cliente</option>
            <option
              v-for="cliente in clientes"
              :key="cliente.id"
              :value="cliente.id"
            >
              {{ formatearNombreCompleto(cliente.nombre, cliente.apellidoPaterno, cliente.apellidoMaterno) }}
              {{ cliente.telefono ? `- ${cliente.telefono}` : '' }}
            </option>
          </select>
          <p v-if="errors.clienteId" class="mt-1 text-sm text-red-600">{{ errors.clienteId }}</p>
        </div>

        <!-- Selector de Servicio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Servicio <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.servicioId"
            @change="handleServicioChange"
            :disabled="loading"
            class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
            :class="errors.servicioId ? 'border-red-300' : 'border-gray-300'"
          >
            <option value="">Selecciona un servicio</option>
            <option
              v-for="servicio in serviciosActivos"
              :key="servicio.id"
              :value="servicio.id"
            >
              {{ servicio.nombre }} - {{ formatearPrecio(servicio.precio) }} ({{ formatearDuracion(servicio.duracion) }})
            </option>
          </select>
          <p v-if="errors.servicioId" class="mt-1 text-sm text-red-600">{{ errors.servicioId }}</p>
        </div>
      </div>
    </div>

    <!-- Sección: Fecha y Hora -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Fecha y Hora</h4>

      <!-- Selector de Fecha -->
      <div class="mb-4">
        <DatePicker
          v-model="formData.fecha"
          label="Fecha de la cita"
          :error="errors.fecha"
          :required="true"
          :disable-past="!isEditMode"
          @change="cargarDisponibilidad"
        />
      </div>

      <!-- Selector de Hora con Disponibilidad Dinámica -->
      <div v-if="formData.fecha && formData.servicioId">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Selecciona un horario disponible <span class="text-red-500">*</span>
        </label>

        <HorarioSelector
          v-model="horarioSeleccionado"
          :horarios="horarios"
          :horarios-recomendados="horariosRecomendados"
          :otros-horarios="otrosHorarios"
          :loading="loadingDisponibilidad"
          :error="errorDisponibilidad"
          :duracion-total="duracionTotal"
        />

        <p v-if="errors.hora" class="mt-2 text-sm text-red-600">{{ errors.hora }}</p>
      </div>
    </div>

    <!-- Sección: Notas -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Notas Adicionales</h4>
      <Textarea
        v-model="formData.notas"
        label="Notas"
        placeholder="Preferencias, observaciones especiales..."
        :rows="3"
        :maxlength="500"
        help="Opcional - Información adicional sobre la cita"
      />
    </div>

    <!-- Sección: Recurrencia -->
    <div v-if="!isEditMode">
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Recurrencia (Opcional)</h4>

      <!-- Opción de recurrencia -->
      <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
        <input
          type="checkbox"
          id="esRecurrente"
          v-model="formData.esRecurrente"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="esRecurrente" class="text-sm font-medium text-gray-700 cursor-pointer">
          Hacer esta cita recurrente
        </label>
      </div>

      <!-- Configuración de recurrencia -->
      <RecurrenceConfig
        v-if="formData.esRecurrente"
        v-model="formData.recurrencia"
        :fecha-inicio="formData.fecha"
        @remove="formData.esRecurrente = false"
      />
      <p v-if="errors.recurrencia" class="mt-2 text-sm text-red-600">{{ errors.recurrencia }}</p>
    </div>

    <!-- Preview de la cita -->
    <div v-if="showPreview && isFormValid" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h4 class="text-sm font-semibold text-green-900 mb-2">Resumen de la cita:</h4>
      <div class="space-y-1 text-sm text-green-800">
        <p><strong>Cliente:</strong> {{ clienteSeleccionado?.nombre }} {{ clienteSeleccionado?.apellidoPaterno }}</p>
        <p><strong>Servicio:</strong> {{ servicioSeleccionado?.nombre }}</p>
        <p><strong>Fecha:</strong> {{ formatearFechaLarga(formData.fecha) }}</p>
        <p><strong>Hora:</strong> {{ formData.hora }}</p>
        <p><strong>Duración:</strong> {{ formatearDuracion(servicioSeleccionado?.duracion) }}</p>
        <p><strong>Precio:</strong> {{ formatearPrecio(servicioSeleccionado?.precio) }}</p>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t">
      <button
        type="button"
        @click="handleCancel"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar
      </button>
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Cita
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useClientesStore } from '../../stores/clientesStore'
import { useServiciosStore } from '../../stores/serviciosStore'
import { useCitasStore } from '../../stores/citasStore'
import { useDisponibilidad } from '../../composables/useDisponibilidad'
import DatePicker from '../common/DatePicker.vue'
import Textarea from '../common/Textarea.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import HorarioSelector from '../HorarioSelector.vue'
import RecurrenceConfig from './RecurrenceConfig.vue'
import { validarCita, requerido } from '../../utils/validators'
import { formatearNombreCompleto, formatearPrecio, formatearDuracion, formatearFechaLarga } from '../../utils/formatters'

const props = defineProps({
  cita: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showPreview: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const clientesStore = useClientesStore()
const serviciosStore = useServiciosStore()
const citasStore = useCitasStore()

// Composable de disponibilidad
const {
  horarios,
  horariosRecomendados,
  otrosHorarios,
  duracionTotal,
  loading: loadingDisponibilidad,
  error: errorDisponibilidad,
  obtenerHorariosDisponibles
} = useDisponibilidad()

// Estado del formulario
const formData = ref({
  clienteId: '',
  servicioId: '',
  fecha: '',
  hora: '',
  notas: '',
  esRecurrente: false,
  recurrencia: {
    tipoRecurrencia: '',
    intervaloRecurrencia: null,
    fechaFinRecurrencia: null,
    numeroOcurrencias: null,
    diasSemana: '',
  },
})

const errors = ref({
  clienteId: '',
  servicioId: '',
  fecha: '',
  hora: '',
})

const horarioSeleccionado = ref(null)

const isEditMode = computed(() => !!props.cita)

// Computed
const clientes = computed(() => clientesStore.clientes)
const serviciosActivos = computed(() => serviciosStore.serviciosActivos)

const clienteSeleccionado = computed(() =>
  clientes.value.find(c => c.id === formData.value.clienteId)
)

const servicioSeleccionado = computed(() =>
  serviciosActivos.value.find(s => s.id === formData.value.servicioId)
)

const isFormValid = computed(() => {
  const baseValid = (
    requerido(formData.value.clienteId) &&
    requerido(formData.value.servicioId) &&
    requerido(formData.value.fecha) &&
    requerido(formData.value.hora)
  )

  if (formData.value.esRecurrente) {
    return baseValid && requerido(formData.value.recurrencia.tipoRecurrencia)
  }

  return baseValid
})

// Validar campo
const validateField = (field) => {
  console.log('[AppointmentForm] Validando campo:', field)

  switch (field) {
    case 'clienteId':
      errors.value.clienteId = requerido(formData.value.clienteId) ? '' : 'Debes seleccionar un cliente'
      break
    case 'servicioId':
      errors.value.servicioId = requerido(formData.value.servicioId) ? '' : 'Debes seleccionar un servicio'
      break
    case 'fecha':
      errors.value.fecha = requerido(formData.value.fecha) ? '' : 'La fecha es requerida'
      break
    case 'hora':
      errors.value.hora = requerido(formData.value.hora) ? '' : 'Debes seleccionar una hora'
      break
  }
}

// Cargar disponibilidad cuando cambia fecha o servicio
const cargarDisponibilidad = async () => {
  if (!formData.value.fecha || !formData.value.servicioId) {
    return
  }

  // Resetear hora seleccionada
  formData.value.hora = ''
  horarioSeleccionado.value = null

  try {
    console.log('[AppointmentForm] Cargando disponibilidad para:', formData.value.fecha, formData.value.servicioId)

    // Usar el composable de disponibilidad con el ID de la cita si estamos editando
    const citaIdExcluir = isEditMode.value ? props.cita.id : null
    await obtenerHorariosDisponibles(formData.value.fecha, [formData.value.servicioId], citaIdExcluir)

    console.log('[AppointmentForm] Horarios cargados:', horarios.value.length)
  } catch (error) {
    console.error('[AppointmentForm] Error al cargar disponibilidad:', error)
  }
}

// Manejar cambio de servicio
const handleServicioChange = () => {
  validateField('servicioId')
  cargarDisponibilidad()
}

// Watch para sincronizar horario seleccionado con formData.hora
watch(horarioSeleccionado, (nuevoHorario) => {
  if (nuevoHorario) {
    console.log('[AppointmentForm] Horario seleccionado:', nuevoHorario)
    formData.value.hora = nuevoHorario.horaInicio
    validateField('hora')
  }
})

// Validar formulario completo
const validateForm = () => {
  console.log('[AppointmentForm] Validando formulario completo')

  const fechaHora = `${formData.value.fecha}T${formData.value.hora}:00`
  const validation = validarCita({
    ...formData.value,
    fechaHora
  })

  if (!validation.valido) {
    errors.value = { ...errors.value, ...validation.errores }
    console.log('[AppointmentForm] Errores de validación:', validation.errores)
  }

  return validation.valido
}

// Manejar envío
const handleSubmit = () => {
  console.log('[AppointmentForm] Enviando formulario')

  if (!validateForm()) {
    console.warn('[AppointmentForm] Formulario inválido')
    return
  }

  // Construir datos para enviar con fecha y hora separadas
  const datos = {
    clienteId: formData.value.clienteId,
    servicioId: formData.value.servicioId,
    fecha: formData.value.fecha,        // "2026-01-09"
    hora: formData.value.hora,          // "10:00"
    notas: formData.value.notas || undefined,
  }

  // Agregar datos de recurrencia si aplica
  if (formData.value.esRecurrente && formData.value.recurrencia.tipoRecurrencia) {
    datos.esRecurrente = true
    datos.tipoRecurrencia = formData.value.recurrencia.tipoRecurrencia

    if (formData.value.recurrencia.intervaloRecurrencia) {
      datos.intervaloRecurrencia = formData.value.recurrencia.intervaloRecurrencia
    }

    if (formData.value.recurrencia.fechaFinRecurrencia) {
      datos.fechaFinRecurrencia = formData.value.recurrencia.fechaFinRecurrencia
    }

    if (formData.value.recurrencia.numeroOcurrencias) {
      datos.numeroOcurrencias = formData.value.recurrencia.numeroOcurrencias
    }

    if (formData.value.recurrencia.diasSemana) {
      datos.diasSemana = formData.value.recurrencia.diasSemana
    }
  }

  console.log('[AppointmentForm] Datos a enviar:', datos)
  emit('submit', datos)
}

// Manejar cancelación
const handleCancel = () => {
  console.log('[AppointmentForm] Cancelando formulario')
  emit('cancel')
}

// Resetear formulario
const resetForm = () => {
  console.log('[AppointmentForm] Reseteando formulario')
  formData.value = {
    clienteId: '',
    servicioId: '',
    fecha: '',
    hora: '',
    notas: '',
    esRecurrente: false,
    recurrencia: {
      tipoRecurrencia: '',
      intervaloRecurrencia: null,
      fechaFinRecurrencia: null,
      numeroOcurrencias: null,
      diasSemana: '',
    },
  }
  errors.value = {
    clienteId: '',
    servicioId: '',
    fecha: '',
    hora: '',
  }
  horarioSeleccionado.value = null
}

// Cargar cita si está en modo edición
const loadCita = () => {
  if (props.cita) {
    console.log('[AppointmentForm] Cargando cita para edición:', props.cita)

    // Extraer fecha y hora de fechaHora
    const fechaHora = props.cita.fechaHora || ''
    const [fecha, horaCompleta] = fechaHora.split('T')
    const hora = horaCompleta ? horaCompleta.substring(0, 5) : ''

    formData.value = {
      clienteId: props.cita.cliente?.id || props.cita.clienteId || '',
      servicioId: props.cita.servicio?.id || props.cita.servicioId || '',
      fecha: fecha || '',
      hora: hora || '',
      notas: props.cita.notas || '',
      esRecurrente: false, // No permitir editar recurrencia
      recurrencia: {
        tipoRecurrencia: '',
        intervaloRecurrencia: null,
        fechaFinRecurrencia: null,
        numeroOcurrencias: null,
        diasSemana: '',
      },
    }

    // Cargar disponibilidad si tenemos fecha y servicio
    if (formData.value.fecha && formData.value.servicioId) {
      cargarDisponibilidad().then(() => {
        // Una vez cargados los horarios, buscar el horario que coincida con la hora de la cita
        if (formData.value.hora && horarios.value.length > 0) {
          const horarioMatch = horarios.value.find(h => h.horaInicio === formData.value.hora)
          if (horarioMatch) {
            horarioSeleccionado.value = horarioMatch
          }
        }
      })
    }
  } else {
    resetForm()
  }
}

// Cargar datos necesarios
const cargarDatos = async () => {
  console.log('[AppointmentForm] Cargando clientes y servicios')

  try {
    await Promise.all([
      clientesStore.clientes.length === 0 ? clientesStore.cargarClientes() : Promise.resolve(),
      serviciosStore.servicios.length === 0 ? serviciosStore.cargarServicios(true) : Promise.resolve(),
    ])
  } catch (error) {
    console.error('[AppointmentForm] Error al cargar datos:', error)
  }
}

// Watch para recargar cuando cambie la cita
watch(() => props.cita, loadCita, { immediate: true })

onMounted(() => {
  console.log('[AppointmentForm] Componente montado, modo edición:', isEditMode.value)
  cargarDatos()
})

defineExpose({
  resetForm,
  validateForm,
})
</script>
