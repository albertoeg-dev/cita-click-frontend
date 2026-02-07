# 📋 Especificaciones de Mejoras Frontend - Cita Click

## ✅ **COMPLETADO**

### 1. Menú Lateral Colapsable ✓
- [x] Botón toggle para abrir/cerrar sidebar
- [x] Modo colapsado: solo iconos (w-20)
- [x] Modo expandido: iconos + texto (w-64)
- [x] Transiciones suaves (300ms)
- [x] Persistencia en localStorage
- [x] Diseño responsive

### 2. Limpieza de Console ✓
- [x] Eliminados TODOS los console.log (330+ instancias)
- [x] Eliminados console.warn
- [x] Eliminados console.info
- [x] Mantenidos console.error (167 instancias)
- [x] 98 archivos limpiados

---

## 🔴 **PRIORIDAD ALTA - PENDIENTE**

### 3. Sección: Configuración

#### A) Perfil del Negocio

**Catálogo ampliado de tipos de negocio:**
```javascript
const tiposNegocio = [
  { value: 'salon', label: 'Salón de Belleza' },
  { value: 'barberia', label: 'Barbería' },
  { value: 'spa', label: 'Spa y Bienestar' },
  { value: 'estetica', label: 'Centro Estético' },
  { value: 'gym', label: 'Gimnasio' },
  { value: 'yoga', label: 'Estudio de Yoga/Pilates' },
  { value: 'clinica', label: 'Clínica Médica' },
  { value: 'dental', label: 'Consultorio Dental' },
  { value: 'veterinaria', label: 'Veterinaria' },
  { value: 'fotografia', label: 'Estudio Fotográfico' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'abogado', label: 'Despacho Legal' },
  { value: 'contabilidad', label: 'Cont abilidad' },
  { value: 'taller', label: 'Taller Mecánico' },
  { value: 'reparaciones', label: 'Reparaciones' },
  { value: 'limpieza', label: 'Servicios de Limpieza' },
  { value: 'educacion', label: 'Centro Educativo' },
  { value: 'idiomas', label: 'Escuela de Idiomas' },
  { value: 'musica', label: 'Escuela de Música' },
  { value: 'otro', label: 'Otro' }
];
```

**Cambios UI/UX:**
- [ ] Eliminar "Vista Previa" al final del formulario
- [ ] Fix icono teléfono encimado con texto (agregar pl-10 al input)
- [ ] Validación 10 dígitos en teléfono con mensaje de error
- [ ] Fix icono email encimado con texto (agregar pl-10 al input)
- [ ] Integrar API de código postal (ver sección 9)

**Archivo:** `/Users/albertoespejel/Documents/Develop/SaaS/cita-click/cita-click-frontend/src/views/settings/BusinessProfile.vue`

---

#### B) Horarios de Atención

**Cambios:**
- [ ] Una sola notificación al guardar horarios masivamente (no una por día)
- [ ] Modal: Pintar de verde horarios ya configurados
- [ ] No permitir guardar horario si ya existe para ese día

**Lógica:**
```javascript
// Al abrir modal, marcar días configurados
const diasConfigurados = computed(() => {
  return horariosStore.horarios.map(h => h.diaSemana);
});

// Validar antes de guardar
const validarDuplicados = (diaSeleccionado) => {
  if (diasConfigurados.value.includes(diaSeleccionado)) {
    toast.error('Este día ya tiene horarios configurados');
    return false;
  }
  return true;
};
```

**Archivo:** `/Users/albertoespejel/Documents/Develop/SaaS/cita-click/cita-click-frontend/src/views/settings/BusinessHours.vue`

---

#### C) Headers Descriptivos

**Cambio en todos los headers:**

Configuración:
```
ANTES: <h1>Configuración</h1>
DESPUÉS: <h1>Configuración <span class="text-base text-slate-500 font-normal">Administra la información y horarios de tu negocio</span></h1>
```

---

### 4. Sección: Dashboard

#### A) Eliminar Mensaje de Bienvenida
- [ ] Quitar: "¡Bienvenido, Alberto Raul! Aquí está el resumen de tu negocio"

#### B) Sistema de Onboarding - Lista de Tareas

**Nueva funcionalidad:**
Crear componente `OnboardingChecklist.vue`

```vue
<template>
  <div v-if="!isCompleted" class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900">Configura tu Negocio</h3>
          <p class="text-sm text-slate-600">Completa estos pasos para empezar</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-blue-600">{{ completedCount }}/{{ tasks.length }}</div>
        <div class="text-xs text-slate-500">tareas completadas</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-slate-200 rounded-full h-2 mb-6">
      <div
        class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>

    <!-- Task List -->
    <div class="space-y-3">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center justify-between p-4 bg-white rounded-lg border-2 transition-all"
        :class="task.completed ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:border-blue-300'"
      >
        <div class="flex items-center gap-3 flex-1">
          <!-- Checkbox -->
          <div
            class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
            :class="task.completed ? 'border-green-500 bg-green-500' : 'border-slate-300'"
          >
            <svg v-if="task.completed" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Task Info -->
          <div class="flex-1">
            <h4 class="font-medium" :class="task.completed ? 'text-green-700 line-through' : 'text-slate-900'">
              {{ task.title }}
            </h4>
            <p class="text-sm text-slate-500">{{ task.description }}</p>
          </div>
        </div>

        <!-- Action Button -->
        <button
          v-if="!task.completed"
          @click="navigateToTask(task.route)"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 flex-shrink-0 ml-4"
        >
          <span>Ir</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Complete Button -->
    <button
      v-if="allTasksCompleted"
      @click="markAsCompleted"
      class="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
    >
      ✓ Completado
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBusinessStore } from '@/stores/businessStore';
import { useServiciosStore } from '@/stores/serviciosStore';
import { useClientesStore } from '@/stores/clientesStore';
import { useCitasStore } from '@/stores/citasStore';

const router = useRouter();
const businessStore = useBusinessStore();
const serviciosStore = useServiciosStore();
const clientesStore = useClientesStore();
const citasStore = useCitasStore();

const isCompleted = ref(false);

// Tareas de onboarding
const tasks = ref([
  {
    id: 1,
    title: 'Configura tus horarios de atención',
    description: 'Define cuándo estás disponible para recibir citas',
    route: '/settings',
    completed: false,
    checkFn: () => businessStore.horarios?.length > 0
  },
  {
    id: 2,
    title: 'Registra tus servicios',
    description: 'Agrega los servicios que ofreces',
    route: '/services',
    completed: false,
    checkFn: () => serviciosStore.servicios?.length > 0
  },
  {
    id: 3,
    title: 'Agrega tus primeros clientes',
    description: 'Registra la información de tus clientes',
    route: '/clients',
    completed: false,
    checkFn: () => clientesStore.clientes?.length > 0
  },
  {
    id: 4,
    title: 'Crea tu primera cita',
    description: 'Programa una cita para comenzar',
    route: '/appointments',
    completed: false,
    checkFn: () => citasStore.citas?.length > 0
  }
]);

// Verificar estado de tareas
const checkTasksCompletion = () => {
  tasks.value.forEach(task => {
    task.completed = task.checkFn();
  });
};

const completedCount = computed(() => {
  return tasks.value.filter(t => t.completed).length;
});

const progressPercentage = computed(() => {
  return (completedCount.value / tasks.value.length) * 100;
});

const allTasksCompleted = computed(() => {
  return completedCount.value === tasks.value.length;
});

const navigateToTask = (route) => {
  router.push(route);
};

const markAsCompleted = () => {
  localStorage.setItem('onboarding_completed', 'true');
  isCompleted.value = true;
};

onMounted(() => {
  // Verificar si ya fue completado
  isCompleted.value = localStorage.getItem('onboarding_completed') === 'true';

  // Verificar estado de tareas
  checkTasksCompletion();

  // Actualizar cada 5 segundos
  setInterval(checkTasksCompletion, 5000);
});
</script>
```

**Cambios en Dashboard:**
- [ ] Eliminar banner "Comienza Ahora" de la parte inferior
- [ ] Mover "Acciones Rápidas" a la parte superior (donde estaba bienvenida)
- [ ] Eliminar banner "¿Listo para crecer?" (moverlo a notificación)
- [ ] Agregar componente OnboardingChecklist al inicio

**Archivo:** `/Users/albertoespejel/Documents/Develop/SaaS/cita-click/cita-click-frontend/src/views/Dashboard.vue`

---

### 5. Sección: Servicios

**Cambios UI:**
- [ ] Header: "Gestión de Servicios" + subtítulo
- [ ] Fix icono lupa encimado en "Buscar Servicio" (agregar pl-10)
- [ ] Modal "Crear Nuevo Servicio": quitar Vista Previa
- [ ] Input "Precio (MXN)": fix signo $ encimado (ajustar padding-left)

**Archivo:** `/Users/albertoespejel/Documents/Develop/SaaS/cita-click/cita-click-frontend/src/views/Services.vue`

---

### 6. Sección: Usuarios

**Cambios:**
- [ ] Header: "Gestión de Usuarios" + subtítulo
- [ ] Modal "Invitar Usuario": validar 10 dígitos en teléfono
- [ ] Crear template SendGrid para invitación de usuario
- [ ] Implementar sistema de roles y permisos
- [ ] Validar que siempre haya un administrador

**Sistema de Roles:**
```javascript
const roles = {
  admin: {
    label: 'Administrador',
    permissions: ['all'] // Acceso total
  },
  manager: {
    label: 'Gerente',
    permissions: [
      'view_dashboard',
      'manage_appointments',
      'manage_clients',
      'manage_services',
      'view_reports'
    ],
    restrictions: ['manage_users', 'manage_settings', 'manage_billing']
  },
  staff: {
    label: 'Staff',
    permissions: [
      'view_dashboard',
      'manage_appointments',
      'view_clients'
    ],
    restrictions: ['manage_users', 'manage_settings', 'manage_billing', 'manage_services', 'view_reports']
  },
  receptionist: {
    label: 'Recepcionista',
    permissions: [
      'view_dashboard',
      'manage_appointments',
      'manage_clients'
    ],
    restrictions: ['manage_users', 'manage_settings', 'manage_billing', 'manage_services', 'view_reports']
  }
};
```

**Archivo:** `/Users/albertoespejel/Documents/Develop/SaaS/cita-click/cita-click-frontend/src/views/Users.vue`

---

### 7. Sección: Clientes

**Cambios:**
- [ ] Header: "Gestión de Clientes" + subtítulo
- [ ] Fix icono lupa encimado en "Buscar cliente" (agregar pl-10)
- [ ] Email obligatorio (no opcional)
- [ ] Fix icono email encimado (agregar pl-10)
- [ ] Fix icono teléfono encimado (agregar pl-10)
- [ ] Validar 10 dígitos en teléfono
- [ ] Quitar Vista Previa del modal
- [ ] Implementar sistema de felicitaciones de cumpleaños

**Sistema de Cumpleaños:**

Backend: Crear nuevo endpoint y template SendGrid
Frontend: Agregar configuración en BusinessProfile.vue

```vue
<!-- Agregar en BusinessProfile.vue -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg border">
  <div>
    <h4 class="font-medium text-slate-900">Felicitaciones de Cumpleaños</h4>
    <p class="text-sm text-slate-600">Envía felicitaciones automáticas a tus clientes</p>
  </div>
  <label class="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      v-model="negocio.felicitacionesCumpleanosHabilitadas"
      class="sr-only peer"
    >
    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
</div>
```

**Archivo:** `/Users/albertoespejel/Documents/Develop/SaaS/cita-click/cita-click-frontend/src/views/Clients.vue`

---

### 9. Integración API Código Postal

**API a usar:** Sepomex API (gratuita para México)
URL: `https://api.copomex.com/query/info_cp/{codigo_postal}?token=pruebas`

**Servicio nuevo:**
```javascript
// services/codigoPostalService.js
import axios from 'axios';

const COPOMEX_API = 'https://api.copomex.com/query';
const TOKEN = import.meta.env.VITE_COPOMEX_TOKEN || 'pruebas';

export const codigoPostalService = {
  async buscarPorCP(codigoPostal) {
    try {
      const response = await axios.get(`${COPOMEX_API}/info_cp/${codigoPostal}`, {
        params: { token: TOKEN }
      });

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        return {
          estado: data.response.estado,
          municipio: data.response.municipio,
          ciudad: data.response.ciudad,
          colonias: data.response.asentamiento || []
        };
      }
      return null;
    } catch (error) {
      console.error('Error al buscar código postal:', error);
      return null;
    }
  }
};
```

**Uso en BusinessProfile.vue:**
```vue
<script setup>
import { watch } from 'vue';
import { codigoPostalService } from '@/services/codigoPostalService';

// Watch para código postal
watch(() => negocio.value.codigoPostal, async (newCP) => {
  if (newCP && newCP.length === 5) {
    loadingCP.value = true;
    const data = await codigoPostalService.buscarPorCP(newCP);

    if (data) {
      negocio.value.estado = data.estado;
      negocio.value.municipio = data.municipio;
      negocio.value.ciudad = data.ciudad || data.municipio;
      negocio.value.pais = 'México';
      // Mostrar selector de colonias
      coloniasDisponibles.value = data.colonias;
    }
    loadingCP.value = false;
  }
});
</script>
```

---

## 📊 **Resumen de Archivos a Modificar**

### Completados (2):
1. ✅ `DashboardLayout.vue` - Menú colapsable
2. ✅ 98 archivos - Limpieza de console.log

### Pendientes (7 archivos principales):
3. `BusinessProfile.vue` - Configuración
4. `BusinessHours.vue` - Horarios
5. `Dashboard.vue` - Onboarding + redesign
6. `Services.vue` - Mejoras UI
7. `Users.vue` - Roles y permisos
8. `Clients.vue` - Cumpleaños y validaciones
9. `codigoPostalService.js` - Nuevo servicio

### Backend (SendGrid Templates):
- Template invitación de usuario
- Template felicitación cumpleaños

---

## 🎯 **Siguiente Paso Recomendado**

**Prioridad 1:** Configuración (BusinessProfile + BusinessHours)
**Prioridad 2:** Dashboard (Onboarding checklist)
**Prioridad 3:** Servicios, Usuarios y Clientes
**Prioridad 4:** Integración código postal

**¿Deseas que continúe con la implementación de alguna sección específica?**
