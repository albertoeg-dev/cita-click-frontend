<template>
  <div class="min-h-screen bg-white">
    <!-- Header/Navbar -->
    <header class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              CC
            </div>
            <span class="font-bold text-xl text-gray-900">Cita Click</span>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <router-link to="/pricing" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Planes
            </router-link>
            <a href="#features" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Características
            </a>
            <a href="#contact" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Contacto
            </a>
            <router-link
              to="/docs"
              class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              Ayuda
            </router-link>
          </nav>

          <!-- CTA Buttons -->
          <div class="flex items-center gap-4">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-gray-900 font-medium"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg transition-all"
            >
              Comenzar Gratis
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Gestiona tus citas de forma
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            inteligente
          </span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          La herramienta completa para agendar citas, gestionar clientes y hacer crecer tu negocio
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register"
            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Comienza Gratis - 7 Días
          </router-link>
          <router-link
            to="/docs"
            class="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all"
          >
            Ver Documentación
          </router-link>
        </div>

        <p class="mt-4 text-sm text-gray-500">
          ✓ Sin tarjeta de crédito ✓ Configuración en minutos
        </p>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">Todo lo que necesitas</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              📅
            </div>
            <h3 class="text-xl font-bold mb-3">Gestión de Citas</h3>
            <p class="text-gray-600">
              Agenda, confirma y gestiona todas tus citas desde un solo lugar
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              👥
            </div>
            <h3 class="text-xl font-bold mb-3">Base de Clientes</h3>
            <p class="text-gray-600">
              Mantén organizada la información de todos tus clientes
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              🔔
            </div>
            <h3 class="text-xl font-bold mb-3">Recordatorios</h3>
            <p class="text-gray-600">
              Envía recordatorios automáticos por SMS y WhatsApp
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              💳
            </div>
            <h3 class="text-xl font-bold mb-3">Pagos Integrados</h3>
            <p class="text-gray-600">
              Cobra a tus clientes con tarjeta directamente
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              📊
            </div>
            <h3 class="text-xl font-bold mb-3">Reportes</h3>
            <p class="text-gray-600">
              Analiza tu negocio con reportes detallados
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              🏢
            </div>
            <h3 class="text-xl font-bold mb-3">Multi-sucursal</h3>
            <p class="text-gray-600">
              Gestiona múltiples ubicaciones desde una cuenta
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-4xl font-bold text-white mb-6">
          ¿Listo para transformar tu negocio?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Únete a cientos de negocios que ya usan Cita Click
        </p>

        <router-link
          to="/register"
          class="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          Comenzar Ahora - Es Gratis
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                CC
              </div>
              <span class="font-bold text-xl">Cita Click</span>
            </div>
            <p class="text-gray-400">
              La solución completa para gestionar tu negocio
            </p>
          </div>

          <div>
            <h4 class="font-bold mb-4">Producto</h4>
            <ul class="space-y-2 text-gray-400">
              <li><router-link to="/pricing" class="hover:text-white">Planes</router-link></li>
              <li><router-link to="/docs" class="hover:text-white">Documentación</router-link></li>
              <li><a href="#features" class="hover:text-white">Características</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold mb-4">Soporte</h4>
            <ul class="space-y-2 text-gray-400">
              <li><router-link to="/docs" class="hover:text-white">Centro de Ayuda</router-link></li>
              <li><a href="mailto:soporte@citaclick.com" class="hover:text-white">Email</a></li>
              <li><a href="https://wa.me/5215512345678" class="hover:text-white">WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Términos</a></li>
              <li><a href="#" class="hover:text-white">Privacidad</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Cita Click. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Si el usuario ya está autenticado, redirigir al dashboard
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
