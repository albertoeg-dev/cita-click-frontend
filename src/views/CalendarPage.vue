<template>
  <DashboardLayout>
    <template #title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendario de Citas
        </div>
        <span class="text-sm text-slate-500 ml-8 mt-1">Visualiza todas tus citas en un calendario mensual</span>
      </div>
    </template>

    <template #headerActions>
      <button @click="abrirModalCrear" class="btn btn-primary btn-sm">
        + Nueva Cita
      </button>
    </template>

    <!-- Controles del calendario -->
    <div class="card mb-6 space-y-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Selector de Vista -->
        <div class="flex gap-1 bg-slate-100 p-1 rounded-lg">
          <button @click="vistaActual = 'dia'" :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            vistaActual === 'dia'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          ]">
            Día
          </button>
          <button @click="vistaActual = 'semana'" :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            vistaActual === 'semana'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          ]">
            Semana
          </button>
          <button @click="vistaActual = 'mes'" :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            vistaActual === 'mes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          ]">
            Mes
          </button>
        </div>

        <!-- Navegación de mes/semana/día -->
        <div class="flex items-center gap-4">
          <button @click="navegarAnterior" class="btn btn-secondary btn-sm" :disabled="citasStore.loading">
            ← Anterior
          </button>
          <h3 class="text-xl font-bold text-slate-900 min-w-[200px] text-center">
            {{ tituloVista }}
          </h3>
          <button @click="navegarSiguiente" class="btn btn-secondary btn-sm" :disabled="citasStore.loading">
            Siguiente →
          </button>
        </div>

        <!-- Botón hoy -->
        <button @click="irAHoy" class="btn btn-secondary btn-sm" :disabled="citasStore.loading">
          Hoy
        </button>

        <!-- Filtro por estado -->
        <Select v-model="filtroEstado" :options="opcionesEstado" @change="aplicarFiltro" />
      </div>

      <!-- Leyenda de estados (movida aquí desde abajo) -->
      <div class="flex items-center gap-4 pt-4 border-t border-slate-200">
        <span class="text-sm font-medium text-slate-700">Leyenda:</span>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span class="text-sm text-slate-600">Pendiente</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
            <span class="text-sm text-slate-600">Confirmada</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span class="text-sm text-slate-600">Completada</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span class="text-sm text-slate-600">Cancelada</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="citasStore.loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Vista Día -->
    <div v-if="!citasStore.loading && vistaActual === 'dia'" class="card">
      <div class="space-y-1">
        <!-- Horas del día (8 AM - 8 PM) -->
        <div v-for="hora in horasDelDia" :key="hora" class="flex border-b border-slate-100 hover:bg-slate-50">
          <div class="w-20 p-3 text-sm font-medium text-slate-600 flex-shrink-0">
            {{ hora }}
          </div>
          <div class="flex-1 p-2 min-h-[60px]">
            <div v-for="cita in citasDeHora(hora)" :key="cita.id" @click="verDetalleCita(cita)" :class="[
              'mb-2 p-2 rounded-md cursor-pointer transition-all hover:scale-102 hover:shadow-md',
              getEstadoClasses(cita.estado)
            ]">
              <div class="font-medium text-sm">
                {{ formatearNombreCompleto(cita.cliente?.nombre, cita.cliente?.apellidoPaterno,
                  cita.cliente?.apellidoMaterno) }}
              </div>
              <div class="text-xs opacity-75">
                {{ cita.servicio?.nombre }} - {{ formatearDuracion(cita.servicio?.duracion) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Semana -->
    <div v-else-if="!citasStore.loading && vistaActual === 'semana'" class="card overflow-x-auto">
      <div class="min-w-[800px]">
        <!-- Encabezados de días -->
        <div class="grid grid-cols-8 gap-px bg-slate-200 border border-slate-200 rounded-t-lg overflow-hidden">
          <div class="bg-slate-100 p-2"></div>
          <div v-for="dia in diasSemana" :key="dia.fecha" class="bg-slate-100 p-2 text-center">
            <div class="text-xs text-slate-600">{{ DIAS_SEMANA[(dia.diaSemana + 6) % 7].short }}</div>
            <div :class="['text-sm font-semibold', dia.esHoy ? 'text-blue-600' : 'text-slate-900']">
              {{ dia.numero }}
            </div>
          </div>
        </div>

        <!-- Horas y citas -->
        <div class="grid grid-cols-8 gap-px bg-slate-200 border-x border-b border-slate-200 rounded-b-lg">
          <div v-for="hora in horasDelDia" :key="hora" class="col-span-8 grid grid-cols-8 gap-px">
            <div class="bg-white p-2 text-xs text-slate-600 font-medium">
              {{ hora }}
            </div>
            <div v-for="dia in diasSemana" :key="`${hora}-${dia.fecha}`"
              class="bg-white p-1 min-h-[50px] hover:bg-slate-50">
              <div v-for="cita in citasDeHoraDia(hora, dia.fecha)" :key="cita.id" @click="verDetalleCita(cita)" :class="[
                'text-xs p-1 rounded cursor-pointer mb-1 truncate',
                getEstadoClasses(cita.estado)
              ]" :title="`${cita.cliente?.nombre} - ${cita.servicio?.nombre}`">
                {{ cita.cliente?.nombre }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Mes (existente) -->
    <div v-else-if="!citasStore.loading && vistaActual === 'mes'" class="card">
      <!-- Encabezados de días -->
      <div class="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-t-lg overflow-hidden">
        <div v-for="dia in DIAS_SEMANA" :key="dia.value"
          class="bg-slate-100 p-3 text-center font-semibold text-slate-700 text-sm">
          {{ dia.short }}
        </div>
      </div>

      <!-- Celdas del calendario -->
      <div
        class="grid grid-cols-7 gap-px bg-slate-200 border-l border-r border-b border-slate-200 rounded-b-lg overflow-hidden">
        <div v-for="(dia, index) in diasDelMes" :key="index" :class="[
          'bg-white p-2 min-h-[120px] transition-colors',
          dia.esOtroMes ? 'bg-slate-50' : '',
          dia.esHoy ? 'bg-blue-50' : '',
          'hover:bg-slate-50 cursor-pointer'
        ]" @click="seleccionarDia(dia)">
          <!-- Número del día -->
          <div class="flex items-center justify-between mb-2">
            <span :class="[
              'text-sm font-medium',
              dia.esOtroMes ? 'text-slate-400' : 'text-slate-900',
              dia.esHoy ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : ''
            ]">
              {{ dia.numero }}
            </span>
            <span v-if="dia.citas.length > 0" class="text-xs text-slate-500">
              {{ dia.citas.length }}
            </span>
          </div>

          <!-- Lista de citas del día -->
          <div class="space-y-1">
            <div v-for="cita in dia.citas.slice(0, 3)" :key="cita.id" @click.stop="verDetalleCita(cita)" :class="[
              'text-xs p-1 rounded truncate cursor-pointer transition-all hover:scale-105',
              getEstadoClasses(cita.estado)
            ]"
              :title="`${formatearHora(cita.fechaHora)} - ${cita.cliente?.nombre} ${cita.cliente?.apellidoPaterno} - ${cita.servicio?.nombre}`">
              <div class="font-medium truncate">
                {{ formatearHora(cita.fechaHora) }} {{ cita.cliente?.nombre }}
              </div>
            </div>
            <!-- Indicador de más citas -->
            <div v-if="dia.citas.length > 3" class="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
              @click.stop="verTodasCitas(dia)">
              + {{ dia.citas.length - 3 }} más
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Cita -->
    <Modal v-model="modalCrearAbierto" title="Crear Nueva Cita" size="2xl" :closable="!guardando">
      <AppointmentForm ref="appointmentFormRef" :cita="null" :loading="guardando" @submit="guardarCita"
        @cancel="cerrarModalCrear" />
    </Modal>

    <!-- Modal Detalle de Cita -->
    <Modal v-model="modalDetalleAbierto" title="Detalles de la Cita" size="lg">
      <div v-if="citaSeleccionada" class="space-y-4">
        <!-- Estado -->
        <div>
          <Badge :variant="getEstadoVariant(citaSeleccionada.estado)" class="text-sm">
            {{ ESTADOS_CITA_LABELS[citaSeleccionada.estado] }}
          </Badge>
        </div>

        <!-- Información -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Cliente -->
          <div>
            <p class="text-sm text-slate-500 mb-1">Cliente</p>
            <div class="flex items-center gap-2">
              <div class="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-purple-600 font-semibold text-sm">
                  {{ obtenerIniciales(citaSeleccionada.cliente?.nombre, citaSeleccionada.cliente?.apellidoPaterno) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-slate-900">
                  {{ formatearNombreCompleto(citaSeleccionada.cliente?.nombre,
                    citaSeleccionada.cliente?.apellidoPaterno,
                  citaSeleccionada.cliente?.apellidoMaterno) }}
                </p>
                <p v-if="citaSeleccionada.cliente?.telefono" class="text-sm text-slate-600">
                  {{ formatearTelefono(citaSeleccionada.cliente?.telefono) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Servicio -->
          <div>
            <p class="text-sm text-slate-500 mb-1">Servicio</p>
            <p class="font-medium text-slate-900">{{ citaSeleccionada.servicio?.nombre }}</p>
            <p class="text-sm text-slate-600">
              {{ formatearDuracion(citaSeleccionada.servicio?.duracion) }} - {{
                formatearPrecio(citaSeleccionada.servicio?.precio) }}
            </p>
          </div>

          <!-- Fecha y Hora -->
          <div>
            <p class="text-sm text-slate-500 mb-1">Fecha y Hora</p>
            <p class="font-medium text-slate-900">{{ formatearFechaHora(citaSeleccionada.fechaHora) }}</p>
          </div>

          <!-- Notas -->
          <div v-if="citaSeleccionada.notas">
            <p class="text-sm text-slate-500 mb-1">Notas</p>
            <p class="text-sm text-slate-700">{{ citaSeleccionada.notas }}</p>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex flex-wrap gap-2 pt-4 border-t">
          <button v-if="citaSeleccionada.estado === 'PENDIENTE'" @click="cambiarEstado(citaSeleccionada, 'CONFIRMADA')"
            class="btn btn-primary btn-sm">
            Confirmar Cita
          </button>
          <button v-if="citaSeleccionada.estado === 'CONFIRMADA'" @click="cambiarEstado(citaSeleccionada, 'COMPLETADA')"
            class="btn btn-success btn-sm">
            Completar Cita
          </button>
          <!-- Recordatorio Email -->
          <button
            v-if="citaSeleccionada.estado !== 'CANCELADA' && citaSeleccionada.estado !== 'COMPLETADA'"
            @click="enviarRecordatorioEmail(citaSeleccionada)"
            :disabled="enviandoRecordatorio === citaSeleccionada.id || !citaSeleccionada.cliente?.email || !emailRecordatoriosHabilitado"
            class="btn btn-secondary btn-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            :title="!emailRecordatoriosHabilitado ? 'Tu plan no incluye recordatorios por email' : (!citaSeleccionada.cliente?.email ? 'Cliente sin email' : 'Enviar recordatorio por Email')">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ enviandoRecordatorio === citaSeleccionada.id ? 'Enviando...' : 'Email' }}
          </button>
          <!-- Solicitar Pago -->
          <button
            v-if="citaSeleccionada.estado !== 'CANCELADA'"
            @click="abrirModalPago(citaSeleccionada)"
            class="btn btn-secondary btn-sm flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Solicitar Pago
          </button>
          <button v-if="citaSeleccionada.estado !== 'CANCELADA' && citaSeleccionada.estado !== 'COMPLETADA'"
            @click="abrirModalEditar" class="btn btn-secondary btn-sm">
            Editar
          </button>
          <button v-if="citaSeleccionada.estado !== 'CANCELADA'" @click="confirmarCancelar"
            class="btn btn-danger btn-sm">
            Cancelar
          </button>
          <button @click="cerrarModalDetalle" class="btn btn-secondary btn-sm ml-auto">
            Cerrar
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal Editar Cita -->
    <Modal v-model="modalEditarAbierto" title="Editar Cita" size="2xl" :closable="!guardando">
      <AppointmentForm ref="editFormRef" :cita="citaSeleccionada" :loading="guardando" @submit="actualizarCita"
        @cancel="cerrarModalEditar" />
    </Modal>

    <!-- Modal Ver Todas las Citas del Día -->
    <Modal v-model="modalTodasCitasAbierto" :title="`Citas del ${diaSeleccionado?.fecha || ''}`" size="lg">
      <div v-if="diaSeleccionado" class="space-y-2">
        <div v-for="cita in diaSeleccionado.citas" :key="cita.id" @click="verDetalleCita(cita)"
          class="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <div class="flex items-center justify-between mb-2">
            <Badge :variant="getEstadoVariant(cita.estado)" class="text-xs">
              {{ ESTADOS_CITA_LABELS[cita.estado] }}
            </Badge>
            <span class="text-sm font-medium text-slate-900">{{ formatearHora(cita.fechaHora) }}</span>
          </div>
          <p class="text-sm text-slate-900 font-medium">
            {{ formatearNombreCompleto(cita.cliente?.nombre, cita.cliente?.apellidoPaterno,
              cita.cliente?.apellidoMaterno)
            }}
          </p>
          <p class="text-sm text-slate-600">{{ cita.servicio?.nombre }}</p>
        </div>
      </div>
    </Modal>

    <!-- Confirm Dialog para Cancelar -->
    <ConfirmDialog ref="confirmDialogRef" title="Cancelar cita"
      message="¿Estás seguro de que deseas cancelar esta cita?"
      description="Esta acción cambiará el estado de la cita a CANCELADA." confirm-text="Cancelar cita"
      @confirm="cancelarCita" @cancel="cerrarConfirmDialog" />

    <!-- Modal de Pago -->
    <PaymentModal :is-open="modalPagoAbierto" :cita="citaParaPago" @close="cerrarModalPago"
      @success="manejarPagoExitoso" />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCitasStore } from '../stores/citasStore'
import { usePlanesStore } from '../stores/planesStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import AppointmentForm from '../components/features/AppointmentForm.vue'
import Modal from '../components/common/Modal.vue'
import Select from '../components/common/Select.vue'
import Badge from '../components/common/Badge.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import PaymentModal from '../components/payments/PaymentModal.vue'
import {
  formatearNombreCompleto,
  formatearPrecio,
  formatearDuracion,
  formatearFechaHora,
  formatearTelefono
} from '../utils/formatters'
import { DIAS_SEMANA, MESES, ESTADOS_CITA_LABELS } from '../utils/constants'

const citasStore = useCitasStore()
const planesStore = usePlanesStore()
const toast = useToast()

// Referencias
const appointmentFormRef = ref(null)
const editFormRef = ref(null)
const confirmDialogRef = ref(null)

// Estado del calendario
const fechaActual = new Date()
const mesActual = ref(fechaActual.getMonth())
const añoActual = ref(fechaActual.getFullYear())
const diaActual = ref(fechaActual.getDate())
const vistaActual = ref('mes') // 'dia', 'semana', 'mes'
const filtroEstado = ref('')

// Horas del día para vista día y semana (8 AM - 8 PM)
const horasDelDia = Array.from({ length: 13 }, (_, i) => {
  const hora = i + 8
  return `${String(hora).padStart(2, '0')}:00`
})

// Estado de modales
const modalCrearAbierto = ref(false)
const modalDetalleAbierto = ref(false)
const modalEditarAbierto = ref(false)
const modalTodasCitasAbierto = ref(false)
const citaSeleccionada = ref(null)
const diaSeleccionado = ref(null)
const guardando = ref(false)

// Estado para recordatorio y pago
const enviandoRecordatorio = ref(null)
const modalPagoAbierto = ref(false)
const citaParaPago = ref(null)

// Computed para verificar si el email está habilitado en el plan
const emailRecordatoriosHabilitado = computed(() => {
  return planesStore.limites?.emailRecordatoriosHabilitado ?? false
})

// Opciones de filtro
const opcionesEstado = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'CONFIRMADA', label: 'Confirmadas' },
  { value: 'COMPLETADA', label: 'Completadas' },
  { value: 'CANCELADA', label: 'Canceladas' },
]

// Computed
const tituloVista = computed(() => {
  if (vistaActual.value === 'dia') {
    const fecha = new Date(añoActual.value, mesActual.value, diaActual.value)
    const nombreDia = DIAS_SEMANA[(fecha.getDay() + 6) % 7].label
    const nombreMes = obtenerNombreMes(mesActual.value)
    return `${nombreDia}, ${diaActual.value} de ${nombreMes} ${añoActual.value}`
  } else if (vistaActual.value === 'semana') {
    const primerDia = diasSemana.value[0]
    const ultimoDia = diasSemana.value[6]
    if (primerDia.mes === ultimoDia.mes) {
      return `${primerDia.numero} - ${ultimoDia.numero} de ${MESES[primerDia.mes - 1].label} ${primerDia.año}`
    } else {
      return `${primerDia.numero} ${MESES[primerDia.mes - 1].short} - ${ultimoDia.numero} ${MESES[ultimoDia.mes - 1].short} ${primerDia.año}`
    }
  } else {
    return `${obtenerNombreMes(mesActual.value)} ${añoActual.value}`
  }
})

const diasSemana = computed(() => {
  const fecha = new Date(añoActual.value, mesActual.value, diaActual.value)
  const diaSemana = fecha.getDay()
  const primerDiaSemana = new Date(fecha)
  // Semana empieza en Lunes: lunes(1)→0 días, domingo(0)→6 días
  primerDiaSemana.setDate(fecha.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1))

  const dias = []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const dia = new Date(primerDiaSemana)
    dia.setDate(primerDiaSemana.getDate() + i)
    dia.setHours(0, 0, 0, 0)

    dias.push({
      numero: dia.getDate(),
      mes: dia.getMonth() + 1,
      año: dia.getFullYear(),
      fecha: formatearFechaISO(dia),
      diaSemana: dia.getDay(),
      esHoy: dia.getTime() === hoy.getTime()
    })
  }

  return dias
})

const citasDelDia = computed(() => {
  const fecha = new Date(añoActual.value, mesActual.value, diaActual.value)
  return obtenerCitasDelDia(fecha)
})

const diasDelMes = computed(() => {

  const primerDia = new Date(añoActual.value, mesActual.value, 1)
  const ultimoDia = new Date(añoActual.value, mesActual.value + 1, 0)
  const diasEnMes = ultimoDia.getDate()
  const diaSemanaInicio = primerDia.getDay() // 0 = Domingo

  const dias = []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  // Días del mes anterior para completar la primera semana (semana inicia en Lunes)
  // Cuántos días del mes anterior mostrar: lun(1)→0, mar(2)→1, ..., dom(0)→6
  const diasPrevios = (diaSemanaInicio + 6) % 7
  const diasMesAnterior = new Date(añoActual.value, mesActual.value, 0).getDate()
  for (let i = diasPrevios - 1; i >= 0; i--) {
    const dia = diasMesAnterior - i
    const fecha = new Date(añoActual.value, mesActual.value - 1, dia)
    dias.push({
      numero: dia,
      fecha: formatearFechaISO(fecha),
      esOtroMes: true,
      esHoy: false,
      citas: obtenerCitasDelDia(fecha)
    })
  }

  // Días del mes actual
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(añoActual.value, mesActual.value, dia)
    fecha.setHours(0, 0, 0, 0)
    const esHoy = fecha.getTime() === hoy.getTime()

    dias.push({
      numero: dia,
      fecha: formatearFechaISO(fecha),
      esOtroMes: false,
      esHoy,
      citas: obtenerCitasDelDia(fecha)
    })
  }

  // Días del mes siguiente para completar la última semana
  const diasRestantes = 42 - dias.length // 6 semanas * 7 días
  for (let dia = 1; dia <= diasRestantes; dia++) {
    const fecha = new Date(añoActual.value, mesActual.value + 1, dia)
    dias.push({
      numero: dia,
      fecha: formatearFechaISO(fecha),
      esOtroMes: true,
      esHoy: false,
      citas: obtenerCitasDelDia(fecha)
    })
  }

  return dias
})

// Métodos auxiliares
const obtenerNombreMes = (mesIndex) => {
  const mesObj = MESES.find(m => m.value === mesIndex + 1)
  return mesObj ? mesObj.label : ''
}

const obtenerNombresDiasSemana = () => {
  return DIAS_SEMANA.map(d => d.short)
}

const formatearFechaISO = (fecha) => {
  const año = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${año}-${mes}-${dia}`
}

const formatearHora = (fechaHora) => {
  if (!fechaHora) return ''
  const [, hora] = fechaHora.split('T')
  return hora ? hora.substring(0, 5) : ''
}

const obtenerCitasDelDia = (fecha) => {
  const fechaStr = formatearFechaISO(fecha)
  let citas = citasStore.citas.filter(cita => {
    if (!cita.fechaHora) return false
    const [fechaCita] = cita.fechaHora.split('T')
    return fechaCita === fechaStr
  })

  // Aplicar filtro de estado si está activo
  if (filtroEstado.value) {
    citas = citas.filter(cita => cita.estado === filtroEstado.value)
  }

  // Ordenar por hora
  return citas.sort((a, b) => {
    const horaA = a.fechaHora.split('T')[1]
    const horaB = b.fechaHora.split('T')[1]
    return horaA.localeCompare(horaB)
  })
}

const obtenerIniciales = (nombre, apellido) => {
  const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : ''
  const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : ''
  return inicial1 + inicial2
}

const getEstadoVariant = (estado) => {
  const variants = {
    PENDIENTE: 'warning',
    CONFIRMADA: 'info',
    COMPLETADA: 'success',
    CANCELADA: 'danger',
  }
  return variants[estado] || 'default'
}

const getEstadoClasses = (estado) => {
  const classes = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    CONFIRMADA: 'bg-blue-100 text-blue-800 border border-blue-300',
    COMPLETADA: 'bg-green-100 text-green-800 border border-green-300',
    CANCELADA: 'bg-red-100 text-red-800 border border-red-300',
  }
  return classes[estado] || 'bg-slate-100 text-slate-800 border border-slate-300'
}

// Métodos para obtener citas por hora
const citasDeHora = (hora) => {
  return citasDelDia.value.filter(cita => {
    const horaCita = formatearHora(cita.fechaHora)
    return horaCita.startsWith(hora.substring(0, 2))
  })
}

const citasDeHoraDia = (hora, fecha) => {
  const citasDia = citasStore.citas.filter(cita => {
    if (!cita.fechaHora) return false
    const [fechaCita] = cita.fechaHora.split('T')
    return fechaCita === fecha
  })

  return citasDia.filter(cita => {
    const horaCita = formatearHora(cita.fechaHora)
    return horaCita.startsWith(hora.substring(0, 2))
  })
}

// Navegación del calendario
const navegarAnterior = () => {
  if (vistaActual.value === 'dia') {
    diaAnterior()
  } else if (vistaActual.value === 'semana') {
    semanaAnterior()
  } else {
    mesAnterior()
  }
}

const navegarSiguiente = () => {
  if (vistaActual.value === 'dia') {
    diaSiguiente()
  } else if (vistaActual.value === 'semana') {
    semanaSiguiente()
  } else {
    mesSiguiente()
  }
}

const diaAnterior = () => {
  const fecha = new Date(añoActual.value, mesActual.value, diaActual.value)
  fecha.setDate(fecha.getDate() - 1)
  diaActual.value = fecha.getDate()
  mesActual.value = fecha.getMonth()
  añoActual.value = fecha.getFullYear()
}

const diaSiguiente = () => {
  const fecha = new Date(añoActual.value, mesActual.value, diaActual.value)
  fecha.setDate(fecha.getDate() + 1)
  diaActual.value = fecha.getDate()
  mesActual.value = fecha.getMonth()
  añoActual.value = fecha.getFullYear()
}

const semanaAnterior = () => {
  const fecha = new Date(añoActual.value, mesActual.value, diaActual.value)
  fecha.setDate(fecha.getDate() - 7)
  diaActual.value = fecha.getDate()
  mesActual.value = fecha.getMonth()
  añoActual.value = fecha.getFullYear()
}

const semanaSiguiente = () => {
  const fecha = new Date(añoActual.value, mesActual.value, diaActual.value)
  fecha.setDate(fecha.getDate() + 7)
  diaActual.value = fecha.getDate()
  mesActual.value = fecha.getMonth()
  añoActual.value = fecha.getFullYear()
}

const mesAnterior = () => {
  if (mesActual.value === 0) {
    mesActual.value = 11
    añoActual.value--
  } else {
    mesActual.value--
  }
}

const mesSiguiente = () => {
  if (mesActual.value === 11) {
    mesActual.value = 0
    añoActual.value++
  } else {
    mesActual.value++
  }
}

const irAHoy = () => {
  const hoy = new Date()
  diaActual.value = hoy.getDate()
  mesActual.value = hoy.getMonth()
  añoActual.value = hoy.getFullYear()
}

// Interacciones
const seleccionarDia = (dia) => {
  if (dia.citas.length === 0) {
    // Si no hay citas, abrir modal para crear
    abrirModalCrear()
  } else if (dia.citas.length === 1) {
    // Si hay solo una cita, mostrar detalle
    verDetalleCita(dia.citas[0])
  } else {
    // Si hay varias, mostrar lista
    verTodasCitas(dia)
  }
}

const verDetalleCita = (cita) => {
  citaSeleccionada.value = cita
  modalTodasCitasAbierto.value = false
  modalDetalleAbierto.value = true
}

const verTodasCitas = (dia) => {
  diaSeleccionado.value = dia
  modalTodasCitasAbierto.value = true
}

// CRUD de citas
const abrirModalCrear = () => {
  modalCrearAbierto.value = true
}

const cerrarModalCrear = () => {
  modalCrearAbierto.value = false
  guardando.value = false
}

const guardarCita = async (datos) => {
  guardando.value = true

  try {
    await citasStore.crearCita(datos)
    toast.success('Cita creada', 'La cita se creó correctamente')
    cerrarModalCrear()
    await cargarCitas()
  } catch (error) {
    console.error('[CalendarPage] Error al crear cita:', error)
    toast.error('Error al crear', error.message || 'No se pudo crear la cita')
  } finally {
    guardando.value = false
  }
}

const cerrarModalDetalle = () => {
  modalDetalleAbierto.value = false
  citaSeleccionada.value = null
}

const abrirModalEditar = () => {
  modalDetalleAbierto.value = false
  modalEditarAbierto.value = true
}

const cerrarModalEditar = () => {
  modalEditarAbierto.value = false
  guardando.value = false
}

const actualizarCita = async (datos) => {
  guardando.value = true

  try {
    await citasStore.actualizarCita(citaSeleccionada.value.id, datos)
    toast.success('Cita actualizada', 'La cita se actualizó correctamente')
    cerrarModalEditar()
    citaSeleccionada.value = null
    await cargarCitas()
  } catch (error) {
    console.error('[CalendarPage] Error al actualizar cita:', error)
    toast.error('Error al actualizar', error.message || 'No se pudo actualizar la cita')
  } finally {
    guardando.value = false
  }
}

const cambiarEstado = async (cita, nuevoEstado) => {
  try {
    await citasStore.cambiarEstadoCita(cita.id, nuevoEstado)
    toast.success('Estado actualizado', `La cita se marcó como ${ESTADOS_CITA_LABELS[nuevoEstado]}`)
    cerrarModalDetalle()
    await cargarCitas()
  } catch (error) {
    console.error('[CalendarPage] Error al cambiar estado:', error)
    toast.error('Error al cambiar estado', error.message || 'No se pudo cambiar el estado')
  }
}

const confirmarCancelar = () => {
  confirmDialogRef.value?.open()
}

const cancelarCita = async () => {
  if (!citaSeleccionada.value) return

  confirmDialogRef.value?.setLoading(true)

  try {
    await citasStore.cancelarCita(citaSeleccionada.value.id)
    toast.success('Cita cancelada', 'La cita se canceló correctamente')
    confirmDialogRef.value?.close()
    cerrarModalDetalle()
    await cargarCitas()
  } catch (error) {
    console.error('[CalendarPage] Error al cancelar cita:', error)
    toast.error('Error al cancelar', error.message || 'No se pudo cancelar la cita')
  } finally {
    confirmDialogRef.value?.setLoading(false)
  }
}

const cerrarConfirmDialog = () => {
}

// Filtros
const aplicarFiltro = () => {
}

// Enviar recordatorio por email
const enviarRecordatorioEmail = async (cita) => {
  if (!cita || !cita.cliente?.email) {
    toast.error('Email no disponible', 'El cliente no tiene email registrado')
    return
  }
  enviandoRecordatorio.value = cita.id
  try {
    await citasStore.enviarRecordatorioCita(cita.id, 'email')
    toast.success('Recordatorio enviado', 'Se envió el recordatorio por email al cliente')
  } catch (error) {
    console.error('[CalendarPage] Error al enviar recordatorio:', error)
    toast.error('Error al enviar recordatorio', error.message || 'No se pudo enviar el recordatorio')
  } finally {
    enviandoRecordatorio.value = null
  }
}

// Funciones para modal de pago
const abrirModalPago = (cita) => {
  citaParaPago.value = {
    ...cita,
    clienteNombre: formatearNombreCompleto(cita.cliente?.nombre, cita.cliente?.apellidoPaterno, cita.cliente?.apellidoMaterno),
    clienteEmail: cita.cliente?.email,
    servicioNombre: cita.servicio?.nombre,
    precioServicio: cita.servicio?.precio
  }
  modalPagoAbierto.value = true
}

const cerrarModalPago = () => {
  modalPagoAbierto.value = false
  citaParaPago.value = null
}

const manejarPagoExitoso = () => {
  toast.success('Pago creado', 'La solicitud de pago ha sido enviada al cliente')
  cerrarModalPago()
  cargarCitas()
}

// Cargar citas
const cargarCitas = async () => {
  try {
    // Cargar todas las citas sin filtros de fecha para tener vista completa del mes
    await citasStore.cargarCitas()
  } catch (error) {
    console.error('[CalendarPage] Error al cargar citas:', error)
    toast.error('Error al cargar citas', error.message || 'Intenta de nuevo')
  }
}

// Watchers
watch([mesActual, añoActual], () => {
  cargarCitas()
})

// Lifecycle
onMounted(() => {
  planesStore.cargarLimites().catch(err => {
    console.error('[CalendarPage] Error al cargar límites del plan:', err)
  })
  cargarCitas()
})
</script>

<style scoped>
/* Asegurar que las celdas del calendario tengan altura mínima */
.min-h-\[120px\] {
  min-height: 120px;
}
</style>
