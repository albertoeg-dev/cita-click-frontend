import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useSuscripcionStore } from '../stores/suscripcionStore'
import { usePlanesStore } from '../stores/planesStore'

// Vistas de Autenticación
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

// Vistas del Dashboard
import DashboardPage from '../views/DashboardPage.vue'
import AppointmentsPage from '../views/Appointmentspage.vue'
import CalendarPage from '../views/CalendarPage.vue'
import ClientsPage from '../views/ClientsPage.vue'
import ClientProfile360 from '../views/ClientProfile360.vue'
import ServicesPage from '../views/ServicesPage.vue'
import ReportsPage from '../views/ReportsPage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import UsersManagement from '../views/UsersManagement.vue'
import PlanDetails from '../views/PlanDetails.vue'
import IntegrationsPage from '../views/IntegrationsPage.vue'

// Vistas de pagos y Stripe
import PricingPage from '../views/PricingPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import PaymentSuccessPage from '../views/PaymentSuccessPage.vue'

// Vista 404
import NotFoundPage from '../views/NotFoundPage.vue'

const routes = [
  // Rutas de autenticación
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { layout: 'auth', requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { layout: 'auth', requiresAuth: false },
  },

  // Rutas del dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: AppointmentsPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/clients',
    name: 'Clients',
    component: ClientsPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/clients/:id/profile',
    name: 'ClientProfile360',
    component: ClientProfile360,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/services',
    name: 'Services',
    component: ServicesPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsPage,
    meta: { layout: 'main', requiresAuth: true, requiresFeature: 'reportes_avanzados' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersManagement,
    meta: { layout: 'main', requiresAuth: true, requiresPlan: 'professional' },
  },
  {
    path: '/planes',
    name: 'Planes',
    component: PlanDetails,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/integrations',
    name: 'Integrations',
    component: IntegrationsPage,
    meta: { layout: 'main', requiresAuth: true },
  },

  // Rutas de pagos y suscripción
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/checkout/:sessionId',
    name: 'Checkout',
    component: CheckoutPage,
    meta: { layout: 'minimal', requiresAuth: true },
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccessPage,
    meta: { layout: 'minimal', requiresAuth: true },
  },

  // Ruta por defecto
  {
    path: '/',
    redirect: '/dashboard',
  },

  // Ruta 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard para rutas protegidas
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const suscripcionStore = useSuscripcionStore()

  // Cargar usuario del localStorage si existe
  if (!authStore.user && authStore.token) {
    authStore.loadUserFromStorage()
  }

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  // Si requiere autenticación y no está autenticado
  if (requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Si está en login/register y ya está autenticado
  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    return next('/dashboard')
  }

  // Verificar restricciones de plan (requiresPlan)
  if (to.meta.requiresPlan && isAuthenticated) {
    // Cargar info de suscripción si no está cargada
    if (!suscripcionStore.info) {
      try {
        await suscripcionStore.cargarInfoSuscripcion()
      } catch (error) {
        console.error('Error al cargar suscripción:', error)
        // Permitir continuar pero mostrará restricción en la página
      }
    }

    const currentPlan = suscripcionStore.info?.plan?.toLowerCase() || 'basico'
    const requiredPlan = to.meta.requiresPlan.toLowerCase()

    // Actualizado con nuevos planes: BASICO, PROFESIONAL, PREMIUM
    const planHierarchy = {
      basico: 1,
      profesional: 2,
      premium: 3,
      // Nombres legacy (mantener compatibilidad temporal)
      starter: 1,
      professional: 2,
      enterprise: 3
    }

    const currentLevel = planHierarchy[currentPlan] || 0
    const requiredLevel = planHierarchy[requiredPlan] || 0

    // Si no tiene el plan requerido, redirigir a planes con mensaje
    if (currentLevel < requiredLevel) {
      return next({
        path: '/planes',
        query: {
          upgrade: requiredPlan,
          from: to.path
        }
      })
    }
  }

  // Verificar restricciones de features específicas (requiresFeature)
  if (to.meta.requiresFeature && isAuthenticated) {
    const planesStore = usePlanesStore()

    // Cargar límites del plan si no están cargados
    if (!planesStore.limites) {
      try {
        await planesStore.cargarLimites()
      } catch (error) {
        console.error('Error al cargar límites del plan:', error)
        // Permitir continuar pero mostrará restricción en la página
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

  next()
})

export default router