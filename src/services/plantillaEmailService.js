import api from './api'

/**
 * Servicio para gestionar plantillas de email personalizadas
 */
const plantillaEmailService = {
  /**
   * Obtiene la configuración de plantilla del negocio
   */
  async obtenerConfiguracion() {
    const response = await api.get('/plantilla-email')
    return response.data
  },

  /**
   * Guarda la configuración de plantilla
   * @param {Object} config - Configuración a guardar
   */
  async guardarConfiguracion(config) {
    const response = await api.post('/plantilla-email', config)
    return response.data
  },

  /**
   * Elimina el logo de la plantilla
   */
  async eliminarLogo() {
    const response = await api.delete('/plantilla-email/logo')
    return response.data
  },

  /**
   * Restaura la configuración a valores por defecto
   */
  async restaurarPorDefecto() {
    const response = await api.post('/plantilla-email/restaurar')
    return response.data
  },

  /**
   * Sube un archivo de logo
   * @param {File} file - Archivo de imagen a subir
   */
  async subirLogo(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/plantilla-email/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default plantillaEmailService
