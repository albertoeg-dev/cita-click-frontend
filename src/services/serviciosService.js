import api from './api'

/**
 * Servicio para gestión de servicios del negocio
 */
export const serviciosService = {
  /**
   * Listar todos los servicios
   * @param {boolean} activos - Filtrar solo servicios activos
   */
  async getServicios(activos = null) {
    try {
      const params = activos !== null ? { activos } : {}
      const response = await api.get('/servicios', { params })
      return response.data
    } catch (error) {
      console.error('[ServiciosService] Error al obtener servicios:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Obtener un servicio por ID
   * @param {string} id - ID del servicio
   */
  async getServicio(id) {
    try {
      const response = await api.get(`/servicios/${id}`)
      return response.data
    } catch (error) {
      console.error('[ServiciosService] Error al obtener servicio:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Crear un nuevo servicio
   * @param {Object} data - Datos del servicio
   */
  async createServicio(data) {
    try {

      // Mapear campos del frontend al formato esperado por el backend
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        duracionMinutos: data.duracion, // Mapear 'duracion' a 'duracionMinutos'
        activo: data.activo
      }

      const response = await api.post('/servicios', payload)
      return response.data
    } catch (error) {
      console.error('[ServiciosService] Error al crear servicio:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Actualizar un servicio existente
   * @param {string} id - ID del servicio
   * @param {Object} data - Datos actualizados
   */
  async updateServicio(id, data) {
    try {

      // Mapear campos del frontend al formato esperado por el backend
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        duracionMinutos: data.duracion, // Mapear 'duracion' a 'duracionMinutos'
        activo: data.activo
      }

      const response = await api.put(`/servicios/${id}`, payload)
      return response.data
    } catch (error) {
      console.error('[ServiciosService] Error al actualizar servicio:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Eliminar un servicio (soft delete)
   * @param {string} id - ID del servicio
   */
  async deleteServicio(id) {
    try {
      const response = await api.delete(`/servicios/${id}`)
      return response.data
    } catch (error) {
      console.error('[ServiciosService] Error al eliminar servicio:', error)
      throw error.response?.data || error.message
    }
  },
}
