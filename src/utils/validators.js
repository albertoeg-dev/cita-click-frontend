/**
 * Utilidades para validación de formularios
 */

import { VALIDACIONES } from './constants'

/**
 * Valida que un campo no esté vacío
 * @param {any} valor - Valor a validar
 * @returns {boolean} True si es válido
 */
export const requerido = (valor) => {
  if (valor === null || valor === undefined) return false
  if (typeof valor === 'string') return valor.trim().length > 0
  if (typeof valor === 'number') return true
  return !!valor
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const validarEmail = (email) => {
  if (!email) return false
  return VALIDACIONES.EMAIL_REGEX.test(email)
}

/**
 * Valida un teléfono (10 dígitos o formato +52 XX XXXX XXXX)
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const validarTelefono = (telefono) => {
  if (!telefono) return false

  // Remover espacios y caracteres no numéricos excepto +
  const telefonoLimpio = telefono.replace(/[\s-]/g, '')

  // Validar 10 dígitos sin código de país
  if (/^\d{10}$/.test(telefonoLimpio)) return true

  // Validar formato con código de país +52
  if (/^\+52\d{10}$/.test(telefonoLimpio)) return true

  // Validar formato con espacios +52 XX XXXX XXXX
  if (VALIDACIONES.TELEFONO_REGEX.test(telefono)) return true

  return false
}

/**
 * Valida que un número sea mayor a cero
 * @param {number} numero - Número a validar
 * @returns {boolean} True si es válido
 */
export const mayorACero = (numero) => {
  if (numero === null || numero === undefined) return false
  return Number(numero) > 0
}

/**
 * Valida que un número sea mayor o igual a cero
 * @param {number} numero - Número a validar
 * @returns {boolean} True si es válido
 */
export const mayorOIgualACero = (numero) => {
  if (numero === null || numero === undefined) return false
  return Number(numero) >= 0
}

/**
 * Valida la longitud máxima de un string
 * @param {string} valor - Valor a validar
 * @param {number} max - Longitud máxima
 * @returns {boolean} True si es válido
 */
export const longitudMaxima = (valor, max) => {
  if (!valor) return true
  return valor.length <= max
}

/**
 * Valida la longitud mínima de un string
 * @param {string} valor - Valor a validar
 * @param {number} min - Longitud mínima
 * @returns {boolean} True si es válido
 */
export const longitudMinima = (valor, min) => {
  if (!valor) return false
  return valor.length >= min
}

/**
 * Valida que una contraseña sea segura
 * @param {string} password - Contraseña a validar
 * @returns {object} { valido: boolean, mensaje: string }
 */
export const validarPassword = (password) => {
  if (!password) {
    return { valido: false, mensaje: 'La contraseña es requerida' }
  }

  if (password.length < 8) {
    return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos una mayúscula' }
  }

  if (!/[a-z]/.test(password)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos una minúscula' }
  }

  if (!/[0-9]/.test(password)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos un número' }
  }

  return { valido: true, mensaje: '' }
}

/**
 * Valida una fecha en formato YYYY-MM-DD
 * @param {string} fecha - Fecha a validar
 * @returns {boolean} True si es válido
 */
export const validarFecha = (fecha) => {
  if (!fecha) return false

  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(fecha)) return false

  const date = new Date(fecha + 'T00:00:00')
  return date instanceof Date && !isNaN(date)
}

/**
 * Valida que una fecha no sea pasada
 * @param {string} fecha - Fecha a validar en formato YYYY-MM-DD
 * @returns {boolean} True si es válido
 */
export const fechaNoEsPasada = (fecha) => {
  if (!validarFecha(fecha)) return false

  const fechaDate = new Date(fecha + 'T00:00:00')
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  return fechaDate >= hoy
}

/**
 * Valida una hora en formato HH:mm
 * @param {string} hora - Hora a validar
 * @returns {boolean} True si es válido
 */
export const validarHora = (hora) => {
  if (!hora) return false

  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/
  return regex.test(hora)
}

/**
 * Valida que hora de cierre sea mayor que hora de apertura
 * @param {string} horaApertura - Hora de apertura HH:mm
 * @param {string} horaCierre - Hora de cierre HH:mm
 * @returns {boolean} True si es válido
 */
export const horaCierreEsMayor = (horaApertura, horaCierre) => {
  if (!validarHora(horaApertura) || !validarHora(horaCierre)) return false

  const [horasAp, minutosAp] = horaApertura.split(':').map(Number)
  const [horasCi, minutosCi] = horaCierre.split(':').map(Number)

  const minutosApertura = horasAp * 60 + minutosAp
  const minutosCierre = horasCi * 60 + minutosCi

  return minutosCierre > minutosApertura
}

/**
 * Valida un rango numérico
 * @param {number} valor - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} True si es válido
 */
export const enRango = (valor, min, max) => {
  if (valor === null || valor === undefined) return false
  const num = Number(valor)
  return num >= min && num <= max
}

/**
 * Valida un día de la semana (0-6)
 * @param {number} dia - Día a validar
 * @returns {boolean} True si es válido
 */
export const validarDiaSemana = (dia) => {
  return enRango(dia, 0, 6)
}

/**
 * Valida los datos de un servicio
 * @param {Object} servicio - Datos del servicio
 * @returns {object} { valido: boolean, errores: object }
 */
export const validarServicio = (servicio) => {
  const errores = {}

  if (!requerido(servicio.nombre)) {
    errores.nombre = 'El nombre es requerido'
  } else if (!longitudMaxima(servicio.nombre, 100)) {
    errores.nombre = 'El nombre no puede exceder 100 caracteres'
  }

  if (!mayorACero(servicio.duracion)) {
    errores.duracion = 'La duración debe ser mayor a 0'
  }

  if (!mayorACero(servicio.precio)) {
    errores.precio = 'El precio debe ser mayor a 0'
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  }
}

/**
 * Valida los datos de un cliente
 * @param {Object} cliente - Datos del cliente
 * @returns {object} { valido: boolean, errores: object }
 */
export const validarCliente = (cliente) => {
  const errores = {}

  if (!requerido(cliente.nombre)) {
    errores.nombre = 'El nombre es requerido'
  }

  if (!requerido(cliente.apellidoPaterno)) {
    errores.apellidoPaterno = 'El apellido paterno es requerido'
  }

  if (cliente.email && !validarEmail(cliente.email)) {
    errores.email = 'El email no es válido'
  }

  if (cliente.telefono && !validarTelefono(cliente.telefono)) {
    errores.telefono = 'El teléfono debe tener el formato +52 XX XXXX XXXX'
  }

  if (cliente.fechaNacimiento && !validarFecha(cliente.fechaNacimiento)) {
    errores.fechaNacimiento = 'La fecha de nacimiento no es válida'
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  }
}

/**
 * Valida los datos de una cita
 * @param {Object} cita - Datos de la cita
 * @returns {object} { valido: boolean, errores: object }
 */
export const validarCita = (cita) => {
  const errores = {}

  if (!requerido(cita.clienteId)) {
    errores.clienteId = 'Debes seleccionar un cliente'
  }

  if (!requerido(cita.servicioId)) {
    errores.servicioId = 'Debes seleccionar un servicio'
  }

  if (!validarFecha(cita.fechaHora?.split('T')[0])) {
    errores.fecha = 'La fecha no es válida'
  } else if (!fechaNoEsPasada(cita.fechaHora?.split('T')[0])) {
    errores.fecha = 'La fecha no puede ser en el pasado'
  }

  // Validar recurrencia si está habilitada
  if (cita.esRecurrente) {
    if (!cita.recurrencia?.tipoRecurrencia) {
      errores.recurrencia = 'Debes seleccionar un tipo de recurrencia'
    } else if (cita.recurrencia.tipoRecurrencia === 'PERSONALIZADO' && !cita.recurrencia.intervaloRecurrencia) {
      errores.recurrencia = 'Debes especificar el intervalo para recurrencia personalizada'
    }
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  }
}

/**
 * Valida los datos de un horario
 * @param {Object} horario - Datos del horario
 * @returns {object} { valido: boolean, errores: object }
 */
export const validarHorario = (horario) => {
  const errores = {}

  if (!validarDiaSemana(horario.diaSemana)) {
    errores.diaSemana = 'El día de la semana no es válido'
  }

  if (!validarHora(horario.horaInicio)) {
    errores.horaInicio = 'La hora de inicio no es válida'
  }

  if (!validarHora(horario.horaFin)) {
    errores.horaFin = 'La hora de fin no es válida'
  }

  if (horario.horaInicio && horario.horaFin &&
      !horaCierreEsMayor(horario.horaInicio, horario.horaFin)) {
    errores.horaFin = 'La hora de fin debe ser mayor a la hora de inicio'
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  }
}

/**
 * Valida los datos de un negocio
 * @param {Object} negocio - Datos del negocio
 * @returns {object} { valido: boolean, errores: object }
 */
export const validarNegocio = (negocio) => {
  const errores = {}

  if (!requerido(negocio.nombre)) {
    errores.nombre = 'El nombre es requerido'
  } else if (!longitudMaxima(negocio.nombre, 100)) {
    errores.nombre = 'El nombre no puede exceder 100 caracteres'
  }

  if (!requerido(negocio.tipo)) {
    errores.tipo = 'El tipo de negocio es requerido'
  }

  if (!requerido(negocio.telefono)) {
    errores.telefono = 'El teléfono es requerido'
  } else if (!validarTelefono(negocio.telefono)) {
    errores.telefono = 'El teléfono no es válido'
  }

  if (negocio.email && !validarEmail(negocio.email)) {
    errores.email = 'El email no es válido'
  }

  if (negocio.direccion?.codigoPostal && !/^\d{5}$/.test(negocio.direccion.codigoPostal)) {
    errores.codigoPostal = 'El código postal debe tener 5 dígitos'
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  }
}
