<template>
  <div class="stripe-connect-setup">
    <div v-if="loading" class="text-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="account && account.onboardingCompleted" class="account-active">
      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-green-800">Cuenta Stripe Conectada</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Tu cuenta de Stripe esta configurada y lista para recibir pagos.</p>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex items-center text-sm">
                <span class="font-medium text-green-800 w-40">ID de Cuenta:</span>
                <span class="text-green-700 font-mono">{{ account.stripeAccountId }}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="font-medium text-green-800 w-40">Pagos Habilitados:</span>
                <Badge :variant="account.chargesEnabled ? 'success' : 'warning'">
                  {{ account.chargesEnabled ? 'Si' : 'No' }}
                </Badge>
              </div>
              <div class="flex items-center text-sm">
                <span class="font-medium text-green-800 w-40">Retiros Habilitados:</span>
                <Badge :variant="account.payoutsEnabled ? 'success' : 'warning'">
                  {{ account.payoutsEnabled ? 'Si' : 'No' }}
                </Badge>
              </div>
            </div>
            <div class="mt-4">
              <button
                @click="refreshAccountStatus"
                class="text-sm font-medium text-green-800 hover:text-green-900"
              >
                Actualizar Estado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="account-setup">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Conecta tu Cuenta de Stripe
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Para recibir pagos de tus clientes, necesitas conectar una cuenta de Stripe.
          El proceso es rapido y seguro.
        </p>

        <div class="space-y-4 mb-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                1
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-700">Crea tu cuenta conectada de Stripe</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                2
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-700">Completa el proceso de verificacion con Stripe</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                3
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-700">Comienza a recibir pagos de tus clientes</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="startOnboarding"
            :disabled="processing"
            class="btn btn-primary flex items-center"
          >
            <span v-if="processing">Procesando...</span>
            <span v-else>Conectar con Stripe</span>
          </button>

          <button
            v-if="account && !account.onboardingCompleted"
            @click="continueOnboarding"
            :disabled="processing"
            class="btn btn-secondary"
          >
            Continuar Configuracion
          </button>
        </div>
      </div>

      <div v-if="error" class="mt-4">
        <Alert variant="error" :message="error" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import stripeConnectService from '@/services/stripeConnectService';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Badge from '@/components/common/Badge.vue';
import Alert from '@/components/common/Alert.vue';

const authStore = useAuthStore();
const loading = ref(true);
const processing = ref(false);
const account = ref(null);
const error = ref(null);

onMounted(async () => {
  await loadAccountStatus();
});

const loadAccountStatus = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await stripeConnectService.getAccountStatus(authStore.user.id);

    if (response.success && response.data) {
      account.value = response.data;
    }
  } catch (err) {
    if (err.response?.status !== 404) {
      error.value = err.response?.data?.message || 'Error al cargar el estado de la cuenta';
    }
  } finally {
    loading.value = false;
  }
};

const startOnboarding = async () => {
  try {
    processing.value = true;
    error.value = null;

    if (!account.value) {
      const createResponse = await stripeConnectService.createAccount({
        usuarioId: authStore.user.id,
        email: authStore.user.email,
        country: 'MX',
        accountType: 'STANDARD'
      });

      if (!createResponse.success) {
        throw new Error(createResponse.message);
      }

      account.value = createResponse.data;
    }

    await continueOnboarding();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al crear la cuenta';
    processing.value = false;
  }
};

const continueOnboarding = async () => {
  try {
    processing.value = true;
    error.value = null;

    const refreshUrl = `${window.location.origin}/settings/payments`;
    const returnUrl = `${window.location.origin}/settings/payments?onboarding=complete`;

    const response = await stripeConnectService.createOnboardingLink(
      authStore.user.id,
      refreshUrl,
      returnUrl
    );

    if (response.success && response.data?.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error('No se recibio URL de onboarding');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al generar el link de onboarding';
    processing.value = false;
  }
};

const refreshAccountStatus = async () => {
  try {
    processing.value = true;
    await stripeConnectService.refreshAccount(authStore.user.id);
    await loadAccountStatus();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al actualizar el estado';
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>
