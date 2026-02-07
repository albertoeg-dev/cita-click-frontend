<template>
  <div class="integrations-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Integraciones</h1>
      <p class="text-gray-600">
        Configura tus integraciones de pagos
      </p>
    </div>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Configuracion de Stripe Connect</h2>
        <StripeConnectSetup />
      </section>

      <section>
        <PaymentsList />
      </section>
    </div>
  </div>
</template>

<script setup>
import StripeConnectSetup from '@/components/integrations/StripeConnectSetup.vue';
import PaymentsList from '@/components/integrations/PaymentsList.vue';
</script>

<style scoped>
.integrations-page {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
}
</style>
