import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  // El token ya NO se guarda en el store ni en localStorage.
  // La autenticación se maneja mediante cookie httpOnly gestionada por el backend.
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  // Indica si ya verificamos la sesión con el backend al menos una vez
  const initialized = ref(false)

  // GETTERS
  // La autenticación se determina por la presencia del objeto user (verificado vía cookie)
  const isAuthenticated = computed(() => !!user.value)

  // ACTIONS
  const register = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(payload)

      if (response.success) {
        // El token fue almacenado en cookie httpOnly por el backend
        user.value = {
          email: response.data?.email,
          nombre: response.data?.nombre,
          negocioId: response.data?.negocioId,
        }
        localStorage.setItem('user', JSON.stringify(user.value))
        initialized.value = true
        return response
      }
      throw new Error(response.message || 'Error en registro')
    } catch (err) {
      console.error('[AuthStore] Error al registrar:', err)
      error.value = err.message || err.mensaje || 'Error al registrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)

      if (response.success) {
        // El token fue almacenado en cookie httpOnly por el backend
        user.value = {
          email: response.data?.email,
          nombre: response.data?.nombre,
          negocioId: response.data?.negocioId,
        }
        localStorage.setItem('user', JSON.stringify(user.value))
        initialized.value = true
        return response
      }
      throw new Error(response.message || 'Error en login')
    } catch (err) {
      console.error('[AuthStore] Error al hacer login:', err)
      error.value = err.message || err.mensaje || 'Error al iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  const googleLogin = async (idToken, negocioData = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.googleAuth(idToken, negocioData)

      if (response.success) {
        // El token fue almacenado en cookie httpOnly por el backend
        user.value = {
          email: response.data?.email,
          nombre: response.data?.nombre,
          negocioId: response.data?.negocioId,
        }
        localStorage.setItem('user', JSON.stringify(user.value))
        initialized.value = true
        return response
      }
      throw new Error(response.message || 'Error en autenticación con Google')
    } catch (err) {
      console.error('[AuthStore] Error al hacer login con Google:', err)
      error.value = err.message || err.mensaje || 'Error al autenticar con Google'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // El backend invalida la cookie httpOnly
      await authService.logout()
    } catch (e) {
      // Error ignorado - limpiar estado de todas formas
    } finally {
      user.value = null
      initialized.value = false
      localStorage.removeItem('user')
    }
  }

  /**
   * Verifica si existe una sesión activa consultando /auth/me.
   * Debe llamarse una vez al inicio de la app (en el router guard).
   * Si la cookie httpOnly es válida, puebla user.value con datos frescos.
   */
  const initSession = async () => {
    if (initialized.value) return

    // Cargar datos de localStorage para mostrar mientras se verifica con el backend
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        localStorage.removeItem('user')
      }
    }

    try {
      const response = await authService.getCurrentUser()
      if (response.success && response.data) {
        const u = response.data
        user.value = {
          ...user.value,
          id: u.id,
          nombre: u.nombre,
          apellidoPaterno: u.apellidoPaterno,
          apellidoMaterno: u.apellidoMaterno,
          email: u.email,
          telefono: u.telefono,
          rol: u.rol,
          negocioId: u.negocioId,
          authProvider: u.authProvider,
        }
        localStorage.setItem('user', JSON.stringify(user.value))
      } else {
        user.value = null
        localStorage.removeItem('user')
      }
    } catch {
      // Si /auth/me falla (cookie expirada o ausente), limpiar sesión local
      user.value = null
      localStorage.removeItem('user')
    } finally {
      initialized.value = true
    }
  }

  /**
   * Cargar perfil completo del usuario desde el backend y sincronizar el store.
   */
  const cargarPerfil = async () => {
    try {
      const response = await authService.getCurrentUser()
      if (response.success && response.data) {
        const u = response.data
        user.value = {
          ...user.value,
          id: u.id,
          nombre: u.nombre,
          apellidoPaterno: u.apellidoPaterno,
          apellidoMaterno: u.apellidoMaterno,
          email: u.email,
          telefono: u.telefono,
          rol: u.rol,
          negocioId: u.negocioId,
          authProvider: u.authProvider,
        }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    } catch (err) {
      console.error('[AuthStore] Error al cargar perfil:', err)
    }
  }

  /**
   * Actualizar perfil del usuario autenticado.
   */
  const actualizarPerfil = async (datos) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.actualizarPerfil(datos)
      if (response.success && response.data) {
        const u = response.data
        user.value = {
          ...user.value,
          nombre: u.nombre,
          apellidoPaterno: u.apellidoPaterno,
          apellidoMaterno: u.apellidoMaterno,
          telefono: u.telefono,
        }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      return response
    } catch (err) {
      console.error('[AuthStore] Error al actualizar perfil:', err)
      error.value = err.message || 'Error al actualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    loading,
    error,
    initialized,

    // Getters
    isAuthenticated,

    // Actions
    register,
    login,
    googleLogin,
    logout,
    initSession,
    cargarPerfil,
    actualizarPerfil,
  }
})
