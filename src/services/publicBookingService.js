import axios from 'axios'
import api from './api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Cliente axios SIN withCredentials (endpoints públicos, sin cookie JWT)
const publicApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const publicBookingService = {

  // ============================================================
  // ENDPOINTS PÚBLICOS (sin autenticación)
  // ============================================================

  /**
   * Obtiene la información pública del negocio y sus servicios activos.
   * @param {string} token - token público del negocio
   */
  async obtenerInfoNegocio(token) {
    const res = await publicApi.get(`/public/booking/${token}`)
    return res.data.data
  },

  /**
   * Obtiene horarios disponibles para una fecha y lista de servicios.
   * @param {string} token
   * @param {string[]} servicioIds - array de UUIDs
   * @param {string} fecha - ISO date string (ej: "2024-12-25")
   */
  async obtenerDisponibilidad(token, servicioIds, fecha) {
    const params = new URLSearchParams()
    params.append('fecha', fecha)
    servicioIds.forEach(id => params.append('servicioIds', id))
    const res = await publicApi.get(`/public/booking/${token}/disponibilidad?${params.toString()}`)
    return res.data.data
  },

  /**
   * Obtiene disponibilidad para los próximos 30 días.
   * Devuelve un objeto { "2024-12-01": true, "2024-12-02": false, ... }
   * @param {string} token
   * @param {string[]} servicioIds
   */
  async obtenerDisponibilidadMensual(token, servicioIds) {
    const params = new URLSearchParams()
    servicioIds.forEach(id => params.append('servicioIds', id))
    const res = await publicApi.get(`/public/booking/${token}/disponibilidad/mensual?${params.toString()}`)
    return res.data.data
  },

  /**
   * Crea una cita pública sin autenticación.
   * @param {string} token
   * @param {Object} datos - { servicioIds, fechaHora, clienteNombre, clienteEmail, clienteTelefono, notas }
   */
  async agendarCita(token, datos) {
    const res = await publicApi.post(`/public/booking/${token}/agendar`, datos)
    return res.data.data
  },

  // ============================================================
  // ENDPOINTS PRIVADOS (requieren JWT del dueño del negocio)
  // ============================================================

  /**
   * Obtiene el token público activo del negocio autenticado.
   * Si no existe, lo crea.
   */
  async obtenerMiToken() {
    const res = await api.get('/public/booking/token/mi-token')
    return res.data.data
  },

  /**
   * Regenera el token público del negocio autenticado.
   * El token anterior queda inválido inmediatamente.
   */
  async regenerarToken() {
    const res = await api.post('/public/booking/token/regenerar')
    return res.data.data
  },
}

export default publicBookingService
