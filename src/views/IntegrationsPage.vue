<template>
  <div class="integrations-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Integraciones</h1>
      <p class="text-gray-600">
        Configura tus integraciones de pagos y notificaciones
      </p>
    </div>

    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'stripe'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'stripe'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Pagos (Stripe)
          </button>
          <button
            @click="activeTab = 'notifications'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Notificaciones
          </button>
        </nav>
      </div>
    </div>

    <div v-if="activeTab === 'stripe'" class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Configuracion de Stripe Connect</h2>
        <StripeConnectSetup />
      </section>

      <section>
        <PaymentsList />
      </section>
    </div>

    <div v-if="activeTab === 'notifications'">
      <NotificationsPanel />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StripeConnectSetup from '@/components/integrations/StripeConnectSetup.vue';
import PaymentsList from '@/components/integrations/PaymentsList.vue';
import NotificationsPanel from '@/components/integrations/NotificationsPanel.vue';

const activeTab = ref('stripe');
</script>

<style scoped>
.integrations-page {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
}
</style>
