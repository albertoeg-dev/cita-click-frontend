import api from './api'

/**
 * Servicio para gestión de usuarios del negocio
 */
const usuariosService = {
  /**
   * Invita un nuevo usuario al negocio
   * @param {Object} data - Datos del usuario a invitar
   * @returns {Promise<Object>} Usuario creado
   */
  async invitarUsuario(data) {
    const response = await api.post('/usuarios/invitar', data)
    return response.data
  },

  /**
   * Obtiene la lista de usuarios del negocio
   * @returns {Promise<Array>} Lista de usuarios
   */
  async listarUsuarios() {
    const response = await api.get('/usuarios')
    return response.data
  },

  /**
   * Obtiene un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Usuario
   */
  async obtenerUsuario(id) {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  },

  /**
   * Cambia el rol de un usuario
   * @param {string} id - ID del usuario
   * @param {string} rol - Nuevo rol (owner/admin/empleado/recepcionista)
   * @returns {Promise<Object>} Usuario actualizado
   */
  async cambiarRol(id, rol) {
    const response = await api.put(`/usuarios/${id}/rol`, { rol })
    return response.data
  },

  /**
   * Desactiva un usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  async desactivarUsuario(id) {
    const response = await api.delete(`/usuarios/${id}`)
    return response.data
  },

  /**
   * Reactiva un usuario previamente desactivado
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Usuario reactivado
   */
  async activarUsuario(id) {
    const response = await api.put(`/usuarios/${id}/activar`)
    return response.data
  }
}

export default usuariosService
