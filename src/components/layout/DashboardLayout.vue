<template>
  <div class="flex h-screen bg-slate-900">
    <!-- Sidebar -->
    <aside
      :class="sidebarCollapsed ? 'w-20' : 'w-64'"
      class="bg-slate-800 border-r border-slate-700 overflow-y-auto transition-all duration-300"
    >
      <div class="sticky top-0 bg-slate-800 border-b border-slate-700" :class="sidebarCollapsed ? 'p-4' : 'p-6'">
        <!-- Toggle Button -->
        <button
          @click="toggleSidebar"
          class="w-full flex items-center justify-center p-2 mb-6 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
          :title="sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'"
        >
          <svg v-if="!sidebarCollapsed" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Logo and Title -->
        <div class="mb-8" :class="sidebarCollapsed ? 'flex justify-center' : 'flex items-center gap-3'">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
            CC
          </div>
          <div v-if="!sidebarCollapsed">
            <h2 class="font-bold text-white text-sm">Cita Click</h2>
            <p class="text-xs text-slate-400">Gestión de Citas</p>
          </div>
        </div>

        <nav class="space-y-1">
          <router-link to="/dashboard" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
              <path d="M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"></path>
              <path d="M14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Dashboard</span>
          </router-link>

          <router-link to="/appointments" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Citas</span>
          </router-link>

          <router-link to="/calendar" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 014 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm12-2a1 1 0 000 2h1.586l-7.293 7.293a1 1 0 001.414 1.414L17.586 6H17a1 1 0 000-2h-2z" clip-rule="evenodd"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Calendario</span>
          </router-link>

          <router-link to="/clients" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3z"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Clientes</span>
          </router-link>

          <router-link to="/services" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Servicios</span>
          </router-link>

          <router-link to="/users" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Usuarios</span>
          </router-link>

          <router-link to="/reports" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Reportes</span>
          </router-link>

          <router-link to="/plantilla-email" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Plantilla Email</span>
          </router-link>

          <router-link to="/planes" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Plan</span>
          </router-link>

          <router-link to="/settings" class="nav-link" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
            </svg>
            <span v-if="!sidebarCollapsed">Configuración</span>
          </router-link>

          <!-- Divider -->
          <div class="border-t border-slate-700 my-2"></div>

          <!-- Documentación Link -->
          <router-link to="/docs" class="nav-link bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20" :class="{ 'justify-center': sidebarCollapsed }">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <span v-if="!sidebarCollapsed" class="flex items-center gap-2">
              Ayuda
              <span class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Docs</span>
            </span>
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Trial Expiring Banner -->
      <TrialExpiringBanner />

      <!-- Subscription Banner -->
      <SubscriptionBanner />

      <!-- Header -->
      <header class="bg-white border-b border-slate-200 shadow-sm p-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">
          <slot name="title">Dashboard</slot>
        </h1>
        <div class="flex items-center gap-4">
          <slot name="headerActions"></slot>

          <!-- User Menu Inline (sin importar UserMenu para evitar referencias circulares) -->
          <div class="relative">
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-3 hover:bg-slate-100 rounded-lg px-3 py-2 transition-all"
            >
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {{ userInitials }}
              </div>
              <div class="text-left hidden md:block">
                <p class="text-sm font-medium text-slate-900">{{ authStore.user?.nombre }}</p>
                <p class="text-xs text-slate-500">{{ businessStore.negocio?.tipo || 'Negocio' }}</p>
              </div>
            </button>

            <!-- Dropdown Menu -->
            <transition name="dropdown">
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50"
                @click.stop
              >
                <div class="px-4 py-3 border-b border-slate-200">
                  <p class="text-sm font-medium text-slate-900">{{ authStore.user?.nombre }}</p>
                  <p class="text-xs text-slate-500">{{ authStore.user?.email }}</p>
                </div>

                <div class="py-2">
                  <router-link
                    to="/settings"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    @click="isUserMenuOpen = false"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                    </svg>
                    Configuración
                  </router-link>
                </div>

                <div class="border-t border-slate-200"></div>

                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </transition>

            <div
              v-if="isUserMenuOpen"
              class="fixed inset-0 z-40"
              @click="isUserMenuOpen = false"
            ></div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div class="max-w-7xl mx-auto">
          <slot></slot>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useBusinessStore } from '../../stores/businessStore'
import TrialExpiringBanner from '../TrialExpiringBanner.vue'
import SubscriptionBanner from '../subscription/SubscriptionBanner.vue'

const router = useRouter()
const authStore = useAuthStore()
const businessStore = useBusinessStore()
const isUserMenuOpen = ref(false)

// Sidebar collapsed state with localStorage persistence
const sidebarCollapsed = ref(false)

const userInitials = ref(authStore.user?.nombre?.charAt(0).toUpperCase() || 'U')

// Load sidebar state from localStorage on mount
onMounted(() => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }
})

// Save sidebar state to localStorage whenever it changes
watch(sidebarCollapsed, (newValue) => {
  localStorage.setItem('sidebarCollapsed', newValue.toString())
})

// Toggle sidebar function
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleLogout = async () => {
  await authStore.logout()
  isUserMenuOpen.value = false
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200;
}

.nav-link.router-link-active {
  @apply bg-blue-600 text-white;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to, .dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
