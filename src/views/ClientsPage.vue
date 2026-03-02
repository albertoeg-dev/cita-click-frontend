<template>
  <DashboardLayout>
    <template #title>
      <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Gestión de Clientes
      </div>
        <span class="text-sm text-slate-500 ml-8 mt-1">Administra todos tus clientes y su historial de citas</span>
      </div>
    </template>

    <template #headerActions>
      <button @click="abrirModalCrear" class="btn btn-primary btn-sm">
        + Nuevo Cliente
      </button>
    </template>

    <!-- Búsqueda y Filtros -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1">
          <Input
            v-model="busqueda"
            type="text"
            label="Buscar cliente"
            placeholder="Nombre, apellidos, email o teléfono..."
            @input="buscarClientes"
          />
        </div>
        <button
          @click="toggleFiltroCumpleaños"
          :class="[
            'btn transition-all',
            filtroCumpleañosMes ? 'btn-primary' : 'btn-secondary'
          ]"
          title="Filtrar clientes con cumpleaños este mes"
        >
          🎂 {{ filtroCumpleañosMes ? 'Ver Todos' : 'Cumpleaños del Mes' }}
        </button>
        <button @click="limpiarBusqueda" class="btn btn-secondary">
          Limpiar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="clientesStore.loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="clientesStore.clientes.length === 0 && !busqueda"
      title="Sin clientes aún"
      description="Comienza agregando tu primer cliente para poder crear citas"
    >
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </template>
      <template #action>
        <button @click="abrirModalCrear" class="btn btn-primary">
          + Agregar Primer Cliente
        </button>
      </template>
    </EmptyState>

    <!-- No results -->
    <EmptyState
      v-else-if="clientesStore.clientes.length === 0"
      title="No se encontraron clientes"
      description="No hay clientes que coincidan con tu búsqueda"
    >
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </template>
      <template #action>
        <button @click="limpiarBusqueda" class="btn btn-secondary">
          Limpiar búsqueda
        </button>
      </template>
    </EmptyState>

    <!-- Tabla de Clientes -->
    <div v-else class="card overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Nacimiento
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="cliente in clientesStore.clientes"
            :key="cliente.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-semibold text-sm">
                    {{ obtenerIniciales(cliente.nombre, cliente.apellidoPaterno) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatearNombreCompleto(cliente.nombre, cliente.apellidoPaterno, cliente.apellidoMaterno) }}
                  </div>
                  <div v-if="cliente.notas" class="text-sm text-gray-500 truncate max-w-xs">
                    {{ cliente.notas }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ cliente.email || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ cliente.telefono ? formatearTelefono(cliente.telefono) : '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div class="text-sm text-gray-900">
                  {{ cliente.fechaNacimiento ? formatearFecha(cliente.fechaNacimiento) : '-' }}
                </div>
                <span
                  v-if="esCumpleañosProximo(cliente.fechaNacimiento)"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                  :title="`Cumpleaños en ${diasParaCumpleaños(cliente.fechaNacimiento)} días`"
                >
                  🎂
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="verPerfil(cliente)"
                class="text-purple-600 hover:text-purple-900 transition-colors"
              >
                Ver Perfil
              </button>
              <button
                @click="abrirModalEditar(cliente)"
                class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Editar
              </button>
              <button
                @click="confirmarEliminar(cliente)"
                class="text-red-600 hover:text-red-900 transition-colors"
              >
                Eliminar
              </button>
            </td>          </tr>
        </tbody>
      </table>
    </div>

    <!-- Resumen -->
    <div v-if="clientesStore.clientes.length > 0" class="mt-6 card bg-purple-50 border-purple-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-purple-900 font-medium">Total de clientes</p>
          <p class="text-2xl font-bold text-purple-900">{{ clientesStore.clientes.length }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-purple-900 font-medium">Búsqueda activa</p>
          <p class="text-lg font-bold text-purple-900">
            {{ busqueda ? 'Sí' : 'No' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Panel lateral Crear/Editar -->
    <SlidePanel
      v-model="modalAbierto"
      :title="modoEdicion ? 'Editar Cliente' : 'Crear Nuevo Cliente'"
      :closable="!guardando"
    >
      <ClientForm
        ref="clientFormRef"
        :cliente="clienteSeleccionado"
        :loading="guardando"
        @submit="guardarCliente"
        @cancel="cerrarModal"
      />
    </SlidePanel>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Eliminar cliente"
      :message="`¿Estás seguro de que deseas eliminar a ${clienteAEliminar?.nombre} ${clienteAEliminar?.apellidoPaterno}?`"
      description="Esta acción eliminará el cliente permanentemente pero no afectará las citas ya creadas."
      confirm-text="Eliminar"
      @confirm="eliminarCliente"
      @cancel="clienteAEliminar = null"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientesStore } from '../stores/clientesStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import ClientForm from '../components/features/ClientForm.vue'
import SlidePanel from '../components/common/SlidePanel.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import Input from '../components/common/Input.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { formatearNombreCompleto, formatearTelefono, formatearFecha } from '../utils/formatters'

const router = useRouter()

const clientesStore = useClientesStore()
const toast = useToast()

// Referencias
const clientFormRef = ref(null)
const confirmDialogRef = ref(null)

// Estado del componente
const modalAbierto = ref(false)
const modoEdicion = ref(false)
const clienteSeleccionado = ref(null)
const clienteAEliminar = ref(null)
const guardando = ref(false)
const busqueda = ref('')
const filtroCumpleañosMes = ref(false)

// Métodos
const cargarClientes = async () => {
  try {
    await clientesStore.cargarClientes()
  } catch (error) {
    console.error('[ClientsPage] Error al cargar clientes:', error)
    toast.error('Error al cargar clientes', error.message || 'Intenta de nuevo')
  }
}

const buscarClientes = async () => {
  try {
    await clientesStore.buscarClientes(busqueda.value)
  } catch (error) {
    console.error('[ClientsPage] Error al buscar clientes:', error)
    toast.error('Error al buscar clientes', error.message || 'Intenta de nuevo')
  }
}

const limpiarBusqueda = async () => {
  busqueda.value = ''
  filtroCumpleañosMes.value = false
  clientesStore.limpiarBusqueda()
  await cargarClientes()
}

// Función para alternar filtro de cumpleaños del mes
const toggleFiltroCumpleaños = () => {
  filtroCumpleañosMes.value = !filtroCumpleañosMes.value

  if (filtroCumpleañosMes.value) {
    // Filtrar clientes con cumpleaños este mes
    const mesActual = new Date().getMonth()
    const clientesFiltrados = clientesStore.clientes.filter(cliente => {
      if (!cliente.fechaNacimiento) return false
      const fechaNacimiento = new Date(cliente.fechaNacimiento)
      return fechaNacimiento.getMonth() === mesActual
    })

    // Actualizar lista temporal
    clientesStore.clientes = clientesFiltrados

    if (clientesFiltrados.length === 0) {
      toast.info('Sin cumpleaños', 'No hay clientes con cumpleaños este mes')
    } else {
      toast.success('Filtro aplicado', `Encontrados ${clientesFiltrados.length} cliente(s) con cumpleaños este mes`)
    }
  } else {
    // Recargar todos los clientes
    cargarClientes()
  }
}

const obtenerIniciales = (nombre, apellido) => {
  const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : ''
  const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : ''
  return inicial1 + inicial2
}

// Función para verificar si el cumpleaños está próximo (dentro de los próximos 7 días)
const esCumpleañosProximo = (fechaNacimiento) => {
  if (!fechaNacimiento) return false

  const hoy = new Date()
  const fecha = new Date(fechaNacimiento)

  // Obtener el cumpleaños de este año
  const cumpleañosEsteAño = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())

  // Si ya pasó este año, calcular para el próximo año
  if (cumpleañosEsteAño < hoy) {
    cumpleañosEsteAño.setFullYear(hoy.getFullYear() + 1)
  }

  // Calcular diferencia en días
  const diferencia = Math.ceil((cumpleañosEsteAño - hoy) / (1000 * 60 * 60 * 24))

  // Retornar true si está dentro de los próximos 7 días
  return diferencia >= 0 && diferencia <= 7
}

// Función para obtener días faltantes para el cumpleaños
const diasParaCumpleaños = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0

  const hoy = new Date()
  const fecha = new Date(fechaNacimiento)

  const cumpleañosEsteAño = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())

  if (cumpleañosEsteAño < hoy) {
    cumpleañosEsteAño.setFullYear(hoy.getFullYear() + 1)
  }

  return Math.ceil((cumpleañosEsteAño - hoy) / (1000 * 60 * 60 * 24))
}

const verPerfil = (cliente) => {
  router.push({ name: 'ClientProfile360', params: { id: cliente.id } })
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  clienteSeleccionado.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (cliente) => {
  modoEdicion.value = true
  clienteSeleccionado.value = { ...cliente }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  modoEdicion.value = false
  clienteSeleccionado.value = null
  guardando.value = false
}

const guardarCliente = async (datos) => {
  guardando.value = true

  try {

    if (modoEdicion.value) {
      await clientesStore.actualizarCliente(clienteSeleccionado.value.id, datos)
      toast.success('Cliente actualizado', 'El cliente se actualizó correctamente')
    } else {
      await clientesStore.crearCliente(datos)
      toast.success('Cliente creado', 'El cliente se creó correctamente')
    }

    cerrarModal()
  } catch (error) {
    console.error('[ClientsPage] Error al guardar cliente:', error)
    toast.error(
      'Error al guardar',
      error.message || 'No se pudo guardar el cliente'
    )
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (cliente) => {
  clienteAEliminar.value = cliente
  confirmDialogRef.value?.open()
}

const eliminarCliente = async () => {
  if (!clienteAEliminar.value) return

  confirmDialogRef.value?.setLoading(true)

  try {
    await clientesStore.eliminarCliente(clienteAEliminar.value.id)
    toast.success('Cliente eliminado', 'El cliente se eliminó correctamente')
    confirmDialogRef.value?.close()
    clienteAEliminar.value = null
  } catch (error) {
    console.error('[ClientsPage] Error al eliminar cliente:', error)
    toast.error(
      'Error al eliminar',
      error.message || 'No se pudo eliminar el cliente'
    )
  } finally {
    confirmDialogRef.value?.setLoading(false)
  }
}

// Lifecycle
onMounted(() => {
  cargarClientes()
})
</script>
