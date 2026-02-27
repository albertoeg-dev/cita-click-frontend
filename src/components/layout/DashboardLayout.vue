<template>
  <div class="flex h-screen bg-slate-900 overflow-hidden">

    <!-- Backdrop móvil -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        @click="mobileMenuOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-64',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      class="fixed lg:static lg:flex-shrink-0 inset-y-0 left-0 z-40 w-72 sm:w-64 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300"
    >
      <div class="flex-1 overflow-y-auto">
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700" :class="sidebarCollapsed ? 'p-4' : 'p-6'">

          <!-- Cabecera móvil: logo + botón cerrar (sólo visible en móvil/tablet) -->
          <div class="flex items-center justify-between mb-6 lg:hidden">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                CC
              </div>
              <div>
                <h2 class="font-bold text-white text-sm">Cita Click</h2>
                <p class="text-xs text-slate-400">Gestión de Citas</p>
              </div>
            </div>
            <button
              @click="mobileMenuOpen = false"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Cerrar menú"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Logo y título (sólo escritorio) -->
          <div class="mb-8 hidden lg:flex" :class="sidebarCollapsed ? 'justify-center' : 'items-center gap-3'">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
              CC
            </div>
            <div v-if="!sidebarCollapsed">
              <h2 class="font-bold text-white text-sm">Cita Click</h2>
              <p class="text-xs text-slate-400">Gestión de Citas</p>
            </div>
          </div>

          <nav class="space-y-1">
            <router-link to="/dashboard" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
                <path d="M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"></path>
                <path d="M14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Dashboard</span>
            </router-link>

            <router-link to="/appointments" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Citas</span>
            </router-link>

            <router-link to="/calendar" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 014 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm12-2a1 1 0 000 2h1.586l-7.293 7.293a1 1 0 001.414 1.414L17.586 6H17a1 1 0 000-2h-2z" clip-rule="evenodd"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Calendario</span>
            </router-link>

            <router-link to="/clients" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3z"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Clientes</span>
            </router-link>

            <router-link to="/services" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Servicios</span>
            </router-link>

            <router-link v-if="showUsuarios" to="/users" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Usuarios</span>
            </router-link>

            <router-link v-if="showReportes" to="/reports" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Reportes</span>
            </router-link>

            <router-link v-if="showPlantillaEmail" to="/plantilla-email" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Plantilla Email</span>
            </router-link>

            <router-link to="/planes" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Plan</span>
            </router-link>

            <router-link to="/payment/history" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Historial de Pagos</span>
            </router-link>

            <router-link to="/settings" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Configuración</span>
            </router-link>

            <router-link to="/integrations" class="nav-link" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
              </svg>
              <span :class="sidebarCollapsed ? 'lg:hidden' : ''">Integraciones</span>
            </router-link>

            <!-- Ayuda/Docs: oculto temporalmente hasta que la documentación esté completa -->
            <template v-if="false">
              <div class="border-t border-slate-700 my-2"></div>
              <router-link to="/docs" class="nav-link bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20" :class="{ 'lg:justify-center': sidebarCollapsed }" @click="mobileMenuOpen = false">
                <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                <span :class="['flex items-center gap-2', sidebarCollapsed ? 'lg:hidden' : '']">
                  Ayuda
                  <span class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Docs</span>
                </span>
              </router-link>
            </template>
          </nav>
        </div>
      </div>

      <!-- Toggle Button (fijo al fondo, solo escritorio) -->
      <div class="p-4 border-t border-slate-700 bg-slate-800 hidden lg:block">
        <button
          @click="toggleSidebar"
          class="w-12 h-12 mx-auto flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 shadow-lg"
          :title="sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'"
        >
          <svg v-if="!sidebarCollapsed" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <!-- Trial Expiring Banner -->
      <TrialExpiringBanner />

      <!-- Subscription Banner -->
      <SubscriptionBanner />

      <!-- Header -->
      <header class="bg-white border-b border-slate-200 shadow-sm px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3">
        <!-- Botón hamburguesa (móvil/tablet) -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menú de navegación"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Título -->
        <h1 class="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 flex-1 min-w-0">
          <slot name="title">Dashboard</slot>
        </h1>

        <!-- Acciones del header y menú de usuario -->
        <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <slot name="headerActions"></slot>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-2 sm:gap-3 hover:bg-slate-100 rounded-lg px-2 sm:px-3 py-2 transition-all"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
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
                  <router-link
                    to="/payment/history"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    @click="isUserMenuOpen = false"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                      <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                    </svg>
                    Historial de Pagos
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
      <div class="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <slot></slot>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useBusinessStore } from '../../stores/businessStore'
import { usePlanesStore } from '../../stores/planesStore'
import TrialExpiringBanner from '../TrialExpiringBanner.vue'
import SubscriptionBanner from '../subscription/SubscriptionBanner.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const businessStore = useBusinessStore()
const planesStore = usePlanesStore()
const isUserMenuOpen = ref(false)
const mobileMenuOpen = ref(false)

// Visibilidad del sidebar según plan del usuario
// Por defecto true mientras los límites se cargan, para evitar parpadeos de UI
const showUsuarios = computed(() => {
  if (!planesStore.limites) return true
  const max = planesStore.limites.maxUsuarios
  return max === -1 || max > 1
})
const showReportes = computed(() => {
  if (!planesStore.limites) return true
  return !!planesStore.limites.reportesAvanzadosHabilitado
})
const showPlantillaEmail = computed(() => {
  if (!planesStore.limites) return true
  return !!planesStore.limites.emailRecordatoriosHabilitado
})

// Sidebar collapsed state with localStorage persistence
const sidebarCollapsed = ref(false)

const userInitials = ref(authStore.user?.nombre?.charAt(0).toUpperCase() || 'U')

// Cerrar el menú móvil al cambiar de ruta
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Load sidebar state from localStorage on mount
onMounted(() => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }
  // Cargar límites del plan para controlar visibilidad del sidebar
  if (!planesStore.limites) {
    planesStore.cargarLimites().catch(() => {})
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
  mobileMenuOpen.value = false
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
