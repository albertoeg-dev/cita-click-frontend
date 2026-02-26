<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          CC
        </div>
        <h1 class="text-xl font-bold text-gray-900">Cita Click</h1>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ authStore.user?.nombre }}</span>
        <button
          @click="handleLogout"
          class="btn btn-secondary text-sm"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>