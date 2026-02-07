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
            <option value="BARBERIA">Barbería</option>
            <option value="SPA">Spa</option>
            <option value="ESTETICA">Estética</option>
            <option value="CENTRO_MASAJES">Centro de Masajes</option>
            <option value="CLINICA_DENTAL">Clínica Dental</option>
            <option value="CLINICA_MEDICA">Clínica Médica</option>
            <option value="CONSULTORIO_MEDICO">Consultorio Médico</option>
            <option value="CONSULTORIO_PSICOLOGIA">Consultorio Psicología</option>
            <option value="FISIOTERAPIA">Fisioterapia</option>
            <option value="NUTRICION">Nutrición</option>
            <option value="VETERINARIA">Veterinaria</option>
            <option value="GYM">Gimnasio</option>
            <option value="CENTRO_YOGA">Centro de Yoga</option>
            <option value="ESTUDIO_PILATES">Estudio de Pilates</option>
            <option value="TALLER_AUTOMOTRIZ">Taller Automotriz</option>
            <option value="TALLER_MECANICO">Taller Mecánico</option>
            <option value="LAVADO_AUTOS">Lavado de Autos</option>
            <option value="ESTUDIO_FOTOGRAFIA">Estudio de Fotografía</option>
            <option value="ESTUDIO_TATUAJES">Estudio de Tatuajes</option>
            <option value="ASESORIA_LEGAL">Asesoría Legal</option>
            <option value="ASESORIA_CONTABLE">Asesoría Contable</option>
            <option value="CONSULTORIA">Consultoría</option>
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email de Contacto
          </label>
          <div class="relative">
            <input
              v-model="formData.email"
              type="email"
              placeholder="contacto@tunegocio.com"
              :disabled="loading"
              @blur="validateField('email')"
              class="block w-full pl-11 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="errors.email ? 'border-red-300' : 'border-gray-300'"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de Contacto <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              v-model="formData.telefono"
              type="tel"
              placeholder="5512345678"
              maxlength="10"
              :disabled="loading"
              @input="handleTelefonoInput"
              @blur="validateField('telefono')"
              class="block w-full pl-11 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="errors.telefono ? 'border-red-300' : 'border-gray-300'"
            />
          </div>
          <p v-if="errors.telefono" class="mt-1 text-sm text-red-600">{{ errors.telefono }}</p>
          <p v-else class="mt-1 text-xs text-gray-500">Formato: 10 dígitos sin espacios ni guiones</p>
        </div>
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
        <div>
          <Input
            v-model="formData.direccion.codigoPostal"
            type="text"
            label="Código Postal"
            placeholder="12345"
            :error="errors.codigoPostal"
            :disabled="loading || buscandoCP"
            help="5 dígitos - Se autocompletará la dirección"
            @input="handleCodigoPostalInput"
            @blur="validateField('codigoPostal')"
          />
          <div v-if="buscandoCP" class="mt-1 flex items-center gap-2 text-sm text-blue-600">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Buscando información del código postal...
          </div>
        </div>

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

const buscandoCP = ref(false)

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

// Handle código postal input - buscar automáticamente
const handleCodigoPostalInput = async (event) => {
  const value = event.target.value
  // Solo números
  const onlyNumbers = value.replace(/\D/g, '').slice(0, 5)
  formData.value.direccion.codigoPostal = onlyNumbers

  // Si tiene 5 dígitos, buscar información
  if (onlyNumbers.length === 5) {
    await buscarCodigoPostal(onlyNumbers)
  }
}

// Buscar información del código postal usando API gratuita
const buscarCodigoPostal = async (cp) => {
  buscandoCP.value = true

  try {
    // Usar API gratuita de SEPOMEX
    const response = await fetch(`https://api.copomex.com/query/info_cp/${cp}?token=pruebas`)

    if (!response.ok) {
      throw new Error('No se pudo obtener información del código postal')
    }

    const data = await response.json()

    if (data.error === false && data.response && data.response.length > 0) {
      const info = data.response[0]

      // Autocompletar campos
      formData.value.direccion.estado = info.response?.estado || info.d_estado || ''
      formData.value.direccion.ciudad = info.response?.municipio || info.d_mnpio || ''
      formData.value.direccion.pais = 'México'

      // Si hay colonias, tomar la primera
      if (data.response.colonias && data.response.colonias.length > 0) {
        formData.value.direccion.colonia = data.response.colonias[0]
      } else if (info.d_asenta) {
        formData.value.direccion.colonia = info.d_asenta
      }

    } else {
      // Intentar con API alternativa
      const responseSepomex = await fetch(`https://jobs.github.com/positions.json?description=&location=${cp}`)
      // Esta API puede no funcionar, pero es un fallback
    }
  } catch (error) {
    // Silencioso - no mostrar error al usuario, solo no autocompletar
    console.warn('No se pudo autocompletar código postal:', error)
  } finally {
    buscandoCP.value = false
  }
}

// Handle telefono input - solo números
const handleTelefonoInput = (event) => {
  const value = event.target.value
  // Remover todo excepto números
  const onlyNumbers = value.replace(/\D/g, '')
  formData.value.telefono = onlyNumbers.substring(0, 10)

  // Validar en tiempo real
  if (onlyNumbers.length > 0 && onlyNumbers.length < 10) {
    errors.value.telefono = `Faltan ${10 - onlyNumbers.length} dígitos`
  } else if (onlyNumbers.length === 10) {
    errors.value.telefono = ''
  }
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
      } else if (!/^\d{10}$/.test(formData.value.telefono)) {
        const digitos = formData.value.telefono.replace(/\D/g, '').length
        if (digitos === 0) {
          errors.value.telefono = 'El teléfono es requerido'
        } else if (digitos < 10) {
          errors.value.telefono = `Faltan ${10 - digitos} dígitos`
        } else {
          errors.value.telefono = 'Teléfono inválido (solo 10 dígitos)'
        }
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
