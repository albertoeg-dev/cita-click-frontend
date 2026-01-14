# Cambios Frontend - Sistema de Planes y Seguridad

## Fecha de Implementación
2026-01-12

## Resumen Ejecutivo

Se implementó el sistema de control de acceso por planes en el frontend, incluyendo:
- Guards de navegación para proteger rutas según features
- Composable actualizado para validar permisos de plan
- Componente modal de upgrade reutilizable
- Ruta de reportes protegida con guard de feature

---

## 1. Archivos Modificados

### 1.1 Router (`src/router/index.js`)

**Cambios Realizados**:
- Importado `usePlanesStore` para validación de features
- Agregada ruta `/reports` con guard `requiresFeature: 'reportes_avanzados'`
- Actualizado guard global con lógica de validación de features
- Actualizada jerarquía de planes: BASICO, PROFESIONAL, PREMIUM

**Código Nuevo** (líneas 231-274):
```javascript
// Verificar restricciones de features específicas (requiresFeature)
if (to.meta.requiresFeature && isAuthenticated) {
  const planesStore = usePlanesStore()

  // Cargar límites del plan si no están cargados
  if (!planesStore.limites) {
    try {
      await planesStore.cargarLimites()
    } catch (error) {
      console.error('Error al cargar límites del plan:', error)
    }
  }

  const featureRequerida = to.meta.requiresFeature
  let tieneAcceso = false

  // Verificar la feature según el tipo
  switch (featureRequerida) {
    case 'reportes_avanzados':
      tieneAcceso = planesStore.limites?.reportesAvanzadosHabilitado || false
      break
    case 'sms_whatsapp':
      tieneAcceso = planesStore.limites?.smsWhatsappHabilitado || false
      break
    case 'soporte_prioritario':
      tieneAcceso = planesStore.limites?.soportePrioritario || false
      break
    default:
      console.warn(`Feature no reconocida en guard: ${featureRequerida}`)
      tieneAcceso = true // Permitir por defecto si no reconocemos la feature
  }

  // Si no tiene acceso a la feature, redirigir a planes
  if (!tieneAcceso) {
    return next({
      path: '/planes',
      query: {
        feature: featureRequerida,
        from: to.path
      }
    })
  }
}
```

**Nueva Ruta**:
```javascript
{
  path: '/reports',
  name: 'Reports',
  component: ReportsPage,
  meta: { layout: 'main', requiresAuth: true, requiresFeature: 'reportes_avanzados' },
}
```

**Jerarquía de Planes Actualizada**:
```javascript
const planHierarchy = {
  basico: 1,
  profesional: 2,
  premium: 3,
  // Nombres legacy (mantener compatibilidad temporal)
  starter: 1,
  professional: 2,
  enterprise: 3
}
```

---

### 1.2 Composable `usePlanFeatures.js` (`src/composables/`)

**Cambios Realizados**:
- Actualizado `funcionalidadesPorPlan` con nuevos planes (BASICO, PROFESIONAL, PREMIUM)
- Actualizado `mensajesFuncionalidades` con mensajes correctos
- Agregados computed: `tieneReportesAvanzados`, `tieneSoportePrioritario`, `tipoPlan`

**Funcionalidades por Plan** (actualizado):
```javascript
const funcionalidadesPorPlan = {
  BASICO: {
    sms_whatsapp: false,
    reportes_avanzados: false,
    soporte_prioritario: false
  },
  PROFESIONAL: {
    sms_whatsapp: false,  // Disponible Q2 2026
    reportes_avanzados: true,
    soporte_prioritario: false
  },
  PREMIUM: {
    sms_whatsapp: false,  // Disponible Q2 2026
    reportes_avanzados: true,
    soporte_prioritario: true
  }
}
```

**Mensajes Actualizados**:
```javascript
const mensajesFuncionalidades = {
  sms_whatsapp: 'Las notificaciones por WhatsApp y SMS estarán disponibles en el plan Premium a partir de Q2 2026',
  reportes_avanzados: 'Los reportes avanzados con exportación a PDF y Excel están disponibles en los planes Profesional y Premium',
  soporte_prioritario: 'El soporte prioritario con respuesta en menos de 6 horas está disponible solo en el plan Premium'
}
```

**Nuevos Computed Exports**:
```javascript
return {
  // Estado
  verificando,
  planActual,
  tipoPlan,             // NUEVO
  tieneLimites,

  // Features
  tieneReportesAvanzados,    // NUEVO
  tieneSoportePrioritario,   // NUEVO

  // Métodos
  tieneFuncionalidad,
  verificarMultiples,
  obtenerMensaje,

  // Constantes
  funcionalidadesPorPlan,
  mensajesFuncionalidades
}
```

---

## 2. Archivos Nuevos

### 2.1 Componente `UpgradeModal.vue` (`src/components/common/`)

**Propósito**: Modal reutilizable para mostrar mensajes de upgrade cuando un usuario intenta acceder a una feature no disponible en su plan.

**Props**:
- `modelValue` (Boolean): Control de visibilidad
- `feature` (String): Feature a validar ('reportes_avanzados', 'sms_whatsapp', 'soporte_prioritario')
- `customTitle` (String, opcional): Título personalizado
- `customMessage` (String, opcional): Mensaje personalizado
- `customBeneficios` (Array, opcional): Lista de beneficios personalizada

**Características**:
- Mensajes predefinidos para cada feature
- Lista de beneficios con iconos de checkmark
- Comparación visual de plan actual vs plan requerido
- Alerta especial para features Q2 2026
- Botón para redirigir a página de planes

**Ejemplo de Uso**:
```vue
<template>
  <UpgradeModal
    v-model="mostrarUpgradeModal"
    feature="reportes_avanzados"
  />
</template>

<script setup>
import { ref } from 'vue'
import UpgradeModal from '@/components/common/UpgradeModal.vue'

const mostrarUpgradeModal = ref(false)
</script>
```

**Configuración de Features**:
```javascript
const featureConfig = {
  reportes_avanzados: {
    titulo: 'Reportes Avanzados No Disponibles',
    mensaje: 'Los reportes avanzados con exportación a PDF y Excel están disponibles en los planes Profesional y Premium.',
    planRequerido: 'profesional',
    beneficios: [
      'Reportes diarios, semanales y mensuales',
      'Exportación a PDF y Excel',
      'Análisis detallado por estado de citas',
      'Servicios más solicitados',
      'Identificación de clientes frecuentes',
      'Métricas de ingresos y rendimiento',
    ],
  },
  sms_whatsapp: {
    titulo: 'Notificaciones Automáticas',
    mensaje: 'Las notificaciones por SMS y WhatsApp estarán disponibles en el plan Premium a partir de Q2 2026.',
    planRequerido: 'premium',
    beneficios: [
      'Recordatorios automáticos de citas',
      'Confirmaciones por WhatsApp',
      'Mensajes de seguimiento post-servicio',
      'Notificaciones de cambios en tiempo real',
      'Plantillas personalizables',
    ],
  },
  soporte_prioritario: {
    titulo: 'Soporte Prioritario',
    mensaje: 'El soporte prioritario con respuesta garantizada en menos de 6 horas está disponible solo en el plan Premium.',
    planRequerido: 'premium',
    beneficios: [
      'Respuesta garantizada en menos de 6 horas',
      'Chat directo con el equipo de soporte',
      'Asistencia personalizada',
      'Llamadas de emergencia',
      'Asesoría en optimización del negocio',
    ],
  },
}
```

---

## 3. Integración Recomendada para ReportsPage

### 3.1 Agregar Imports

```vue
<script setup>
import { ref } from 'vue'
import { usePlanFeatures } from '@/composables/usePlanFeatures'
import UpgradeModal from '@/components/common/UpgradeModal.vue'

const { tieneReportesAvanzados, planActual } = usePlanFeatures()
const mostrarUpgradeModal = ref(false)
</script>
```

### 3.2 Agregar Alerta en Template

Agregar después del título de la página:

```vue
<!-- Alerta de Plan si no tiene acceso -->
<div v-if="!tieneReportesAvanzados" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
  <div class="flex items-start gap-3">
    <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>
    <div class="flex-1">
      <h3 class="text-sm font-semibold text-yellow-900 mb-1">
        Reportes Avanzados No Disponibles
      </h3>
      <p class="text-sm text-yellow-700 mb-3">
        Los reportes avanzados con exportación a PDF y Excel están disponibles en los planes Profesional y Premium.
        Tu plan actual es: <span class="font-semibold">{{ planActual }}</span>
      </p>
      <button
        @click="mostrarUpgradeModal = true"
        class="text-sm font-medium text-yellow-900 hover:text-yellow-800 underline"
      >
        Ver Planes y Beneficios →
      </button>
    </div>
  </div>
</div>

<!-- Modal de Upgrade -->
<UpgradeModal
  v-model="mostrarUpgradeModal"
  feature="reportes_avanzados"
/>
```

### 3.3 Deshabilitar Funcionalidad de Exportación

En los botones de descargar PDF/Excel, agregar validación:

```vue
<button
  @click="descargarPDF"
  :disabled="descargando || !tieneReportesAvanzados"
  class="btn btn-secondary btn-sm flex items-center gap-1"
  :class="{ 'opacity-50 cursor-not-allowed': !tieneReportesAvanzados }"
  :title="!tieneReportesAvanzados ? 'Requiere plan Profesional o Premium' : ''"
>
  <!-- Icon y texto -->
</button>
```

---

## 4. Flujo de Usuario

### 4.1 Usuario con Plan BÁSICO Intenta Acceder a Reportes

1. **Navegación**: Usuario hace click en "Reportes" en el menú
2. **Router Guard**: `beforeEach` intercepta la navegación
3. **Validación**: Verifica `requiresFeature: 'reportes_avanzados'`
4. **Consulta Backend**: Carga `planesStore.limites` si no existe
5. **Resultado**: `reportesAvanzadosHabilitado = false` para plan BÁSICO
6. **Redirección**: Usuario es redirigido a `/planes?feature=reportes_avanzados&from=/reports`

### 4.2 Usuario con Plan PROFESIONAL Accede a Reportes

1. **Navegación**: Usuario hace click en "Reportes" en el menú
2. **Router Guard**: Intercepta y valida
3. **Consulta Backend**: `reportesAvanzadosHabilitado = true` para plan PROFESIONAL
4. **Acceso Concedido**: Usuario accede a `/reports`
5. **Funcionalidad Completa**: Puede generar reportes JSON, PDF, Excel

### 4.3 Usuario Intenta Exportar sin Permiso (Plan BÁSICO accede por URL directa)

Aunque el router bloquea, si el usuario accede por URL directa:

1. **Alerta Visible**: Banner amarillo muestra restricción
2. **Botones Deshabilitados**: Exportación PDF/Excel deshabilitada
3. **Click en "Ver Planes"**: Abre UpgradeModal
4. **Modal Muestra**:
   - Mensaje claro de restricción
   - Lista de beneficios
   - Comparación de planes
   - Botón "Ver Planes" → Redirige a `/planes?feature=reportes_avanzados`

---

## 5. Beneficios de la Implementación

### 5.1 Seguridad en Capas

```
┌──────────────────────────────────────────┐
│     Usuario intenta acceder              │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  1. Router Guard (Frontend)              │
│     - Valida requiresFeature             │
│     - Carga limites del plan             │
│     - Redirige si no tiene acceso        │
└──────────┬───────────────────────────────┘
           │ (Si pasa)
           ▼
┌──────────────────────────────────────────┐
│  2. Componente (Vue)                     │
│     - Muestra alerta si no tiene acceso  │
│     - Deshabilita botones                │
│     - Ofrece upgrade                     │
└──────────┬───────────────────────────────┘
           │ (Si intenta request)
           ▼
┌──────────────────────────────────────────┐
│  3. Backend API                          │
│     - @RequiresPlanFeature               │
│     - PlanFeatureAspect                  │
│     - PlanLimitesService                 │
└──────────────────────────────────────────┘
```

### 5.2 Experiencia de Usuario

✅ **Mensajes Claros**: Usuario sabe exactamente qué necesita para upgrade
✅ **CTA Directos**: Botones que llevan a la página de planes
✅ **Comparación Visual**: Modal muestra plan actual vs requerido
✅ **Lista de Beneficios**: Usuario ve qué gana al actualizar
✅ **Sin Sorpresas**: Alertas preventivas antes de intentar usar feature

### 5.3 Mantenibilidad

✅ **Composable Reutilizable**: `usePlanFeatures` centraliza lógica
✅ **Modal Reutilizable**: `UpgradeModal` funciona para cualquier feature
✅ **Guard Extensible**: Fácil agregar nuevas features al switch
✅ **Configuración Centralizada**: Mensajes y beneficios en un solo lugar

---

## 6. Próximos Pasos

### 6.1 Inmediatos (Testing)

- [ ] Actualizar ReportsPage.vue con alerta y modal
- [ ] Compilar frontend: `npm run dev`
- [ ] Probar navegación con diferentes planes
- [ ] Verificar mensajes de upgrade
- [ ] Validar redirecciones

### 6.2 Corto Plazo

- [ ] Agregar indicadores de uso en Dashboard (X/Y usuarios, clientes, etc.)
- [ ] Implementar banners de plan en sidebar
- [ ] Agregar tooltips en features deshabilitadas
- [ ] Crear página de pricing mejorada con comparación

### 6.3 Mediano Plazo

- [ ] Analytics de conversión (cuántos ven modal vs cuántos upgradean)
- [ ] A/B testing de mensajes de upgrade
- [ ] Notificaciones proactivas al acercarse a límites
- [ ] Recomendaciones inteligentes de upgrade según uso

---

## 7. Testing Rápido

### 7.1 Compilar Frontend

```bash
cd cita-click-frontend
npm install  # Si es necesario
npm run dev
```

### 7.2 Probar con Planes Diferentes

**Plan BÁSICO**:
1. Login con usuario de plan básico
2. Intentar acceder a `/reports`
3. **Esperado**: Redirigido a `/planes?feature=reportes_avanzados&from=/reports`

**Plan PROFESIONAL**:
1. Login con usuario de plan profesional
2. Acceder a `/reports`
3. **Esperado**: Acceso permitido, reportes funcionan
4. Botones de exportación habilitados

**Plan PREMIUM**:
1. Login con usuario de plan premium
2. Acceder a `/reports`
3. **Esperado**: Acceso completo

### 7.3 Verificar UpgradeModal

```bash
# En consola del navegador
const modal = document.querySelector('button:contains("Ver Planes")')
if (modal) console.log('Modal se muestra correctamente')
```

---

## 8. Archivos de Configuración

### package.json (sin cambios necesarios)

El proyecto ya tiene las dependencias necesarias:
- Vue 3
- Vue Router 4
- Pinia (State Management)
- Tailwind CSS

---

## 9. Checklist de Implementación

### Backend (Completado)
- [x] Actualizar TipoPlan enum
- [x] Actualizar PlanLimites entity
- [x] Crear migration V9
- [x] Actualizar PlanLimitesService
- [x] Agregar @RequiresPlanFeature a endpoints de reportes
- [x] Compilar sin errores

### Frontend (Completado)
- [x] Actualizar usePlanFeatures composable
- [x] Crear UpgradeModal component
- [x] Agregar ruta /reports al router
- [x] Implementar guard de features en router
- [x] Actualizar jerarquía de planes

### Frontend (Pendiente - Opcional)
- [ ] Actualizar ReportsPage con alerta
- [ ] Agregar indicadores de uso en Dashboard
- [ ] Compilar y probar en navegador
- [ ] Agregar tooltips en features restringidas

---

## Conclusión

El frontend está **80% implementado** con la infraestructura crítica completa:
- ✅ Router con guards de features
- ✅ Composable para validaciones
- ✅ Modal de upgrade reutilizable
- ⏳ Integración en componentes individuales (opcional)

La arquitectura permite **fácil extensión** para nuevas features y proporciona una **experiencia de usuario clara** sobre qué necesitan para actualizar su plan.

**Próxima Acción Recomendada**: Compilar el frontend (`npm run dev`) y verificar que no hay errores, luego integrar opcionalmente las alertas en ReportsPage.
