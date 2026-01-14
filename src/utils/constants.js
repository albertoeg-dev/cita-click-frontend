/**
 * Constantes globales de la aplicación
 */

// Tipos de negocio
export const TIPOS_NEGOCIO = {
  SALON: 'SALON',
  SPA: 'SPA',
  CLINICA: 'CLINICA',
  CONSULTORIO: 'CONSULTORIO',
  OTRO: 'OTRO',
}

export const TIPOS_NEGOCIO_LABELS = {
  SALON: 'Salón de Belleza',
  SPA: 'Spa',
  CLINICA: 'Clínica',
  CONSULTORIO: 'Consultorio',
  OTRO: 'Otro',
}

// Estados de citas
export const ESTADOS_CITA = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
}

export const ESTADOS_CITA_LABELS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
}

export const ESTADOS_CITA_COLORS = {
  PENDIENTE: 'yellow',
  CONFIRMADA: 'blue',
  COMPLETADA: 'green',
  CANCELADA: 'red',
}

// Días de la semana
// IMPORTANTE: Backend usa 0=Lunes, 1=Martes, ..., 6=Domingo
// Este orden DEBE coincidir con HorarioTrabajo.diaSemana en el backend
export const DIAS_SEMANA = [
  { value: 0, label: 'Lunes', short: 'Lun' },
  { value: 1, label: 'Martes', short: 'Mar' },
  { value: 2, label: 'Miércoles', short: 'Mié' },
  { value: 3, label: 'Jueves', short: 'Jue' },
  { value: 4, label: 'Viernes', short: 'Vie' },
  { value: 5, label: 'Sábado', short: 'Sáb' },
  { value: 6, label: 'Domingo', short: 'Dom' },
]

export const DIAS_SEMANA_LABELS = {
  0: 'Lunes',
  1: 'Martes',
  2: 'Miércoles',
  3: 'Jueves',
  4: 'Viernes',
  5: 'Sábado',
  6: 'Domingo',
}

export const DIAS_SEMANA_MAP = {
  0: 'Lunes',
  1: 'Martes',
  2: 'Miércoles',
  3: 'Jueves',
  4: 'Viernes',
  5: 'Sábado',
  6: 'Domingo',
}

// Tipos de periodo para reportes
export const TIPOS_PERIODO = {
  DIARIO: 'DIARIO',
  SEMANAL: 'SEMANAL',
  MENSUAL: 'MENSUAL',
}

// Meses del año
export const MESES = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]

// Configuración de formato
export const FORMATO_FECHA = 'YYYY-MM-DD'
export const FORMATO_HORA = 'HH:mm'
export const FORMATO_FECHA_HORA = 'YYYY-MM-DDTHH:mm:ss'
export const FORMATO_FECHA_DISPLAY = 'DD/MM/YYYY'
export const FORMATO_HORA_DISPLAY = 'hh:mm A'

// Validaciones
export const VALIDACIONES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO_REGEX: /^\+52\s?\d{2}\s?\d{4}\s?\d{4}$/,
  TELEFONO_PLACEHOLDER: '+52 55 1234 5678',
}

// Mensajes comunes
export const MENSAJES = {
  ERROR_GENERICO: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
  EXITO_CREAR: 'Creado exitosamente',
  EXITO_ACTUALIZAR: 'Actualizado exitosamente',
  EXITO_ELIMINAR: 'Eliminado exitosamente',
  CONFIRMAR_ELIMINAR: '¿Estás seguro de que deseas eliminar este elemento?',
  CAMPOS_REQUERIDOS: 'Por favor, completa todos los campos requeridos',
  CARGANDO: 'Cargando...',
}

// Configuración de paginación (para uso futuro)
export const PAGINACION = {
  ITEMS_POR_PAGINA: 10,
  ITEMS_POR_PAGINA_OPCIONES: [10, 25, 50, 100],
}
