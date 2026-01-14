<template>
  <div class="notifications-panel">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestionar Notificaciones</h2>
      <p class="text-sm text-gray-600">
        Envia notificaciones a tus clientes por WhatsApp o Email
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white shadow-md rounded-lg p-6">
        <div class="flex items-center mb-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">WhatsApp</h3>
            <p class="text-sm text-gray-500">Notificaciones instantaneas</p>
          </div>
        </div>
        <button @click="openSendModal('WHATSAPP')" class="w-full btn btn-primary">
          Enviar WhatsApp
        </button>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <div class="flex items-center mb-4">
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Email</h3>
            <p class="text-sm text-gray-500">Correos profesionales</p>
          </div>
        </div>
        <button @click="openSendModal('EMAIL')" class="w-full btn btn-primary">
          Enviar Email
        </button>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Historial de Notificaciones</h3>
        <button @click="loadNotifications" class="text-sm text-blue-600 hover:text-blue-800">
          Actualizar
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <LoadingSpinner />
      </div>

      <div v-else-if="notifications.length === 0" class="py-8">
        <EmptyState
          title="No hay notificaciones"
          description="Cuando envies notificaciones, apareceran aqui."
        />
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <Badge :variant="getChannelVariant(notification.channel)">
                  {{ notification.channel }}
                </Badge>
                <Badge :variant="getStatusVariant(notification.status)">
                  {{ getStatusText(notification.status) }}
                </Badge>
              </div>
              <p class="text-sm font-medium text-gray-900 mb-1">
                Para: {{ notification.recipientName || notification.recipient }}
              </p>
              <p v-if="notification.subject" class="text-sm text-gray-700 mb-1">
                Asunto: {{ notification.subject }}
              </p>
              <p class="text-sm text-gray-600">
                {{ truncateContent(notification.content) }}
              </p>
              <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{{ formatDate(notification.sentAt || notification.createdAt) }}</span>
                <span v-if="notification.deliveredAt">
                  Entregado: {{ formatDate(notification.deliveredAt) }}
                </span>
                <span v-if="notification.readAt">
                  Leido: {{ formatDate(notification.readAt) }}
                </span>
              </div>
            </div>
            <button
              @click="viewNotification(notification)"
              class="ml-4 text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver
            </button>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showSendModal" @close="showSendModal = false">
      <template #header>
        <h3 class="text-lg font-medium">
          Enviar {{ selectedChannel === 'WHATSAPP' ? 'WhatsApp' : 'Email' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="sendNotification" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ selectedChannel === 'WHATSAPP' ? 'Numero de Telefono' : 'Email' }}
            </label>
            <input
              v-model="form.recipient"
              :type="selectedChannel === 'EMAIL' ? 'email' : 'tel'"
              :placeholder="selectedChannel === 'WHATSAPP' ? '+52 1234567890' : 'cliente@example.com'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Destinatario
            </label>
            <input
              v-model="form.recipientName"
              type="text"
              placeholder="Nombre del cliente"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div v-if="selectedChannel === 'EMAIL'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Asunto
            </label>
            <input
              v-model="form.subject"
              type="text"
              placeholder="Asunto del correo"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              v-model="form.content"
              rows="5"
              required
              placeholder="Escribe tu mensaje aqui..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div v-if="sendError" class="mt-4">
            <Alert variant="error" :message="sendError" />
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button @click="showSendModal = false" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="sendNotification" :disabled="sending" class="btn btn-primary">
            {{ sending ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </template>
    </Modal>

    <Modal v-if="selectedNotification" @close="selectedNotification = null">
      <template #header>
        <h3 class="text-lg font-medium">Detalles de la Notificacion</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-700">Canal:</span>
            <p class="text-sm text-gray-900">{{ selectedNotification.channel }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700">Proveedor:</span>
            <p class="text-sm text-gray-900">{{ selectedNotification.provider }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700">Destinatario:</span>
            <p class="text-sm text-gray-900">
              {{ selectedNotification.recipientName }} ({{ selectedNotification.recipient }})
            </p>
          </div>
          <div v-if="selectedNotification.subject">
            <span class="text-sm font-medium text-gray-700">Asunto:</span>
            <p class="text-sm text-gray-900">{{ selectedNotification.subject }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700">Contenido:</span>
            <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedNotification.content }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700">Estado:</span>
            <Badge :variant="getStatusVariant(selectedNotification.status)" class="ml-2">
              {{ getStatusText(selectedNotification.status) }}
            </Badge>
          </div>
          <div v-if="selectedNotification.errorMessage">
            <span class="text-sm font-medium text-gray-700">Error:</span>
            <p class="text-sm text-red-600">{{ selectedNotification.errorMessage }}</p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import notificationsService from '@/services/notificationsService';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Badge from '@/components/common/Badge.vue';
import Alert from '@/components/common/Alert.vue';
import Modal from '@/components/common/Modal.vue';

const authStore = useAuthStore();
const loading = ref(true);
const notifications = ref([]);
const showSendModal = ref(false);
const selectedChannel = ref('WHATSAPP');
const sending = ref(false);
const sendError = ref(null);
const selectedNotification = ref(null);

const form = ref({
  recipient: '',
  recipientName: '',
  subject: '',
  content: ''
});

onMounted(async () => {
  await loadNotifications();
});

const loadNotifications = async () => {
  try {
    loading.value = true;
    const response = await notificationsService.getNotifications(authStore.user.id, {
      page: 0,
      size: 20
    });

    if (response.success) {
      notifications.value = response.data.content || response.data;
    }
  } catch (err) {
    console.error('Error al cargar notificaciones:', err);
  } finally {
    loading.value = false;
  }
};

const openSendModal = (channel) => {
  selectedChannel.value = channel;
  form.value = {
    recipient: '',
    recipientName: '',
    subject: '',
    content: ''
  };
  sendError.value = null;
  showSendModal.value = true;
};

const sendNotification = async () => {
  try {
    sending.value = true;
    sendError.value = null;

    const data = {
      channel: selectedChannel.value,
      recipient: form.value.recipient,
      recipientName: form.value.recipientName,
      content: form.value.content,
      usuarioId: authStore.user.id
    };

    if (selectedChannel.value === 'EMAIL') {
      data.subject = form.value.subject;
    }

    const response = selectedChannel.value === 'WHATSAPP'
      ? await notificationsService.sendWhatsApp(data)
      : await notificationsService.sendEmail(data);

    if (response.success) {
      showSendModal.value = false;
      await loadNotifications();
    }
  } catch (err) {
    sendError.value = err.response?.data?.message || 'Error al enviar la notificacion';
  } finally {
    sending.value = false;
  }
};

const viewNotification = (notification) => {
  selectedNotification.value = notification;
};

const getChannelVariant = (channel) => {
  return channel === 'WHATSAPP' ? 'success' : 'info';
};

const getStatusVariant = (status) => {
  const variants = {
    SENT: 'info',
    DELIVERED: 'success',
    READ: 'success',
    FAILED: 'error',
    BOUNCED: 'warning'
  };
  return variants[status] || 'neutral';
};

const getStatusText = (status) => {
  const texts = {
    SENT: 'Enviado',
    DELIVERED: 'Entregado',
    READ: 'Leido',
    FAILED: 'Fallido',
    BOUNCED: 'Rebotado',
    CLICKED: 'Click'
  };
  return texts[status] || status;
};

const truncateContent = (content, maxLength = 100) => {
  if (!content) return '';
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
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
  @apply px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>
