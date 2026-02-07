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
   * Obtiene el estado de la cuenta conectada del usuario autenticado
   */
  async getStatus() {
    const response = await api.get('/v1/stripe-connect/status');
    return response.data;
  },

  /**
   * Obtiene la cuenta conectada del usuario autenticado
   */
  async getAccount() {
    const response = await api.get('/v1/stripe-connect/account');
    return response.data;
  },

  /**
   * Genera un link de onboarding para completar la configuracion
   */
  async createOnboardingLink() {
    const response = await api.post('/v1/stripe-connect/onboarding-link');
    return response.data;
  },

  /**
   * Actualiza el estado de la cuenta conectada
   */
  async refreshAccount() {
    const response = await api.post('/v1/stripe-connect/refresh');
    return response.data;
  }
};

export default stripeConnectService;
