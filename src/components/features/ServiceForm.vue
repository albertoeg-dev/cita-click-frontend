<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Sección: Información del Servicio -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Información del Servicio</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nombre del servicio -->
        <Input
          v-model="formData.nombre"
          label="Nombre del servicio"
          placeholder="Ej: Corte de cabello"
          :error="errors.nombre"
          :required="true"
          @blur="validateField('nombre')"
        />

        <!-- Estado activo -->
        <div class="flex items-center gap-3 pt-6">
          <input
            v-model="formData.activo"
            type="checkbox"
            id="activo"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="activo" class="text-sm font-medium text-gray-700">
            Servicio activo
          </label>
        </div>

        <!-- Descripción - full width -->
        <div class="md:col-span-2">
          <Textarea
            v-model="formData.descripcion"
            label="Descripción"
            placeholder="Describe brevemente el servicio..."
            :rows="3"
            :maxlength="500"
            help="Opcional: Agrega detalles sobre el servicio"
          />
        </div>
      </div>
    </div>

    <!-- Sección: Precio y Duración -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">Precio y Duración</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Duración -->
        <Input
          v-model.number="formData.duracion"
          type="number"
          label="Duración (minutos)"
          placeholder="30"
          :error="errors.duracion"
          :required="true"
          :min="1"
          :step="1"
          help="Duración en minutos (ej: 15, 30, 45, 60, 90, etc.)"
          @blur="validateField('duracion')"
        />

        <!-- Precio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Precio (MXN) <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">$</span>
            </div>
            <input
              v-model.number="formData.precio"
              type="number"
              placeholder="150.00"
              min="0"
              step="0.01"
              @blur="validateField('precio')"
              class="block w-full pl-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="errors.precio ? 'border-red-300' : 'border-gray-300'"
            />
          </div>
          <p v-if="errors.precio" class="mt-1 text-sm text-red-600">{{ errors.precio }}</p>
          <p v-else class="mt-1 text-xs text-gray-500">Precio del servicio en pesos mexicanos</p>
        </div>
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
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Servicio
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Input from '../common/Input.vue'
import Textarea from '../common/Textarea.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import { validarServicio, requerido, mayorACero, longitudMaxima } from '../../utils/validators'
import { formatearDuracion, formatearPrecio } from '../../utils/formatters'

const props = defineProps({
  servicio: {
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
  descripcion: '',
  duracion: 30,
  precio: 0,
  activo: true,
})

const errors = ref({
  nombre: '',
  descripcion: '',
  duracion: '',
  precio: '',
})

const isEditMode = computed(() => !!props.servicio)

// Validar un campo específico
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

    case 'duracion':
      if (!mayorACero(formData.value.duracion)) {
        errors.value.duracion = 'La duración debe ser mayor a 0'
      } else {
        errors.value.duracion = ''
      }
      break

    case 'precio':
      if (!mayorACero(formData.value.precio)) {
        errors.value.precio = 'El precio debe ser mayor a 0'
      } else {
        errors.value.precio = ''
      }
      break
  }
}

// Validar todo el formulario
const validateForm = () => {
  const validation = validarServicio(formData.value)

  if (!validation.valido) {
    errors.value = validation.errores
  }

  return validation.valido
}

const isFormValid = computed(() => {
  return (
    requerido(formData.value.nombre) &&
    longitudMaxima(formData.value.nombre, 100) &&
    mayorACero(formData.value.duracion) &&
    mayorACero(formData.value.precio)
  )
})

// Manejar envío del formulario
const handleSubmit = () => {

  if (!validateForm()) {
    return
  }

  emit('submit', { ...formData.value })
}

// Manejar cancelación
const handleCancel = () => {
  emit('cancel')
}

// Resetear formulario
const resetForm = () => {
  formData.value = {
    nombre: '',
    descripcion: '',
    duracion: 30,
    precio: 0,
    activo: true,
  }
  errors.value = {
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
  }
}

// Cargar datos del servicio si está en modo edición
const loadServicio = () => {
  if (props.servicio) {
    formData.value = {
      nombre: props.servicio.nombre || '',
      descripcion: props.servicio.descripcion || '',
      duracion: props.servicio.duracion || 30,
      precio: props.servicio.precio || 0,
      activo: props.servicio.activo !== undefined ? props.servicio.activo : true,
    }
  } else {
    resetForm()
  }
}

// Cargar servicio al montar o cuando cambie
watch(() => props.servicio, loadServicio, { immediate: true })

onMounted(() => {
})

defineExpose({
  resetForm,
  validateForm,
})
</script>
