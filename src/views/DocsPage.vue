<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <router-link to="/" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                CC
              </div>
              <span class="font-semibold text-lg text-gray-900">Cita Click</span>
            </router-link>
            <span class="text-gray-300">/</span>
            <span class="text-sm text-gray-600">Documentación</span>
          </div>

          <div class="flex items-center gap-3">
            <router-link
              to="/login"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Empezar gratis
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- Sidebar Navigation -->
        <aside class="w-64 flex-shrink-0 hidden lg:block">
          <div class="sticky top-24">
            <!-- Search -->
            <div class="mb-6">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar..."
                  class="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="space-y-1">
              <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contenido</p>
              <a
                v-for="category in categories"
                :key="category.id"
                :href="`#${category.id}`"
                @click.prevent="scrollToSection(category.id)"
                class="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors"
                :class="activeSection === category.id
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg
                  class="w-5 h-5 flex-shrink-0"
                  :class="activeSection === category.id ? 'text-indigo-600' : 'text-gray-400'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  v-html="getIcon(category.icon)"
                ></svg>
                <span>{{ category.name }}</span>
              </a>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <!-- Hero Section -->
          <div class="mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">
              Documentación de Cita Click
            </h1>
            <p class="text-lg text-gray-600">
              Aprende a utilizar todas las funciones de la plataforma
            </p>
          </div>

          <!-- Quick Start Cards -->
          <section id="inicio-rapido" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('rocket')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Inicio Rápido</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                v-for="guide in quickStartGuides"
                :key="guide.title"
                class="group border border-gray-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white"
                @click="navigateToGuide(guide.link)"
              >
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors">
                    <svg class="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon(guide.icon)"></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {{ guide.title }}
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">
                      {{ guide.description }}
                    </p>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <!-- Gestión de Citas -->
          <section id="gestion-citas" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('calendar')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Gestión de Citas</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Crear una cita"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Abre el menú lateral izquierdo de tu dashboard',
                  'Haz clic en la sección \'Citas\' (icono de calendario)',
                  'En la esquina superior derecha, presiona el botón + Nueva Cita (color azul)',
                  'En el modal que aparece, busca al cliente escribiendo su nombre en el campo de búsqueda',
                  'Si el cliente no existe, haz clic en \'+ Crear nuevo cliente\' y completa sus datos',
                  'Selecciona el servicio que va a recibir el cliente del menú desplegable',
                  'El sistema mostrará la duración estimada y precio del servicio automáticamente',
                  'Elige la fecha haciendo clic en el calendario',
                  'Selecciona la hora disponible de la lista de horarios (los ocupados aparecen en gris)',
                  'Opcionalmente, agrega notas internas sobre preferencias o detalles especiales del cliente',
                  'Si quieres enviar una confirmación al cliente, marca la casilla \'Enviar notificación\'',
                  'Revisa que todos los datos sean correctos',
                  'Haz clic en \'Guardar cita\' para confirmar',
                  'Verás una confirmación verde indicando que la cita fue creada exitosamente'
                ]"
                image-placeholder="crear-cita.png"
                note="Consejo: Puedes crear múltiples citas seguidas sin cerrar el modal usando el botón \'Guardar y crear otra\'"
              />

              <DocCard
                title="Editar una cita existente"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a la lista de citas desde el menú lateral',
                  'Localiza la cita que deseas modificar (puedes usar la barra de búsqueda)',
                  'Haz clic directamente sobre la cita para abrirla',
                  'En el panel de detalles, presiona el botón \'Editar\' (icono de lápiz)',
                  'Modifica los campos que necesites: cliente, servicio, fecha u hora',
                  'Si cambias la fecha u hora, el sistema verificará disponibilidad automáticamente',
                  'Actualiza las notas si es necesario',
                  'Haz clic en \'Guardar cambios\'',
                  'El cliente recibirá una notificación automática si configuraste los recordatorios'
                ]"
                image-placeholder="editar-cita.png"
              />

              <DocCard
                title="Confirmar o cancelar citas"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Accede a la lista completa de citas desde el menú',
                  'Usa los filtros superiores para encontrar citas por estado (Pendiente, Confirmada, etc.)',
                  'Haz clic en la cita que quieres gestionar',
                  'En el menú de 3 puntos (...) en la esquina superior derecha, selecciona una opción:',
                  '• Confirmar cita: Cambia el estado a confirmada y notifica al cliente',
                  '• Cancelar cita: Abre un modal para indicar el motivo de cancelación',
                  'Si cancelas, selecciona el motivo del menú (Cliente no disponible, Reagendar, etc.)',
                  'Opcionalmente escribe un mensaje personalizado que se enviará al cliente',
                  'Marca si deseas reprogramar inmediatamente o solo cancelar',
                  'Confirma la acción haciendo clic en el botón correspondiente',
                  'El sistema actualizará el calendario y liberará ese horario',
                  'El cliente recibirá una notificación por email/SMS según tu configuración'
                ]"
                image-placeholder="confirmar-cita.png"
                note="Las citas canceladas se archivan y puedes verlas en la sección \'Historial\' para referencia futura"
              />

              <DocCard
                title="Marcar cita como completada"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Cuando el cliente asista a su cita, abre los detalles de la cita',
                  'Haz clic en el botón \'Marcar como completada\'',
                  'Si el plan Premium está activo, puedes solicitar pago inmediatamente',
                  'Opcionalmente, agrega notas sobre el servicio realizado',
                  'Califica la asistencia del cliente (opcional pero recomendado)',
                  'La cita se moverá al historial de citas completadas',
                  'Las estadísticas del dashboard se actualizarán automáticamente'
                ]"
                image-placeholder="completar-cita.png"
              />

              <DocCard
                title="Citas recurrentes (Plan Profesional y Premium)"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Al crear una nueva cita, busca la opción \'Cita recurrente\' en el formulario',
                  'Activa el switch de \'Esta es una cita recurrente\'',
                  'Aparecerán opciones de frecuencia: Semanal, Quincenal, Mensual',
                  'Si seleccionas semanal, elige qué días de la semana se repetirá',
                  'Define la cantidad de repeticiones (por ejemplo, 10 sesiones)',
                  'O selecciona una fecha de fin para las repeticiones',
                  'El sistema te mostrará una vista previa del calendario de citas',
                  'Revisa que todas las fechas sean correctas antes de confirmar',
                  'Haz clic en \'Crear serie de citas\'',
                  'Todas las citas se crearán simultáneamente',
                  'Puedes editar o cancelar citas individuales de la serie sin afectar las demás',
                  'Si cancelas la serie completa, se te preguntará si deseas cancelar todas o solo las futuras'
                ]"
                image-placeholder="citas-recurrentes.png"
                premium-feature
                note="Ideal para clientes con tratamientos continuos como terapias, clases o mantenimientos periódicos"
              />

              <DocCard
                title="Ver citas en calendario"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Haz clic en \'Calendario\' en el menú lateral',
                  'Por defecto verás la vista mensual con todas tus citas',
                  'Cambia entre vistas usando los botones superiores: Día, Semana, Mes',
                  'Las citas están codificadas por colores según su estado:',
                  '• Verde: Citas confirmadas',
                  '• Amarillo: Citas pendientes de confirmación',
                  '• Rojo: Citas canceladas',
                  '• Azul: Citas completadas',
                  'Haz clic en cualquier cita para ver sus detalles completos',
                  'Usa los filtros superiores para mostrar solo ciertos tipos de servicios',
                  'Filtra por empleado si tienes múltiples usuarios (Plan Profesional)',
                  'Arrastra y suelta citas para reprogramarlas rápidamente',
                  'Haz clic en un espacio vacío para crear una nueva cita en ese horario',
                  'Exporta tu calendario haciendo clic en \'Exportar\' (formatos PDF o Excel)'
                ]"
                image-placeholder="calendario-citas.png"
                note="Consejo: Usa la vista semanal para planificar mejor tu semana y detectar huecos disponibles"
              />

              <DocCard
                title="Buscar y filtrar citas"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'En la vista de lista de citas, usa la barra de búsqueda superior',
                  'Puedes buscar por nombre de cliente, servicio o notas',
                  'Usa los filtros rápidos para ver solo citas de hoy, esta semana o este mes',
                  'Aplica filtros avanzados haciendo clic en el icono de embudo:',
                  '• Por estado de la cita (Pendiente, Confirmada, Completada, Cancelada)',
                  '• Por rango de fechas personalizado',
                  '• Por tipo de servicio',
                  '• Por empleado asignado (si tienes equipo)',
                  'Combina múltiples filtros para búsquedas específicas',
                  'Guarda tus filtros favoritos con el botón \'Guardar filtro\'',
                  'Ordena los resultados por fecha, cliente o estado haciendo clic en los encabezados',
                  'Exporta la lista filtrada a Excel para análisis externos'
                ]"
                image-placeholder="filtrar-citas.png"
              />
            </div>
          </section>

          <!-- Gestión de Clientes -->
          <section id="gestion-clientes" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('users')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Agregar un cliente nuevo"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Navega a la sección \'Clientes\' desde el menú lateral',
                  'Haz clic en el botón \'+ Nuevo Cliente\' ubicado en la esquina superior derecha',
                  'Completa el nombre completo del cliente (campo obligatorio)',
                  'Ingresa el número de teléfono (se validará el formato automáticamente)',
                  'Añade el correo electrónico del cliente para recibir notificaciones',
                  'Opcionalmente, ingresa la fecha de nacimiento para enviar felicitaciones automáticas',
                  'Selecciona el género si deseas personalizar comunicaciones',
                  'En la sección \'Preferencias\', anota cualquier detalle importante:',
                  '• Alergias o restricciones',
                  '• Preferencias de horario',
                  '• Servicios favoritos',
                  '• Notas especiales sobre el cliente',
                  'Si el cliente tiene redes sociales, agrégalas para referencia',
                  'Define si quieres que reciba recordatorios por SMS, WhatsApp o Email',
                  'Opcionalmente sube una foto de perfil del cliente',
                  'Haz clic en \'Guardar cliente\'',
                  'Verás una confirmación y el cliente aparecerá en tu lista'
                ]"
                image-placeholder="agregar-cliente.png"
                note="Todos los campos excepto el nombre son opcionales, pero mientras más información agregues, mejor podrás personalizar el servicio"
              />

              <DocCard
                title="Importar clientes desde Excel o CSV"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a la sección Clientes y haz clic en el botón \'Importar\'',
                  'Descarga la plantilla de Excel proporcionada por el sistema',
                  'Abre la plantilla y completa los datos de tus clientes:',
                  '• Nombre (obligatorio)',
                  '• Teléfono',
                  '• Email',
                  '• Fecha de nacimiento',
                  '• Notas',
                  'Asegúrate de que los teléfonos incluyan código de país (ej: +52)',
                  'Verifica que los emails tengan formato válido',
                  'Guarda el archivo en formato Excel (.xlsx) o CSV',
                  'Regresa a Cita Click y haz clic en \'Seleccionar archivo\'',
                  'Elige el archivo que acabas de preparar',
                  'El sistema validará los datos y mostrará un resumen',
                  'Revisa las advertencias si algún dato es incorrecto',
                  'Marca la opción \'Enviar notificación de bienvenida\' si lo deseas',
                  'Haz clic en \'Importar clientes\'',
                  'Espera a que se complete el proceso (puede tomar unos minutos si son muchos)',
                  'Recibirás un resumen con clientes importados exitosamente y errores si los hay'
                ]"
                image-placeholder="importar-clientes.png"
                note="Puedes importar hasta 1,000 clientes a la vez. Para cantidades mayores, divide en múltiples archivos"
              />

              <DocCard
                title="Editar información del cliente"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Desde la lista de clientes, usa la barra de búsqueda para encontrar al cliente',
                  'También puedes filtrar por letra inicial o desplazarte por la lista',
                  'Haz clic sobre el nombre del cliente para abrir su perfil completo',
                  'En la vista de perfil, presiona el botón \'Editar\' (icono de lápiz)',
                  'Modifica cualquier campo de información personal',
                  'Actualiza preferencias, alergias o notas según sea necesario',
                  'Si el cliente cambió de número, actualízalo aquí',
                  'Guarda los cambios haciendo clic en \'Actualizar cliente\'',
                  'Los cambios se reflejarán inmediatamente en todas las citas futuras'
                ]"
                image-placeholder="editar-cliente.png"
              />

              <DocCard
                title="Perfil 360° del cliente (Planes Profesional y Premium)"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Abre el perfil del cliente desde la lista',
                  'En la vista de perfil completo verás varias secciones:',
                  'HISTORIAL DE CITAS:',
                  '• Todas las citas pasadas con fechas y servicios',
                  '• Estado de cada cita (completada, cancelada, no asistió)',
                  '• Notas del servicio realizado',
                  'ESTADÍSTICAS DEL CLIENTE:',
                  '• Total gastado hasta la fecha',
                  '• Servicios más frecuentes',
                  '• Tasa de asistencia (% de citas a las que asistió)',
                  '• Promedio de gasto por visita',
                  '• Frecuencia de visitas (cada cuánto viene)',
                  'PREFERENCIAS Y NOTAS:',
                  '• Todas las notas que has agregado sobre el cliente',
                  '• Preferencias de servicios',
                  '• Historial de productos o técnicas usadas',
                  'PRÓXIMAS CITAS:',
                  '• Citas agendadas a futuro',
                  '• Opción para crear nueva cita directamente',
                  'Usa el botón \'Exportar perfil\' para generar un PDF completo',
                  'Comparte insights con tu equipo usando el botón \'Compartir\''
                ]"
                image-placeholder="perfil-360.png"
                premium-feature
                note="Esta vista te ayuda a ofrecer un servicio más personalizado y detectar oportunidades de venta"
              />

              <DocCard
                title="Etiquetar y categorizar clientes"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Abre el perfil del cliente que deseas etiquetar',
                  'En la sección \'Etiquetas\', haz clic en \'+ Agregar etiqueta\'',
                  'Selecciona de las etiquetas predefinidas o crea una nueva:',
                  '• VIP (clientes importantes)',
                  '• Nuevo (menos de 3 visitas)',
                  '• Regular (cliente frecuente)',
                  '• Ocasional (visitas esporádicas)',
                  '• Cumpleaños este mes',
                  '• Requiere seguimiento',
                  'Crea etiquetas personalizadas según tu negocio',
                  'Asigna colores a cada etiqueta para identificación visual',
                  'Usa las etiquetas para filtrar clientes en la lista principal',
                  'Crea campañas de marketing dirigidas a etiquetas específicas',
                  'Las etiquetas aparecerán en el calendario junto al nombre del cliente'
                ]"
                image-placeholder="etiquetar-clientes.png"
                premium-feature
              />

              <DocCard
                title="Eliminar o archivar clientes"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Abre el perfil del cliente que deseas eliminar o archivar',
                  'Haz clic en el menú de 3 puntos (...) en la esquina superior derecha',
                  'Selecciona \'Archivar cliente\' para ocultarlo sin eliminarlo:',
                  '• El cliente no aparecerá en búsquedas ni listas',
                  '• Su historial se conserva completo',
                  '• Puedes restaurarlo en cualquier momento',
                  'O selecciona \'Eliminar cliente\' para borrado permanente:',
                  '• Se te mostrará una advertencia sobre las consecuencias',
                  '• El historial de citas se mantendrá pero sin datos del cliente',
                  '• Esta acción NO se puede deshacer',
                  'Confirma la acción escribiendo el nombre del cliente',
                  'Para ver clientes archivados, activa el filtro \'Mostrar archivados\' en la lista'
                ]"
                image-placeholder="eliminar-cliente.png"
                note="Recomendamos archivar en lugar de eliminar para mantener tu historial de negocio completo"
              />
            </div>
          </section>

          <!-- Servicios -->
          <section id="servicios" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('briefcase')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Servicios</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Crear un servicio nuevo"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Accede a la sección \'Servicios\' desde el menú lateral',
                  'Presiona el botón \'+ Nuevo Servicio\' en la parte superior',
                  'Ingresa el nombre descriptivo del servicio (ej: \'Corte de cabello caballero\')',
                  'Define la duración estimada del servicio:',
                  '• Usa incrementos de 15 minutos para mayor flexibilidad',
                  '• Considera tiempo de preparación y limpieza',
                  'Establece el precio base del servicio',
                  'Selecciona la moneda si manejas múltiples (MXN, USD, etc.)',
                  'En la descripción detallada, explica qué incluye el servicio',
                  'Opcionalmente, sube una imagen representativa del servicio',
                  'Si aplica, define un precio máximo para servicios variables',
                  'Activa \'Permitir reserva online\' si quieres que clientes agenden este servicio',
                  'Marca si requiere depósito o anticipo (Plan Premium)',
                  'Define el porcentaje de depósito si es necesario',
                  'Agrega productos o materiales que se usan en este servicio (para inventario)',
                  'Selecciona qué empleados pueden realizar este servicio (Plan Profesional)',
                  'Establece tiempo de buffer entre citas si necesitas descanso',
                  'Haz clic en \'Guardar servicio\'',
                  'El servicio estará disponible inmediatamente para agendar citas'
                ]"
                image-placeholder="crear-servicio.png"
                note="Define duraciones realistas considerando tiempo de preparación para evitar retrasos en tu agenda"
              />

              <DocCard
                title="Crear paquetes o combos de servicios"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Servicios y haz clic en la pestaña \'Paquetes\'',
                  'Presiona \'+ Nuevo Paquete\'',
                  'Asigna un nombre atractivo al paquete (ej: \'Paquete Novias Completo\')',
                  'Selecciona los servicios individuales que incluye el paquete',
                  'El sistema sumará automáticamente duración y precio total',
                  'Aplica un descuento al paquete (en porcentaje o monto fijo)',
                  'El precio final se mostrará con el ahorro destacado',
                  'Define cuántas sesiones incluye el paquete si aplica',
                  'Establece fecha de vigencia si el paquete es promocional',
                  'Agrega una descripción detallada de lo que incluye',
                  'Sube una imagen atractiva del paquete',
                  'Marca si el paquete es visible para reserva online',
                  'Define términos y condiciones específicos del paquete',
                  'Guarda el paquete',
                  'Los clientes verán el ahorro al seleccionar el paquete en lugar de servicios individuales'
                ]"
                image-placeholder="paquetes-servicios.png"
                premium-feature
                note="Los paquetes ayudan a incrementar el ticket promedio y fidelizar clientes con mejor valor percibido"
              />

              <DocCard
                title="Organizar servicios por categorías"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'En la sección de Servicios, haz clic en \'Gestionar categorías\'',
                  'Presiona \'+ Nueva categoría\'',
                  'Crea categorías lógicas según tu tipo de negocio:',
                  '• Para salones: Cabello, Uñas, Maquillaje, Spa',
                  '• Para consultorios: Consultas, Estudios, Tratamientos, Seguimiento',
                  '• Para talleres: Mantenimiento, Reparación, Personalización',
                  'Asigna un color distintivo a cada categoría para identificación visual',
                  'Opcionalmente, agrega un icono representativo',
                  'Define el orden de visualización (arrastra para reorganizar)',
                  'Guarda las categorías',
                  'Regresa a la lista de servicios',
                  'Edita cada servicio y asígnale su categoría correspondiente',
                  'En el calendario y lista de servicios verás todo organizado por categorías',
                  'Los clientes verán servicios agrupados al hacer reservas online',
                  'Usa las categorías para generar reportes específicos por tipo de servicio'
                ]"
                image-placeholder="categorias-servicios.png"
                premium-feature
              />

              <DocCard
                title="Configurar precios variables o personalizados"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Abre el servicio que tiene precio variable',
                  'Activa la opción \'Precio personalizable\'',
                  'Define un rango de precios (mínimo y máximo)',
                  'Crea opciones de precio predefinidas:',
                  '• Ejemplo para cortes: Corto ($300), Medio ($400), Largo ($500)',
                  'Permite que el empleado ajuste el precio al crear la cita',
                  'Opcionalmente, requiere autorización del administrador para precios fuera de rango',
                  'Agrega notas de guía para tu equipo sobre cuándo aplicar cada precio',
                  'En reportes podrás ver el desglose de precios aplicados',
                  'Configura si el precio se define antes o después del servicio'
                ]"
                image-placeholder="precios-variables.png"
                premium-feature
              />

              <DocCard
                title="Editar o desactivar servicios"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Desde la lista de servicios, busca el que deseas modificar',
                  'Haz clic en el servicio para abrir sus detalles',
                  'Presiona el botón \'Editar\'',
                  'Modifica cualquier campo: nombre, precio, duración, descripción',
                  'Si subes los precios, considera avisar a clientes con citas agendadas',
                  'Para desactivar temporalmente un servicio:',
                  '• Desmarca la opción \'Servicio activo\'',
                  '• El servicio no estará disponible para nuevas citas',
                  '• Las citas ya agendadas con ese servicio no se afectarán',
                  'Para eliminar permanentemente:',
                  '• Haz clic en \'Eliminar servicio\' (menú de 3 puntos)',
                  '• Solo puedes eliminar servicios sin citas activas o futuras',
                  '• Los registros históricos se conservarán',
                  'Guarda los cambios',
                  'El equipo verá los cambios inmediatamente en sus agendas'
                ]"
                image-placeholder="editar-servicio.png"
                note="Mejor desactivar que eliminar para mantener consistencia en reportes históricos"
              />
            </div>
          </section>

          <!-- Recordatorios -->
          <section id="recordatorios" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('bell')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Recordatorios Automáticos</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Configurar recordatorios por SMS (Planes Profesional y Premium)"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Configuración desde el menú principal',
                  'Haz clic en la sección \'Recordatorios\'',
                  'Localiza la tarjeta \'Recordatorios por SMS\'',
                  'Activa el switch \'Enviar recordatorios por SMS\'',
                  'Configura CUÁNDO enviar el recordatorio:',
                  '• 24 horas antes (recomendado para la mayoría)',
                  '• 48 horas antes (para servicios largos)',
                  '• 2 horas antes (recordatorio adicional)',
                  '• Configura múltiples recordatorios si lo deseas',
                  'Personaliza el mensaje del SMS usando variables dinámicas:',
                  '• {cliente} - Nombre del cliente',
                  '• {servicio} - Nombre del servicio',
                  '• {fecha} - Fecha de la cita',
                  '• {hora} - Hora de la cita',
                  '• {negocio} - Nombre de tu negocio',
                  '• {direccion} - Dirección de tu negocio',
                  'Ejemplo: \'Hola {cliente}, te recordamos tu cita para {servicio} mañana a las {hora} en {negocio}\'',
                  'Agrega enlace de confirmación si deseas que el cliente confirme asistencia',
                  'Define si enviar recordatorio solo a citas confirmadas o también a pendientes',
                  'Configura horario de envío (no enviar antes de las 8am ni después de las 8pm)',
                  'Activa notificaciones para ti cuando se envíen los SMS',
                  'Revisa el contador de SMS disponibles en tu plan',
                  'Haz clic en \'Guardar configuración\'',
                  'Los recordatorios se enviarán automáticamente según tu configuración',
                  'Monitorea el historial de SMS enviados en la sección \'Reportes de notificaciones\''
                ]"
                image-placeholder="config-sms.png"
                premium-feature
                note="Plan Profesional: 200 SMS/mes incluidos | Plan Premium: SMS ilimitados | SMS adicionales: $0.50 MXN c/u"
              />

              <DocCard
                title="Configurar recordatorios por WhatsApp (Planes Profesional y Premium)"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'En Configuración → Recordatorios, busca \'WhatsApp\'',
                  'Activa \'Enviar recordatorios por WhatsApp\'',
                  'Si es tu primera vez, conecta tu cuenta de WhatsApp Business:',
                  '• Haz clic en \'Conectar WhatsApp\'',
                  '• Escanea el código QR con WhatsApp en tu celular',
                  '• Autoriza la conexión',
                  '• Espera la confirmación de conexión exitosa',
                  'Configura la frecuencia de recordatorios:',
                  '• Primer recordatorio: 24 horas antes',
                  '• Segundo recordatorio: 2 horas antes (opcional)',
                  'Personaliza el mensaje de WhatsApp con variables:',
                  '• Usa emojis para hacer el mensaje más amigable',
                  '• {cliente}, {servicio}, {fecha}, {hora}, {negocio}',
                  'Agrega botones interactivos (WhatsApp Business):',
                  '• Botón \'Confirmar asistencia\'',
                  '• Botón \'Reagendar\'',
                  '• Botón \'Ver ubicación\'',
                  'Configura mensaje de confirmación cuando el cliente responde',
                  'Define reglas de envío:',
                  '• Solo a clientes que tengan WhatsApp',
                  '• No enviar en días festivos',
                  '• Respetar horario laboral',
                  'Activa confirmación de lectura para saber si el cliente vio el mensaje',
                  'Habilita respuestas automáticas para preguntas frecuentes',
                  'Guarda la configuración',
                  'Prueba enviando un recordatorio de prueba a tu propio WhatsApp',
                  'Monitorea tasa de confirmación en reportes'
                ]"
                image-placeholder="config-whatsapp.png"
                premium-feature
                note="WhatsApp tiene 95% de tasa de apertura vs 20% del email. Reduce inasistencias hasta un 60%"
              />

              <DocCard
                title="Configurar recordatorios por Email"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Configuración → Recordatorios → Email',
                  'Activa \'Enviar recordatorios por email\'',
                  'Configura cuándo enviar (24 o 48 horas antes)',
                  'Personaliza el asunto del email para mejorar tasa de apertura',
                  'Edita la plantilla del email:',
                  '• Usa el editor visual para dar formato',
                  '• Agrega tu logo para profesionalismo',
                  '• Inserta variables dinámicas',
                  '• Incluye detalles de la cita claramente',
                  'Agrega sección con información útil:',
                  '• Instrucciones de cómo llegar',
                  '• Política de cancelación',
                  '• Qué traer o cómo prepararse',
                  'Incluye botón de \'Agregar a calendario\' (iCal)',
                  'Agrega enlace para confirmar o cancelar la cita',
                  'Configura email de recordatorio diferente para servicios específicos',
                  'Define remitente (tu negocio) y email de respuesta',
                  'Agrega enlaces a redes sociales en el footer',
                  'Habilita tracking para saber cuántos abren el email',
                  'Configura recordatorio de seguimiento para citas completadas',
                  'Prueba el email enviándote una prueba',
                  'Guarda y activa'
                ]"
                image-placeholder="config-email.png"
                note="Los emails son gratuitos e ilimitados en todos los planes"
              />

              <DocCard
                title="Ver historial y estadísticas de recordatorios"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Reportes → Notificaciones',
                  'Verás un dashboard con métricas de recordatorios:',
                  '• Total de recordatorios enviados',
                  '• Tasa de entrega por canal (SMS, WhatsApp, Email)',
                  '• Tasa de confirmación de clientes',
                  '• Costo total de SMS en el período',
                  'Filtra por rango de fechas para análisis específicos',
                  'Revisa lista detallada de recordatorios enviados',
                  'Identifica recordatorios fallidos y sus razones:',
                  '• Número inválido',
                  '• Email rebotado',
                  '• WhatsApp no disponible',
                  'Exporta reporte para análisis externos',
                  'Compara efectividad de cada canal',
                  'Identifica clientes que nunca confirman para seguimiento manual'
                ]"
                image-placeholder="stats-recordatorios.png"
                premium-feature
              />
            </div>
          </section>

          <!-- Pagos -->
          <section id="pagos" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('credit-card')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Sistema de Pagos</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Configurar Stripe Connect (Plan Premium)"
                :plan-badges="['PREMIUM']"
                :steps="[
                  'Navega a Configuración desde el menú principal',
                  'Haz clic en la pestaña \'Integraciones\'',
                  'Localiza la tarjeta de \'Stripe Connect\' (procesador de pagos)',
                  'Lee los requisitos antes de comenzar:',
                  '• Identificación oficial vigente',
                  '• Datos bancarios (CLABE interbancaria para México)',
                  '• Información fiscal (RFC)',
                  '• Comprobante de domicilio',
                  'Haz clic en el botón azul \'Conectar con Stripe\'',
                  'Serás redirigido a Stripe para completar el registro',
                  'Completa el formulario de Stripe paso por paso:',
                  'PASO 1 - Información personal:',
                  '• Nombre completo como aparece en identificación',
                  '• Fecha de nacimiento',
                  '• Email de contacto',
                  '• Número telefónico',
                  'PASO 2 - Información del negocio:',
                  '• Nombre legal del negocio',
                  '• Tipo de industria (selecciona Servicios Profesionales)',
                  '• Descripción de lo que vendes',
                  '• URL del sitio web (si tienes)',
                  'PASO 3 - Datos bancarios:',
                  '• País del banco (México)',
                  '• CLABE interbancaria de 18 dígitos',
                  '• Confirma que eres el titular de la cuenta',
                  'PASO 4 - Verificación de identidad:',
                  '• Sube foto de tu INE o pasaporte (frente y reverso)',
                  '• Comprobante de domicilio no mayor a 3 meses',
                  '• RFC si eres persona física con actividad empresarial',
                  'PASO 5 - Revisión y aceptación:',
                  '• Lee los términos y condiciones de Stripe',
                  '• Acepta las comisiones (2.9% + $3 MXN por transacción)',
                  '• Confirma toda la información',
                  'Haz clic en \'Enviar solicitud\'',
                  'Stripe revisará tu solicitud (puede tomar 24-48 horas)',
                  'Recibirás un email cuando tu cuenta sea aprobada',
                  'Regresa a Cita Click y verás el estado \'Conectado\'',
                  'Ya puedes empezar a cobrar con tarjeta',
                  'El dinero se deposita en tu cuenta en 2 días hábiles'
                ]"
                image-placeholder="stripe-connect.png"
                premium-feature
                note="Stripe es la plataforma de pagos más segura del mundo. Tus datos bancarios nunca pasan por Cita Click"
              />

              <DocCard
                title="Solicitar pago a un cliente (Plan Premium)"
                :plan-badges="['PREMIUM']"
                :steps="[
                  'Verifica que tu cuenta de Stripe esté conectada y activa',
                  'Ve a la sección \'Citas\' desde el menú',
                  'Localiza la cita por la cual quieres cobrar',
                  'Haz clic en la cita para abrir sus detalles',
                  'En el panel de acciones, haz clic en los 3 puntos (...)',
                  'Selecciona la opción \'Solicitar pago\'',
                  'Se abrirá un modal con los detalles del cobro',
                  'El sistema pre-llena el monto del servicio automáticamente',
                  'Puedes modificar el monto si hubo cambios o extras',
                  'Agrega el concepto o descripción del pago:',
                  '• Por ejemplo: \'Corte de cabello + tinte\'',
                  '• Sé específico para evitar confusiones',
                  'Opcionalmente agrega una nota para el cliente',
                  'Selecciona el método de envío del link de pago:',
                  '• WhatsApp (más rápido y mayor tasa de pago)',
                  '• SMS (si el cliente no tiene WhatsApp)',
                  '• Email (para comprobante formal)',
                  '• Copiar link (para compartir manualmente)',
                  'Revisa el resumen:',
                  '• Monto a cobrar',
                  '• Comisión de Stripe',
                  '• Total que recibirás en tu cuenta',
                  'Haz clic en \'Generar link de pago\'',
                  'El link se generará y enviará automáticamente',
                  'El cliente recibirá un mensaje con:',
                  '• Nombre de tu negocio',
                  '• Concepto del pago',
                  '• Monto a pagar',
                  '• Link seguro para pagar',
                  'El cliente hace clic en el link',
                  'Ingresa sus datos de tarjeta en la página segura de Stripe',
                  'El pago se procesa instantáneamente',
                  'Ambos reciben confirmación por email',
                  'En Cita Click verás el pago marcado como \'Pagado\'',
                  'El dinero se deposita en tu cuenta bancaria en 2 días hábiles',
                  'Puedes ver el estatus del pago en tiempo real'
                ]"
                image-placeholder="solicitar-pago.png"
                premium-feature
                note="El cliente NO necesita crear cuenta ni descargar app. Paga directamente con cualquier tarjeta en segundos"
              />

              <DocCard
                title="Cobrar depósitos o anticipos (Plan Premium)"
                :plan-badges="['PREMIUM']"
                :steps="[
                  'Configura primero qué servicios requieren depósito:',
                  '• Ve a Servicios',
                  '• Edita el servicio que requiere anticipo',
                  '• Activa \'Requiere depósito\'',
                  '• Define el % o monto fijo del depósito',
                  'Al crear una cita con servicio que requiere depósito:',
                  '• El sistema solicitará el pago automáticamente',
                  '• Genera link de pago del monto del depósito',
                  '• La cita quedará en estado \'Pendiente de pago\'',
                  'Envía el link de pago al cliente',
                  'Una vez que el cliente paga el depósito:',
                  '• La cita cambia a estado \'Confirmada\'',
                  '• Se envía confirmación automática',
                  '• El depósito se marca como pagado',
                  'Al completar el servicio, cobra el monto restante:',
                  '• El sistema calcula automáticamente: Total - Depósito pagado',
                  '• Genera link para el saldo pendiente',
                  '• O acepta efectivo y marca como pagado',
                  'Define política de reembolso en caso de cancelación:',
                  '• Depósito no reembolsable',
                  '• Reembolso parcial',
                  '• Reembolso completo con X horas de anticipación'
                ]"
                image-placeholder="depositos.png"
                premium-feature
                note="Los depósitos reducen cancelaciones de último minuto hasta en 80% y aseguran tu ingreso"
              />

              <DocCard
                title="Ver historial y estadísticas de pagos (Plan Premium)"
                :plan-badges="['PREMIUM']"
                :steps="[
                  'Ve a la sección \'Pagos\' en el menú lateral',
                  'Verás el dashboard principal de pagos con:',
                  'RESUMEN DEL MES:',
                  '• Total cobrado este mes',
                  '• Número de transacciones',
                  '• Ticket promedio',
                  '• Comisiones pagadas a Stripe',
                  '• Neto recibido en tu cuenta',
                  'GRÁFICA DE INGRESOS:',
                  '• Ingresos diarios del mes',
                  '• Comparativa vs mes anterior',
                  '• Proyección de cierre de mes',
                  'LISTA DE TRANSACCIONES:',
                  '• Fecha y hora de cada pago',
                  '• Cliente que pagó',
                  '• Concepto del servicio',
                  '• Monto cobrado',
                  '• Comisión descontada',
                  '• Monto neto',
                  '• Estado (Exitoso, Pendiente, Fallido, Reembolsado)',
                  'Usa filtros para búsquedas específicas:',
                  '• Por rango de fechas',
                  '• Por cliente',
                  '• Por tipo de servicio',
                  '• Por estado del pago',
                  '• Por método (tarjeta, efectivo)',
                  'Haz clic en cualquier transacción para ver detalles completos',
                  'Descarga comprobante en PDF de cada pago',
                  'Los clientes pueden solicitar facturas desde su comprobante',
                  'Exporta todo el historial a Excel para contabilidad:',
                  '• Selecciona período',
                  '• Descarga archivo Excel',
                  '• Entrega a tu contador',
                  'Identifica tendencias y oportunidades:',
                  '• Servicios más rentables',
                  '• Mejores días de la semana',
                  '• Clientes que más gastan',
                  'Configura alertas de depósitos bancarios'
                ]"
                image-placeholder="historial-pagos.png"
                premium-feature
              />

              <DocCard
                title="Gestionar reembolsos y devoluciones (Plan Premium)"
                :plan-badges="['PREMIUM']"
                :steps="[
                  'Ve a la sección Pagos → Historial',
                  'Localiza la transacción que deseas reembolsar',
                  'Haz clic en la transacción para abrir detalles',
                  'Presiona el botón \'Reembolsar pago\'',
                  'Selecciona el tipo de reembolso:',
                  '• Reembolso completo (100% del monto)',
                  '• Reembolso parcial (ingresa monto a devolver)',
                  'Indica el motivo del reembolso:',
                  '• Cancelación del cliente',
                  '• Error en el servicio',
                  '• Cobro duplicado',
                  '• Insatisfacción del cliente',
                  '• Otro (especifica)',
                  'Agrega una nota interna sobre la situación',
                  'Opcionalmente escribe un mensaje para el cliente',
                  'Revisa el resumen:',
                  '• Monto original cobrado',
                  '• Monto a reembolsar',
                  '• Comisión de Stripe (no se reembolsa)',
                  '• Total que se debitará de tu cuenta',
                  'Confirma el reembolso haciendo clic en \'Procesar reembolso\'',
                  'El dinero regresa a la tarjeta del cliente en 5-10 días hábiles',
                  'El cliente recibe notificación del reembolso',
                  'La transacción se marca como \'Reembolsada\' en el historial',
                  'Puedes ver todos los reembolsos en el reporte mensual',
                  'IMPORTANTE: Las comisiones de Stripe NO se reembolsan'
                ]"
                image-placeholder="reembolsos.png"
                premium-feature
                note="Los reembolsos parciales son útiles cuando el cliente no está completamente satisfecho pero acepta un descuento"
              />

              <DocCard
                title="Configurar métodos de pago adicionales"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Además de pagos con tarjeta (Premium), puedes registrar otros métodos:',
                  'Ve a Configuración → Pagos',
                  'Activa los métodos que aceptas en tu negocio:',
                  '• Efectivo (disponible en todos los planes)',
                  '• Transferencia bancaria',
                  '• Tarjeta de débito en terminal física',
                  '• Tarjeta de crédito en terminal física',
                  '• Otro (personalizable)',
                  'Para cada método, define:',
                  '• Si requiere comprobante',
                  '• Si genera factura automáticamente',
                  '• Instrucciones para el cliente',
                  'Al registrar un pago en efectivo:',
                  '• Abre la cita',
                  '• Marca como pagado',
                  '• Selecciona \'Efectivo\' como método',
                  '• Registra el monto recibido',
                  '• Si diste cambio, el sistema lo calcula',
                  '• Genera recibo para el cliente',
                  'Los pagos en efectivo se incluyen en reportes financieros',
                  'Puedes cerrar caja al final del día y cuadrar contra los pagos registrados'
                ]"
                image-placeholder="metodos-pago.png"
              />
            </div>
          </section>

          <!-- Reportes -->
          <section id="reportes" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('chart')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Reportes y Análisis</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Dashboard de métricas"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Accede al Dashboard desde el menú principal',
                  'Visualiza citas del día, semana y mes',
                  'Revisa ingresos y tendencias',
                  'Identifica los servicios más solicitados'
                ]"
                image-placeholder="dashboard-metricas.png"
              />

              <DocCard
                title="Reportes avanzados con exportación"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a \'Reportes\' en el menú',
                  'Selecciona el tipo de reporte (citas, ingresos, clientes)',
                  'Define el rango de fechas',
                  'Visualiza gráficas y estadísticas',
                  'Exporta a PDF o Excel'
                ]"
                image-placeholder="reportes-avanzados.png"
                premium-feature
              />
            </div>
          </section>

          <!-- Multi-usuario -->
          <section id="multi-usuario" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('user-group')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Multi-usuario y Roles</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Agregar usuarios al equipo"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Configuración → Usuarios',
                  'Haz clic en \'+ Agregar Usuario\'',
                  'Ingresa email y datos del usuario',
                  'Asigna un rol (Admin, Empleado, Recepcionista)',
                  'Envía la invitación',
                  'El usuario recibirá un email para activar su cuenta'
                ]"
                image-placeholder="agregar-usuario.png"
                premium-feature
              />

              <DocCard
                title="Roles y permisos"
                :plan-badges="['PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Owner: Acceso total, gestión de suscripción',
                  'Admin: Gestión completa excepto facturación',
                  'Empleado: Crear/editar citas y clientes',
                  'Recepcionista: Solo confirmar/cancelar citas'
                ]"
                image-placeholder="roles-permisos.png"
                premium-feature
              />
            </div>
          </section>

          <!-- Multi-sucursal -->
          <section id="multi-sucursal" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('building')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Multi-sucursal</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Crear una sucursal"
                :plan-badges="['PREMIUM']"
                :steps="[
                  'Ve a Configuración → Sucursales',
                  'Haz clic en \'+ Nueva Sucursal\'',
                  'Ingresa nombre y dirección',
                  'Asigna servicios disponibles',
                  'Asigna usuarios a la sucursal',
                  'Guarda la sucursal'
                ]"
                image-placeholder="crear-sucursal.png"
                premium-feature
              />

              <DocCard
                title="Cambiar entre sucursales"
                :plan-badges="['PREMIUM']"
                :steps="[
                  'En el header superior, verás un selector de sucursal',
                  'Haz clic y selecciona la sucursal',
                  'Todas las citas y clientes se filtrarán por sucursal',
                  'Puedes ver reportes consolidados o por sucursal'
                ]"
                image-placeholder="cambiar-sucursal.png"
                premium-feature
              />
            </div>
          </section>

          <!-- Configuración -->
          <section id="configuracion" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('cog')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Configuración</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Configurar horarios de atención"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Configuración → Horarios',
                  'Define tu horario por día de la semana',
                  'Marca días no laborables',
                  'Establece descansos o pausas',
                  'Guarda los cambios'
                ]"
                image-placeholder="config-horarios.png"
              />

              <DocCard
                title="Personalizar notificaciones"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Configuración → Notificaciones',
                  'Activa/desactiva notificaciones por email',
                  'Configura notificaciones push',
                  'Define para qué eventos recibir alertas'
                ]"
                image-placeholder="config-notificaciones.png"
              />
            </div>
          </section>

          <!-- Planes y Facturación -->
          <section id="planes-facturacion" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('currency')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Planes y Facturación</h2>
            </div>

            <div class="space-y-6">
              <DocCard
                title="Cambiar de plan"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Plan y Facturación',
                  'Haz clic en \'Cambiar o Actualizar Plan\'',
                  'Selecciona el nuevo plan',
                  'Revisa el resumen de cambios',
                  'Confirma el cambio',
                  'El cobro se ajustará proporcionalmente'
                ]"
                image-placeholder="cambiar-plan.png"
              />

              <DocCard
                title="Ver historial de facturas"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Plan y Facturación → Facturas',
                  'Visualiza todas tus facturas',
                  'Descarga facturas en PDF',
                  'Revisa próximo cobro y método de pago'
                ]"
                image-placeholder="historial-facturas.png"
              />

              <DocCard
                title="Cancelar suscripción"
                :plan-badges="['BASICO', 'PROFESIONAL', 'PREMIUM']"
                :steps="[
                  'Ve a Plan y Facturación',
                  'Scroll hasta el final',
                  'Haz clic en \'Cancelar Suscripción\'',
                  'Confirma la cancelación',
                  'Tu plan seguirá activo hasta el final del período pagado'
                ]"
                image-placeholder="cancelar-suscripcion.png"
                note="Puedes cancelar en cualquier momento sin penalización"
              />
            </div>
          </section>

          <!-- FAQ -->
          <section id="faq" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('question')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h2>
            </div>

            <div class="space-y-3">
              <FaqItem
                question="¿Puedo probar Cita Click antes de pagar?"
                answer="Sí, todos los planes incluyen 7 días de prueba gratis. No necesitas tarjeta de crédito para comenzar."
              />

              <FaqItem
                question="¿Puedo cambiar de plan en cualquier momento?"
                answer="Sí, puedes actualizar o bajar de plan cuando quieras. El cambio se refleja inmediatamente y el cobro se ajusta proporcionalmente."
              />

              <FaqItem
                question="¿Cómo funcionan los recordatorios automáticos?"
                answer="Los recordatorios se envían automáticamente a tus clientes por SMS o WhatsApp según tu configuración. Tú defines cuántas horas antes de la cita se envían."
              />

              <FaqItem
                question="¿Necesito conocimientos técnicos para usar Cita Click?"
                answer="No, Cita Click está diseñado para ser intuitivo y fácil de usar. No necesitas conocimientos técnicos, todo es visual y guiado."
              />

              <FaqItem
                question="¿Mis datos están seguros?"
                answer="Sí, utilizamos encriptación de grado bancario y cumplimos con todas las normativas de protección de datos. Tus datos nunca se comparten con terceros."
              />

              <FaqItem
                question="¿Puedo exportar mis datos?"
                answer="Sí, puedes exportar reportes en PDF y Excel en cualquier momento. También puedes solicitar una exportación completa de tus datos si lo necesitas."
              />
            </div>
          </section>

          <!-- Soporte -->
          <section id="soporte" class="mb-16">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon('chat')"></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Soporte y Contacto</h2>
            </div>

            <div class="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div class="max-w-2xl mx-auto text-center">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  ¿No encontraste lo que buscabas?
                </h3>
                <p class="text-gray-600 mb-6">
                  Nuestro equipo de soporte está listo para ayudarte
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">Email</h4>
                    <p class="text-sm text-gray-600">soporte@citaclick.com</p>
                  </div>

                  <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">WhatsApp</h4>
                    <p class="text-sm text-gray-600">+52 123 456 7890</p>
                  </div>

                  <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">Chat en vivo</h4>
                    <p class="text-sm text-gray-600">Disponible 9am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-gray-50 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-gray-600">
          <p>© 2024 Cita Click. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DocCard from '@/components/docs/DocCard.vue'
import FaqItem from '@/components/docs/FaqItem.vue'

const searchQuery = ref('')
const activeSection = ref('inicio-rapido')

const categories = [
  { id: 'inicio-rapido', name: 'Inicio Rápido', icon: 'rocket' },
  { id: 'gestion-citas', name: 'Gestión de Citas', icon: 'calendar' },
  { id: 'gestion-clientes', name: 'Gestión de Clientes', icon: 'users' },
  { id: 'servicios', name: 'Servicios', icon: 'briefcase' },
  { id: 'recordatorios', name: 'Recordatorios', icon: 'bell' },
  { id: 'pagos', name: 'Sistema de Pagos', icon: 'credit-card' },
  { id: 'reportes', name: 'Reportes', icon: 'chart' },
  { id: 'multi-usuario', name: 'Multi-usuario', icon: 'user-group' },
  { id: 'multi-sucursal', name: 'Multi-sucursal', icon: 'building' },
  { id: 'configuracion', name: 'Configuración', icon: 'cog' },
  { id: 'planes-facturacion', name: 'Planes', icon: 'currency' },
  { id: 'faq', name: 'FAQ', icon: 'question' },
  { id: 'soporte', name: 'Soporte', icon: 'chat' }
]

const getIcon = (iconName) => {
  const icons = {
    'rocket': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
    'calendar': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
    'users': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>',
    'briefcase': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
    'bell': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>',
    'credit-card': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>',
    'chart': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
    'user-group': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>',
    'building': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
    'cog': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    'currency': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'question': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'chat': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>'
  }
  return icons[iconName] || icons['question']
}

const quickStartGuides = [
  {
    title: 'Configura tu negocio',
    description: 'Completa la información básica de tu negocio, horarios y servicios',
    icon: 'cog',
    link: '#configuracion'
  },
  {
    title: 'Agrega tus primeros clientes',
    description: 'Importa o crea manualmente tu base de clientes',
    icon: 'users',
    link: '#gestion-clientes'
  },
  {
    title: 'Crea tu primera cita',
    description: 'Aprende a agendar citas de manera rápida y sencilla',
    icon: 'calendar',
    link: '#gestion-citas'
  },
  {
    title: 'Activa recordatorios',
    description: 'Configura SMS y WhatsApp para reducir ausencias',
    icon: 'bell',
    link: '#recordatorios'
  }
]

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const navigateToGuide = (link) => {
  if (link.startsWith('#')) {
    const sectionId = link.substring(1)
    scrollToSection(sectionId)
  }
}

const handleScroll = () => {
  const sections = categories.map(cat => cat.id)
  const scrollPosition = window.scrollY + 100

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i])
    if (section && section.offsetTop <= scrollPosition) {
      activeSection.value = sections[i]
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
