import api from './api'

/**
 * Servicio para gestión de reportes
 */
export const reportesService = {
  /**
   * Obtener reporte diario (JSON)
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  async getReporteDiario(fecha) {
    try {
      console.log('[ReportesService] Obteniendo reporte diario:', fecha)
      const response = await api.get('/reportes/diario', {
        params: { fecha }
      })
      console.log('[ReportesService] Reporte diario obtenido')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al obtener reporte diario:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Obtener reporte semanal (JSON)
   * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
   */
  async getReporteSemanal(fechaInicio) {
    try {
      console.log('[ReportesService] Obteniendo reporte semanal:', fechaInicio)
      const response = await api.get('/reportes/semanal', {
        params: { fechaInicio }
      })
      console.log('[ReportesService] Reporte semanal obtenido')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al obtener reporte semanal:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Obtener reporte mensual (JSON)
   * @param {number} mes - Mes (1-12)
   * @param {number} anio - Año
   */
  async getReporteMensual(mes, anio) {
    try {
      console.log('[ReportesService] Obteniendo reporte mensual:', mes, '/', anio)
      const response = await api.get('/reportes/mensual', {
        params: { mes, anio }
      })
      console.log('[ReportesService] Reporte mensual obtenido')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al obtener reporte mensual:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Descargar reporte diario en PDF
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  async descargarPdfDiario(fecha) {
    try {
      console.log('[ReportesService] Descargando PDF diario:', fecha)
      const response = await api.get('/reportes/diario/pdf', {
        params: { fecha },
        responseType: 'blob'
      })
      console.log('[ReportesService] PDF descargado')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al descargar PDF:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Descargar reporte semanal en PDF
   * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
   */
  async descargarPdfSemanal(fechaInicio) {
    try {
      console.log('[ReportesService] Descargando PDF semanal:', fechaInicio)
      const response = await api.get('/reportes/semanal/pdf', {
        params: { fechaInicio },
        responseType: 'blob'
      })
      console.log('[ReportesService] PDF descargado')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al descargar PDF:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Descargar reporte mensual en PDF
   * @param {number} mes - Mes (1-12)
   * @param {number} anio - Año
   */
  async descargarPdfMensual(mes, anio) {
    try {
      console.log('[ReportesService] Descargando PDF mensual:', mes, '/', anio)
      const response = await api.get('/reportes/mensual/pdf', {
        params: { mes, anio },
        responseType: 'blob'
      })
      console.log('[ReportesService] PDF descargado')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al descargar PDF:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Descargar reporte diario en Excel
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  async descargarExcelDiario(fecha) {
    try {
      console.log('[ReportesService] Descargando Excel diario:', fecha)
      const response = await api.get('/reportes/diario/excel', {
        params: { fecha },
        responseType: 'blob'
      })
      console.log('[ReportesService] Excel descargado')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al descargar Excel:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Descargar reporte semanal en Excel
   * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
   */
  async descargarExcelSemanal(fechaInicio) {
    try {
      console.log('[ReportesService] Descargando Excel semanal:', fechaInicio)
      const response = await api.get('/reportes/semanal/excel', {
        params: { fechaInicio },
        responseType: 'blob'
      })
      console.log('[ReportesService] Excel descargado')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al descargar Excel:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Descargar reporte mensual en Excel
   * @param {number} mes - Mes (1-12)
   * @param {number} anio - Año
   */
  async descargarExcelMensual(mes, anio) {
    try {
      console.log('[ReportesService] Descargando Excel mensual:', mes, '/', anio)
      const response = await api.get('/reportes/mensual/excel', {
        params: { mes, anio },
        responseType: 'blob'
      })
      console.log('[ReportesService] Excel descargado')
      return response.data
    } catch (error) {
      console.error('[ReportesService] Error al descargar Excel:', error)
      throw error.response?.data || error.message
    }
  },

  /**
   * Utilidad para descargar archivo blob
   * @param {Blob} blob - Blob del archivo
   * @param {string} filename - Nombre del archivo
   */
  downloadFile(blob, filename) {
    console.log('[ReportesService] Iniciando descarga:', filename)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    console.log('[ReportesService] Descarga completada')
  },
}
