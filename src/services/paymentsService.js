import api from './api';

/**
 * Servicio para gestionar pagos con Stripe Connect
 */
const paymentsService = {
  /**
   * Crea un PaymentIntent para cobrar a un cliente
   */
  async createPayment(data) {
    const response = await api.post('/v1/payments', data);
    return response.data;
  },

  /**
   * Obtiene los pagos del usuario
   */
  async getPayments(usuarioId, params = {}) {
    const response = await api.get('/v1/payments', {
      params: { usuarioId, ...params }
    });
    return response.data;
  },

  /**
   * Obtiene un pago por ID
   */
  async getPaymentById(paymentId) {
    const response = await api.get(`/v1/payments/${paymentId}`);
    return response.data;
  },

  /**
   * Crea un reembolso para un pago
   */
  async createRefund(data) {
    const response = await api.post('/v1/payments/refund', data);
    return response.data;
  }
};

export default paymentsService;
