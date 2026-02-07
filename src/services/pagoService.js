import api from './api'

/**
 * Servicio para gestionar pagos y suscripciones
 */
const pagoService = {
  /**
   * Obtiene el historial de pagos del negocio
   * @returns {Promise<Object>} Historial de pagos
   */
  async obtenerHistorial() {
    const response = await api.get('/pagos/historial')
    return response.data
  },

  /**
   * Obtiene un pago específico por ID
   * @param {string} pagoId - ID del pago
   * @returns {Promise<Object>} Detalle del pago
   */
  async obtenerPago(pagoId) {
    const response = await api.get(`/pagos/${pagoId}`)
    return response.data
  },

  /**
   * Obtiene estadísticas de pagos
   * @returns {Promise<Object>} Estadísticas de pagos
   */
  async obtenerEstadisticas() {
    const response = await api.get('/pagos/estadisticas')
    return response.data
  },

  /**
   * Obtiene los planes disponibles
   * @returns {Promise<Object>} Lista de planes
   */
  async obtenerPlanes() {
    const response = await api.get('/pagos/planes')
    return response.data
  },

  /**
   * Crea una sesión de checkout para suscripción
   * @param {Object} data - Datos del checkout (plan)
   * @returns {Promise<Object>} Datos de la sesión de checkout
   */
  async crearCheckout(data) {
    const response = await api.post('/pagos/checkout', data)
    return response.data
  }
}

export default pagoService
