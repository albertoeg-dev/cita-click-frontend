<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Personalización de Emails</h1>
        <p class="mt-2 text-sm text-gray-600">
          Personaliza el aspecto de los correos electrónicos que envías a tus clientes
        </p>
      </div>

      <div v-if="cargando" class="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Panel de Configuración -->
        <div class="space-y-6">
          <!-- Colores -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Colores</h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Color Primario
                </label>
                <div class="flex items-center gap-3">
                  <input
                    type="color"
                    v-model="config.colorPrimario"
                    class="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  >
                  <Input
                    type="text"
                    v-model="config.colorPrimario"
                    placeholder="#1E40AF"
                    class="flex-1"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">Usado para headers y botones principales</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Color Secundario
                </label>
                <div class="flex items-center gap-3">
                  <input
                    type="color"
                    v-model="config.colorSecundario"
                    class="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  >
                  <Input
                    type="text"
                    v-model="config.colorSecundario"
                    placeholder="#3B82F6"
                    class="flex-1"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">Usado para acentos y links</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Color de Fondo
                </label>
                <div class="flex items-center gap-3">
                  <input
                    type="color"
                    v-model="config.colorFondo"
                    class="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  >
                  <Input
                    type="text"
                    v-model="config.colorFondo"
                    placeholder="#F3F4F6"
                    class="flex-1"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">Usado para el fondo del email</p>
              </div>
            </div>
          </div>

          <!-- Textos -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Textos Personalizados</h3>

            <div class="space-y-4">
              <Textarea
                v-model="config.mensajeBienvenida"
                label="Mensaje de Bienvenida"
                placeholder="¡Hola! Gracias por confiar en nosotros"
                :maxlength="500"
                rows="3"
              />

              <Input
                type="text"
                v-model="config.firma"
                label="Firma"
                placeholder="Equipo de Mi Negocio"
                :maxlength="300"
              />

              <Textarea
                v-model="config.infoContacto"
                label="Información de Contacto"
                placeholder="Teléfono: +52 33 1234 5678 | Dirección: Calle Principal 123"
                :maxlength="500"
                rows="2"
              />
            </div>
          </div>

          <!-- Diseño Base -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Diseño</h3>

            <Select
              v-model="config.disenoBase"
              label="Tipo de Diseño"
              :options="opcionesDiseno"
            />

            <div class="mt-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="config.activa"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700">Usar plantilla personalizada</span>
              </label>
              <p class="mt-1 text-xs text-gray-500">
                Si está desactivada, se usará la plantilla por defecto
              </p>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex gap-3">
            <button
              @click="guardarConfiguracion"
              :disabled="guardando"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
            </button>

            <button
              @click="confirmarRestaurar"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Restaurar
            </button>
          </div>
        </div>

        <!-- Vista Previa -->
        <div class="lg:sticky lg:top-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                ref="previewFrame"
                :srcdoc="previewHtml"
                class="w-full h-[600px] bg-gray-50"
                sandbox="allow-same-origin"
              />
            </div>

            <p class="mt-3 text-xs text-gray-500 text-center">
              Esta es una vista previa aproximada. El resultado final puede variar según el cliente de email.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <ConfirmDialog
      v-if="mostrarModalRestaurar"
      titulo="Restaurar Configuración"
      mensaje="¿Estás seguro de que deseas restaurar la configuración a los valores por defecto? Esta acción no se puede deshacer."
      textoConfirmar="Restaurar"
      textoCancel ar="Cancelar"
      @confirm="restaurarPorDefecto"
      @cancel="mostrarModalRestaurar = false"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import Input from '../components/common/Input.vue'
import Textarea from '../components/common/Textarea.vue'
import Select from '../components/common/Select.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import plantillaEmailService from '../services/plantillaEmailService'

const toast = useToast()

// Estado
const cargando = ref(true)
const guardando = ref(false)
const mostrarModalRestaurar = ref(false)

// Configuración
const config = ref({
  colorPrimario: '#1E40AF',
  colorSecundario: '#3B82F6',
  colorFondo: '#F3F4F6',
  mensajeBienvenida: '',
  firma: '',
  infoContacto: '',
  disenoBase: 'CLASICO',
  activa: true
})

// Opciones
const opcionesDiseno = [
  { value: 'CLASICO', label: 'Clásico' },
  { value: 'MODERNO', label: 'Moderno' },
  { value: 'MINIMALISTA', label: 'Minimalista' }
]

// Vista previa HTML
const previewHtml = computed(() => {
  const disenoBase = config.value.disenoBase || 'CLASICO'

  switch (disenoBase) {
    case 'MODERNO':
      return generarPreviewModerno()
    case 'MINIMALISTA':
      return generarPreviewMinimalista()
    default:
      return generarPreviewClasico()
  }
})

const generarPreviewClasico = () => {
  const mensaje = config.value.mensajeBienvenida || 'Te recordamos tu próxima cita'
  const firma = config.value.firma || 'Equipo de Mi Negocio'
  const contacto = config.value.infoContacto || ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${config.value.colorFondo}; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: ${config.value.colorPrimario}; padding: 30px; text-align: center; }
        .header-emoji { font-size: 48px; margin-bottom: 10px; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 20px; }
        .info-box { background-color: #F9FAFB; border-left: 4px solid ${config.value.colorSecundario}; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .info-row { margin: 12px 0; }
        .info-label { font-weight: 600; color: #374151; display: inline-block; width: 120px; }
        .info-value { color: #1F2937; }
        .footer { background-color: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px; }
        .footer-firma { font-weight: 600; color: #374151; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-emoji">🔔</div>
          <h1>Recordatorio de Cita</h1>
        </div>
        <div class="content">
          <p class="greeting">${mensaje}</p>
          <p>Hola <strong>Juan Pérez</strong>,</p>
          <p>Este es un recordatorio de tu cita programada:</p>
          <div class="info-box">
            <div class="info-row"><span class="info-label">📋 Servicio:</span><span class="info-value">Corte de Cabello</span></div>
            <div class="info-row"><span class="info-label">📅 Fecha:</span><span class="info-value">Lunes 27 de Enero, 2026</span></div>
            <div class="info-row"><span class="info-label">🕐 Hora:</span><span class="info-value">10:00 AM</span></div>
            <div class="info-row"><span class="info-label">📍 Lugar:</span><span class="info-value">Mi Negocio</span></div>
          </div>
          <p style="color: #6B7280; margin-top: 30px;">¡Te esperamos!</p>
        </div>
        <div class="footer">
          <p class="footer-firma">${firma}</p>
          ${contacto ? `<p>${contacto}</p>` : ''}
          <p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">
            Este es un correo automático generado por Mi Negocio.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

const generarPreviewModerno = () => {
  const mensaje = config.value.mensajeBienvenida || 'Te recordamos tu próxima cita'
  const firma = config.value.firma || 'Equipo de Mi Negocio'
  const contacto = config.value.infoContacto || ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, ${config.value.colorFondo} 0%, #E5E7EB 100%); }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .header { background: linear-gradient(135deg, ${config.value.colorPrimario} 0%, ${config.value.colorSecundario} 100%); padding: 40px 30px; text-align: center; }
        .header-emoji { font-size: 56px; margin-bottom: 15px; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #374151; margin-bottom: 20px; font-weight: 500; }
        .card { background: linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%); border: 1px solid #E5E7EB; padding: 25px; margin: 25px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .info-row { margin: 16px 0; display: flex; align-items: center; }
        .info-icon { font-size: 24px; width: 40px; }
        .info-content { flex: 1; }
        .info-label { font-weight: 600; color: ${config.value.colorSecundario}; font-size: 14px; display: block; margin-bottom: 4px; }
        .info-value { color: #1F2937; font-size: 16px; }
        .footer { background: linear-gradient(to bottom, #F9FAFB 0%, #F3F4F6 100%); padding: 30px; text-align: center; color: #6B7280; font-size: 14px; }
        .footer-firma { font-weight: 600; color: #374151; margin-bottom: 15px; font-size: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-emoji">🔔</div>
          <h1>Recordatorio de Cita</h1>
        </div>
        <div class="content">
          <p class="greeting">${mensaje}</p>
          <p style="font-size: 16px; color: #374151;">Hola <strong style="color: ${config.value.colorPrimario};">Juan Pérez</strong>,</p>
          <p style="font-size: 16px; color: #6B7280;">Este es un recordatorio de tu cita programada:</p>
          <div class="card">
            <div class="info-row">
              <div class="info-icon">📋</div>
              <div class="info-content">
                <span class="info-label">SERVICIO</span>
                <div class="info-value">Corte de Cabello</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">📅</div>
              <div class="info-content">
                <span class="info-label">FECHA</span>
                <div class="info-value">Lunes 27 de Enero, 2026</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">🕐</div>
              <div class="info-content">
                <span class="info-label">HORA</span>
                <div class="info-value">10:00 AM</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">📍</div>
              <div class="info-content">
                <span class="info-label">LUGAR</span>
                <div class="info-value">Mi Negocio</div>
              </div>
            </div>
          </div>
          <p style="color: #6B7280; margin-top: 30px; font-size: 16px; font-weight: 500;">¡Te esperamos! ✨</p>
        </div>
        <div class="footer">
          <p class="footer-firma">${firma}</p>
          ${contacto ? `<p style="margin: 10px 0;">${contacto}</p>` : ''}
          <p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">
            Este es un correo automático generado por Mi Negocio.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

const generarPreviewMinimalista = () => {
  const mensaje = config.value.mensajeBienvenida || 'Te recordamos tu próxima cita'
  const firma = config.value.firma || 'Equipo de Mi Negocio'
  const contacto = config.value.infoContacto || ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FFFFFF; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; }
        .header { border-bottom: 2px solid #000000; padding: 30px; text-align: center; background-color: #FFFFFF; }
        .header h1 { color: #000000; margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 40px 30px; background-color: #FFFFFF; }
        .greeting { font-size: 16px; color: #000000; margin-bottom: 25px; font-weight: 300; }
        .table-info { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .table-info td { padding: 15px 0; border-bottom: 1px solid #E5E7EB; }
        .table-info tr:last-child td { border-bottom: none; }
        .info-label { font-weight: 500; color: #000000; width: 120px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
        .info-value { color: #374151; font-size: 15px; }
        .footer { border-top: 1px solid #E5E7EB; padding: 30px; text-align: center; color: #6B7280; font-size: 13px; background-color: #FAFAFA; }
        .footer-firma { font-weight: 500; color: #000000; margin-bottom: 15px; font-size: 14px; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Recordatorio</h1>
        </div>
        <div class="content">
          <p class="greeting">${mensaje}</p>
          <p style="font-size: 15px; color: #374151; margin-bottom: 10px;">Estimado/a <strong style="color: #000000;">Juan Pérez</strong>,</p>
          <p style="font-size: 15px; color: #6B7280; margin-bottom: 30px;">Le recordamos su cita programada:</p>
          <table class="table-info">
            <tr>
              <td class="info-label">Servicio</td>
              <td class="info-value">Corte de Cabello</td>
            </tr>
            <tr>
              <td class="info-label">Fecha</td>
              <td class="info-value">Lunes 27 de Enero, 2026</td>
            </tr>
            <tr>
              <td class="info-label">Hora</td>
              <td class="info-value">10:00 AM</td>
            </tr>
            <tr>
              <td class="info-label">Lugar</td>
              <td class="info-value">Mi Negocio</td>
            </tr>
          </table>
          <p style="color: #6B7280; margin-top: 30px; font-size: 15px;">Le esperamos.</p>
        </div>
        <div class="footer">
          <p class="footer-firma">${firma}</p>
          ${contacto ? `<p style="margin: 10px 0; font-size: 13px;">${contacto}</p>` : ''}
          <p style="font-size: 11px; color: #9CA3AF; margin-top: 20px;">
            Este es un correo automático generado por Mi Negocio.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Métodos
const cargarConfiguracion = async () => {
  try {
    cargando.value = true
    const response = await plantillaEmailService.obtenerConfiguracion()

    if (response.success && response.data) {
      config.value = {
        colorPrimario: response.data.colorPrimario || '#1E40AF',
        colorSecundario: response.data.colorSecundario || '#3B82F6',
        colorFondo: response.data.colorFondo || '#F3F4F6',
        mensajeBienvenida: response.data.mensajeBienvenida || '',
        firma: response.data.firma || '',
        infoContacto: response.data.infoContacto || '',
        disenoBase: response.data.disenoBase || 'CLASICO',
        activa: response.data.activa !== undefined ? response.data.activa : true
      }
    }
  } catch (error) {
    console.error('Error al cargar configuración:', error)
    toast.error('Error al cargar la configuración')
  } finally {
    cargando.value = false
  }
}

const guardarConfiguracion = async () => {
  try {
    guardando.value = true

    const response = await plantillaEmailService.guardarConfiguracion(config.value)

    if (response.success) {
      toast.success('Configuración guardada exitosamente')
    } else {
      toast.error(response.message || 'Error al guardar la configuración')
    }
  } catch (error) {
    console.error('Error al guardar configuración:', error)
    toast.error('Error al guardar la configuración')
  } finally {
    guardando.value = false
  }
}

const confirmarRestaurar = () => {
  mostrarModalRestaurar.value = true
}

const restaurarPorDefecto = async () => {
  try {
    const response = await plantillaEmailService.restaurarPorDefecto()

    if (response.success) {
      mostrarModalRestaurar.value = false
      await cargarConfiguracion()
      toast.success('Configuración restaurada a valores por defecto')
    } else {
      toast.error(response.message || 'Error al restaurar la configuración')
    }
  } catch (error) {
    console.error('Error al restaurar configuración:', error)
    toast.error('Error al restaurar la configuración')
  }
}

// Lifecycle
onMounted(() => {
  cargarConfiguracion()
})
</script>
