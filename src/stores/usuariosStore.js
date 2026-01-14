import { defineStore } from 'pinia'
import { ref } from 'vue'
import usuariosService from '@/services/usuariosService'

export const useUsuariosStore = defineStore('usuarios', () => {
  // State
  const usuarios = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const cargarUsuarios = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await usuariosService.listarUsuarios()
      usuarios.value = response.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar usuarios'
      console.error('Error al cargar usuarios:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const invitarUsuario = async (data) => {
    loading.value = true
    error.value = null
    try {
      const response = await usuariosService.invitarUsuario(data)
      if (response.success) {
        // Agregar el nuevo usuario a la lista
        usuarios.value.push(response.data)
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al invitar usuario'
      console.error('Error al invitar usuario:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const cambiarRol = async (id, rol) => {
    loading.value = true
    error.value = null
    try {
      const response = await usuariosService.cambiarRol(id, rol)
      if (response.success) {
        // Actualizar el usuario en la lista
        const index = usuarios.value.findIndex(u => u.id === id)
        if (index !== -1) {
          usuarios.value[index] = response.data
        }
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cambiar rol'
      console.error('Error al cambiar rol:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const desactivarUsuario = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await usuariosService.desactivarUsuario(id)
      if (response.success) {
        // Remover el usuario de la lista
        usuarios.value = usuarios.value.filter(u => u.id !== id)
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al desactivar usuario'
      console.error('Error al desactivar usuario:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const activarUsuario = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await usuariosService.activarUsuario(id)
      if (response.success) {
        // Agregar el usuario reactivado a la lista
        usuarios.value.push(response.data)
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al activar usuario'
      console.error('Error al activar usuario:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const limpiarError = () => {
    error.value = null
  }

  return {
    // State
    usuarios,
    loading,
    error,
    // Actions
    cargarUsuarios,
    invitarUsuario,
    cambiarRol,
    desactivarUsuario,
    activarUsuario,
    limpiarError
  }
})
