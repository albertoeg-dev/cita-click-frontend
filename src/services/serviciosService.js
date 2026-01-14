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
      console.log('[ServiciosService] Obteniendo servicios, activos:', activos)
      const params = activos !== null ? { activos } : {}
      const response = await api.get('/servicios', { params })
      console.log('[ServiciosService] Servicios obtenidos:', response.data.data?.length || 0)
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
      console.log('[ServiciosService] Obteniendo servicio:', id)
      const response = await api.get(`/servicios/${id}`)
      console.log('[ServiciosService] Servicio obtenido')
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
      console.log('[ServiciosService] Creando servicio:', data)

      // Mapear campos del frontend al formato esperado por el backend
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        duracionMinutos: data.duracion, // Mapear 'duracion' a 'duracionMinutos'
        activo: data.activo
      }

      console.log('[ServiciosService] Payload mapeado:', payload)
      const response = await api.post('/servicios', payload)
      console.log('[ServiciosService] Servicio creado exitosamente')
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
      console.log('[ServiciosService] Actualizando servicio:', id, data)

      // Mapear campos del frontend al formato esperado por el backend
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        duracionMinutos: data.duracion, // Mapear 'duracion' a 'duracionMinutos'
        activo: data.activo
      }

      console.log('[ServiciosService] Payload mapeado:', payload)
      const response = await api.put(`/servicios/${id}`, payload)
      console.log('[ServiciosService] Servicio actualizado exitosamente')
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
      console.log('[ServiciosService] Eliminando servicio:', id)
      const response = await api.delete(`/servicios/${id}`)
      console.log('[ServiciosService] Servicio eliminado exitosamente')
      return response.data
    } catch (error) {
      console.error('[ServiciosService] Error al eliminar servicio:', error)
      throw error.response?.data || error.message
    }
  },
}
