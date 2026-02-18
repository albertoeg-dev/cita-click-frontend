import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // GETTERS
  const isAuthenticated = computed(() => !!token.value)

  // ACTIONS
  const register = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(payload)

      if (response.success && response.data?.token) {
        token.value = response.data.token
        user.value = {
          email: response.data.email,
          nombre: response.data.nombre,
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
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

      if (response.success && response.data?.token) {
        token.value = response.data.token
        user.value = {
          email: response.data.email,
          nombre: response.data.nombre,
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
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

      if (response.success && response.data?.token) {
        token.value = response.data.token
        user.value = {
          email: response.data.email,
          nombre: response.data.nombre,
          negocioId: response.data.negocioId,
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
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
      // Intentar llamar al backend, pero no fallar si no funciona
      await authService.logout()
    } catch (error) {
      // Error ignorado
    } finally {
      // Siempre limpiar el estado local
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('[AuthStore] Error al parsear usuario de localStorage:', error)
        // Si hay error parseando, limpiar localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        token.value = null
        user.value = null
      }
    } else if (storedToken && !storedUser) {
      // Token sin usuario, limpiar todo
      localStorage.removeItem('token')
      token.value = null
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,

    // Actions
    register,
    login,
    googleLogin,
    logout,
    loadUserFromStorage,
  }
})