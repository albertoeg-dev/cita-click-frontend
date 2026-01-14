<template>
  <DashboardLayout>
    <template #title>
      👥 Usuarios
    </template>

    <template #headerActions>
      <button
        @click="mostrarModalInvitar = true"
        class="btn btn-primary btn-sm"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Invitar Usuario
      </button>
    </template>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">Gestión de Usuarios</h2>
      <p class="text-slate-600">Administra los usuarios de tu negocio</p>
    </div>

    <!-- Alert de Límite -->
    <div v-if="planesStore.uso && planesStore.uso.alertaUsuarios" class="bg-orange-50 border-l-4 border-orange-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-orange-700">
            Estás cerca del límite de usuarios ({{ planesStore.uso.totalUsuarios }}/{{ planesStore.uso.limiteUsuarios }}).
            <router-link to="/planes" class="font-medium underline">
              Actualiza tu plan
            </router-link>
            para agregar más usuarios.
          </p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="usuariosStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-sm text-gray-500">Cargando usuarios...</p>
    </div>

    <!-- Error -->
    <div v-else-if="usuariosStore.error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-sm text-red-600">{{ usuariosStore.error }}</p>
    </div>

    <!-- Tabla de Usuarios -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="usuario in usuariosStore.usuarios" :key="usuario.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-600 font-medium text-sm">
                      {{ obtenerIniciales(usuario) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ usuario.nombre }} {{ usuario.apellidoPaterno }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ usuario.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ usuario.telefono || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="obtenerClaseRol(usuario.rol)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ obtenerNombreRol(usuario.rol) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="usuario.activo" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Activo
              </span>
              <span v-else class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                Inactivo
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <!-- Cambiar Rol -->
                <button
                  v-if="usuario.rol !== 'owner'"
                  @click="abrirModalCambiarRol(usuario)"
                  class="text-indigo-600 hover:text-indigo-900"
                  title="Cambiar rol"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>

                <!-- Desactivar -->
                <button
                  v-if="usuario.activo && usuario.rol !== 'owner'"
                  @click="confirmarDesactivar(usuario)"
                  class="text-red-600 hover:text-red-900"
                  title="Desactivar usuario"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="usuariosStore.usuarios.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">No hay usuarios registrados</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Invitar Usuario -->
    <InviteUserModal
      :show="mostrarModalInvitar"
      @close="mostrarModalInvitar = false"
      @success="handleInvitacionExitosa"
    />

    <!-- Modal Cambiar Rol -->
    <div v-if="mostrarModalCambiarRol" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cambiar Rol de Usuario</h3>

        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">
            Usuario: <strong>{{ usuarioSeleccionado?.nombre }} {{ usuarioSeleccionado?.apellidoPaterno }}</strong>
          </p>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nuevo Rol
          </label>
          <select
            v-model="nuevoRol"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="admin">Administrador</option>
            <option value="empleado">Empleado</option>
            <option value="recepcionista">Recepcionista</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="cerrarModalCambiarRol"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="cambiarRol"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Cambiar Rol
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { useUsuariosStore } from '@/stores/usuariosStore'
import { usePlanesStore } from '@/stores/planesStore'
import InviteUserModal from '@/components/usuarios/InviteUserModal.vue'

const usuariosStore = useUsuariosStore()
const planesStore = usePlanesStore()

const mostrarModalInvitar = ref(false)
const mostrarModalCambiarRol = ref(false)
const usuarioSeleccionado = ref(null)
const nuevoRol = ref('')

onMounted(async () => {
  await usuariosStore.cargarUsuarios()
  await planesStore.cargarUso()
})

const obtenerIniciales = (usuario) => {
  const nombre = usuario.nombre?.charAt(0) || ''
  const apellido = usuario.apellidoPaterno?.charAt(0) || ''
  return (nombre + apellido).toUpperCase()
}

const obtenerNombreRol = (rol) => {
  const nombres = {
    owner: 'Propietario',
    admin: 'Administrador',
    empleado: 'Empleado',
    recepcionista: 'Recepcionista'
  }
  return nombres[rol] || rol
}

const obtenerClaseRol = (rol) => {
  const clases = {
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    empleado: 'bg-green-100 text-green-800',
    recepcionista: 'bg-yellow-100 text-yellow-800'
  }
  return clases[rol] || 'bg-gray-100 text-gray-800'
}

const handleInvitacionExitosa = () => {
  // Recargar la lista de usuarios
  usuariosStore.cargarUsuarios()
  planesStore.cargarUso()
}

const abrirModalCambiarRol = (usuario) => {
  usuarioSeleccionado.value = usuario
  nuevoRol.value = usuario.rol
  mostrarModalCambiarRol.value = true
}

const cerrarModalCambiarRol = () => {
  mostrarModalCambiarRol.value = false
  usuarioSeleccionado.value = null
  nuevoRol.value = ''
}

const cambiarRol = async () => {
  try {
    await usuariosStore.cambiarRol(usuarioSeleccionado.value.id, nuevoRol.value)
    cerrarModalCambiarRol()
  } catch (error) {
    alert(error.response?.data?.message || 'Error al cambiar el rol')
  }
}

const confirmarDesactivar = async (usuario) => {
  if (confirm(`¿Estás seguro de desactivar a ${usuario.nombre} ${usuario.apellidoPaterno}?`)) {
    try {
      await usuariosStore.desactivarUsuario(usuario.id)
      await planesStore.cargarUso()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al desactivar usuario')
    }
  }
}
</script>
