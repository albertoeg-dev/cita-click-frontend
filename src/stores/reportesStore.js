import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportesService } from '../services/reportesService'

export const useReportesStore = defineStore('reportes', () => {
  // STATE
  const reporteActual = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ACTIONS
  const cargarReporteDiario = async (fecha) => {
    loading.value = true
    error.value = null
    try {
      console.log('[ReportesStore] Cargando reporte diario:', fecha)
      const response = await reportesService.getReporteDiario(fecha)
      if (response.success) {
        reporteActual.value = response.data
        console.log('[ReportesStore] Reporte diario cargado')
        return response.data
      }
    } catch (err) {
      console.error('[ReportesStore] Error al cargar reporte diario:', err)
      error.value = err.message || err.mensaje || 'Error al cargar el reporte'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarReporteSemanal = async (fechaInicio) => {
    loading.value = true
    error.value = null
    try {
      console.log('[ReportesStore] Cargando reporte semanal:', fechaInicio)
      const response = await reportesService.getReporteSemanal(fechaInicio)
      if (response.success) {
        reporteActual.value = response.data
        console.log('[ReportesStore] Reporte semanal cargado')
        return response.data
      }
    } catch (err) {
      console.error('[ReportesStore] Error al cargar reporte semanal:', err)
      error.value = err.message || err.mensaje || 'Error al cargar el reporte'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarReporteMensual = async (mes, anio) => {
    loading.value = true
    error.value = null
    try {
      console.log('[ReportesStore] Cargando reporte mensual:', mes, '/', anio)
      const response = await reportesService.getReporteMensual(mes, anio)
      if (response.success) {
        reporteActual.value = response.data
        console.log('[ReportesStore] Reporte mensual cargado')
        return response.data
      }
    } catch (err) {
      console.error('[ReportesStore] Error al cargar reporte mensual:', err)
      error.value = err.message || err.mensaje || 'Error al cargar el reporte'
      throw err
    } finally {
      loading.value = false
    }
  }

  const descargarPdf = async (tipo, params) => {
    loading.value = true
    error.value = null
    try {
      console.log('[ReportesStore] Descargando PDF:', tipo, params)
      let blob
      let filename

      switch (tipo) {
        case 'diario':
          blob = await reportesService.descargarPdfDiario(params.fecha)
          filename = `reporte_diario_${params.fecha}.pdf`
          break
        case 'semanal':
          blob = await reportesService.descargarPdfSemanal(params.fechaInicio)
          filename = `reporte_semanal_${params.fechaInicio}.pdf`
          break
        case 'mensual':
          blob = await reportesService.descargarPdfMensual(params.mes, params.anio)
          filename = `reporte_mensual_${params.mes}_${params.anio}.pdf`
          break
        default:
          throw new Error('Tipo de reporte no válido')
      }

      reportesService.downloadFile(blob, filename)
      console.log('[ReportesStore] PDF descargado exitosamente')
    } catch (err) {
      console.error('[ReportesStore] Error al descargar PDF:', err)
      error.value = err.message || err.mensaje || 'Error al descargar el PDF'
      throw err
    } finally {
      loading.value = false
    }
  }

  const descargarExcel = async (tipo, params) => {
    loading.value = true
    error.value = null
    try {
      console.log('[ReportesStore] Descargando Excel:', tipo, params)
      let blob
      let filename

      switch (tipo) {
        case 'diario':
          blob = await reportesService.descargarExcelDiario(params.fecha)
          filename = `reporte_diario_${params.fecha}.xlsx`
          break
        case 'semanal':
          blob = await reportesService.descargarExcelSemanal(params.fechaInicio)
          filename = `reporte_semanal_${params.fechaInicio}.xlsx`
          break
        case 'mensual':
          blob = await reportesService.descargarExcelMensual(params.mes, params.anio)
          filename = `reporte_mensual_${params.mes}_${params.anio}.xlsx`
          break
        default:
          throw new Error('Tipo de reporte no válido')
      }

      reportesService.downloadFile(blob, filename)
      console.log('[ReportesStore] Excel descargado exitosamente')
    } catch (err) {
      console.error('[ReportesStore] Error al descargar Excel:', err)
      error.value = err.message || err.mensaje || 'Error al descargar el Excel'
      throw err
    } finally {
      loading.value = false
    }
  }

  const limpiarReporte = () => {
    reporteActual.value = null
  }

  // Alias methods to match ReportsPage.vue expectations
  const obtenerReporteDiario = cargarReporteDiario
  const obtenerReporteSemanal = cargarReporteSemanal
  const obtenerReporteMensual = cargarReporteMensual

  const descargarReporteDiarioPDF = async (fecha) => {
    return await descargarPdf('diario', { fecha })
  }

  const descargarReporteSemanalPDF = async (fechaInicio, fechaFin) => {
    return await descargarPdf('semanal', { fechaInicio, fechaFin })
  }

  const descargarReporteMensualPDF = async (anio, mes) => {
    return await descargarPdf('mensual', { mes, anio })
  }

  const descargarReporteDiarioExcel = async (fecha) => {
    return await descargarExcel('diario', { fecha })
  }

  const descargarReporteSemanalExcel = async (fechaInicio, fechaFin) => {
    return await descargarExcel('semanal', { fechaInicio, fechaFin })
  }

  const descargarReporteMensualExcel = async (anio, mes) => {
    return await descargarExcel('mensual', { mes, anio })
  }

  return {
    // State
    reporteActual,
    loading,
    error,

    // Actions
    cargarReporteDiario,
    cargarReporteSemanal,
    cargarReporteMensual,
    descargarPdf,
    descargarExcel,
    limpiarReporte,

    // Aliases for ReportsPage.vue
    obtenerReporteDiario,
    obtenerReporteSemanal,
    obtenerReporteMensual,
    descargarReporteDiarioPDF,
    descargarReporteSemanalPDF,
    descargarReporteMensualPDF,
    descargarReporteDiarioExcel,
    descargarReporteSemanalExcel,
    descargarReporteMensualExcel,
  }
})
