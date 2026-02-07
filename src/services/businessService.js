import api from './api'

export const businessService = {
  /**
   * Obtener datos del negocio
   */
  async getPerfil() {
    try {
      const response = await api.get('/negocios/perfil')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  /**
   * Actualizar datos del negocio
   */
  async updatePerfil(data) {
    try {
      const response = await api.put('/negocios/perfil', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  /**
   * Obtener horarios
   */
  async getHorarios() {
    try {
      const response = await api.get('/negocios/horarios')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  /**
   * Crear horario
   */
  async createHorario(data) {
    try {

      // Mapear campos del frontend al formato esperado por el backend
      const payload = {
        diaSemana: data.diaSemana,
        horaApertura: data.horaInicio,  // Mapear horaInicio a horaApertura
        horaCierre: data.horaFin,        // Mapear horaFin a horaCierre
        activo: data.activo
      }

      const response = await api.post(`/negocios/horarios/${data.diaSemana}`, payload)
      return response.data
    } catch (error) {
      console.error('[BusinessService] Error al crear horario:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Actualizar horario
   */
  async updateHorario(id, data) {
    try {

      // Mapear campos del frontend al formato esperado por el backend
      const payload = {
        diaSemana: data.diaSemana,
        horaApertura: data.horaInicio,  // Mapear horaInicio a horaApertura
        horaCierre: data.horaFin,        // Mapear horaFin a horaCierre
        activo: data.activo
      }

      const response = await api.put(`/negocios/horarios/${id}`, payload)
      return response.data
    } catch (error) {
      console.error('[BusinessService] Error al actualizar horario:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Eliminar horario
   */
  async deleteHorario(id) {
    try {
      const response = await api.delete(`/negocios/horarios/${id}`)
      return response.data
    } catch (error) {
      console.error('[BusinessService] Error al eliminar horario:', error)
      throw error.response?.data || error.message
    }
  },
}
