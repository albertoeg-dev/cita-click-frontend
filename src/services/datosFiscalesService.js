import api from './api'

const datosFiscalesService = {
  /**
   * Obtiene los datos fiscales del negocio (desde Stripe Customer metadata).
   */
  async obtener() {
    const response = await api.get('/datos-fiscales')
    return response.data
  },

  /**
   * Guarda o actualiza los datos fiscales en Stripe.
   * @param {Object} datos - Datos fiscales del negocio
   */
  async guardar(datos) {
    const response = await api.post('/datos-fiscales', datos)
    return response.data
  },
}

export default datosFiscalesService
