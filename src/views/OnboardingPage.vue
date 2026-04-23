<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useOnboardingStore } from '@/stores/onboardingStore'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()

const pasoActual = ref(1)
const totalPasos = 4
const guardando = ref(false)
const error = ref('')

// Determinar si vino por Google
const esGoogle = computed(() => authStore.user?.authProvider === 'google')

// --- Paso 2: Perfil personal ---
const perfil = ref({
  nombre: authStore.user?.nombre || '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  telefono: ''
})

// --- Paso 3: Negocio ---
const negocio = ref({
  nombre: '',
  tipo: '',
  telefono: '',
  descripcion: ''
})

const tiposNegocio = [
  'Salón de belleza',
  'Barbería',
  'Clínica dental',
  'Consultorio médico',
  'Spa / Masajes',
  'Estudio de yoga / Fitness',
  'Veterinaria',
  'Psicología / Terapia',
  'Nutrición',
  'Otro'
]

const porcentajeProgreso = computed(() => Math.round(((pasoActual.value - 1) / (totalPasos - 1)) * 100))

// Validaciones por paso
const pasoValido = computed(() => {
  if (pasoActual.value === 1) return true
  if (pasoActual.value === 2) {
    return perfil.value.nombre.trim() && perfil.value.apellidoPaterno.trim()
  }
  if (pasoActual.value === 3) {
    return negocio.value.nombre.trim() && negocio.value.tipo
  }
  return true
})

onMounted(async () => {
  // Cargar datos actuales del negocio para pre-llenar si ya existen
  try {
    const res = await api.get('/negocios/perfil')
    if (res.data?.data) {
      const n = res.data.data
      if (n.nombre) negocio.value.nombre = n.nombre
      if (n.tipo) negocio.value.tipo = n.tipo
      if (n.telefono) negocio.value.telefono = n.telefono
      if (n.descripcion) negocio.value.descripcion = n.descripcion
    }
  } catch {}
})

async function siguiente() {
  error.value = ''

  if (pasoActual.value === 2) {
    await guardarPerfil()
  } else if (pasoActual.value === 3) {
    await guardarNegocio()
  } else if (pasoActual.value === 4) {
    await finalizar()
    return
  }

  pasoActual.value++
}

function omitir() {
  error.value = ''
  pasoActual.value++
}

async function guardarPerfil() {
  guardando.value = true
  try {
    await api.put('/auth/perfil', {
      nombre: perfil.value.nombre,
      apellidoPaterno: perfil.value.apellidoPaterno,
      apellidoMaterno: perfil.value.apellidoMaterno || null,
      telefono: perfil.value.telefono || null
    })
  } catch (err) {
    error.value = 'Error al guardar tu perfil. Puedes continuar y actualizarlo en Configuración.'
  } finally {
    guardando.value = false
  }
}

async function guardarNegocio() {
  guardando.value = true
  try {
    await api.put('/negocios/perfil', {
      nombre: negocio.value.nombre,
      tipo: negocio.value.tipo,
      telefono: negocio.value.telefono || null,
      descripcion: negocio.value.descripcion || null
    })
  } catch (err) {
    error.value = 'Error al guardar los datos del negocio. Puedes actualizarlos luego en Configuración.'
  } finally {
    guardando.value = false
  }
}

async function finalizar() {
  guardando.value = true
  try {
    await onboardingStore.completarOnboarding()
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Hubo un error. Por favor intenta de nuevo.'
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">

    <!-- Header con logo -->
    <header class="pt-8 pb-4 flex justify-center">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="text-xl font-extrabold text-gray-900 tracking-tight">Cita Click</span>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="flex-1 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-lg">

        <!-- Barra de progreso -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-indigo-600">Paso {{ pasoActual }} de {{ totalPasos }}</span>
            <span class="text-sm text-gray-400">{{ porcentajeProgreso }}% completado</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              :style="{ width: porcentajeProgreso + '%' }"
            ></div>
          </div>
          <!-- Indicadores de paso -->
          <div class="flex justify-between mt-3">
            <div
              v-for="n in totalPasos"
              :key="n"
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                n < pasoActual ? 'bg-indigo-600 text-white' :
                n === pasoActual ? 'bg-white text-indigo-600 ring-2 ring-indigo-600 shadow-md' :
                'bg-gray-100 text-gray-400'
              ]"
            >
              <svg v-if="n < pasoActual" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span v-else>{{ n }}</span>
            </div>
          </div>
        </div>

        <!-- Card del paso actual -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          <!-- === PASO 1: Bienvenida === -->
          <div v-if="pasoActual === 1" class="p-8">
            <div class="text-center mb-8">
              <div class="flex justify-center mb-4">
                <svg class="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              </div>
              <h1 class="text-2xl font-extrabold text-gray-900 mb-2">
                ¡Bienvenido a Cita Click, {{ authStore.user?.nombre?.split(' ')[0] || 'amigo' }}!
              </h1>
              <p class="text-gray-500">
                Vamos a configurar tu cuenta en unos minutos para que empieces a gestionar tus citas profesionalmente.
              </p>
            </div>

            <div class="space-y-4 mb-8">
              <div class="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
                <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">Tu perfil personal</p>
                  <p class="text-gray-500 text-xs">Completa tus datos de contacto</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">Tu negocio</p>
                  <p class="text-gray-500 text-xs">Nombre, tipo y descripción del negocio</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">¡Listo para empezar!</p>
                  <p class="text-gray-500 text-xs">Solo 3 pasos y estás dentro</p>
                </div>
              </div>
            </div>

            <button
              @click="pasoActual = 2"
              class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold text-base hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-200"
            >
              Comenzar configuración →
            </button>
          </div>

          <!-- === PASO 2: Perfil Personal === -->
          <div v-else-if="pasoActual === 2" class="p-8">
            <div class="mb-6">
              <h2 class="text-xl font-extrabold text-gray-900 mb-1">Tu perfil personal</h2>
              <p class="text-gray-500 text-sm">
                <span v-if="esGoogle">Confirma los datos de tu cuenta de Google y completa los faltantes.</span>
                <span v-else>Completa tus datos de contacto.</span>
              </p>
            </div>

            <!-- Avatar de Google si aplica -->
            <div v-if="esGoogle && authStore.user?.photoURL" class="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
              <img :src="authStore.user.photoURL" alt="foto" class="w-10 h-10 rounded-full object-cover"/>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.nombre }}</p>
                <p class="text-xs text-gray-400">{{ authStore.user?.email }}</p>
              </div>
              <span class="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Google</span>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nombre(s) <span class="text-red-500">*</span></label>
                <input
                  v-model="perfil.nombre"
                  type="text"
                  placeholder="Tu nombre"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">Apellido paterno <span class="text-red-500">*</span></label>
                  <input
                    v-model="perfil.apellidoPaterno"
                    type="text"
                    placeholder="Apellido paterno"
                    class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">Apellido materno</label>
                  <input
                    v-model="perfil.apellidoMaterno"
                    type="text"
                    placeholder="Apellido materno"
                    class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono personal</label>
                <input
                  v-model="perfil.telefono"
                  type="tel"
                  placeholder="10 dígitos"
                  maxlength="10"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <p v-if="error" class="mt-4 text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">{{ error }}</p>

            <div class="flex gap-3 mt-6">
              <button
                @click="omitir"
                class="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                Omitir por ahora
              </button>
              <button
                @click="siguiente"
                :disabled="!pasoValido || guardando"
                class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="guardando">Guardando...</span>
                <span v-else>Siguiente →</span>
              </button>
            </div>
          </div>

          <!-- === PASO 3: Datos del Negocio === -->
          <div v-else-if="pasoActual === 3" class="p-8">
            <div class="mb-6">
              <h2 class="text-xl font-extrabold text-gray-900 mb-1">Tu negocio</h2>
              <p class="text-gray-500 text-sm">Esta información aparecerá en tu perfil y ayuda a organizar tu sistema.</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del negocio <span class="text-red-500">*</span></label>
                <input
                  v-model="negocio.nombre"
                  type="text"
                  placeholder="Ej: Salón Luna, Clínica Sonrisa..."
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de negocio <span class="text-red-500">*</span></label>
                <select
                  v-model="negocio.tipo"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="" disabled>Selecciona el tipo...</option>
                  <option v-for="tipo in tiposNegocio" :key="tipo" :value="tipo">{{ tipo }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono del negocio</label>
                <input
                  v-model="negocio.telefono"
                  type="tel"
                  placeholder="10 dígitos"
                  maxlength="10"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Descripción breve</label>
                <textarea
                  v-model="negocio.descripcion"
                  rows="3"
                  placeholder="¿Qué servicios ofreces? ¿Qué te hace especial?"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
            </div>

            <p v-if="error" class="mt-4 text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">{{ error }}</p>

            <div class="flex gap-3 mt-6">
              <button
                @click="omitir"
                class="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                Omitir por ahora
              </button>
              <button
                @click="siguiente"
                :disabled="!pasoValido || guardando"
                class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="guardando">Guardando...</span>
                <span v-else>Siguiente →</span>
              </button>
            </div>
          </div>

          <!-- === PASO 4: ¡Todo listo! === -->
          <div v-else-if="pasoActual === 4" class="p-8 text-center">
            <div class="flex justify-center mb-4">
              <svg class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h2 class="text-2xl font-extrabold text-gray-900 mb-2">¡Ya casi estás listo!</h2>
            <p class="text-gray-500 mb-8">
              Tu cuenta está configurada. Ahora completa los últimos pasos desde el dashboard para empezar a recibir citas.
            </p>

            <div class="space-y-3 text-left mb-8">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-700">Configura tus <strong>horarios de atención</strong></p>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div class="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-700">Agrega tus <strong>servicios</strong></p>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div class="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-700">Registra tus <strong>primeros clientes</strong></p>
              </div>
            </div>

            <p v-if="error" class="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ error }}</p>

            <button
              @click="siguiente"
              :disabled="guardando"
              class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold text-base hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              <span v-if="guardando">Entrando al dashboard...</span>
              <span v-else>Ir al dashboard →</span>
            </button>
          </div>

        </div>
        <!-- Pie -->
        <p class="text-center text-xs text-gray-400 mt-6">
          Puedes editar esta información después en
          <router-link to="/settings" class="text-indigo-500 hover:underline">Configuración</router-link>
        </p>
      </div>
    </main>
  </div>
</template>
