<template>
  <div class="w-full">
    <!-- Contenedor para el botón de Google (renderizado por GSI) -->
    <div
      ref="googleButtonContainer"
      id="googleButtonContainer"
      class="w-full flex justify-center"
    ></div>

    <!-- Loading mientras se inicializa GSI -->
    <div
      v-if="!googleButtonRendered"
      class="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white"
    >
      <svg
        class="animate-spin h-5 w-5 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-sm font-medium text-gray-700">Cargando Google...</span>
    </div>

    <!-- Error si GSI no carga -->
    <div
      v-if="gsiLoadError"
      class="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-red-300 rounded-md bg-red-50"
    >
      <span class="text-sm text-red-600">No se pudo cargar el botón de Google. Recarga la página.</span>
    </div>

    <p v-if="showInfo && googleButtonRendered" class="mt-2 text-xs text-center text-gray-500">
      {{ mode === 'login' ? 'Inicia sesión' : 'Regístrate' }} rápidamente con tu cuenta de Google
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useSuscripcionStore } from '../../stores/suscripcionStore'
import { useOnboardingStore } from '../../stores/onboardingStore'

const props = defineProps({
  mode: {
    type: String,
    default: 'login',
    validator: (value) => ['login', 'register'].includes(value),
  },
  showInfo: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['success', 'error'])

const router = useRouter()
const authStore = useAuthStore()
const suscripcionStore = useSuscripcionStore()
const onboardingStore = useOnboardingStore()
const googleButtonContainer = ref(null)
const googleButtonRendered = ref(false)
const gsiLoadError = ref(false)

let retryCount = 0
const MAX_RETRIES = 50 // 5 segundos máximo (50 * 100ms)

onMounted(async () => {
  // Esperar al siguiente tick para asegurarse de que el DOM está listo
  await nextTick()
  initGoogleSignIn()
})

onUnmounted(() => {
  // Limpiar el estado de GSI al desmontar para evitar conflictos
  try {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.cancel()
    }
  } catch (_) {
    // silenciar errores al desmontar
  }
})

const initGoogleSignIn = () => {
  // Verificar que GSI esté disponible
  if (typeof google === 'undefined' || !google?.accounts?.id) {
    retryCount++
    if (retryCount >= MAX_RETRIES) {
      console.error('[GoogleLoginButton] Timeout: Google Identity Services no cargó')
      gsiLoadError.value = true
      return
    }
    setTimeout(initGoogleSignIn, 100)
    return
  }

  // Verificar que el contenedor exista en el DOM
  if (!googleButtonContainer.value) {
    console.error('[GoogleLoginButton] El contenedor del botón no está en el DOM')
    gsiLoadError.value = true
    return
  }

  try {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('[GoogleLoginButton] VITE_GOOGLE_CLIENT_ID no está configurado')
      gsiLoadError.value = true
      emit('error', 'Google Client ID no configurado')
      return
    }

    // Inicializar Google Identity Services
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: props.mode === 'login' ? 'signin' : 'signup',
      ux_mode: 'popup',
    })

    // Calcular el ancho del contenedor en píxeles (la API de Google requiere un número)
    const containerWidth = googleButtonContainer.value.offsetWidth || 400

    // Renderizar el botón oficial de Google
    google.accounts.id.renderButton(
      googleButtonContainer.value,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: props.mode === 'login' ? 'continue_with' : 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: containerWidth,
        locale: 'es',
      }
    )

    googleButtonRendered.value = true
  } catch (error) {
    console.error('[GoogleLoginButton] Error al inicializar Google Sign-In:', error)
    gsiLoadError.value = true
    emit('error', 'Error al cargar el botón de Google')
  }
}

const handleGoogleCallback = async (response) => {
  try {
    const idToken = response.credential

    if (!idToken) {
      throw new Error('No se recibió token de Google')
    }

    // Autenticar con el backend
    await authStore.googleLogin(idToken)

    emit('success')

    // Verificar estado de onboarding antes de redirigir
    try {
      await suscripcionStore.cargarInfoSuscripcion()
    } catch {}

    if (!onboardingStore.onboardingCompleto) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('[GoogleLoginButton] Error en callback de Google:', error)

    const errorMessage = error.response?.data?.message
      || error.message
      || 'Error al autenticar con Google'

    emit('error', errorMessage)
  }
}
</script>
