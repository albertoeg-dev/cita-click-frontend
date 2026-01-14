<template>
  <div>
    <!-- Contenedor para el botón de Google (será renderizado por Google) -->
    <div
      ref="googleButtonContainer"
      id="googleButtonContainer"
      class="w-full"
    ></div>

    <!-- Mensaje de loading mientras se renderiza el botón -->
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
      <span class="text-sm font-medium text-gray-700">Cargando...</span>
    </div>

    <!-- Nota de información -->
    <p v-if="showInfo" class="mt-2 text-xs text-center text-gray-500">
      {{ mode === 'login' ? 'Inicia sesión' : 'Regístrate' }} rápidamente con tu cuenta de Google
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

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
const loading = ref(false)
const googleButtonContainer = ref(null)
const googleButtonRendered = ref(false)

const buttonText = props.mode === 'login'
  ? 'Continuar con Google'
  : 'Registrarse con Google'

// Inicializar Google al montar el componente
onMounted(() => {
  initGoogleSignIn()
})

const initGoogleSignIn = () => {
  // Esperar a que Google Identity Services esté disponible
  if (typeof google === 'undefined' || !google.accounts) {
    console.log('[GoogleLoginButton] Esperando a que Google GSI se cargue...')
    setTimeout(initGoogleSignIn, 100)
    return
  }

  try {
    console.log('[GoogleLoginButton] Inicializando Google Sign-In Button')

    // Renderizar el botón oficial de Google
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: props.mode === 'login' ? 'signin' : 'signup',
    })

    // Renderizar el botón en el contenedor
    google.accounts.id.renderButton(
      googleButtonContainer.value,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: props.mode === 'login' ? 'continue_with' : 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
      }
    )

    googleButtonRendered.value = true
    console.log('[GoogleLoginButton] Botón de Google renderizado correctamente')
  } catch (error) {
    console.error('[GoogleLoginButton] Error al renderizar botón de Google:', error)
    emit('error', 'Error al cargar el botón de Google')
  }
}

const handleGoogleCallback = async (response) => {
  console.log('[GoogleLoginButton] Callback de Google recibido')
  loading.value = true

  try {
    // El response contiene el credential (JWT token de Google)
    const idToken = response.credential

    if (!idToken) {
      throw new Error('No se recibió token de Google')
    }

    console.log('[GoogleLoginButton] Token recibido, autenticando con backend...')

    // Autenticar con el backend
    await authStore.googleLogin(idToken)

    console.log('[GoogleLoginButton] Autenticación exitosa')
    loading.value = false
    emit('success')

    // Redirigir al dashboard
    router.push('/dashboard')

  } catch (error) {
    console.error('[GoogleLoginButton] Error en callback:', error)
    loading.value = false

    const errorMessage = error.response?.data?.message
      || error.message
      || 'Error al autenticar con Google'

    emit('error', errorMessage)
  }
}
</script>
