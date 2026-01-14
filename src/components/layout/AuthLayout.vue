<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Fondo decorativo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-40 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div class="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
            RP
          </div>
          <h1 class="text-3xl font-bold text-slate-900">Reservas Pro</h1>
          <p class="text-slate-600 text-sm mt-2">Gestiona tus citas y clientes</p>
        </div>

        <!-- Contenido -->
        <div class="mb-6">
          <slot></slot>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-slate-400 text-xs mt-8">
        © 2025 Reservas Pro. Todos los derechos reservados.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>