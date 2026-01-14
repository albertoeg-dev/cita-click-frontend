<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <h2 class="text-4xl font-bold text-white mb-2">Página no encontrada</h2>
      <p class="text-slate-400 text-lg mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      
      <div class="flex gap-4 justify-center">
        <router-link to="/dashboard" class="btn btn-primary">
          ← Volver al Dashboard
        </router-link>
        <button @click="$router.back()" class="btn btn-secondary">
          ← Ir Atrás
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>