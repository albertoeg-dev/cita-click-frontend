import { defineStore } from 'pinia'
import { ref } from 'vue'
import { businessService } from '../services/businessService'

export const useBusinessStore = defineStore('business', () => {
  // STATE
  const negocio = ref(null)
  const horarios = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ACTIONS
  const cargarNegocio = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('[BusinessStore] Cargando datos del negocio')
      const response = await businessService.getPerfil()
      if (response.success) {
        negocio.value = response.data
        console.log('[BusinessStore] Negocio cargado:', negocio.value?.nombre)
      }
    } catch (err) {
      console.error('[BusinessStore] Error al cargar negocio:', err)
      error.value = err.message || err.mensaje || 'Error al cargar el negocio'
    } finally {
      loading.value = false
    }
  }

  const actualizarNegocio = async (data) => {
    loading.value = true
    error.value = null
    try {
      console.log('[BusinessStore] Actualizando datos del negocio')
      const response = await businessService.updatePerfil(data)
      if (response.success) {
        negocio.value = response.data
        console.log('[BusinessStore] Negocio actualizado')
        return response
      }
    } catch (err) {
      console.error('[BusinessStore] Error al actualizar negocio:', err)
      error.value = err.message || err.mensaje || 'Error al actualizar el negocio'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarHorarios = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('[BusinessStore] Cargando horarios')
      const response = await businessService.getHorarios()
      if (response.success) {
        horarios.value = response.data
        console.log('[BusinessStore] Horarios cargados:', horarios.value?.length || 0)
      }
    } catch (err) {
      console.error('[BusinessStore] Error al cargar horarios:', err)
      error.value = err.message || err.mensaje || 'Error al cargar horarios'
    } finally {
      loading.value = false
    }
  }

  const crearHorario = async (data) => {
    loading.value = true
    error.value = null
    try {
      console.log('[BusinessStore] Creando horario')
      const response = await businessService.createHorario(data)
      if (response.success) {
        await cargarHorarios()
        console.log('[BusinessStore] Horario creado y lista actualizada')
        return response
      }
    } catch (err) {
      console.error('[BusinessStore] Error al crear horario:', err)
      error.value = err.message || err.mensaje || 'Error al crear horario'
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizarHorario = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      console.log('[BusinessStore] Actualizando horario:', id)
      const response = await businessService.updateHorario(id, data)
      if (response.success) {
        await cargarHorarios()
        console.log('[BusinessStore] Horario actualizado y lista actualizada')
        return response
      }
    } catch (err) {
      console.error('[BusinessStore] Error al actualizar horario:', err)
      error.value = err.message || err.mensaje || 'Error al actualizar horario'
      throw err
    } finally {
      loading.value = false
    }
  }

  const eliminarHorario = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log('[BusinessStore] Eliminando horario:', id)
      const response = await businessService.deleteHorario(id)
      if (response.success) {
        await cargarHorarios()
        console.log('[BusinessStore] Horario eliminado y lista actualizada')
        return response
      }
    } catch (err) {
      console.error('[BusinessStore] Error al eliminar horario:', err)
      error.value = err.message || err.mensaje || 'Error al eliminar horario'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    negocio,
    horarios,
    loading,
    error,

    // Actions
    cargarNegocio,
    actualizarNegocio,
    cargarHorarios,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
  }
})