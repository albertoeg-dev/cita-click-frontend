import api from './api'

/**
 * Servicio para el marketplace de módulos adicionales.
 * Cada módulo es una funcionalidad opcional que el negocio activa pagando
 * una suscripción independiente en Stripe.
 */
const modulosService = {
  /**
   * Lista el catálogo completo de módulos disponibles (sin estado por negocio).
   * @returns {Promise<Object>} ApiResponse con lista de ModuloDTO
   */
  async listarModulos() {
    const response = await api.get('/modulos')
    return response.data
  },

  /**
   * Lista el catálogo con estado activo/inactivo para el negocio del usuario autenticado.
   * @returns {Promise<Object>} ApiResponse con lista de ModuloNegocioDTO
   */
  async listarModulosConEstado() {
    const response = await api.get('/modulos/estado')
    return response.data
  },

  /**
   * Inicia el checkout de Stripe para activar un módulo.
   * Devuelve la URL de Stripe Hosted Checkout a la que redirigir al usuario.
   * @param {string} clave - Clave del módulo a activar
   * @returns {Promise<Object>} ApiResponse con CheckoutResponse (url, sessionId, etc.)
   */
  async crearCheckout(clave) {
    const response = await api.post(`/modulos/${clave}/checkout`)
    return response.data
  },

  /**
   * Cancela un módulo activo del negocio.
   * @param {string} clave - Clave del módulo a cancelar
   * @returns {Promise<Object>} ApiResponse confirmando la cancelación
   */
  async cancelarModulo(clave) {
    const response = await api.delete(`/modulos/${clave}/cancelar`)
    return response.data
  }
}

export default modulosService
