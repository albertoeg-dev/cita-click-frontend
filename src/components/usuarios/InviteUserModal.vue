<template>
  <SlidePanel
    :model-value="show"
    title="Invitar Usuario"
    :closable="!loading"
    @update:model-value="(v) => { if (!v) cerrar() }"
  >
    <form @submit.prevent="enviarInvitacion" class="space-y-4">
      <!-- Nombre -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          v-model="form.nombre"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Juan"
        />
      </div>

      <!-- Apellidos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Apellido Paterno *
          </label>
          <input
            v-model="form.apellidoPaterno"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Pérez"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Apellido Materno
          </label>
          <input
            v-model="form.apellidoMaterno"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="García"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="juan.perez@ejemplo.com"
        />
      </div>

      <!-- Teléfono -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          v-model="form.telefono"
          type="tel"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="5512345678"
        />
      </div>

      <!-- Rol -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Rol *
        </label>
        <select
          v-model="form.rol"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Seleccionar rol...</option>
          <option value="admin">Administrador</option>
          <option value="empleado">Empleado</option>
          <option value="recepcionista">Recepcionista</option>
        </select>
        <p class="mt-1 text-xs text-gray-500">
          {{ obtenerDescripcionRol(form.rol) }}
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="cerrar"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Enviando...</span>
          <span v-else>Enviar Invitación</span>
        </button>
      </div>
    </form>
  </SlidePanel>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUsuariosStore } from '@/stores/usuariosStore'
import SlidePanel from '@/components/common/SlidePanel.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const usuariosStore = useUsuariosStore()

const form = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  email: '',
  telefono: '',
  rol: ''
})

const loading = ref(false)
const errorMessage = ref('')

const obtenerDescripcionRol = (rol) => {
  const descripciones = {
    admin: 'Puede gestionar usuarios, clientes, servicios y citas',
    empleado: 'Puede gestionar clientes, servicios y citas',
    recepcionista: 'Solo puede gestionar clientes y citas'
  }
  return descripciones[rol] || ''
}

const limpiarFormulario = () => {
  form.value = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    telefono: '',
    rol: ''
  }
  errorMessage.value = ''
}

const cerrar = () => {
  limpiarFormulario()
  emit('close')
}

const enviarInvitacion = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await usuariosStore.invitarUsuario(form.value)
    emit('success')
    cerrar()
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al invitar usuario'
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    limpiarFormulario()
  }
})
</script>
