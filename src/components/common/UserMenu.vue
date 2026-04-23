<template>
  <DashboardLayout>
    <template #title>
      Dashboard
    </template>

    <div class="mb-8 animate-fadeIn">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">
        ¡Bienvenido, {{ authStore.user?.nombre }}!
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
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
        </div>
      </div>

      <div class="card-hover transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Clientes</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </div>
      </div>

      <div class="card-hover transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Ingresos</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">$0</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
      </div>

      <div class="card-hover transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Servicios</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Getting Started -->
    <div class="card border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-transparent">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-bold text-blue-900 mb-2">Próximos Pasos</h3>
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
