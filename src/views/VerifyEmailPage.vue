<template>
  <AuthLayout>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Verificando tu email...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="success" class="text-center py-8">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-3">
        ¡Email Verificado!
      </h2>

      <p class="text-gray-600 mb-6">
        Tu correo electrónico ha sido verificado exitosamente.
      </p>

      <button
        @click="goToLogin"
        class="btn btn-primary"
      >
        Ir al Login
      </button>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-3">
        Error de Verificación
      </h2>

      <p class="text-gray-600 mb-6">
        {{ errorMessage }}
      </p>

      <div class="space-y-3">
        <button
          @click="resendEmail"
          :disabled="resending"
          class="btn btn-primary btn-block"
        >
          <span v-if="!resending">Reenviar Email de Verificación</span>
          <span v-else>Reenviando...</span>
        </button>

        <button
          @click="goToLogin"
          class="btn btn-secondary btn-block"
        >
          Volver al Login
        </button>
      </div>

      <Alert
        v-if="resendSuccess"
        type="success"
        message="Email de verificación reenviado exitosamente"
        class="mt-4"
      />

      <Alert
        v-if="resendError"
        type="error"
        :message="resendError"
        class="mt-4"
      />
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '../components/layout/AuthLayout.vue'
import Alert from '../components/common/Alert.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const resending = ref(false)
const resendSuccess = ref(false)
const resendError = ref('')
const token = ref('')

onMounted(async () => {
  // Obtener token de la URL
  token.value = route.query.token

  if (!token.value) {
    loading.value = false
    error.value = true
    errorMessage.value = 'Token de verificación no encontrado'
    return
  }

  await verifyEmail()
})

const verifyEmail = async () => {
  try {

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/verify-email`,
      { token: token.value }
    )

    if (response.data.success) {
      success.value = true
    } else {
      throw new Error(response.data.message || 'Error al verificar el email')
    }
  } catch (err) {
    console.error('[VerifyEmailPage] Error al verificar email:', err)
    error.value = true

    if (err.response?.status === 400) {
      errorMessage.value = 'El token de verificación es inválido o ha expirado'
    } else if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message
    } else {
      errorMessage.value = 'Ocurrió un error al verificar tu email. Por favor, intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

const resendEmail = async () => {
  resending.value = true
  resendSuccess.value = false
  resendError.value = ''

  try {

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/reenviar-verificacion`,
      { token: token.value }
    )

    if (response.data.success) {
      resendSuccess.value = true
      setTimeout(() => {
        resendSuccess.value = false
      }, 5000)
    } else {
      throw new Error(response.data.message || 'Error al reenviar el email')
    }
  } catch (err) {
    console.error('[VerifyEmailPage] Error al reenviar email:', err)
    resendError.value = err.response?.data?.message || 'Error al reenviar el email de verificación'
    setTimeout(() => {
      resendError.value = ''
    }, 5000)
  } finally {
    resending.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>
