import api from './api'

/**
 * Servicio para gestión de citas
 */
export const citasService = {
  /**
   * Listar todas las citas
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @param {string} estado - Estado de la cita (PENDIENTE, CONFIRMADA, COMPLETADA, CANCELADA)
   */
  async getCitas(fecha = null, estado = null) {
    try {
      console.log('[CitasService] Obteniendo citas, fecha:', fecha, 'estado:', estado)
      const params = {}
      if (fecha) params.fecha = fecha
      if (estado) params.estado = estado

      const response = await api.get('/citas', { params })
      console.log('[CitasService] Citas obtenidas:', response.data.data?.length || 0)
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al obtener citas:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Obtener una cita por ID
   * @param {string} id - ID de la cita
   */
  async getCita(id) {
    try {
      console.log('[CitasService] Obteniendo cita:', id)
      const response = await api.get(`/citas/${id}`)
      console.log('[CitasService] Cita obtenida')
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al obtener cita:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Crear una nueva cita
   * @param {Object} data - Datos de la cita
   */
  async createCita(data) {
    try {
      console.log('[CitasService] Creando cita:', data)
      const response = await api.post('/citas', data)
      console.log('[CitasService] Cita creada exitosamente')
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al crear cita:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Actualizar una cita existente
   * @param {string} id - ID de la cita
   * @param {Object} data - Datos actualizados
   */
  async updateCita(id, data) {
    try {
      console.log('[CitasService] Actualizando cita:', id, data)
      const response = await api.put(`/citas/${id}`, data)
      console.log('[CitasService] Cita actualizada exitosamente')
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al actualizar cita:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Cambiar estado de una cita
   * @param {string} id - ID de la cita
   * @param {string} estado - Nuevo estado
   */
  async cambiarEstado(id, estado) {
    try {
      console.log('[CitasService] Cambiando estado de cita:', id, 'a', estado)
      const response = await api.patch(`/citas/${id}/estado`, null, {
        params: { estado }
      })
      console.log('[CitasService] Estado cambiado exitosamente')
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al cambiar estado:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Cancelar una cita
   * @param {string} id - ID de la cita
   */
  async cancelarCita(id) {
    try {
      console.log('[CitasService] Cancelando cita:', id)
      const response = await api.delete(`/citas/${id}`)
      console.log('[CitasService] Cita cancelada exitosamente')
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al cancelar cita:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Obtener horarios disponibles para una fecha y servicio
   * @param {string} servicioId - ID del servicio
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  async getDisponibilidad(servicioId, fecha) {
    try {
      console.log('[CitasService] Obteniendo disponibilidad para servicio:', servicioId, 'fecha:', fecha)
      const response = await api.get('/citas/disponibilidad', {
        params: { servicioId, fecha }
      })
      console.log('[CitasService] Disponibilidad obtenida:', response.data.data?.horariosDisponibles?.length || 0, 'slots')
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al obtener disponibilidad:', error)
      throw error.response?.data || error.message
    }
  },
}
