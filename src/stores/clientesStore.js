import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clientesService } from '../services/clientesService'

export const useClientesStore = defineStore('clientes', () => {
  // STATE
  const clientes = ref([])
  const clienteActual = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // ACTIONS
  const cargarClientes = async (search = null) => {
    // Verificar si hay token antes de intentar cargar
    const token = localStorage.getItem('token')
    if (!token) {
      loading.value = false
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await clientesService.getClientes(search)
      if (response.success) {
        clientes.value = response.data
      }
    } catch (err) {
      console.error('[ClientesStore] Error al cargar clientes:', err)
      // Si es error de autenticación, no establecer error (el interceptor maneja)
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        error.value = err.message || err.mensaje || 'Error al cargar clientes'
      }
    } finally {
      loading.value = false
    }
  }

  const buscarClientes = async (query) => {
    searchQuery.value = query
    await cargarClientes(query)
  }

  const cargarCliente = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await clientesService.getCliente(id)
      if (response.success) {
        clienteActual.value = response.data
      }
    } catch (err) {
      console.error('[ClientesStore] Error al cargar cliente:', err)
      error.value = err.message || err.mensaje || 'Error al cargar el cliente'
    } finally {
      loading.value = false
    }
  }

  const crearCliente = async (data) => {
    loading.value = true
    error.value = null
    try {
      const response = await clientesService.createCliente(data)
      if (response.success) {
        await cargarClientes()
        return response
      }
    } catch (err) {
      console.error('[ClientesStore] Error al crear cliente:', err)
      error.value = err.message || err.mensaje || 'Error al crear el cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizarCliente = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const response = await clientesService.updateCliente(id, data)
      if (response.success) {
        await cargarClientes()
        return response
      }
    } catch (err) {
      console.error('[ClientesStore] Error al actualizar cliente:', err)
      error.value = err.message || err.mensaje || 'Error al actualizar el cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  const eliminarCliente = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await clientesService.deleteCliente(id)
      if (response.success) {
        await cargarClientes()
        return response
      }
    } catch (err) {
      console.error('[ClientesStore] Error al eliminar cliente:', err)
      error.value = err.message || err.mensaje || 'Error al eliminar el cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  const limpiarClienteActual = () => {
    clienteActual.value = null
  }

  const limpiarBusqueda = () => {
    searchQuery.value = ''
  }

  return {
    // State
    clientes,
    clienteActual,
    loading,
    error,
    searchQuery,

    // Actions
    cargarClientes,
    buscarClientes,
    cargarCliente,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    limpiarClienteActual,
    limpiarBusqueda,
  }
})
