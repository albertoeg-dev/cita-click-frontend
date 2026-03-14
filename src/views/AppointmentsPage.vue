<template>
  <DashboardLayout>
    <template #title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Gestión de Citas
        </div>
        <span class="text-sm text-slate-500 ml-8 mt-1">Administra todas las citas de tu negocio</span>
      </div>
    </template>

    <template #headerActions>
      <button @click="abrirModalCrear" data-tour="agregar-cita" class="btn btn-primary btn-sm">
        + Nueva Cita
      </button>
    </template>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <DatePicker v-model="filtros.fecha" label="Filtrar por fecha" @change="aplicarFiltros" />
        <Select v-model="filtros.estado" label="Estado" :options="opcionesEstado" @change="aplicarFiltros" />
        <button @click="limpiarFiltros" class="btn btn-secondary self-end">
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="citasStore.loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Empty State -->
    <EmptyState v-else-if="citasStore.citas.length === 0 && !filtros.fecha && !filtros.estado" title="Sin citas aún"
      description="Comienza creando tu primera cita para gestionar las reservas de tus clientes">
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </template>
      <template #action>
        <button @click="abrirModalCrear" class="btn btn-primary">
          + Crear Primera Cita
        </button>
      </template>
    </EmptyState>

    <!-- No results -->
    <EmptyState v-else-if="citasStore.citas.length === 0" title="No se encontraron citas"
      description="No hay citas que coincidan con los filtros seleccionados">
      <template #action>
        <button @click="limpiarFiltros" class="btn btn-secondary">
          Limpiar filtros
        </button>
      </template>
    </EmptyState>

    <!-- Lista de Citas -->
    <div v-else class="space-y-4">
      <div v-for="cita in citasStore.citas" :key="cita.id" class="card-hover">
        <div class="flex items-start justify-between">
          <!-- Información de la cita -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <Badge :variant="getEstadoVariant(cita.estado)">
                {{ ESTADOS_CITA_LABELS[cita.estado] }}
              </Badge>
              <span class="text-sm text-gray-500">
                {{ formatearFechaHora(cita.fechaHora) }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Cliente -->
              <div>
                <p class="text-xs text-gray-500 mb-1">Cliente</p>
                <div class="flex items-center gap-2">
                  <div class="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 font-semibold text-xs">
                      {{ obtenerIniciales(cita.cliente?.nombre, cita.cliente?.apellidoPaterno) }}
                    </span>
                  </div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatearNombreCompleto(cita.cliente?.nombre, cita.cliente?.apellidoPaterno,
                      cita.cliente?.apellidoMaterno) }}
                  </p>
                </div>
              </div>

              <!-- Servicio -->
              <div>
                <p class="text-xs text-gray-500 mb-1">Servicio</p>
                <p class="text-sm font-medium text-gray-900">{{ cita.servicio?.nombre }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatearDuracion(cita.servicio?.duracion) }} - {{ formatearPrecio(cita.servicio?.precio) }}
                </p>
              </div>

              <!-- Notas -->
              <div v-if="cita.notas">
                <p class="text-xs text-gray-500 mb-1">Notas</p>
                <p class="text-sm text-gray-700 truncate">{{ cita.notas }}</p>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="relative ml-4" @click.stop>
            <!-- Botón de menú -->
            <button @click="toggleMenu(cita.id)"
              class="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-2">
              <span>Acciones</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Menú desplegable -->
            <div v-if="menuAbierto === cita.id"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <!-- Confirmar cita -->
              <button v-if="cita.estado === 'PENDIENTE'" @click="abrirModalConfirmarCita(cita); menuAbierto = null"
                class="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Confirmar cita
              </button>

              <!-- Completar cita -->
              <button v-if="cita.estado === 'CONFIRMADA'" @click="cambiarEstado(cita, 'COMPLETADA'); menuAbierto = null"
                class="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completar cita
              </button>

              <!-- Separador -->
              <div v-if="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'"
                class="border-t border-gray-200 my-1">
              </div>

              <!-- Recordatorios -->
              <div v-if="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'" class="px-4 py-2">
                <div class="flex items-center gap-1.5">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Recordar por</p>
                  <span v-if="!emailRecordatoriosHabilitado" class="text-xs text-amber-500 font-medium">· Plan Profesional+</span>
                </div>
              </div>

              <button v-if="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'"
                @click="enviarRecordatorioEmail(cita); menuAbierto = null"
                :disabled="enviandoRecordatorio === cita.id || !cita.cliente?.email || !emailRecordatoriosHabilitado"
                class="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :title="!emailRecordatoriosHabilitado ? 'Tu plan no incluye recordatorios por email. Actualiza a Profesional o Premium' : (cita.cliente?.email ? 'Enviar recordatorio por Email' : 'Cliente sin email registrado')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ enviandoRecordatorio === cita.id ? 'Enviando...' : 'Email' }}
              </button>

              <button v-if="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'" disabled
                class="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                title="WhatsApp estará disponible próximamente">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp (Próximamente)
              </button>

              <!-- Separador -->
              <div class="border-t border-gray-200 my-1"></div>

              <!-- Solicitar Pago -->
              <button v-if="cita.estado !== 'CANCELADA'" @click="solicitarPago(cita)"
                class="w-full text-left px-4 py-2 text-sm flex items-center gap-2"
                :class="pagoOnlineHabilitado ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'"
                :title="!pagoOnlineHabilitado ? 'Disponible en Plan Premium' : 'Solicitar pago al cliente'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Solicitar Pago
                <span v-if="!pagoOnlineHabilitado" class="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Premium</span>
              </button>

              <!-- Editar -->
              <button v-if="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'"
                @click="abrirModalEditar(cita); menuAbierto = null"
                class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>

              <!-- Cancelar -->
              <button v-if="cita.estado !== 'CANCELADA'" @click="confirmarCancelar(cita); menuAbierto = null"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen por estado -->
    <div v-if="citasStore.citas.length > 0" class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card bg-yellow-50 border-yellow-200">
        <p class="text-xs text-yellow-900 font-medium">Pendientes</p>
        <p class="text-2xl font-bold text-yellow-900">{{ citasStore.citasPendientes.length }}</p>
      </div>
      <div class="card bg-blue-50 border-blue-200">
        <p class="text-xs text-blue-900 font-medium">Confirmadas</p>
        <p class="text-2xl font-bold text-blue-900">{{ citasStore.citasConfirmadas.length }}</p>
      </div>
      <div class="card bg-green-50 border-green-200">
        <p class="text-xs text-green-900 font-medium">Completadas</p>
        <p class="text-2xl font-bold text-green-900">{{ citasStore.citasCompletadas.length }}</p>
      </div>
      <div class="card bg-red-50 border-red-200">
        <p class="text-xs text-red-900 font-medium">Canceladas</p>
        <p class="text-2xl font-bold text-red-900">{{ citasStore.citasCanceladas.length }}</p>
      </div>
    </div>

    <!-- Panel lateral Crear/Editar Cita -->
    <SlidePanel
      v-model="modalAbierto"
      :title="modoEdicion ? 'Editar Cita' : 'Crear Nueva Cita'"
      :closable="!guardando"
    >
      <AppointmentForm ref="appointmentFormRef" :cita="citaSeleccionada" :loading="guardando" @submit="guardarCita"
        @cancel="cerrarModal" />
    </SlidePanel>

    <!-- Confirm Dialog -->
    <ConfirmDialog ref="confirmDialogRef" title="Cancelar cita"
      :message="`¿Estás seguro de que deseas cancelar esta cita?`"
      description="Esta acción cambiará el estado de la cita a CANCELADA." confirm-text="Cancelar cita"
      @confirm="cancelarCita" @cancel="citaACancelar = null" />

    <!-- Modal de Pago -->
    <PaymentModal :is-open="modalPagoAbierto" :cita="citaParaPago" @close="cerrarModalPago"
      @success="manejarPagoExitoso" />

    <!-- Panel lateral Confirmación WhatsApp/SMS -->
    <SlidePanel
      v-model="modalConfirmacionAbierto"
      title="Enviar Confirmación al Cliente"
      :closable="!enviandoConfirmacion"
    >
      <div v-if="citaParaConfirmar" class="space-y-4">
        <!-- Información de la cita -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-sm text-gray-900 mb-2">Información de la cita</h4>
          <div class="space-y-1 text-sm">
            <p><span class="text-gray-600">Cliente:</span>
              <span class="font-medium">{{ citaParaConfirmar.cliente.nombre }} {{ citaParaConfirmar.cliente.apellido
                }}</span>
            </p>
            <p><span class="text-gray-600">Teléfono:</span>
              <span class="font-medium">{{ citaParaConfirmar.cliente.telefono || 'No disponible' }}</span>
            </p>
            <p><span class="text-gray-600">Servicio:</span>
              <span class="font-medium">{{ citaParaConfirmar.servicio.nombre }}</span>
            </p>
            <p><span class="text-gray-600">Fecha:</span>
              <span class="font-medium">{{ formatearFechaHora(citaParaConfirmar.fechaHora) }}</span>
            </p>
          </div>
        </div>

        <!-- Selección de canal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Canal de envío</label>
          <div class="space-y-2">
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" v-model="canalSeleccionado" value="WHATSAPP" class="mr-3 text-blue-600" />
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span class="text-sm font-medium">WhatsApp</span>
              </div>
            </label>

            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" v-model="canalSeleccionado" value="SMS" class="mr-3 text-blue-600" />
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span class="text-sm font-medium">SMS</span>
              </div>
            </label>

            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" v-model="canalSeleccionado" value="AMBOS" class="mr-3 text-blue-600" />
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <span class="text-sm font-medium">Ambos (WhatsApp + SMS)</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Confirmación de pago -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <label class="flex items-start cursor-pointer">
            <input type="checkbox" v-model="confirmarPago" class="mt-1 mr-3 text-blue-600 rounded" />
            <div>
              <span class="text-sm font-medium text-gray-900">Confirmar pago recibido</span>
              <p class="text-xs text-gray-600 mt-1">
                Marca esta opción si ya recibiste el pago del cliente. Se incluirá en el mensaje de confirmación.
              </p>
            </div>
          </label>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="cerrarModalConfirmacion" :disabled="enviandoConfirmacion"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Cancelar
          </button>
          <button type="button" @click="enviarConfirmacion"
            :disabled="enviandoConfirmacion || !citaParaConfirmar.cliente.telefono"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg v-if="enviandoConfirmacion" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>{{ enviandoConfirmacion ? 'Enviando...' : 'Enviar Confirmación' }}</span>
          </button>
        </div>
      </div>
    </SlidePanel>

    <!-- Panel lateral Confirmar Cita con Pago -->
    <SlidePanel
      v-model="modalConfirmarCitaAbierto"
      title="Confirmar Cita"
      :closable="!confirmandoCita"
    >
      <div v-if="citaAConfirmar" class="space-y-4">
        <!-- Información de la cita -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-sm text-gray-900 mb-2">Información de la cita</h4>
          <div class="space-y-1 text-sm">
            <p><span class="text-gray-600">Cliente:</span>
              <span class="font-medium">{{ citaAConfirmar.cliente.nombre }} {{ citaAConfirmar.cliente.apellido }}</span>
            </p>
            <p><span class="text-gray-600">Servicio:</span>
              <span class="font-medium">{{ citaAConfirmar.servicio.nombre }}</span>
            </p>
            <p><span class="text-gray-600">Fecha:</span>
              <span class="font-medium">{{ formatearFechaHora(citaAConfirmar.fechaHora) }}</span>
            </p>
            <p><span class="text-gray-600">Precio:</span>
              <span class="font-medium">{{ formatearPrecio(citaAConfirmar.servicio.precio) }}</span>
            </p>
          </div>
        </div>

        <!-- Checkbox de pago -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <label class="flex items-start cursor-pointer">
            <input type="checkbox" v-model="pagoRecibido" class="mt-1 mr-3 text-blue-600 rounded" />
            <div>
              <span class="text-sm font-medium text-gray-900">El cliente ya realizó el pago</span>
              <p class="text-xs text-gray-600 mt-1">
                Marca esta opción si el cliente ya pagó por el servicio. Esto ayudará a tener un mejor control de tus
                ingresos.
              </p>
            </div>
          </label>
        </div>

        <!-- Mensaje informativo -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-800">
            Al confirmar, la cita cambiará al estado <strong>CONFIRMADA</strong>.
            {{ pagoRecibido ? ' El pago será registrado.' : '' }}
          </p>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="cerrarModalConfirmarCita" :disabled="confirmandoCita"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Cancelar
          </button>
          <button type="button" @click="confirmarCita" :disabled="confirmandoCita"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg v-if="confirmandoCita" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>{{ confirmandoCita ? 'Confirmando...' : 'Confirmar Cita' }}</span>
          </button>
        </div>
      </div>
    </SlidePanel>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCitasStore } from '../stores/citasStore'
import { usePlanesStore } from '../stores/planesStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import AppointmentForm from '../components/features/AppointmentForm.vue'
import SlidePanel from '../components/common/SlidePanel.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import DatePicker from '../components/common/DatePicker.vue'
import Select from '../components/common/Select.vue'
import Badge from '../components/common/Badge.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import PaymentModal from '../components/payments/PaymentModal.vue'
import { formatearNombreCompleto, formatearPrecio, formatearDuracion, formatearFechaHora } from '../utils/formatters'
import { ESTADOS_CITA_LABELS } from '../utils/constants'

const citasStore = useCitasStore()
const planesStore = usePlanesStore()
const toast = useToast()
const router = useRouter()

// Referencias
const appointmentFormRef = ref(null)
const confirmDialogRef = ref(null)

// Estado del componente
const modalAbierto = ref(false)
const modoEdicion = ref(false)
const citaSeleccionada = ref(null)
const citaACancelar = ref(null)
const guardando = ref(false)

// Estado para confirmación WhatsApp/SMS
const modalConfirmacionAbierto = ref(false)
const citaParaConfirmar = ref(null)
const canalSeleccionado = ref('WHATSAPP')
const confirmarPago = ref(false)
const enviandoConfirmacion = ref(false)

// Estado para confirmar cita con pago
const modalConfirmarCitaAbierto = ref(false)
const citaAConfirmar = ref(null)
const pagoRecibido = ref(false)
const confirmandoCita = ref(false)

// Estado para enviar recordatorio
const enviandoRecordatorio = ref(null)

// Estado para menú desplegable
const menuAbierto = ref(null)

// Estado para modal de pago
const modalPagoAbierto = ref(false)
const citaParaPago = ref(null)

// Filtros
const filtros = ref({
  fecha: '',
  estado: '',
})

// Computed property para verificar si el email está habilitado en el plan
const emailRecordatoriosHabilitado = computed(() => {
  return planesStore.limites?.emailRecordatoriosHabilitado ?? false
})

// Computed para verificar si el pago online está disponible (solo Plan Premium)
const pagoOnlineHabilitado = computed(() => {
  return planesStore.limites?.tipoPlan?.toUpperCase() === 'PREMIUM'
})

const opcionesEstado = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'CONFIRMADA', label: 'Confirmadas' },
  { value: 'COMPLETADA', label: 'Completadas' },
  { value: 'CANCELADA', label: 'Canceladas' },
]

// Métodos
const cargarCitas = async () => {
  try {
    await citasStore.cargarCitas(filtros.value.fecha, filtros.value.estado)
  } catch (error) {
    console.error('[AppointmentsPage] Error al cargar citas:', error)
    toast.error('Error al cargar citas', error.message || 'Intenta de nuevo')
  }
}

const aplicarFiltros = async () => {
  await cargarCitas()
}

const limpiarFiltros = async () => {
  filtros.value = {
    fecha: '',
    estado: '',
  }
  await cargarCitas()
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

const abrirModalCrear = () => {
  modoEdicion.value = false
  citaSeleccionada.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (cita) => {
  modoEdicion.value = true
  citaSeleccionada.value = { ...cita }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  modoEdicion.value = false
  citaSeleccionada.value = null
  guardando.value = false
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

const manejarPagoExitoso = (paymentData) => {
  toast.success('Pago creado', 'La solicitud de pago ha sido enviada al cliente')
  cerrarModalPago()

  // Recargar citas para actualizar cualquier cambio
  citasStore.cargarCitas(filtros.value.fecha, filtros.value.estado)
}

// Solicitar pago: redirige a /planes si no es Premium, abre modal si sí
const solicitarPago = (cita) => {
  menuAbierto.value = null
  if (!pagoOnlineHabilitado.value) {
    router.push({ path: '/planes', query: { upgrade: 'premium', from: '/appointments' } })
    return
  }
  abrirModalPago(cita)
}

const guardarCita = async (datos) => {
  guardando.value = true

  try {

    if (modoEdicion.value) {
      await citasStore.actualizarCita(citaSeleccionada.value.id, datos)
      toast.success('Cita actualizada', 'La cita se actualizó correctamente')
    } else {
      await citasStore.crearCita(datos)
      toast.success('Cita creada', 'La cita se creó correctamente')
    }

    cerrarModal()
  } catch (error) {
    console.error('[AppointmentsPage] Error al guardar cita:', error)
    toast.error(
      'Error al guardar',
      error.message || 'No se pudo guardar la cita'
    )
  } finally {
    guardando.value = false
  }
}

const cambiarEstado = async (cita, nuevoEstado) => {
  try {
    await citasStore.cambiarEstadoCita(cita.id, nuevoEstado)
    toast.success('Estado actualizado', `La cita se marcó como ${ESTADOS_CITA_LABELS[nuevoEstado]}`)
  } catch (error) {
    console.error('[AppointmentsPage] Error al cambiar estado:', error)
    toast.error(
      'Error al cambiar estado',
      error.message || 'No se pudo cambiar el estado'
    )
  }
}

const confirmarCancelar = (cita) => {
  citaACancelar.value = cita
  confirmDialogRef.value?.open()
}

const cancelarCita = async () => {
  if (!citaACancelar.value) return

  confirmDialogRef.value?.setLoading(true)

  try {
    await citasStore.cancelarCita(citaACancelar.value.id)
    toast.success('Cita cancelada', 'La cita se canceló correctamente')
    confirmDialogRef.value?.close()
    citaACancelar.value = null
  } catch (error) {
    console.error('[AppointmentsPage] Error al cancelar cita:', error)
    toast.error(
      'Error al cancelar',
      error.message || 'No se pudo cancelar la cita'
    )
  } finally {
    confirmDialogRef.value?.setLoading(false)
  }
}

// Métodos para confirmación WhatsApp/SMS
const abrirModalConfirmacion = (cita) => {
  citaParaConfirmar.value = cita
  canalSeleccionado.value = 'WHATSAPP'
  confirmarPago.value = false
  modalConfirmacionAbierto.value = true
}

const cerrarModalConfirmacion = () => {
  modalConfirmacionAbierto.value = false
  citaParaConfirmar.value = null
  canalSeleccionado.value = 'WHATSAPP'
  confirmarPago.value = false
}

const enviarConfirmacion = async () => {
  if (!citaParaConfirmar.value) return

  enviandoConfirmacion.value = true

  try {
    await citasStore.enviarConfirmacionCita(
      citaParaConfirmar.value.id,
      canalSeleccionado.value,
      confirmarPago.value
    )

    toast.success('Confirmación enviada', 'Se envió la confirmación al cliente exitosamente')
    cerrarModalConfirmacion()
  } catch (error) {
    console.error('[AppointmentsPage] Error al enviar confirmación:', error)
    toast.error(
      'Error al enviar confirmación',
      error.message || 'No se pudo enviar la confirmación'
    )
  } finally {
    enviandoConfirmacion.value = false
  }
}

// Método para enviar recordatorio por email
const enviarRecordatorioEmail = async (cita) => {
  if (!cita || !cita.cliente?.email) {
    toast.error('Email no disponible', 'El cliente no tiene email registrado')
    return
  }

  enviandoRecordatorio.value = cita.id

  try {
    await citasStore.enviarRecordatorioCita(cita.id, 'email')

    toast.success('Recordatorio enviado', 'Se envió el recordatorio por email al cliente exitosamente')
  } catch (error) {
    console.error('[AppointmentsPage] Error al enviar recordatorio:', error)
    toast.error(
      'Error al enviar recordatorio',
      error.message || 'No se pudo enviar el recordatorio'
    )
  } finally {
    enviandoRecordatorio.value = null
  }
}

// Métodos para confirmar cita con pago
const abrirModalConfirmarCita = (cita) => {
  citaAConfirmar.value = cita
  pagoRecibido.value = false
  modalConfirmarCitaAbierto.value = true
}

const cerrarModalConfirmarCita = () => {
  modalConfirmarCitaAbierto.value = false
  citaAConfirmar.value = null
  pagoRecibido.value = false
}

const confirmarCita = async () => {
  if (!citaAConfirmar.value) return

  confirmandoCita.value = true

  try {
    // Cambiar estado a CONFIRMADA
    await citasStore.cambiarEstadoCita(citaAConfirmar.value.id, 'CONFIRMADA')

    // Si se marcó el pago, registrarlo en el backend
    if (pagoRecibido.value) {
      await citasStore.registrarPago(citaAConfirmar.value.id)
    }

    const mensaje = pagoRecibido.value
      ? 'Cita confirmada y pago registrado'
      : 'Cita confirmada exitosamente'

    toast.success('Cita confirmada', mensaje)
    cerrarModalConfirmarCita()
  } catch (error) {
    console.error('[AppointmentsPage] Error al confirmar cita:', error)
    toast.error(
      'Error al confirmar cita',
      error.message || 'No se pudo confirmar la cita'
    )
  } finally {
    confirmandoCita.value = false
  }
}

// Método para toggle del menú
const toggleMenu = (citaId) => {
  menuAbierto.value = menuAbierto.value === citaId ? null : citaId
}

// Cerrar menú al hacer clic fuera
const cerrarMenuAlClickFuera = (event) => {
  if (!event.target.closest('.relative')) {
    menuAbierto.value = null
  }
}

// Lifecycle
onMounted(async () => {

  // Cargar límites del plan para validar funcionalidades
  await planesStore.cargarLimites().catch(err => {
    console.error('[AppointmentsPage] Error al cargar límites del plan:', err)
  })

  cargarCitas()

  // Agregar listener para cerrar menú al hacer clic fuera
  document.addEventListener('click', cerrarMenuAlClickFuera)
})

onUnmounted(() => {
  document.removeEventListener('click', cerrarMenuAlClickFuera)
})
</script>
