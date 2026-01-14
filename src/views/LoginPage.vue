<template>
  <AuthLayout>
    <Alert
      v-if="error"
      type="error"
      :message="error"
    />

    <!-- Google Sign-In Button -->
    <GoogleLoginButton
      mode="login"
      @success="handleGoogleSuccess"
      @error="handleGoogleError"
    />

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">O continúa con email</span>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary btn-block"
      >
        <span v-if="!loading">Iniciar Sesión</span>
        <span v-else>Entrando...</span>
      </button>
    </form>

    <p class="text-center text-gray-600 text-sm mt-6">
      ¿No tienes cuenta?
      <router-link to="/register" class="text-blue-600 font-medium hover:underline">
        Regístrate aquí
      </router-link>
    </p>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AuthLayout from '../components/layout/AuthLayout.vue'
import Alert from '../components/common/Alert.vue'
import GoogleLoginButton from '../components/common/GoogleLoginButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.mensaje || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const handleGoogleSuccess = () => {
  console.log('[LoginPage] Google login exitoso')
  error.value = ''
}

const handleGoogleError = (errorMsg) => {
  console.error('[LoginPage] Error en Google login:', errorMsg)
  error.value = errorMsg || 'Error al iniciar sesión con Google'
}
</script>