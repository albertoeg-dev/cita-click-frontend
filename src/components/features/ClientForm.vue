<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Sección: Información Personal -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Información Personal</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nombre -->
        <Input
          v-model="formData.nombre"
          label="Nombre"
          placeholder="Ej: Juan"
          :error="errors.nombre"
          :required="true"
          @blur="validateField('nombre')"
        />

        <!-- Apellido Paterno -->
        <Input
          v-model="formData.apellidoPaterno"
          label="Apellido Paterno"
          placeholder="Ej: Pérez"
          :error="errors.apellidoPaterno"
          :required="true"
          @blur="validateField('apellidoPaterno')"
        />

        <!-- Apellido Materno -->
        <Input
          v-model="formData.apellidoMaterno"
          label="Apellido Materno"
          placeholder="Ej: García"
          help="Opcional"
        />

        <!-- Género -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            v-model="formData.genero"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>
          <p class="mt-1 text-xs text-gray-500">Opcional</p>
        </div>

        <!-- Fecha de Nacimiento - ocupa 2 columnas en pantallas grandes para mantener consistencia -->
        <div class="md:col-span-2">
          <DatePicker
            v-model="formData.fechaNacimiento"
            label="Fecha de nacimiento"
            :error="errors.fechaNacimiento"
            help="Opcional - Para felicitaciones de cumpleaños"
            :max="obtenerFechaActual()"
            @blur="validateField('fechaNacimiento')"
          />
        </div>
      </div>
    </div>

    <!-- Sección: Información de Contacto -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Información de Contacto</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Email -->
        <Input
          v-model="formData.email"
          type="email"
          label="Correo electrónico"
          placeholder="juan@ejemplo.com"
          :error="errors.email"
          help="Opcional - Para enviar recordatorios"
          @blur="validateField('email')"
        >
          <template #icon>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </template>
        </Input>

        <!-- Teléfono -->
        <Input
          v-model="formData.telefono"
          type="tel"
          label="Teléfono"
          :placeholder="VALIDACIONES.TELEFONO_PLACEHOLDER"
          :error="errors.telefono"
          help="Formato: +52 XX XXXX XXXX"
          @blur="validateField('telefono')"
        >
          <template #icon>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </template>
        </Input>
      </div>
    </div>

    <!-- Sección: Notas (ancho completo) -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Notas Adicionales</h4>
      <Textarea
        v-model="formData.notas"
        label="Notas"
        placeholder="Alergias, preferencias, observaciones..."
        :rows="3"
        :maxlength="500"
        help="Opcional - Información importante sobre el cliente"
      />
    </div>

    <!-- Preview -->
    <div v-if="showPreview && isFormValid" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="text-sm font-semibold text-blue-900 mb-2">Vista previa:</h4>
      <div class="space-y-1 text-sm text-blue-800">
        <p><strong>Nombre:</strong> {{ formatearNombreCompleto(formData.nombre, formData.apellidoPaterno, formData.apellidoMaterno) }}</p>
        <p v-if="formData.email"><strong>Email:</strong> {{ formData.email }}</p>
        <p v-if="formData.telefono"><strong>Teléfono:</strong> {{ formatearTelefono(formData.telefono) }}</p>
        <p v-if="formData.genero"><strong>Género:</strong> {{ formData.genero }}</p>
        <p v-if="formData.fechaNacimiento"><strong>Fecha de nacimiento:</strong> {{ formatearFecha(formData.fechaNacimiento) }}</p>
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
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Cliente
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Input from '../common/Input.vue'
import Textarea from '../common/Textarea.vue'
import DatePicker from '../common/DatePicker.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import { validarCliente, requerido, validarEmail, validarTelefono, validarFecha } from '../../utils/validators'
import { formatearNombreCompleto, formatearTelefono, formatearFecha, obtenerFechaActual } from '../../utils/formatters'
import { VALIDACIONES } from '../../utils/constants'

const props = defineProps({
  cliente: {
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

// Estado del formulario
const formData = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  email: '',
  telefono: '',
  genero: '',
  fechaNacimiento: '',
  notas: '',
})

const errors = ref({
  nombre: '',
  apellidoPaterno: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
})

const isEditMode = computed(() => !!props.cliente)

// Validar un campo específico
const validateField = (field) => {
  console.log('[ClientForm] Validando campo:', field, formData.value[field])

  switch (field) {
    case 'nombre':
      if (!requerido(formData.value.nombre)) {
        errors.value.nombre = 'El nombre es requerido'
      } else {
        errors.value.nombre = ''
      }
      break

    case 'apellidoPaterno':
      if (!requerido(formData.value.apellidoPaterno)) {
        errors.value.apellidoPaterno = 'El apellido paterno es requerido'
      } else {
        errors.value.apellidoPaterno = ''
      }
      break

    case 'email':
      if (formData.value.email && !validarEmail(formData.value.email)) {
        errors.value.email = 'El email no es válido'
      } else {
        errors.value.email = ''
      }
      break

    case 'telefono':
      if (formData.value.telefono && !validarTelefono(formData.value.telefono)) {
        errors.value.telefono = 'El teléfono debe tener el formato +52 XX XXXX XXXX'
      } else {
        errors.value.telefono = ''
      }
      break

    case 'fechaNacimiento':
      if (formData.value.fechaNacimiento && !validarFecha(formData.value.fechaNacimiento)) {
        errors.value.fechaNacimiento = 'La fecha no es válida'
      } else {
        errors.value.fechaNacimiento = ''
      }
      break
  }
}

// Validar todo el formulario
const validateForm = () => {
  console.log('[ClientForm] Validando formulario completo')
  const validation = validarCliente(formData.value)

  if (!validation.valido) {
    errors.value = validation.errores
    console.log('[ClientForm] Errores de validación:', validation.errores)
  }

  return validation.valido
}

const isFormValid = computed(() => {
  return (
    requerido(formData.value.nombre) &&
    requerido(formData.value.apellidoPaterno) &&
    (!formData.value.email || validarEmail(formData.value.email)) &&
    (!formData.value.telefono || validarTelefono(formData.value.telefono)) &&
    (!formData.value.fechaNacimiento || validarFecha(formData.value.fechaNacimiento))
  )
})

// Manejar envío del formulario
const handleSubmit = () => {
  console.log('[ClientForm] Enviando formulario')

  if (!validateForm()) {
    console.warn('[ClientForm] Formulario inválido')
    return
  }

  // Limpiar campos vacíos opcionales
  const datosLimpios = { ...formData.value }
  if (!datosLimpios.apellidoMaterno) delete datosLimpios.apellidoMaterno
  if (!datosLimpios.email) delete datosLimpios.email
  if (!datosLimpios.telefono) delete datosLimpios.telefono
  if (!datosLimpios.fechaNacimiento) delete datosLimpios.fechaNacimiento
  if (!datosLimpios.notas) delete datosLimpios.notas

  console.log('[ClientForm] Datos del formulario:', datosLimpios)
  emit('submit', datosLimpios)
}

// Manejar cancelación
const handleCancel = () => {
  console.log('[ClientForm] Cancelando formulario')
  emit('cancel')
}

// Resetear formulario
const resetForm = () => {
  console.log('[ClientForm] Reseteando formulario')
  formData.value = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    telefono: '',
    genero: '',
    fechaNacimiento: '',
    notas: '',
  }
  errors.value = {
    nombre: '',
    apellidoPaterno: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
  }
}

// Cargar datos del cliente si está en modo edición
const loadCliente = () => {
  if (props.cliente) {
    console.log('[ClientForm] Cargando cliente para edición:', props.cliente)
    formData.value = {
      nombre: props.cliente.nombre || '',
      apellidoPaterno: props.cliente.apellidoPaterno || '',
      apellidoMaterno: props.cliente.apellidoMaterno || '',
      email: props.cliente.email || '',
      telefono: props.cliente.telefono || '',
      genero: props.cliente.genero || '',
      fechaNacimiento: props.cliente.fechaNacimiento || '',
      notas: props.cliente.notas || '',
    }
  } else {
    resetForm()
  }
}

// Cargar cliente al montar o cuando cambie
watch(() => props.cliente, loadCliente, { immediate: true })

onMounted(() => {
  console.log('[ClientForm] Componente montado, modo edición:', isEditMode.value)
})

defineExpose({
  resetForm,
  validateForm,
})
</script>
