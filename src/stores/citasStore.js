import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { citasService } from '../services/citasService'

export const useCitasStore = defineStore('citas', () => {
  // STATE
  const citas = ref([])
  const citaActual = ref(null)
  const horariosDisponibles = ref([])
  const loading = ref(false)
  const error = ref(null)

  // GETTERS
  const citasPendientes = computed(() =>
    citas.value.filter(c => c.estado === 'PENDIENTE')
  )

  const citasConfirmadas = computed(() =>
    citas.value.filter(c => c.estado === 'CONFIRMADA')
  )

  const citasCompletadas = computed(() =>
    citas.value.filter(c => c.estado === 'COMPLETADA')
  )

  const citasCanceladas = computed(() =>
    citas.value.filter(c => c.estado === 'CANCELADA')
  )

  // ACTIONS
  const cargarCitas = async (fecha = null, estado = null) => {
    loading.value = true
    error.value = null
    try {
      console.log('[CitasStore] Cargando citas, fecha:', fecha, 'estado:', estado)
      const response = await citasService.getCitas(fecha, estado)
      if (response.success) {
        citas.value = response.data
        console.log('[CitasStore] Citas cargadas:', citas.value?.length || 0)
      }
    } catch (err) {
      console.error('[CitasStore] Error al cargar citas:', err)
      error.value = err.message || err.mensaje || 'Error al cargar citas'
    } finally {
      loading.value = false
    }
  }

  const cargarCita = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log('[CitasStore] Cargando cita:', id)
      const response = await citasService.getCita(id)
      if (response.success) {
        citaActual.value = response.data
        console.log('[CitasStore] Cita cargada')
      }
    } catch (err) {
      console.error('[CitasStore] Error al cargar cita:', err)
      error.value = err.message || err.mensaje || 'Error al cargar la cita'
    } finally {
      loading.value = false
    }
  }

  const crearCita = async (data) => {
    loading.value = true
    error.value = null
    try {
      console.log('[CitasStore] Creando cita')
      const response = await citasService.createCita(data)
      if (response.success) {
        await cargarCitas()
        console.log('[CitasStore] Cita creada y lista actualizada')
        return response
      }
    } catch (err) {
      console.error('[CitasStore] Error al crear cita:', err)
      error.value = err.message || err.mensaje || 'Error al crear la cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizarCita = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      console.log('[CitasStore] Actualizando cita:', id)
      const response = await citasService.updateCita(id, data)
      if (response.success) {
        await cargarCitas()
        console.log('[CitasStore] Cita actualizada y lista actualizada')
        return response
      }
    } catch (err) {
      console.error('[CitasStore] Error al actualizar cita:', err)
      error.value = err.message || err.mensaje || 'Error al actualizar la cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cambiarEstadoCita = async (id, estado) => {
    loading.value = true
    error.value = null
    try {
      console.log('[CitasStore] Cambiando estado de cita:', id, 'a', estado)
      const response = await citasService.cambiarEstado(id, estado)
      if (response.success) {
        await cargarCitas()
        console.log('[CitasStore] Estado cambiado y lista actualizada')
        return response
      }
    } catch (err) {
      console.error('[CitasStore] Error al cambiar estado:', err)
      error.value = err.message || err.mensaje || 'Error al cambiar el estado'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelarCita = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log('[CitasStore] Cancelando cita:', id)
      const response = await citasService.cancelarCita(id)
      if (response.success) {
        await cargarCitas()
        console.log('[CitasStore] Cita cancelada y lista actualizada')
        return response
      }
    } catch (err) {
      console.error('[CitasStore] Error al cancelar cita:', err)
      error.value = err.message || err.mensaje || 'Error al cancelar la cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarDisponibilidad = async (servicioId, fecha) => {
    loading.value = true
    error.value = null
    try {
      console.log('[CitasStore] Cargando disponibilidad para servicio:', servicioId, 'fecha:', fecha)
      const response = await citasService.getDisponibilidad(servicioId, fecha)
      if (response.success) {
        // Backend devuelve data directamente como array de LocalDateTime strings
        // Extraer solo la parte de la hora (HH:mm) de cada timestamp
        const horarios = (response.data || []).map(timestamp => {
          // timestamp viene como "2026-01-15T09:00:00"
          const horaCompleta = timestamp.split('T')[1] // "09:00:00"
          return horaCompleta.substring(0, 5) // "09:00"
        })
        horariosDisponibles.value = horarios
        console.log('[CitasStore] Disponibilidad cargada:', horariosDisponibles.value.length, 'slots')
        // Retornar en el formato que el componente espera
        return { horariosDisponibles: horariosDisponibles.value }
      }
    } catch (err) {
      console.error('[CitasStore] Error al cargar disponibilidad:', err)
      error.value = err.message || err.mensaje || 'Error al cargar disponibilidad'
      horariosDisponibles.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const limpiarCitaActual = () => {
    citaActual.value = null
  }

  const limpiarDisponibilidad = () => {
    horariosDisponibles.value = []
  }

  return {
    // State
    citas,
    citaActual,
    horariosDisponibles,
    loading,
    error,

    // Getters
    citasPendientes,
    citasConfirmadas,
    citasCompletadas,
    citasCanceladas,

    // Actions
    cargarCitas,
    cargarCita,
    crearCita,
    actualizarCita,
    cambiarEstadoCita,
    cancelarCita,
    cargarDisponibilidad,
    limpiarCitaActual,
    limpiarDisponibilidad,
  }
})
