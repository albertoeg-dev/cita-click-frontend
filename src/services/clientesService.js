import api from './api'

/**
 * Servicio para gestión de clientes
 */
export const clientesService = {
  /**
   * Listar todos los clientes
   * @param {string} search - Búsqueda por nombre, apellidos, email o teléfono
   */
  async getClientes(search = null) {
    try {
      const params = search ? { search } : {}
      const response = await api.get('/clientes', { params })
      return response.data
    } catch (error) {
      console.error('[ClientesService] Error al obtener clientes:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Obtener un cliente por ID
   * @param {string} id - ID del cliente
   */
  async getCliente(id) {
    try {
      const response = await api.get(`/clientes/${id}`)
      return response.data
    } catch (error) {
      console.error('[ClientesService] Error al obtener cliente:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Crear un nuevo cliente
   * @param {Object} data - Datos del cliente
   */
  async createCliente(data) {
    try {
      const response = await api.post('/clientes', data)
      return response.data
    } catch (error) {
      console.error('[ClientesService] Error al crear cliente:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Actualizar un cliente existente
   * @param {string} id - ID del cliente
   * @param {Object} data - Datos actualizados
   */
  async updateCliente(id, data) {
    try {
      const response = await api.put(`/clientes/${id}`, data)
      return response.data
    } catch (error) {
      console.error('[ClientesService] Error al actualizar cliente:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Eliminar un cliente
   * @param {string} id - ID del cliente
   */
  async deleteCliente(id) {
    try {
      const response = await api.delete(`/clientes/${id}`)
      return response.data
    } catch (error) {
      console.error('[ClientesService] Error al eliminar cliente:', error)
      throw error.response?.data || error.message
    }
  },
}
