import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { serviciosService } from '../services/serviciosService'

export const useServiciosStore = defineStore('servicios', () => {
  // STATE
  const servicios = ref([])
  const servicioActual = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GETTERS
  const serviciosActivos = computed(() =>
    servicios.value.filter(s => s.activo)
  )

  const serviciosInactivos = computed(() =>
    servicios.value.filter(s => !s.activo)
  )

  // ACTIONS
  const cargarServicios = async (activos = null) => {
    // Verificar si hay token antes de intentar cargar
    const token = localStorage.getItem('token')
    if (!token) {
      loading.value = false
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await serviciosService.getServicios(activos)
      if (response.success) {
        // Map duracionMinutos to duracion for frontend compatibility
        servicios.value = response.data.map(servicio => ({
          ...servicio,
          duracion: servicio.duracionMinutos
        }))
      }
    } catch (err) {
      console.error('[ServiciosStore] Error al cargar servicios:', err)
      // Si es error de autenticación, no establecer error (el interceptor maneja)
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        error.value = err.message || err.mensaje || 'Error al cargar servicios'
      }
    } finally {
      loading.value = false
    }
  }

  const cargarServicio = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await serviciosService.getServicio(id)
      if (response.success) {
        // Map duracionMinutos to duracion for frontend compatibility
        servicioActual.value = {
          ...response.data,
          duracion: response.data.duracionMinutos
        }
      }
    } catch (err) {
      console.error('[ServiciosStore] Error al cargar servicio:', err)
      error.value = err.message || err.mensaje || 'Error al cargar el servicio'
    } finally {
      loading.value = false
    }
  }

  const crearServicio = async (data) => {
    loading.value = true
    error.value = null
    try {
      const response = await serviciosService.createServicio(data)
      if (response.success) {
        await cargarServicios()
        return response
      }
    } catch (err) {
      console.error('[ServiciosStore] Error al crear servicio:', err)
      error.value = err.message || err.mensaje || 'Error al crear el servicio'
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizarServicio = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const response = await serviciosService.updateServicio(id, data)
      if (response.success) {
        await cargarServicios()
        return response
      }
    } catch (err) {
      console.error('[ServiciosStore] Error al actualizar servicio:', err)
      error.value = err.message || err.mensaje || 'Error al actualizar el servicio'
      throw err
    } finally {
      loading.value = false
    }
  }

  const eliminarServicio = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await serviciosService.deleteServicio(id)
      if (response.success) {
        await cargarServicios()
        return response
      }
    } catch (err) {
      console.error('[ServiciosStore] Error al eliminar servicio:', err)
      error.value = err.message || err.mensaje || 'Error al eliminar el servicio'
      throw err
    } finally {
      loading.value = false
    }
  }

  const limpiarServicioActual = () => {
    servicioActual.value = null
  }

  return {
    // State
    servicios,
    servicioActual,
    loading,
    error,

    // Getters
    serviciosActivos,
    serviciosInactivos,

    // Actions
    cargarServicios,
    cargarServicio,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    limpiarServicioActual,
  }
})
