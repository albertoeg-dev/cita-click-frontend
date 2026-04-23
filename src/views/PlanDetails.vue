<template>
  <DashboardLayout>
    <template #title>
      Plan y Facturación
    </template>

    <!-- Cuenta Bloqueada Notice (trial vencido o suscripción expirada) -->
    <div v-if="cuentaBloqueada" class="mb-6">
      <div class="bg-red-50 border border-red-200 rounded-xl p-5">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-red-800 mb-1">
              Tu acceso ha sido suspendido
            </h3>
            <p class="text-sm text-red-700 leading-relaxed">
              Tu periodo de prueba gratuita o suscripción ha vencido. Para continuar usando
              Cita Click y acceder a todas tus citas, clientes y configuraciones,
              <strong>selecciona un plan a continuación</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Notice (cuando viene de una restricción) -->
    <div v-if="upgradeRequired" class="mb-6">
      <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-orange-800">
              Se requiere actualización de plan
            </h3>
            <div class="mt-2 text-sm text-orange-700">
              <p>{{ upgradeMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Plan y Facturación</h2>
        <p class="text-slate-600">Administra tu plan y visualiza tu uso actual</p>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          to="/marketplace"
          class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-all duration-200"
        >
          <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Módulos adicionales
        </router-link>
        <router-link
          to="/pricing"
          class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Cambiar Plan
        </router-link>
      </div>
    </div>

    <!-- Modal de confirmación de cancelación -->
    <Teleport to="body">
      <div v-if="mostrarModalCancelar" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="mostrarModalCancelar = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900 mb-1">¿Cancelar suscripción?</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Tu suscripción se cancelará al final del período de facturación actual.
                <span v-if="suscripcionStore.info?.fechaProximoPago" class="font-semibold text-slate-800">
                  Tendrás acceso hasta el {{ formatearFecha(suscripcionStore.info.fechaProximoPago) }}.
                </span>
                Después de esa fecha perderás acceso al sistema.
              </p>
            </div>
          </div>

          <div v-if="errorCancelacion" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ errorCancelacion }}</p>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="mostrarModalCancelar = false"
              :disabled="cancelando"
              class="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Conservar plan
            </button>
            <button
              @click="confirmarCancelacion"
              :disabled="cancelando"
              class="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg v-if="cancelando" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ cancelando ? 'Cancelando...' : 'Sí, cancelar suscripción' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Loading -->
    <div v-if="planesStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-sm text-gray-500">Cargando información...</p>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Plan Actual -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Plan Actual</h2>

          <div v-if="planesStore.limites" class="space-y-4">
            <div class="text-center py-4 border-b border-gray-200">
              <h3 class="text-2xl font-bold text-indigo-600">
                {{ planesStore.limites.nombrePlan }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">Plan activo</p>
            </div>

            <div class="space-y-3">
              <h4 class="font-medium text-gray-900 text-sm">Límites de Recursos</h4>

              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Usuarios</span>
                <span class="font-semibold text-gray-900">
                  {{ planesStore.formatearLimite(planesStore.limites.maxUsuarios) }}
                </span>
              </div>

              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Clientes</span>
                <span class="font-semibold text-gray-900">
                  {{ planesStore.formatearLimite(planesStore.limites.maxClientes) }}
                </span>
              </div>

              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Citas por mes</span>
                <span class="font-semibold text-gray-900">
                  {{ planesStore.formatearLimite(planesStore.limites.maxCitasMes) }}
                </span>
              </div>

              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Servicios</span>
                <span class="font-semibold text-gray-900">
                  {{ planesStore.formatearLimite(planesStore.limites.maxServicios) }}
                </span>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 space-y-3">
              <h4 class="font-medium text-gray-900 text-sm">Funcionalidades Incluidas</h4>

              <div class="space-y-2">
                <!-- Funcionalidades Core (todos los planes) -->
                <div class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Gestión de citas</span>
                </div>

                <div class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Gestión de clientes</span>
                </div>

                <div class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Calendario visual</span>
                </div>

                <div class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Dashboard con métricas</span>
                </div>

                <div class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Horarios de trabajo</span>
                </div>

                <!-- Funcionalidades avanzadas (Profesional y Premium) -->
                <div v-if="planNombreNormalizado !== 'basico'" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Citas recurrentes</span>
                </div>

                <div v-if="planNombreNormalizado !== 'basico'" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Perfil 360 del cliente</span>
                </div>

                <div v-if="planesStore.limites.smsWhatsappHabilitado" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">
                    Recordatorios automáticos
                    <span v-if="planNombreNormalizado === 'premium'" class="text-xs text-green-600 font-semibold">(ILIMITADOS)</span>
                    <span v-else-if="planNombreNormalizado === 'profesional'" class="text-xs text-gray-600">(200/mes)</span>
                  </span>
                </div>

                <div v-if="planesStore.limites.reportesAvanzadosHabilitado" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Reportes con exportación PDF/Excel</span>
                </div>

                <div v-if="planNombreNormalizado !== 'basico'" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Multi-usuario con roles</span>
                </div>

                <!-- Funcionalidades Premium -->
                <div v-if="planNombreNormalizado === 'premium'" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Pagos por servicios (Stripe Connect)</span>
                </div>

                <div v-if="planesStore.limites.soportePrioritario" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Soporte prioritario 24/7</span>
                </div>

                <div v-if="planNombreNormalizado === 'premium'" class="flex items-center text-sm">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-900">Multi-sucursal</span>
                </div>
              </div>
            </div>

            <!-- Botón cancelar suscripción (dentro de v-if planesStore.limites) -->
            <div v-if="suscripcionStore.info?.cuentaActiva && suscripcionStore.info?.estadoPago === 'activo' && !suscripcionStore.info?.enPeriodoPrueba" class="pt-4 border-t border-gray-200">
              <button
                @click="mostrarModalCancelar = true"
                class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar suscripción
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Uso Actual -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Uso Actual</h2>

          <div v-if="planesStore.uso" class="space-y-6">
            <!-- Periodo -->
            <div class="flex items-center justify-between pb-4 border-b border-gray-200">
              <span class="text-sm text-gray-500">Periodo</span>
              <span class="text-sm font-medium text-gray-900">{{ formatearPeriodo(planesStore.uso.periodo) }}</span>
            </div>

            <!-- Barras de Progreso -->
            <div class="space-y-6">
              <!-- Usuarios -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Usuarios</h4>
                    <p class="text-xs text-gray-500">Usuarios activos en tu negocio</p>
                  </div>
                  <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeUsuarios)" class="text-lg font-bold">
                    <template v-if="planesStore.uso.limiteUsuarios === -1">
                      {{ planesStore.uso.totalUsuarios }} / Ilimitados
                    </template>
                    <template v-else>
                      {{ planesStore.uso.totalUsuarios }} / {{ planesStore.uso.limiteUsuarios }}
                    </template>
                  </span>
                </div>
                <div v-if="planesStore.uso.limiteUsuarios !== -1" class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeUsuarios)"
                    class="h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(planesStore.uso.porcentajeUsuarios, 100)}%` }"
                  ></div>
                </div>
                <p v-if="planesStore.uso.limiteUsuarios !== -1" class="text-sm text-gray-500 mt-1">
                  {{ planesStore.uso.porcentajeUsuarios.toFixed(1) }}% utilizado
                </p>
                <p v-else class="text-sm text-green-600 mt-1 font-medium">
                  Sin límite de usuarios
                </p>
              </div>

              <!-- Clientes -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Clientes</h4>
                    <p class="text-xs text-gray-500">Clientes registrados</p>
                  </div>
                  <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeClientes)" class="text-lg font-bold">
                    <template v-if="planesStore.uso.limiteClientes === -1">
                      {{ planesStore.uso.totalClientes }} / Ilimitados
                    </template>
                    <template v-else>
                      {{ planesStore.uso.totalClientes }} / {{ planesStore.uso.limiteClientes }}
                    </template>
                  </span>
                </div>
                <div v-if="planesStore.uso.limiteClientes !== -1" class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeClientes)"
                    class="h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(planesStore.uso.porcentajeClientes, 100)}%` }"
                  ></div>
                </div>
                <p v-if="planesStore.uso.limiteClientes !== -1" class="text-sm text-gray-500 mt-1">
                  {{ planesStore.uso.porcentajeClientes.toFixed(1) }}% utilizado
                </p>
                <p v-else class="text-sm text-green-600 mt-1 font-medium">
                  Sin límite de clientes
                </p>
              </div>

              <!-- Citas del Mes -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Citas del Mes</h4>
                    <p class="text-xs text-gray-500">Citas creadas en {{ formatearPeriodo(planesStore.uso.periodo) }}</p>
                  </div>
                  <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeCitasMes)" class="text-lg font-bold">
                    <template v-if="planesStore.uso.limiteCitasMes === -1">
                      {{ planesStore.uso.totalCitasMes }} / Ilimitadas
                    </template>
                    <template v-else>
                      {{ planesStore.uso.totalCitasMes }} / {{ planesStore.uso.limiteCitasMes }}
                    </template>
                  </span>
                </div>
                <div v-if="planesStore.uso.limiteCitasMes !== -1" class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeCitasMes)"
                    class="h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(planesStore.uso.porcentajeCitasMes, 100)}%` }"
                  ></div>
                </div>
                <p v-if="planesStore.uso.limiteCitasMes !== -1" class="text-sm text-gray-500 mt-1">
                  {{ planesStore.uso.porcentajeCitasMes.toFixed(1) }}% utilizado
                </p>
                <p v-else class="text-sm text-green-600 mt-1 font-medium">
                  Sin límite de citas
                </p>
              </div>

              <!-- Servicios -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Servicios</h4>
                    <p class="text-xs text-gray-500">Servicios registrados</p>
                  </div>
                  <span :class="planesStore.obtenerColorPorcentaje(planesStore.uso.porcentajeServicios)" class="text-lg font-bold">
                    <template v-if="planesStore.uso.limiteServicios === -1">
                      {{ planesStore.uso.totalServicios }} / Ilimitados
                    </template>
                    <template v-else>
                      {{ planesStore.uso.totalServicios }} / {{ planesStore.uso.limiteServicios }}
                    </template>
                  </span>
                </div>
                <div v-if="planesStore.uso.limiteServicios !== -1" class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    :class="planesStore.obtenerColorBarra(planesStore.uso.porcentajeServicios)"
                    class="h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(planesStore.uso.porcentajeServicios, 100)}%` }"
                  ></div>
                </div>
                <p v-if="planesStore.uso.limiteServicios !== -1" class="text-sm text-gray-500 mt-1">
                  {{ planesStore.uso.porcentajeServicios.toFixed(1) }}% utilizado
                </p>
                <p v-else class="text-sm text-green-600 mt-1 font-medium">
                  Sin límite de servicios
                </p>
              </div>
            </div>

            <!-- Alertas -->
            <div v-if="planesStore.tieneAlerta" class="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
              <div class="flex">
                <svg class="h-6 w-6 text-orange-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h3 class="text-sm font-medium text-orange-800">Cerca del límite</h3>
                  <div class="mt-2 text-sm text-orange-700">
                    <ul class="list-disc list-inside space-y-1">
                      <li v-for="alerta in planesStore.alertas" :key="alerta.tipo">
                        {{ alerta.mensaje }} ({{ alerta.porcentaje.toFixed(0) }}%)
                      </li>
                    </ul>
                  </div>
                  <p class="mt-3 text-sm text-orange-700">
                    Considera <strong>actualizar tu plan</strong> para evitar interrupciones en tu servicio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { usePlanesStore } from '@/stores/planesStore'
import { useSuscripcionStore } from '@/stores/suscripcionStore'

const route = useRoute()
const planesStore = usePlanesStore()
const suscripcionStore = useSuscripcionStore()

const mostrarModalCancelar = ref(false)
const cancelando = ref(false)
const errorCancelacion = ref('')

// Detectar si la cuenta está bloqueada (trial o suscripción vencida)
const cuentaBloqueada = computed(() => {
  return !!route.query.blocked || suscripcionStore.estaBloqueado
})

// Detectar si viene de una restricción de plan
const upgradeRequired = computed(() => {
  return !!route.query.upgrade
})

const upgradeMessage = computed(() => {
  if (!route.query.upgrade) return ''

  const planName = route.query.upgrade.charAt(0).toUpperCase() + route.query.upgrade.slice(1)
  const featureMap = {
    '/users': 'gestión de usuarios'
  }

  const feature = featureMap[route.query.from] || 'esta funcionalidad'

  return `Para acceder a ${feature}, necesitas actualizar a plan ${planName} o superior.`
})

// Normalizar nombre del plan para comparaciones
const planNombreNormalizado = computed(() => {
  const nombrePlan = planesStore.limites?.nombrePlan || ''
  return nombrePlan.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
})

onMounted(() => {
  planesStore.cargarTodo()
  // Asegurar que la info de suscripción esté cargada para el botón de cancelación
  if (!suscripcionStore.info) {
    suscripcionStore.cargarInfoSuscripcion().catch(() => {})
  }
})

const formatearPeriodo = (periodo) => {
  if (!periodo) return ''
  const [year, month] = periodo.split('-')
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${meses[parseInt(month) - 1]} ${year}`
}

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
}

const confirmarCancelacion = async () => {
  cancelando.value = true
  errorCancelacion.value = ''
  try {
    await suscripcionStore.cancelarSuscripcion()
    mostrarModalCancelar.value = false
  } catch (err) {
    errorCancelacion.value = err.response?.data?.message || err.message || 'Error al cancelar la suscripción'
  } finally {
    cancelando.value = false
  }
}
</script>
