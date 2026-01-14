import api from './api';

/**
 * Servicio para gestionar notificaciones (WhatsApp, Email, SMS)
 */
const notificationsService = {
  /**
   * Envia una notificacion por WhatsApp
   */
  async sendWhatsApp(data) {
    const response = await api.post('/v1/notifications/whatsapp', data);
    return response.data;
  },

  /**
   * Envia una notificacion por Email
   */
  async sendEmail(data) {
    const response = await api.post('/v1/notifications/email', data);
    return response.data;
  },

  /**
   * Envia una notificacion por el canal especificado
   */
  async send(data) {
    const response = await api.post('/v1/notifications/send', data);
    return response.data;
  },

  /**
   * Envia multiples notificaciones en lote
   */
  async sendBatch(notifications) {
    const response = await api.post('/v1/notifications/batch', notifications);
    return response.data;
  },

  /**
   * Obtiene el historial de notificaciones del usuario
   */
  async getNotifications(usuarioId, params = {}) {
    const response = await api.get('/v1/notifications', {
      params: { usuarioId, ...params }
    });
    return response.data;
  },

  /**
   * Obtiene una notificacion por ID
   */
  async getNotificationById(notificationId) {
    const response = await api.get(`/v1/notifications/${notificationId}`);
    return response.data;
  }
};

export default notificationsService;
