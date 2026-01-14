import api from './api';

/**
 * Servicio para gestionar Stripe Connected Accounts
 */
const stripeConnectService = {
  /**
   * Crea una cuenta conectada de Stripe
   */
  async createAccount(data) {
    const response = await api.post('/v1/stripe-connect/account', data);
    return response.data;
  },

  /**
   * Obtiene el estado de la cuenta conectada del usuario
   */
  async getAccountStatus(usuarioId) {
    const response = await api.get(`/v1/stripe-connect/status?usuarioId=${usuarioId}`);
    return response.data;
  },

  /**
   * Obtiene la cuenta conectada del usuario
   */
  async getAccount(usuarioId) {
    const response = await api.get(`/v1/stripe-connect/account?usuarioId=${usuarioId}`);
    return response.data;
  },

  /**
   * Genera un link de onboarding para completar la configuracion
   */
  async createOnboardingLink(usuarioId, refreshUrl, returnUrl) {
    const response = await api.post('/v1/stripe-connect/onboarding-link', null, {
      params: { usuarioId, refreshUrl, returnUrl }
    });
    return response.data;
  },

  /**
   * Actualiza el estado de la cuenta conectada
   */
  async refreshAccount(usuarioId) {
    const response = await api.post(`/v1/stripe-connect/refresh?usuarioId=${usuarioId}`);
    return response.data;
  }
};

export default stripeConnectService;
