# Control de Funcionalidades por Plan

Sistema completo para controlar el acceso a funcionalidades según el plan de suscripción del usuario.

## Componentes Disponibles

### 1. Composable `usePlanFeatures`

Composable para verificar disponibilidad de funcionalidades desde cualquier componente.

```javascript
import { usePlanFeatures } from '@/composables/usePlanFeatures'

const { tieneFuncionalidad, obtenerMensaje, planActual } = usePlanFeatures()

// Verificar una funcionalidad
const tieneWhatsApp = await tieneFuncionalidad('sms_whatsapp')

// Verificar múltiples funcionalidades
const resultados = await verificarMultiples(['sms_whatsapp', 'reportes_avanzados'])

// Obtener mensaje descriptivo
const mensaje = obtenerMensaje('api_publica')
```

### 2. Directiva `v-requires-feature`

Directiva global para controlar elementos en el template.

#### Modo: Hide (Ocultar - por defecto)

```vue
<button v-requires-feature="'sms_whatsapp'">
  Enviar WhatsApp
</button>
```

#### Modo: Disable (Deshabilitar)

```vue
<button v-requires-feature="{ feature: 'reportes_avanzados', mode: 'disable' }">
  Generar Reporte Avanzado
</button>
```

#### Modo: Blur (Difuminar)

```vue
<div v-requires-feature="{ feature: 'google_calendar', mode: 'blur' }">
  <h3>Integración con Google Calendar</h3>
  <p>Sincroniza tus citas automáticamente...</p>
</div>
```

#### Modo: Tooltip (Solo mostrar mensaje)

```vue
<div v-requires-feature="{
  feature: 'white_label',
  mode: 'tooltip',
  message: 'Personalización White Label disponible solo en Enterprise'
}">
  Configuración de marca
</div>
```

### 3. Componente `FeatureGate`

Componente wrapper para mostrar contenido condicionalmente con mensaje de upgrade.

#### Uso Básico

```vue
<FeatureGate feature="sms_whatsapp">
  <!-- Este contenido solo se muestra si el plan tiene la funcionalidad -->
  <div>
    <h3>Notificaciones WhatsApp</h3>
    <button @click="enviarWhatsApp">Enviar mensaje</button>
  </div>
</FeatureGate>
```

#### Con Mensaje Personalizado

```vue
<FeatureGate
  feature="reportes_avanzados"
  title="Reportes Avanzados"
  message="Obtén insights profundos sobre tu negocio con reportes avanzados"
  :show-learn-more="true"
  @learn-more="mostrarDemo"
>
  <ReportesAvanzados />
</FeatureGate>
```

#### Con Slot Personalizado para Locked State

```vue
<FeatureGate feature="api_publica">
  <!-- Contenido cuando tiene acceso -->
  <ApiKeyManager />

  <!-- Mensaje personalizado cuando no tiene acceso -->
  <template #locked>
    <div class="custom-locked-message">
      <h3>Acceso API Público</h3>
      <p>Integra Cita Click con tus sistemas externos</p>
      <button @click="contactarVentas">Contactar Ventas</button>
    </div>
  </template>
</FeatureGate>
```

## Funcionalidades Disponibles

Lista de funcionalidades que se pueden validar:

| Funcionalidad | Descripción | Planes con Acceso |
|---------------|-------------|-------------------|
| `sms_whatsapp` | Notificaciones por WhatsApp y SMS | Professional, Enterprise |
| `reportes_avanzados` | Reportes detallados y analítica | Professional, Enterprise |
| `google_calendar` | Integración con Google Calendar | Professional, Enterprise |
| `api_publica` | Acceso a API pública | Enterprise |
| `white_label` | Personalización de marca | Enterprise |
| `soporte_prioritario` | Soporte prioritario 24/7 | Enterprise |

## Ejemplos de Uso Completos

### Ejemplo 1: Botón de Acción Restringido

```vue
<template>
  <div class="actions">
    <!-- Opción 1: Usar directiva para ocultar -->
    <button
      v-requires-feature="'sms_whatsapp'"
      @click="enviarSMS"
      class="btn btn-primary"
    >
      Enviar SMS
    </button>

    <!-- Opción 2: Usar directiva para deshabilitar -->
    <button
      v-requires-feature="{ feature: 'sms_whatsapp', mode: 'disable' }"
      @click="enviarSMS"
      class="btn btn-primary"
    >
      Enviar SMS
    </button>

    <!-- Opción 3: Usar composable manualmente -->
    <button
      @click="handleEnviarSMS"
      :disabled="!puedeEnviarSMS"
      class="btn btn-primary"
    >
      Enviar SMS
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlanFeatures } from '@/composables/usePlanFeatures'

const { tieneFuncionalidad } = usePlanFeatures()
const puedeEnviarSMS = ref(false)

onMounted(async () => {
  puedeEnviarSMS.value = await tieneFuncionalidad('sms_whatsapp')
})

const handleEnviarSMS = async () => {
  if (!puedeEnviarSMS.value) {
    alert('Esta funcionalidad requiere el plan Professional o superior')
    return
  }
  // Lógica para enviar SMS...
}
</script>
```

### Ejemplo 2: Sección Completa Bloqueada

```vue
<template>
  <div class="page">
    <h1>Reportes</h1>

    <!-- Reportes básicos (disponibles en todos los planes) -->
    <div class="basic-reports">
      <ReporteBasico />
    </div>

    <!-- Reportes avanzados (solo Professional y Enterprise) -->
    <FeatureGate
      feature="reportes_avanzados"
      title="Reportes Avanzados"
      message="Accede a análisis detallados y exportación a Excel"
    >
      <div class="advanced-reports">
        <ReporteAvanzado tipo="ventas" />
        <ReporteAvanzado tipo="clientes" />
        <ReporteAvanzado tipo="servicios" />
      </div>
    </FeatureGate>
  </div>
</template>
```

### Ejemplo 3: Verificación Múltiple

```vue
<template>
  <div class="settings">
    <h2>Configuración de Notificaciones</h2>

    <div v-if="loading">Cargando...</div>

    <div v-else>
      <!-- Email (disponible en todos los planes) -->
      <div class="setting">
        <label>
          <input type="checkbox" v-model="notificaciones.email" />
          Notificaciones por Email
        </label>
      </div>

      <!-- SMS/WhatsApp (Professional+) -->
      <div
        v-if="funcionalidades.sms_whatsapp"
        class="setting"
      >
        <label>
          <input type="checkbox" v-model="notificaciones.whatsapp" />
          Notificaciones por WhatsApp
        </label>
      </div>

      <div
        v-else
        class="setting-locked"
      >
        <p>Notificaciones por WhatsApp</p>
        <router-link to="/planes" class="upgrade-link">
          Actualizar a Professional
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlanFeatures } from '@/composables/usePlanFeatures'

const { verificarMultiples } = usePlanFeatures()

const loading = ref(true)
const funcionalidades = ref({})
const notificaciones = ref({
  email: true,
  whatsapp: false
})

onMounted(async () => {
  funcionalidades.value = await verificarMultiples([
    'sms_whatsapp',
    'google_calendar',
    'api_publica'
  ])
  loading.value = false
})
</script>
```

## Backend Integration

Este sistema frontend trabaja en conjunto con el backend que usa AOP para validar acceso:

```java
@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @PostMapping("/whatsapp")
    @RequiresPlanFeature("sms_whatsapp")
    public ResponseEntity<?> enviarWhatsApp(@RequestBody WhatsAppRequest request) {
        // Solo se ejecuta si el plan tiene acceso
        return ResponseEntity.ok(notificacionService.enviarWhatsApp(request));
    }
}
```

El frontend debe manejar errores 403 cuando el backend rechaza una operación por límites del plan.

## Mejores Prácticas

1. **Usar `FeatureGate` para secciones completas**: Es más declarativo y proporciona mejor UX con mensajes de upgrade

2. **Usar directiva `v-requires-feature` para elementos individuales**: Más ligero para botones y acciones simples

3. **Modo 'disable' vs 'hide'**:
   - Usa `hide` cuando el usuario no debe saber que existe la funcionalidad
   - Usa `disable` cuando quieres que vean la funcionalidad pero sepan que está bloqueada

4. **Cachear resultados**: El composable ya cachea internamente, pero evita verificar la misma funcionalidad múltiples veces innecesariamente

5. **Manejo de errores**: Siempre manejar el caso donde el backend rechace una operación aunque el frontend permita el acceso (validación doble)

## Testing

```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FeatureGate from '@/components/planes/FeatureGate.vue'

describe('FeatureGate', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('muestra contenido cuando tiene acceso', async () => {
    const wrapper = mount(FeatureGate, {
      props: { feature: 'sms_whatsapp' },
      slots: {
        default: '<div>Contenido protegido</div>'
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Contenido protegido')
  })

  it('muestra mensaje de upgrade cuando no tiene acceso', async () => {
    const wrapper = mount(FeatureGate, {
      props: { feature: 'api_publica' }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Actualizar Plan')
  })
})
```
