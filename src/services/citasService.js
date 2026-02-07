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
      const params = {}
      if (fecha) params.fecha = fecha
      if (estado) params.estado = estado

      const response = await api.get('/citas', { params })
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
      const response = await api.get(`/citas/${id}`)
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
      const response = await api.post('/citas', data)
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
      const response = await api.put(`/citas/${id}`, data)
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
      const response = await api.patch(`/citas/${id}/estado`, null, {
        params: { estado }
      })
      return response.data
    } catch (error) {
      console.error('[CitasService] Error completo:', error)
      console.error('[CitasService] Error response:', error.response)
      console.error('[CitasService] Error data:', error.response?.data)
      throw error.response?.data || error.message
    }
  },

  /**
   * Cancelar una cita
   * @param {string} id - ID de la cita
   */
  async cancelarCita(id) {
    try {
      const response = await api.delete(`/citas/${id}`)
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
      const response = await api.get('/citas/disponibilidad', {
        params: { servicioId, fecha }
      })
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al obtener disponibilidad:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Enviar confirmación de cita por WhatsApp/SMS
   * @param {string} id - ID de la cita
   * @param {string} canal - Canal de envío (WHATSAPP, SMS, AMBOS)
   * @param {boolean} confirmarPago - Si se confirma el pago
   */
  async enviarConfirmacionCita(id, canal, confirmarPago) {
    try {
      const response = await api.post(`/citas/${id}/enviar-confirmacion`, null, {
        params: { canal, confirmarPago }
      })
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al enviar confirmación:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Enviar recordatorio de cita (solo EMAIL disponible)
   * @param {string} id - ID de la cita
   * @param {string} canal - Canal de envío (solo 'email' permitido)
   */
  async enviarRecordatorioCita(id, canal) {
    try {
      const response = await api.post(`/citas/${id}/enviar-recordatorio`, null, {
        params: { canal }
      })
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al enviar recordatorio:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Registrar pago de una cita
   * @param {string} id - ID de la cita
   */
  async registrarPago(id) {
    try {
      const response = await api.patch(`/citas/${id}/registrar-pago`)
      return response.data
    } catch (error) {
      console.error('[CitasService] Error al registrar pago:', error)
      throw error.response?.data || error.message
    }
  },
}
