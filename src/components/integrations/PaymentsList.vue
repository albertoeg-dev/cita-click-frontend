<template>
  <div class="payments-list">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Historial de Pagos</h2>
      <button @click="refreshPayments" class="btn btn-secondary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="py-6">
      <Alert variant="error" :message="error" />
    </div>

    <div v-else-if="payments.length === 0" class="py-12">
      <EmptyState
        title="No hay pagos registrados"
        description="Cuando recibas pagos de tus clientes, apareceran aqui."
        icon="credit-card"
      />
    </div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comision
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Neto
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ payment.customerName || 'N/A' }}
              </div>
              <div class="text-sm text-gray-500">
                {{ payment.customerEmail }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
              {{ formatCurrency(payment.amount, payment.currency) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatCurrency(payment.platformFee, payment.currency) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
              {{ formatCurrency(payment.netAmount, payment.currency) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <Badge :variant="getStatusVariant(payment.status)">
                {{ getStatusText(payment.status) }}
              </Badge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(payment.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="viewPayment(payment)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Ver Detalles
              </button>
              <button
                v-if="payment.status === 'SUCCESS' && !payment.refunded"
                @click="openRefundModal(payment)"
                class="text-red-600 hover:text-red-900"
              >
                Reembolsar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="hasMorePages" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <button
          @click="previousPage"
          :disabled="page === 0"
          class="btn btn-secondary disabled:opacity-50"
        >
          Anterior
        </button>
        <span class="text-sm text-gray-700">
          Pagina {{ page + 1 }}
        </span>
        <button
          @click="nextPage"
          class="btn btn-secondary"
        >
          Siguiente
        </button>
      </div>
    </div>

    <Modal v-if="selectedPayment" @close="selectedPayment = null">
      <template #header>
        <h3 class="text-lg font-medium">Detalles del Pago</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-700">Payment Intent ID:</span>
            <p class="text-sm text-gray-900 font-mono">{{ selectedPayment.paymentIntentId }}</p>
          </div>
          <div v-if="selectedPayment.chargeId">
            <span class="text-sm font-medium text-gray-700">Charge ID:</span>
            <p class="text-sm text-gray-900 font-mono">{{ selectedPayment.chargeId }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700">Descripcion:</span>
            <p class="text-sm text-gray-900">{{ selectedPayment.description || 'N/A' }}</p>
          </div>
          <div v-if="selectedPayment.cita">
            <span class="text-sm font-medium text-gray-700">Cita Relacionada:</span>
            <p class="text-sm text-gray-900">{{ selectedPayment.cita.id }}</p>
          </div>
        </div>
      </template>
    </Modal>

    <Modal v-if="refundingPayment" @close="refundingPayment = null">
      <template #header>
        <h3 class="text-lg font-medium">Reembolsar Pago</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Estas a punto de reembolsar {{ formatCurrency(refundingPayment.amount, refundingPayment.currency) }} a {{ refundingPayment.customerName }}.
          </p>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Monto a Reembolsar
            </label>
            <input
              v-model.number="refundAmount"
              type="number"
              :max="refundingPayment.amount"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">
              Maximo: {{ formatCurrency(refundingPayment.amount, refundingPayment.currency) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Razon del Reembolso
            </label>
            <select
              v-model="refundReason"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="REQUESTED_BY_CUSTOMER">Solicitado por el cliente</option>
              <option value="DUPLICATE">Pago duplicado</option>
              <option value="FRAUDULENT">Fraudulento</option>
            </select>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button @click="refundingPayment = null" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="processRefund" :disabled="processingRefund" class="btn btn-danger">
            {{ processingRefund ? 'Procesando...' : 'Reembolsar' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import paymentsService from '@/services/paymentsService';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Badge from '@/components/common/Badge.vue';
import Alert from '@/components/common/Alert.vue';
import Modal from '@/components/common/Modal.vue';

const authStore = useAuthStore();
const loading = ref(true);
const error = ref(null);
const payments = ref([]);
const page = ref(0);
const hasMorePages = ref(false);
const selectedPayment = ref(null);
const refundingPayment = ref(null);
const refundAmount = ref(0);
const refundReason = ref('REQUESTED_BY_CUSTOMER');
const processingRefund = ref(false);

onMounted(async () => {
  await loadPayments();
});

const loadPayments = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await paymentsService.getPayments(authStore.user.id, {
      page: page.value,
      size: 20
    });

    if (response.success) {
      payments.value = response.data.content || response.data;
      hasMorePages.value = !response.data.last;
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar los pagos';
  } finally {
    loading.value = false;
  }
};

const refreshPayments = async () => {
  page.value = 0;
  await loadPayments();
};

const nextPage = async () => {
  page.value++;
  await loadPayments();
};

const previousPage = async () => {
  if (page.value > 0) {
    page.value--;
    await loadPayments();
  }
};

const viewPayment = (payment) => {
  selectedPayment.value = payment;
};

const openRefundModal = (payment) => {
  refundingPayment.value = payment;
  refundAmount.value = payment.amount;
};

const processRefund = async () => {
  try {
    processingRefund.value = true;

    await paymentsService.createRefund({
      paymentIntentId: refundingPayment.value.paymentIntentId,
      amount: refundAmount.value,
      reason: refundReason.value
    });

    refundingPayment.value = null;
    await refreshPayments();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al procesar el reembolso';
  } finally {
    processingRefund.value = false;
  }
};

const getStatusVariant = (status) => {
  const variants = {
    SUCCESS: 'success',
    PENDING: 'warning',
    FAILED: 'error',
    CANCELED: 'neutral'
  };
  return variants[status] || 'neutral';
};

const getStatusText = (status) => {
  const texts = {
    SUCCESS: 'Exitoso',
    PENDING: 'Pendiente',
    FAILED: 'Fallido',
    CANCELED: 'Cancelado'
  };
  return texts[status] || status;
};

const formatCurrency = (amount, currency = 'MXN') => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}
</style>
