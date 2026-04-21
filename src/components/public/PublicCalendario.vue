<template>
  <div>
    <!-- Cargando disponibilidad mensual -->
    <div v-if="cargandoMes" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Calendario -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <!-- Navegación del mes -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="mesAnterior"
            :disabled="!puedeMesAnterior"
            :class="[
              'p-1.5 rounded-lg transition-colors',
              puedeMesAnterior ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
            ]"
          >
            ‹
          </button>
          <h3 class="font-semibold text-gray-800 capitalize">
            {{ nombreMes }} {{ anioMes }}
          </h3>
          <button
            @click="mesSiguiente"
            :disabled="!puedeMesSiguiente"
            :class="[
              'p-1.5 rounded-lg transition-colors',
              puedeMesSiguiente ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
            ]"
          >
            ›
          </button>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 mb-2">
          <div v-for="dia in ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']" :key="dia"
            class="text-center text-xs text-gray-400 font-medium py-1"
          >{{ dia }}</div>
        </div>

        <!-- Días del mes -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Espacios vacíos para alinear el primer día -->
          <div v-for="i in primerDiaMes" :key="`empty-${i}`"></div>

          <button
            v-for="dia in diasDelMes"
            :key="dia.fecha"
            @click="seleccionarFecha(dia)"
            :disabled="!dia.disponible || dia.esPasado"
            :class="[
              'aspect-square text-sm rounded-lg flex items-center justify-center transition-colors font-medium',
              dia.fecha === fechaSeleccionada
                ? 'bg-indigo-600 text-white'
                : dia.esPasado
                ? 'text-gray-300 cursor-not-allowed'
                : dia.disponible
                ? 'hover:bg-indigo-100 text-gray-800 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed bg-gray-50',
              dia.esHoy && dia.fecha !== fechaSeleccionada ? 'ring-2 ring-indigo-300' : ''
            ]"
          >
            {{ dia.numero }}
          </button>
        </div>

        <!-- Leyenda -->
        <div class="flex items-center gap-4 mt-3 justify-center text-xs text-gray-400">
          <div class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-full bg-white border border-gray-800"></div>
            Disponible
          </div>
          <div class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></div>
            No disponible
          </div>
        </div>
      </div>

      <!-- Horarios del día seleccionado -->
      <div>
        <div v-if="!fechaSeleccionada" class="flex flex-col items-center justify-center h-full py-8 text-gray-400">
          <div class="text-4xl mb-2">📅</div>
          <p class="text-sm">Selecciona una fecha</p>
        </div>

        <div v-else>
          <h3 class="font-semibold text-gray-800 mb-3">
            Horarios disponibles — {{ formatFechaLabel(fechaSeleccionada) }}
          </h3>

          <div v-if="cargandoHorarios" class="flex justify-center py-6">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>

          <div v-else-if="horariosDisponibles.length === 0" class="text-center py-6 text-gray-400">
            <p class="text-sm">No hay horarios disponibles para este día.</p>
            <p class="text-xs mt-1">Intenta con otra fecha.</p>
          </div>

          <div v-else class="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
            <button
              v-for="horario in horariosDisponibles"
              :key="horario.horaInicio"
              @click="seleccionarHorario(horario)"
              :class="[
                'py-2 px-1 rounded-lg text-sm font-medium border-2 transition-colors',
                horarioSeleccionado?.horaInicio === horario.horaInicio
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : horario.recomendado
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-400'
                  : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
              ]"
            >
              {{ formatHora(horario.horaInicio) }}
            </button>
          </div>

          <!-- Botón confirmar horario -->
          <div v-if="horarioSeleccionado" class="mt-4">
            <button
              @click="confirmarHorario"
              class="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continuar con {{ formatHora(horarioSeleccionado.horaInicio) }} →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import publicBookingService from '../../services/publicBookingService'

const props = defineProps({
  token: { type: String, required: true },
  servicioIds: { type: Array, required: true },
})

const emit = defineEmits(['seleccionar'])

const hoy = new Date()
const mesMostrado = ref(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
const disponibilidadMensual = ref({})
const cargandoMes = ref(true)

const fechaSeleccionada = ref(null)
const horariosDisponibles = ref([])
const horarioSeleccionado = ref(null)
const cargandoHorarios = ref(false)

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const nombreMes = computed(() => MESES[mesMostrado.value.getMonth()])
const anioMes = computed(() => mesMostrado.value.getFullYear())

// El primer día del mes (0=Domingo, ajustado a 0=Lunes)
const primerDiaMes = computed(() => {
  const d = new Date(mesMostrado.value.getFullYear(), mesMostrado.value.getMonth(), 1)
  return (d.getDay() + 6) % 7 // 0=Lu, 1=Ma, ..., 6=Do
})

const diasDelMes = computed(() => {
  const year = mesMostrado.value.getFullYear()
  const month = mesMostrado.value.getMonth()
  const totalDias = new Date(year, month + 1, 0).getDate()
  const dias = []

  for (let i = 1; i <= totalDias; i++) {
    const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const fechaDate = new Date(year, month, i)
    const esPasado = fechaDate < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    const esHoy = fecha === toISOLocal(hoy)

    dias.push({
      numero: i,
      fecha,
      esPasado,
      esHoy,
      disponible: !esPasado && (disponibilidadMensual.value[fecha] === true),
    })
  }
  return dias
})

const puedeMesAnterior = computed(() => {
  return mesMostrado.value > new Date(hoy.getFullYear(), hoy.getMonth(), 1)
})

const puedeMesSiguiente = computed(() => {
  const limite = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
  return mesMostrado.value <= limite
})

onMounted(() => cargarDisponibilidadMensual())

// Recargar disponibilidad cuando cambian los servicios
watch(() => props.servicioIds, () => {
  cargarDisponibilidadMensual()
}, { deep: true })

async function cargarDisponibilidadMensual() {
  if (props.servicioIds.length === 0) return
  cargandoMes.value = true
  try {
    disponibilidadMensual.value = await publicBookingService.obtenerDisponibilidadMensual(
      props.token,
      props.servicioIds
    )
  } catch (e) {
    console.error('Error al cargar disponibilidad mensual', e)
  } finally {
    cargandoMes.value = false
  }
}

async function seleccionarFecha(dia) {
  if (!dia.disponible || dia.esPasado) return
  fechaSeleccionada.value = dia.fecha
  horarioSeleccionado.value = null
  horariosDisponibles.value = []
  cargandoHorarios.value = true

  try {
    const resp = await publicBookingService.obtenerDisponibilidad(
      props.token,
      props.servicioIds,
      dia.fecha
    )
    horariosDisponibles.value = resp.horariosDisponibles || []
  } catch (e) {
    console.error('Error al cargar horarios', e)
    horariosDisponibles.value = []
  } finally {
    cargandoHorarios.value = false
  }
}

function seleccionarHorario(horario) {
  horarioSeleccionado.value = horario
}

function confirmarHorario() {
  if (!horarioSeleccionado.value || !fechaSeleccionada.value) return
  const fechaHora = `${fechaSeleccionada.value}T${horarioSeleccionado.value.horaInicio}`
  emit('seleccionar', fechaHora)
}

function mesAnterior() {
  if (!puedeMesAnterior.value) return
  mesMostrado.value = new Date(mesMostrado.value.getFullYear(), mesMostrado.value.getMonth() - 1, 1)
  cargarDisponibilidadMensual()
}

function mesSiguiente() {
  if (!puedeMesSiguiente.value) return
  mesMostrado.value = new Date(mesMostrado.value.getFullYear(), mesMostrado.value.getMonth() + 1, 1)
  cargarDisponibilidadMensual()
}

function toISOLocal(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatHora(hora) {
  if (!hora) return ''
  return hora.substring(0, 5) // "HH:mm"
}

function formatFechaLabel(fecha) {
  if (!fecha) return ''
  const [year, month, day] = fecha.split('-')
  return `${day} de ${MESES[parseInt(month, 10) - 1]} ${year}`
}
</script>
