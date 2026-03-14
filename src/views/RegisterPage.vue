<template>
  <AuthLayout>
    <Alert
      v-if="error"
      type="error"
      :message="error"
    />

    <!-- Google Sign-In Button -->
    <GoogleLoginButton
      mode="register"
      @success="handleGoogleSuccess"
      @error="handleGoogleError"
    />

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">O regístrate con email</span>
      </div>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Plan Selection -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Selecciona tu plan <span class="text-red-500">*</span>
        </label>
        <select
          v-model="selectedPlan"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        >
          <option value="base">Plan Base - $299/mes (7 días gratis)</option>
          <option value="completo">Bundle Completo - $1,199/mes (7 días gratis)</option>
        </select>
        <p class="text-xs text-gray-600 mt-2">
          Ambos planes incluyen 7 días de prueba gratis. Sin tarjeta de crédito.
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nombre <span class="text-red-500">*</span>
        </label>
        <input
          v-model="nombre"
          type="text"
          placeholder="Juan"
          required
          class="input"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Apellido Paterno <span class="text-red-500">*</span>
          </label>
          <input
            v-model="apellidoPaterno"
            type="text"
            placeholder="García"
            required
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Apellido Materno <span class="text-red-500">*</span>
          </label>
          <input
            v-model="apellidoMaterno"
            type="text"
            placeholder="López"
            required
            class="input"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="tu@email.com"
          required
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Contraseña <span class="text-red-500">*</span>
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          required
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Contraseña <span class="text-red-500">*</span>
        </label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          required
          class="input"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary btn-block"
      >
        <span v-if="!loading">Crear Cuenta</span>
        <span v-else>Creando cuenta...</span>
      </button>
    </form>

    <p class="text-center text-gray-600 text-sm mt-6">
      ¿Ya tienes cuenta?
      <router-link to="/login" class="text-blue-600 font-medium hover:underline">
        Inicia sesión aquí
      </router-link>
    </p>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useSuscripcionStore } from '../stores/suscripcionStore'
import { useOnboardingStore } from '../stores/onboardingStore'
import AuthLayout from '../components/layout/AuthLayout.vue'
import Alert from '../components/common/Alert.vue'
import GoogleLoginButton from '../components/common/GoogleLoginButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const suscripcionStore = useSuscripcionStore()
const onboardingStore = useOnboardingStore()

const nombre = ref('')
const apellidoPaterno = ref('')
const apellidoMaterno = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const selectedPlan = ref('base')
const loading = ref(false)
const error = ref('')

// Cargar plan desde URL query params
onMounted(() => {
  const planFromQuery = route.query.plan
  const planesValidos = ['base', 'completo', 'basico', 'bundle'] // aliases legacy aceptados
  if (planFromQuery && planesValidos.includes(planFromQuery)) {
    // Normalizar aliases legacy al nuevo nombre
    selectedPlan.value = (planFromQuery === 'bundle' || planFromQuery === 'basico') ? 'base' : planFromQuery
  }
})

const handleRegister = async () => {

  // Validaciones
  if (!nombre.value || !apellidoPaterno.value || !apellidoMaterno.value || !email.value || !password.value) {
    error.value = 'Por favor completa todos los campos requeridos'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const datos = {
      nombre: nombre.value,
      apellidoPaterno: apellidoPaterno.value,
      apellidoMaterno: apellidoMaterno.value,
      email: email.value,
      password: password.value,
      plan: selectedPlan.value,
    }

    await authStore.register(datos)

    // Verificar onboarding antes de redirigir
    try { await suscripcionStore.cargarInfoSuscripcion() } catch {}
    if (!onboardingStore.onboardingCompleto) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('[RegisterPage] Error al registrar:', err)
    error.value = err.message || err.mensaje || 'Error al crear la cuenta'
  } finally {
    loading.value = false
  }
}

const handleGoogleSuccess = () => {
  error.value = ''
}

const handleGoogleError = (errorMsg) => {
  console.error('[RegisterPage] Error en Google register:', errorMsg)
  error.value = errorMsg || 'Error al registrarse con Google'
}
</script>
