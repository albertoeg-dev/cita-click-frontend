import api from './api'

/**
 * Servicio para consulta de límites de planes y uso del negocio
 */
const planesService = {
  /**
   * Obtiene los límites del plan actual del negocio
   * @returns {Promise<Object>} Límites del plan
   */
  async obtenerLimites() {
    const response = await api.get('/planes/limites')
    return response.data
  },

  /**
   * Obtiene el uso actual del negocio comparado con los límites
   * @returns {Promise<Object>} Uso actual con porcentajes y alertas
   */
  async obtenerUso() {
    const response = await api.get('/planes/uso')
    return response.data
  },

  /**
   * Valida si una funcionalidad está habilitada en el plan actual
   * @param {string} funcionalidad - Nombre de la funcionalidad (sms, whatsapp, reportes_avanzados, etc.)
   * @returns {Promise<boolean>} true si está habilitada
   */
  async validarFuncionalidad(funcionalidad) {
    const response = await api.get(`/planes/validar-funcionalidad/${funcionalidad}`)
    return response.data
  }
}

export default planesService
