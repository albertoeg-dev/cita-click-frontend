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
      console.log('[ClientesService] Obteniendo clientes, búsqueda:', search)
      const params = search ? { search } : {}
      const response = await api.get('/clientes', { params })
      console.log('[ClientesService] Clientes obtenidos:', response.data.data?.length || 0)
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
      console.log('[ClientesService] Obteniendo cliente:', id)
      const response = await api.get(`/clientes/${id}`)
      console.log('[ClientesService] Cliente obtenido')
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
      console.log('[ClientesService] Creando cliente:', data)
      const response = await api.post('/clientes', data)
      console.log('[ClientesService] Cliente creado exitosamente')
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
      console.log('[ClientesService] Actualizando cliente:', id, data)
      const response = await api.put(`/clientes/${id}`, data)
      console.log('[ClientesService] Cliente actualizado exitosamente')
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
      console.log('[ClientesService] Eliminando cliente:', id)
      const response = await api.delete(`/clientes/${id}`)
      console.log('[ClientesService] Cliente eliminado exitosamente')
      return response.data
    } catch (error) {
      console.error('[ClientesService] Error al eliminar cliente:', error)
      throw error.response?.data || error.message
    }
  },
}
