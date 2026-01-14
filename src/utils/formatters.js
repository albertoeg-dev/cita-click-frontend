/**
 * Utilidades para formatear datos
 */

/**
 * Formatea un precio a formato de moneda mexicana
 * @param {number} precio - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatearPrecio = (precio) => {
  if (precio === null || precio === undefined) return '$0.00'

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio)
}

/**
 * Formatea una fecha de YYYY-MM-DD a DD/MM/YYYY
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return ''

  try {
    const [year, month, day] = fecha.split('T')[0].split('-')
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('[Formatters] Error al formatear fecha:', error)
    return fecha
  }
}

/**
 * Formatea una fecha a formato corto (ej: "15 Ene 2025")
 * @param {string} fecha - Fecha en formato YYYY-MM-DD o ISO
 * @returns {string} Fecha formateada
 */
export const formatearFechaCorta = (fecha) => {
  if (!fecha) return ''

  try {
    const date = new Date(fecha)
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch (error) {
    console.error('[Formatters] Error al formatear fecha corta:', error)
    return fecha
  }
}

/**
 * Formatea una fecha a formato largo (ej: "Lunes, 15 de Enero de 2025")
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export const formatearFechaLarga = (fecha) => {
  if (!fecha) return ''

  try {
    const date = new Date(fecha + 'T00:00:00')
    return new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch (error) {
    console.error('[Formatters] Error al formatear fecha larga:', error)
    return fecha
  }
}

/**
 * Formatea una hora de HH:mm:ss a HH:mm
 * @param {string} hora - Hora en formato HH:mm:ss
 * @returns {string} Hora formateada
 */
export const formatearHora = (hora) => {
  if (!hora) return ''

  try {
    return hora.substring(0, 5)
  } catch (error) {
    console.error('[Formatters] Error al formatear hora:', error)
    return hora
  }
}

/**
 * Formatea una fecha y hora a formato legible
 * @param {string} fechaHora - Fecha y hora en formato ISO
 * @returns {string} Fecha y hora formateada
 */
export const formatearFechaHora = (fechaHora) => {
  if (!fechaHora) return ''

  try {
    const date = new Date(fechaHora)
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (error) {
    console.error('[Formatters] Error al formatear fecha y hora:', error)
    return fechaHora
  }
}

/**
 * Formatea duración en minutos a formato legible
 * @param {number} minutos - Duración en minutos
 * @returns {string} Duración formateada
 */
export const formatearDuracion = (minutos) => {
  if (!minutos || minutos === 0) return '0 min'

  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60

  if (horas === 0) return `${mins} min`
  if (mins === 0) return `${horas} h`
  return `${horas} h ${mins} min`
}

/**
 * Formatea un teléfono a formato +52 XX XXXX XXXX
 * @param {string} telefono - Teléfono a formatear
 * @returns {string} Teléfono formateado
 */
export const formatearTelefono = (telefono) => {
  if (!telefono) return ''

  // Remover todo excepto números
  const numeros = telefono.replace(/\D/g, '')

  // Si ya tiene código de país, formatear
  if (numeros.startsWith('52')) {
    const numero = numeros.substring(2)
    if (numero.length === 10) {
      return `+52 ${numero.substring(0, 2)} ${numero.substring(2, 6)} ${numero.substring(6)}`
    }
  }

  // Si son 10 dígitos, agregar código de país
  if (numeros.length === 10) {
    return `+52 ${numeros.substring(0, 2)} ${numeros.substring(2, 6)} ${numeros.substring(6)}`
  }

  return telefono
}

/**
 * Formatea un nombre completo
 * @param {string} nombre - Nombre
 * @param {string} apellidoPaterno - Apellido paterno
 * @param {string} apellidoMaterno - Apellido materno (opcional)
 * @returns {string} Nombre completo formateado
 */
export const formatearNombreCompleto = (nombre, apellidoPaterno, apellidoMaterno = '') => {
  const partes = [nombre, apellidoPaterno, apellidoMaterno].filter(Boolean)
  return partes.join(' ')
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha actual
 */
export const obtenerFechaActual = () => {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = String(hoy.getMonth() + 1).padStart(2, '0')
  const day = String(hoy.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Obtiene la hora actual en formato HH:mm
 * @returns {string} Hora actual
 */
export const obtenerHoraActual = () => {
  const ahora = new Date()
  const horas = String(ahora.getHours()).padStart(2, '0')
  const minutos = String(ahora.getMinutes()).padStart(2, '0')
  return `${horas}:${minutos}`
}

/**
 * Convierte una fecha de DD/MM/YYYY a YYYY-MM-DD
 * @param {string} fecha - Fecha en formato DD/MM/YYYY
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const convertirFechaAISO = (fecha) => {
  if (!fecha) return ''

  try {
    const [day, month, year] = fecha.split('/')
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('[Formatters] Error al convertir fecha a ISO:', error)
    return fecha
  }
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalizar = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, maxLength = 50) => {
  if (!texto) return ''
  if (texto.length <= maxLength) return texto
  return texto.substring(0, maxLength) + '...'
}
