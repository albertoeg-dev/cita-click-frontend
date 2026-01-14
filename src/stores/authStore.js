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
      console.log('[AuthStore] Registrando usuario:', payload)
      const response = await authService.register(payload)
      console.log('[AuthStore] Respuesta del registro:', response)

      if (response.success && response.data?.token) {
        token.value = response.data.token
        user.value = {
          email: response.data.email,
          nombre: response.data.nombre,
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        console.log('[AuthStore] Usuario registrado exitosamente')
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
      console.log('[AuthStore] Iniciando sesión:', email)
      const response = await authService.login(email, password)
      console.log('[AuthStore] Respuesta del login:', response)

      if (response.success && response.data?.token) {
        token.value = response.data.token
        user.value = {
          email: response.data.email,
          nombre: response.data.nombre,
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        console.log('[AuthStore] Login exitoso')
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
      console.log('[AuthStore] Iniciando login con Google')
      const response = await authService.googleAuth(idToken, negocioData)
      console.log('[AuthStore] Respuesta de Google Auth:', response)

      if (response.success && response.data?.token) {
        token.value = response.data.token
        user.value = {
          email: response.data.email,
          nombre: response.data.nombre,
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        console.log('[AuthStore] Login con Google exitoso')
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
      await authService.logout()
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
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