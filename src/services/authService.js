import api from './api'

export const authService = {
  /**
   * Registrar nuevo usuario
   */
  async register(data) {
    try {
      const response = await api.post('/auth/register', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  /**
   * Login de usuario
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  /**
   * Autenticación con Google
   */
  async googleAuth(idToken, negocioData = {}) {
    try {
      const response = await api.post('/auth/google', {
        idToken,
        nombreNegocio: negocioData.nombreNegocio,
        tipoNegocio: negocioData.tipoNegocio,
      })
      return response.data
    } catch (error) {
      console.error('[AuthService] Error en Google Auth:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error en logout:', error)
    }
  },

  /**
   * Obtener datos del usuario actual
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}