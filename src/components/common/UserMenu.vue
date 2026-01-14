<template>
  <DashboardLayout>
    <template #title>
      📊 Dashboard
    </template>

    <div class="mb-8 animate-fadeIn">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">
        ¡Bienvenido, {{ authStore.user?.nombre }}! 👋
      </h2>
      <p class="text-slate-600">Aquí está el resumen de tu negocio</p>
    </div>

    <!-- Grid de Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card-hover transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Citas Hoy</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl">
            📅
          </div>
        </div>
      </div>

      <div class="card-hover transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Clientes</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-2xl">
            👥
          </div>
        </div>
      </div>

      <div class="card-hover transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Ingresos</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">$0</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-2xl">
            💰
          </div>
        </div>
      </div>

      <div class="card-hover transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Servicios</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-2xl">
            🛠️
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Getting Started -->
    <div class="card border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-transparent">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-bold text-blue-900 mb-2">✨ Próximos Pasos</h3>
          <p class="text-blue-800 text-sm leading-relaxed">
            Comienza configurando tus servicios, horarios de trabajo y luego podrás empezar a recibir citas de tus clientes.
          </p>
        </div>
        <router-link to="/settings" class="btn btn-primary btn-sm ml-4 flex-shrink-0">
          Configurar Ahora
        </router-link>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'
import DashboardLayout from '../layout/DashboardLayout.vue'

const authStore = useAuthStore()
</script>
