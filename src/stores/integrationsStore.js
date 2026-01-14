import { defineStore } from 'pinia';
import { ref } from 'vue';
import stripeConnectService from '@/services/stripeConnectService';
import paymentsService from '@/services/paymentsService';
import notificationsService from '@/services/notificationsService';

export const useIntegrationsStore = defineStore('integrations', () => {
  const stripeAccount = ref(null);
  const stripeAccountLoading = ref(false);
  const recentPayments = ref([]);
  const recentNotifications = ref([]);

  /**
   * Carga el estado de la cuenta de Stripe Connect
   */
  const loadStripeAccount = async (usuarioId) => {
    try {
      stripeAccountLoading.value = true;
      const response = await stripeConnectService.getAccountStatus(usuarioId);

      if (response.success && response.data) {
        stripeAccount.value = response.data;
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error al cargar cuenta de Stripe:', error);
      }
    } finally {
      stripeAccountLoading.value = false;
    }
  };

  /**
   * Verifica si el usuario tiene Stripe configurado
   */
  const hasStripeConfigured = () => {
    return stripeAccount.value && stripeAccount.value.onboardingCompleted;
  };

  /**
   * Verifica si el usuario puede recibir pagos
   */
  const canReceivePayments = () => {
    return (
      stripeAccount.value &&
      stripeAccount.value.onboardingCompleted &&
      stripeAccount.value.chargesEnabled &&
      stripeAccount.value.payoutsEnabled
    );
  };

  /**
   * Carga pagos recientes
   */
  const loadRecentPayments = async (usuarioId, limit = 5) => {
    try {
      const response = await paymentsService.getPayments(usuarioId, {
        page: 0,
        size: limit
      });

      if (response.success) {
        recentPayments.value = response.data.content || response.data;
      }
    } catch (error) {
      console.error('Error al cargar pagos recientes:', error);
    }
  };

  /**
   * Carga notificaciones recientes
   */
  const loadRecentNotifications = async (usuarioId, limit = 5) => {
    try {
      const response = await notificationsService.getNotifications(usuarioId, {
        page: 0,
        size: limit
      });

      if (response.success) {
        recentNotifications.value = response.data.content || response.data;
      }
    } catch (error) {
      console.error('Error al cargar notificaciones recientes:', error);
    }
  };

  /**
   * Reinicia el estado
   */
  const reset = () => {
    stripeAccount.value = null;
    stripeAccountLoading.value = false;
    recentPayments.value = [];
    recentNotifications.value = [];
  };

  return {
    stripeAccount,
    stripeAccountLoading,
    recentPayments,
    recentNotifications,
    loadStripeAccount,
    hasStripeConfigured,
    canReceivePayments,
    loadRecentPayments,
    loadRecentNotifications,
    reset
  };
});
