<template>
  <div class="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <h4 class="text-sm font-semibold text-blue-900">Configuración de Recurrencia</h4>
      </div>
      <button
        type="button"
        @click="$emit('remove')"
        class="text-sm text-red-600 hover:text-red-800"
      >
        Eliminar recurrencia
      </button>
    </div>

    <!-- Tipo de recurrencia -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Frecuencia <span class="text-red-500">*</span>
      </label>
      <select
        :value="modelValue.tipoRecurrencia"
        @change="updateField('tipoRecurrencia', $event.target.value)"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecciona frecuencia</option>
        <option value="DIARIA">Diaria</option>
        <option value="SEMANAL">Semanal</option>
        <option value="QUINCENAL">Quincenal (cada 2 semanas)</option>
        <option value="MENSUAL">Mensual</option>
        <option value="TRIMESTRAL">Trimestral (cada 3 meses)</option>
        <option value="PERSONALIZADO">Personalizado</option>
      </select>
    </div>

    <!-- Intervalo personalizado -->
    <div v-if="modelValue.tipoRecurrencia === 'PERSONALIZADO'">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Repetir cada (días) <span class="text-red-500">*</span>
      </label>
      <input
        type="number"
        :value="modelValue.intervaloRecurrencia"
        @input="updateField('intervaloRecurrencia', parseInt($event.target.value))"
        min="1"
        max="365"
        placeholder="Ej: 3 (cada 3 días)"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Días de la semana (solo para SEMANAL) -->
    <div v-if="modelValue.tipoRecurrencia === 'SEMANAL'">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Días de la semana
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="dia in diasSemana"
          :key="dia.value"
          type="button"
          @click="toggleDiaSemana(dia.value)"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md transition-all',
            isDiaSeleccionado(dia.value)
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ dia.label }}
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Deja vacío para repetir el mismo día de la semana que la cita inicial
      </p>
    </div>

    <!-- Límite de recurrencia -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Terminar recurrencia
      </label>
      <div class="space-y-3">
        <!-- Por fecha -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <input
              type="radio"
              id="porFecha"
              name="limiteType"
              :checked="limiteType === 'fecha'"
              @change="cambiarLimiteType('fecha')"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="porFecha" class="text-sm text-gray-700 cursor-pointer">
              En fecha específica
            </label>
          </div>
          <div v-if="limiteType === 'fecha'" class="ml-6">
            <input
              type="date"
              :value="modelValue.fechaFinRecurrencia"
              @input="updateField('fechaFinRecurrencia', $event.target.value)"
              :min="fechaMinima"
              class="block w-full px-3 py-2 text-sm border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Por número de ocurrencias -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <input
              type="radio"
              id="porOcurrencias"
              name="limiteType"
              :checked="limiteType === 'ocurrencias'"
              @change="cambiarLimiteType('ocurrencias')"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="porOcurrencias" class="text-sm text-gray-700 cursor-pointer">
              Después de un número específico de citas
            </label>
          </div>
          <div v-if="limiteType === 'ocurrencias'" class="ml-6 flex items-center gap-2">
            <input
              type="number"
              :value="modelValue.numeroOcurrencias"
              @input="updateField('numeroOcurrencias', parseInt($event.target.value))"
              min="1"
              max="100"
              placeholder="10"
              class="w-24 px-3 py-2 text-sm border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="text-sm text-gray-600">citas</span>
          </div>
        </div>

        <!-- Sin límite -->
        <div class="flex items-center gap-2">
          <input
            type="radio"
            id="sinLimite"
            name="limiteType"
            :checked="limiteType === 'ninguno'"
            @change="cambiarLimiteType('ninguno')"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label for="sinLimite" class="text-sm text-gray-700 cursor-pointer">
            Sin fecha de finalización (máx. 52 citas o 1 año)
          </label>
        </div>
      </div>
    </div>

    <!-- Resumen de recurrencia -->
    <div v-if="resumenRecurrencia" class="p-3 bg-white border border-blue-200 rounded-md">
      <p class="text-xs font-medium text-blue-900 mb-1">Resumen:</p>
      <p class="text-sm text-blue-800">{{ resumenRecurrencia }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      tipoRecurrencia: '',
      intervaloRecurrencia: null,
      fechaFinRecurrencia: null,
      numeroOcurrencias: null,
      diasSemana: '',
    }),
  },
  fechaInicio: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'remove'])

const diasSemana = [
  { value: 'LUN', label: 'L' },
  { value: 'MAR', label: 'M' },
  { value: 'MIE', label: 'X' },
  { value: 'JUE', label: 'J' },
  { value: 'VIE', label: 'V' },
  { value: 'SAB', label: 'S' },
  { value: 'DOM', label: 'D' },
]

// Determinar el tipo de límite inicial basado en los valores
const determinarLimiteInicial = () => {
  if (props.modelValue.fechaFinRecurrencia) return 'fecha'
  if (props.modelValue.numeroOcurrencias) return 'ocurrencias'
  return 'ninguno'
}

const limiteType = ref(determinarLimiteInicial())

const fechaMinima = computed(() => {
  if (props.fechaInicio) {
    const fecha = new Date(props.fechaInicio)
    fecha.setDate(fecha.getDate() + 1)
    return fecha.toISOString().split('T')[0]
  }
  return new Date().toISOString().split('T')[0]
})

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}

const isDiaSeleccionado = (dia) => {
  if (!props.modelValue.diasSemana) return false
  return props.modelValue.diasSemana.split(',').includes(dia)
}

const toggleDiaSemana = (dia) => {
  let dias = props.modelValue.diasSemana ? props.modelValue.diasSemana.split(',') : []

  if (dias.includes(dia)) {
    dias = dias.filter(d => d !== dia)
  } else {
    dias.push(dia)
  }

  // Ordenar días según el orden de la semana
  const ordenDias = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
  dias.sort((a, b) => ordenDias.indexOf(a) - ordenDias.indexOf(b))

  updateField('diasSemana', dias.join(','))
}

const cambiarLimiteType = (type) => {
  limiteType.value = type

  if (type === 'fecha') {
    updateField('numeroOcurrencias', null)
  } else if (type === 'ocurrencias') {
    updateField('fechaFinRecurrencia', null)
  } else {
    updateField('fechaFinRecurrencia', null)
    updateField('numeroOcurrencias', null)
  }
}

const resumenRecurrencia = computed(() => {
  if (!props.modelValue.tipoRecurrencia) return ''

  const tipos = {
    DIARIA: 'Todos los días',
    SEMANAL: 'Cada semana',
    QUINCENAL: 'Cada 2 semanas',
    MENSUAL: 'Cada mes',
    TRIMESTRAL: 'Cada 3 meses',
    PERSONALIZADO: `Cada ${props.modelValue.intervaloRecurrencia || '?'} días`,
  }

  let texto = tipos[props.modelValue.tipoRecurrencia] || ''

  if (props.modelValue.tipoRecurrencia === 'SEMANAL' && props.modelValue.diasSemana) {
    texto += ` los ${props.modelValue.diasSemana.replace(/,/g, ', ')}`
  }

  if (props.modelValue.fechaFinRecurrencia) {
    const fecha = new Date(props.modelValue.fechaFinRecurrencia)
    texto += ` hasta el ${fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
  } else if (props.modelValue.numeroOcurrencias) {
    texto += ` por ${props.modelValue.numeroOcurrencias} citas`
  } else {
    texto += ' (máx. 52 citas o 1 año)'
  }

  return texto
})
</script>
