<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
      <div class="flex justify-center mb-6">
        <div class="bg-yellow-100 rounded-full p-4">
          <svg class="h-16 w-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-4">Pago cancelado</h1>
      <p class="text-gray-600 mb-8">
        Tu pago no fue procesado. No se ha realizado ningún cargo a tu cuenta.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <button
          @click="volverAPlanes"
          class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Ver planes
        </button>
        <button
          @click="irAlDashboard"
          class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const volverAPlanes = () => {
  router.push({ name: 'Pricing' })
}

const irAlDashboard = () => {
  router.push({ name: 'Dashboard' })
}
</script>
