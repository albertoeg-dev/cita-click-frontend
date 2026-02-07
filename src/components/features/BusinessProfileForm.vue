<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Sección: Información del Negocio -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Información del Negocio</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nombre del Negocio -->
        <Input
          v-model="formData.nombre"
          type="text"
          label="Nombre del Negocio"
          placeholder="Ej: Salón de Belleza Mary"
          :error="errors.nombre"
          :required="true"
          :disabled="loading"
          @blur="validateField('nombre')"
        />

        <!-- Tipo de Negocio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Negocio <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.tipo"
            @change="validateField('tipo')"
            :disabled="loading"
            class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
            :class="errors.tipo ? 'border-red-300' : 'border-gray-300'"
          >
            <option value="">Selecciona un tipo</option>
            <option value="SALON">Salón de Belleza</option>
            <option value="SPA">Spa</option>
            <option value="CLINICA">Clínica</option>
            <option value="CONSULTORIO">Consultorio</option>
            <option value="OTRO">Otro</option>
          </select>
          <p v-if="errors.tipo" class="mt-1 text-sm text-red-600">{{ errors.tipo }}</p>
        </div>

        <!-- Descripción - full width -->
        <div class="md:col-span-2">
          <Textarea
            v-model="formData.descripcion"
            label="Descripción"
            placeholder="Describe brevemente tu negocio y los servicios que ofreces..."
            :rows="4"
            :maxlength="500"
            help="Opcional - Esta descripción puede ser visible para tus clientes"
          />
        </div>
      </div>
    </div>

    <!-- Sección: Información de Contacto -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Información de Contacto</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Email de Contacto -->
        <Input
          v-model="formData.email"
          type="email"
          label="Email de Contacto"
          placeholder="contacto@tunegocio.com"
          :error="errors.email"
          :disabled="loading"
          @blur="validateField('email')"
        >
          <template #icon>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </template>
        </Input>

        <!-- Teléfono -->
        <Input
          v-model="formData.telefono"
          type="tel"
          label="Teléfono de Contacto"
          placeholder="5512345678"
          :error="errors.telefono"
          :required="true"
          :disabled="loading"
          help="Formato: 10 dígitos sin espacios ni guiones"
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

    <!-- Sección: Dirección -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Dirección</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Calle y Número -->
        <Input
          v-model="formData.direccion.calle"
          type="text"
          label="Calle y Número"
          placeholder="Av. Principal 123"
          :error="errors.calle"
          :disabled="loading"
          @blur="validateField('calle')"
        />

        <!-- Colonia -->
        <Input
          v-model="formData.direccion.colonia"
          type="text"
          label="Colonia"
          placeholder="Centro"
          :disabled="loading"
        />

        <!-- Ciudad -->
        <Input
          v-model="formData.direccion.ciudad"
          type="text"
          label="Ciudad"
          placeholder="Ciudad de México"
          :error="errors.ciudad"
          :disabled="loading"
          @blur="validateField('ciudad')"
        />

        <!-- Código Postal -->
        <Input
          v-model="formData.direccion.codigoPostal"
          type="text"
          label="Código Postal"
          placeholder="12345"
          :error="errors.codigoPostal"
          :disabled="loading"
          help="5 dígitos"
          @blur="validateField('codigoPostal')"
        />

        <!-- Estado -->
        <Input
          v-model="formData.direccion.estado"
          type="text"
          label="Estado"
          placeholder="CDMX"
          :disabled="loading"
        />

        <!-- País -->
        <Input
          v-model="formData.direccion.pais"
          type="text"
          label="País"
          placeholder="México"
          :disabled="loading"
        />
      </div>
    </div>

    <!-- Preview del Negocio -->
    <div v-if="showPreview && isFormValid" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="text-sm font-semibold text-blue-900 mb-2">Vista Previa:</h4>
      <div class="space-y-1 text-sm text-blue-800">
        <p><strong>Nombre:</strong> {{ formData.nombre }}</p>
        <p><strong>Tipo:</strong> {{ getTipoLabel(formData.tipo) }}</p>
        <p v-if="formData.descripcion"><strong>Descripción:</strong> {{ formData.descripcion }}</p>
        <p v-if="formData.email"><strong>Email:</strong> {{ formData.email }}</p>
        <p><strong>Teléfono:</strong> {{ formatearTelefono(formData.telefono) }}</p>
        <p v-if="getDireccionCompleta">
          <strong>Dirección:</strong> {{ getDireccionCompleta }}
        </p>
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
        {{ isEditMode ? 'Actualizar' : 'Guardar' }} Perfil
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Input from '../common/Input.vue'
import Textarea from '../common/Textarea.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import { validarNegocio, requerido, validarEmail, validarTelefono, longitudMaxima } from '../../utils/validators'
import { formatearTelefono } from '../../utils/formatters'
import { TIPOS_NEGOCIO, TIPOS_NEGOCIO_LABELS } from '../../utils/constants'

const props = defineProps({
  negocio: {
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
  tipo: '',
  descripcion: '',
  email: '',
  telefono: '',
  direccion: {
    calle: '',
    colonia: '',
    ciudad: '',
    codigoPostal: '',
    estado: '',
    pais: 'México',
  },
})

const errors = ref({
  nombre: '',
  tipo: '',
  email: '',
  telefono: '',
  calle: '',
  ciudad: '',
  codigoPostal: '',
})

const isEditMode = computed(() => !!props.negocio)

// Computed
const isFormValid = computed(() => {
  return (
    requerido(formData.value.nombre) &&
    requerido(formData.value.tipo) &&
    requerido(formData.value.telefono) &&
    validarTelefono(formData.value.telefono) &&
    (!formData.value.email || validarEmail(formData.value.email))
  )
})

const getDireccionCompleta = computed(() => {
  const dir = formData.value.direccion
  const partes = []

  if (dir.calle) partes.push(dir.calle)
  if (dir.colonia) partes.push(dir.colonia)
  if (dir.ciudad) partes.push(dir.ciudad)
  if (dir.codigoPostal) partes.push(`CP ${dir.codigoPostal}`)
  if (dir.estado) partes.push(dir.estado)
  if (dir.pais) partes.push(dir.pais)

  return partes.length > 0 ? partes.join(', ') : ''
})

// Métodos
const getTipoLabel = (tipo) => {
  return TIPOS_NEGOCIO_LABELS[tipo] || tipo
}

// Validar campo
const validateField = (field) => {

  switch (field) {
    case 'nombre':
      if (!requerido(formData.value.nombre)) {
        errors.value.nombre = 'El nombre es requerido'
      } else if (!longitudMaxima(formData.value.nombre, 100)) {
        errors.value.nombre = 'El nombre no puede exceder 100 caracteres'
      } else {
        errors.value.nombre = ''
      }
      break
    case 'tipo':
      errors.value.tipo = requerido(formData.value.tipo) ? '' : 'Debes seleccionar un tipo de negocio'
      break
    case 'email':
      if (formData.value.email && !validarEmail(formData.value.email)) {
        errors.value.email = 'Email inválido'
      } else {
        errors.value.email = ''
      }
      break
    case 'telefono':
      if (!requerido(formData.value.telefono)) {
        errors.value.telefono = 'El teléfono es requerido'
      } else if (!validarTelefono(formData.value.telefono)) {
        errors.value.telefono = 'Teléfono inválido (10 dígitos)'
      } else {
        errors.value.telefono = ''
      }
      break
    case 'codigoPostal':
      if (formData.value.direccion.codigoPostal && !/^\d{5}$/.test(formData.value.direccion.codigoPostal)) {
        errors.value.codigoPostal = 'Código postal inválido (5 dígitos)'
      } else {
        errors.value.codigoPostal = ''
      }
      break
  }
}

// Validar formulario completo
const validateForm = () => {

  const validation = validarNegocio(formData.value)

  if (!validation.valido) {
    errors.value = { ...errors.value, ...validation.errores }
  }

  return validation.valido
}

// Manejar envío
const handleSubmit = () => {

  if (!validateForm()) {
    return
  }

  // Construir datos para enviar
  const datos = {
    nombre: formData.value.nombre,
    tipo: formData.value.tipo,
    descripcion: formData.value.descripcion || undefined,
    email: formData.value.email || undefined,
    telefono: formData.value.telefono,
    direccion: {
      calle: formData.value.direccion.calle || undefined,
      colonia: formData.value.direccion.colonia || undefined,
      ciudad: formData.value.direccion.ciudad || undefined,
      codigoPostal: formData.value.direccion.codigoPostal || undefined,
      estado: formData.value.direccion.estado || undefined,
      pais: formData.value.direccion.pais || 'México',
    },
  }

  emit('submit', datos)
}

// Manejar cancelación
const handleCancel = () => {
  emit('cancel')
}

// Resetear formulario
const resetForm = () => {
  formData.value = {
    nombre: '',
    tipo: '',
    descripcion: '',
    email: '',
    telefono: '',
    direccion: {
      calle: '',
      colonia: '',
      ciudad: '',
      codigoPostal: '',
      estado: '',
      pais: 'México',
    },
  }
  errors.value = {
    nombre: '',
    tipo: '',
    email: '',
    telefono: '',
    calle: '',
    ciudad: '',
    codigoPostal: '',
  }
}

// Cargar negocio si está en modo edición
const loadNegocio = () => {
  if (props.negocio) {

    formData.value = {
      nombre: props.negocio.nombre || '',
      tipo: props.negocio.tipo || '',
      descripcion: props.negocio.descripcion || '',
      email: props.negocio.email || '',
      telefono: props.negocio.telefono || '',
      direccion: {
        calle: props.negocio.direccion?.calle || '',
        colonia: props.negocio.direccion?.colonia || '',
        ciudad: props.negocio.direccion?.ciudad || '',
        codigoPostal: props.negocio.direccion?.codigoPostal || '',
        estado: props.negocio.direccion?.estado || '',
        pais: props.negocio.direccion?.pais || 'México',
      },
    }
  } else {
    resetForm()
  }
}

// Watch para recargar cuando cambie el negocio
watch(() => props.negocio, loadNegocio, { immediate: true })

defineExpose({
  resetForm,
  validateForm,
})
</script>
