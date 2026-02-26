<template>
  <DashboardLayout>
    <template #title>
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Integraciones
      </div>
    </template>

    <!-- Encabezado -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">Integraciones</h2>
      <p class="text-slate-600">
        Conecta tu negocio con herramientas de pago y servicios externos para ofrecer una
        experiencia completa a tus clientes.
      </p>
    </div>

    <div class="space-y-8">

      <!-- ── Stripe Connect ───────────────────────────────────────── -->
      <div class="card">
        <div class="flex items-start gap-4 mb-5">
          <!-- Ícono -->
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <h3 class="text-lg font-semibold text-slate-900">Stripe Connect</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Solo Plan Premium
              </span>
            </div>
            <p class="text-sm text-slate-500 mt-1">
              Conecta tu cuenta de Stripe para cobrar directamente a tus clientes cuando reservan
              una cita. Los pagos llegan a tu cuenta bancaria descontando la comisión de la plataforma.
            </p>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-5">
          <StripeConnectSetup />
        </div>
      </div>

      <!-- ── Pagos de Clientes ────────────────────────────────────── -->
      <div class="card">
        <div class="flex items-start gap-4 mb-5">
          <!-- Ícono -->
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-slate-900">Pagos de Clientes</h3>
            <p class="text-sm text-slate-500 mt-1">
              Historial de todos los cobros realizados a tus clientes a través de Cita Click.
              Puedes ver el estado de cada pago y emitir reembolsos si es necesario.
            </p>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-5">
          <PaymentsList />
        </div>
      </div>

      <!-- ── Próximas Integraciones ──────────────────────────────── -->
      <div class="card border-dashed border-2 border-slate-200 bg-slate-50/50">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-700">Más integraciones próximamente</h3>
            <p class="text-sm text-slate-500 mt-1 mb-4">
              Estamos trabajando en nuevas integraciones para potenciar tu negocio.
            </p>
            <div class="flex flex-wrap gap-2">
              <span v-for="integracion in proximasIntegraciones" :key="integracion"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 shadow-sm">
                {{ integracion }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import StripeConnectSetup from '@/components/integrations/StripeConnectSetup.vue'
import PaymentsList from '@/components/integrations/PaymentsList.vue'

const proximasIntegraciones = [
  'WhatsApp Business',
  'Google Calendar',
  'Mercado Pago',
  'OXXO Pay',
  'Facturación electrónica',
  'Mailchimp',
]
</script>
