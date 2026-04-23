<template>
  <div class="bg-white rounded-2xl shadow-xl p-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-indigo-100 rounded-full p-2">
        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Datos para facturación</h2>
        <p class="text-sm text-gray-500">CFDI 4.0 — Solo se emite factura si la solicitas</p>
      </div>
    </div>

    <form @submit.prevent="enviar" class="space-y-5">

      <!-- Tipo de persona -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de persona <span class="text-red-500">*</span></label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="form.tipoPersona = 'FISICA'"
            :class="[
              'py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors',
              form.tipoPersona === 'FISICA'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300'
            ]"
          >
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Persona Física
          </button>
          <button
            type="button"
            @click="form.tipoPersona = 'MORAL'"
            :class="[
              'py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors',
              form.tipoPersona === 'MORAL'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300'
            ]"
          >
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Persona Moral
          </button>
        </div>
      </div>

      <!-- RFC -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          RFC <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.rfc"
          type="text"
          placeholder="XAXX010101000"
          maxlength="13"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          @input="form.rfc = form.rfc.toUpperCase()"
        />
        <p class="text-xs text-gray-400 mt-1">
          {{ form.tipoPersona === 'MORAL' ? '12 caracteres para persona moral' : '13 caracteres para persona física' }}
        </p>
      </div>

      <!-- Razón Social / Nombre -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ form.tipoPersona === 'MORAL' ? 'Razón Social' : 'Nombre completo' }}
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.razonSocial"
          type="text"
          :placeholder="form.tipoPersona === 'MORAL' ? 'Ej: MI EMPRESA SA DE CV' : 'Ej: JUAN PÉREZ GARCÍA'"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          @input="form.razonSocial = form.razonSocial.toUpperCase()"
        />
        <p class="text-xs text-gray-400 mt-1">Tal como aparece en tu Constancia de Situación Fiscal</p>
      </div>

      <!-- Régimen Fiscal -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Régimen Fiscal <span class="text-red-500">*</span>
        </label>
        <select
          v-model="regimenSeleccionado"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Selecciona un régimen</option>
          <template v-if="form.tipoPersona === 'FISICA'">
            <option v-for="r in regimenesFisica" :key="r.clave" :value="r.clave">
              {{ r.clave }} – {{ r.descripcion }}
            </option>
          </template>
          <template v-else>
            <option v-for="r in regimenesMoral" :key="r.clave" :value="r.clave">
              {{ r.clave }} – {{ r.descripcion }}
            </option>
          </template>
        </select>
      </div>

      <!-- Código Postal Fiscal -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Código Postal fiscal <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.codigoPostalFiscal"
          type="text"
          placeholder="06600"
          maxlength="5"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">Requerido por el SAT en CFDI 4.0</p>
      </div>

      <!-- Uso CFDI -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Uso CFDI <span class="text-red-500">*</span>
        </label>
        <select
          v-model="usoSeleccionado"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Selecciona el uso</option>
          <option v-for="u in usosCFDI" :key="u.clave" :value="u.clave">
            {{ u.clave }} – {{ u.descripcion }}
          </option>
        </select>
      </div>

      <!-- Email de facturación -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Correo para recibir facturas <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.emailFacturacion"
          type="email"
          placeholder="facturas@tuempresa.com"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <!-- Domicilio fiscal (colapsable) -->
      <div>
        <button
          type="button"
          @click="mostrarDomicilio = !mostrarDomicilio"
          class="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <svg :class="['w-4 h-4 transition-transform', mostrarDomicilio ? 'rotate-90' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          {{ mostrarDomicilio ? 'Ocultar' : 'Agregar' }} domicilio fiscal (opcional)
        </button>

        <div v-if="mostrarDomicilio" class="mt-3 space-y-3 pl-2 border-l-2 border-indigo-100">
          <input v-model="form.domicilioCalle" type="text" placeholder="Calle y número"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div class="grid grid-cols-2 gap-3">
            <input v-model="form.domicilioColonia" type="text" placeholder="Colonia"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input v-model="form.domicilioMunicipio" type="text" placeholder="Municipio / Alcaldía"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <input v-model="form.domicilioEstado" type="text" placeholder="Estado"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <!-- Error general -->
      <p v-if="errorGuardar" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        {{ errorGuardar }}
      </p>

      <!-- Botones -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          :disabled="guardando || !formularioValido"
          class="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="guardando" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ guardando ? 'Guardando...' : 'Guardar datos fiscales' }}
        </button>
        <button
          type="button"
          @click="$emit('omitir')"
          class="flex-1 border border-gray-200 text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Omitir por ahora
        </button>
      </div>

      <p class="text-xs text-center text-gray-400">
        Puedes actualizar estos datos en cualquier momento desde la sección de Configuración.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import datosFiscalesService from '../../services/datosFiscalesService'

const emit = defineEmits(['guardado', 'omitir'])

const props = defineProps({
  datosIniciales: { type: Object, default: null },
})

const guardando = ref(false)
const errorGuardar = ref('')
const mostrarDomicilio = ref(false)

const form = ref({
  tipoPersona: 'FISICA',
  rfc: '',
  razonSocial: '',
  codigoPostalFiscal: '',
  emailFacturacion: '',
  domicilioCalle: '',
  domicilioColonia: '',
  domicilioMunicipio: '',
  domicilioEstado: '',
})

// Si vienen datos previos, prellenar el formulario
if (props.datosIniciales) {
  Object.assign(form.value, props.datosIniciales)
  if (form.value.domicilioCalle) mostrarDomicilio.value = true
}

// Catálogos SAT
const regimenesFisica = [
  { clave: '605', descripcion: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { clave: '606', descripcion: 'Arrendamiento' },
  { clave: '608', descripcion: 'Demás ingresos' },
  { clave: '611', descripcion: 'Ingresos por Dividendos (socios y accionistas)' },
  { clave: '612', descripcion: 'Personas Físicas con Actividades Empresariales y Profesionales' },
  { clave: '614', descripcion: 'Ingresos por intereses' },
  { clave: '616', descripcion: 'Sin obligaciones fiscales' },
  { clave: '621', descripcion: 'Incorporación Fiscal' },
  { clave: '625', descripcion: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
  { clave: '626', descripcion: 'Régimen Simplificado de Confianza' },
]

const regimenesMoral = [
  { clave: '601', descripcion: 'General de Ley Personas Morales' },
  { clave: '603', descripcion: 'Personas Morales con Fines no Lucrativos' },
  { clave: '610', descripcion: 'Residentes en el Extranjero sin Establecimiento Permanente en México' },
  { clave: '620', descripcion: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
  { clave: '622', descripcion: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
  { clave: '623', descripcion: 'Opcional para Grupos de Sociedades' },
  { clave: '624', descripcion: 'Coordinados' },
  { clave: '626', descripcion: 'Régimen Simplificado de Confianza' },
]

const usosCFDI = [
  { clave: 'G01', descripcion: 'Adquisición de mercancias' },
  { clave: 'G03', descripcion: 'Gastos en general' },
  { clave: 'I01', descripcion: 'Construcciones' },
  { clave: 'I04', descripcion: 'Equipo de computo y accesorios' },
  { clave: 'I06', descripcion: 'Comunicaciones telefónicas' },
  { clave: 'I08', descripcion: 'Otra maquinaria y equipo' },
  { clave: 'D01', descripcion: 'Honorarios médicos, dentales y gastos hospitalarios' },
  { clave: 'D10', descripcion: 'Pagos por servicios educativos (colegiaturas)' },
  { clave: 'S01', descripcion: 'Sin efectos fiscales' },
  { clave: 'CP01', descripcion: 'Pagos' },
]

// Selects controlados para actualizar clave + descripcion juntas
const regimenSeleccionado = computed({
  get: () => form.value.regimenFiscalClave || '',
  set: (clave) => {
    const lista = form.value.tipoPersona === 'FISICA' ? regimenesFisica : regimenesMoral
    const found = lista.find(r => r.clave === clave)
    form.value.regimenFiscalClave = clave
    form.value.regimenFiscalDescripcion = found?.descripcion || ''
  },
})

const usoSeleccionado = computed({
  get: () => form.value.usoCfdiClave || '',
  set: (clave) => {
    const found = usosCFDI.find(u => u.clave === clave)
    form.value.usoCfdiClave = clave
    form.value.usoCfdiDescripcion = found?.descripcion || ''
  },
})

// Al cambiar tipo de persona, limpiar el régimen (puede no aplicar)
watch(() => form.value.tipoPersona, () => {
  form.value.regimenFiscalClave = ''
  form.value.regimenFiscalDescripcion = ''
})

const formularioValido = computed(() => {
  return (
    form.value.tipoPersona &&
    form.value.rfc.length >= 12 &&
    form.value.razonSocial.trim() &&
    form.value.regimenFiscalClave &&
    form.value.codigoPostalFiscal.length === 5 &&
    form.value.usoCfdiClave &&
    form.value.emailFacturacion.includes('@')
  )
})

async function enviar() {
  if (!formularioValido.value) return
  guardando.value = true
  errorGuardar.value = ''

  try {
    const resultado = await datosFiscalesService.guardar({ ...form.value })
    emit('guardado', resultado.data)
  } catch (err) {
    errorGuardar.value = err?.response?.data?.message || 'Error al guardar los datos fiscales. Intenta de nuevo.'
  } finally {
    guardando.value = false
  }
}
</script>
