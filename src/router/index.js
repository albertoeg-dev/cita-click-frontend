import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useSuscripcionStore } from '../stores/suscripcionStore'
import { usePlanesStore } from '../stores/planesStore'

// Vistas de Autenticación
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import VerifyEmailPage from '../views/VerifyEmailPage.vue'

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
import PlantillaEmailPage from '../views/PlantillaEmailPage.vue'

// Vistas de pagos y Stripe
import PricingPage from '../views/PricingPage.vue'
import SubscriptionCheckoutPage from '../views/SubscriptionCheckoutPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import PaymentSuccessPage from '../views/PaymentSuccessPage.vue'
import PaymentHistoryPage from '../views/PaymentHistoryPage.vue'
import PublicPaymentPage from '../views/PublicPaymentPage.vue'

// Vista de Documentación
import DocsPage from '../views/DocsPage.vue'

// Vista Landing
import LandingPage from '../views/LandingPage.vue'

// Vista 404
import NotFoundPage from '../views/NotFoundPage.vue'

const routes = [
  // Landing Page
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { layout: 'minimal', requiresAuth: false }
  },

  // Ruta de documentación (pública)
  {
    path: '/docs',
    name: 'Docs',
    component: DocsPage,
    meta: { layout: 'minimal', requiresAuth: false }
  },

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
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmailPage,
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
  {
    path: '/plantilla-email',
    name: 'PlantillaEmail',
    component: PlantillaEmailPage,
    meta: { layout: 'main', requiresAuth: true, requiresPlan: 'premium' },
  },

  // Rutas de pagos y suscripción
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/subscription/checkout/:planId',
    name: 'SubscriptionCheckout',
    component: SubscriptionCheckoutPage,
    meta: { layout: 'minimal', requiresAuth: true },
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
  {
    path: '/payment/history',
    name: 'PaymentHistory',
    component: PaymentHistoryPage,
    meta: { layout: 'main', requiresAuth: true },
  },
  // Ruta pública para pagos de clientes (sin autenticación)
  {
    path: '/pay/:paymentId',
    name: 'PublicPayment',
    component: PublicPaymentPage,
    meta: { layout: 'public', requiresAuth: false },
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

  // Verificar token en localStorage primero
  const storedToken = localStorage.getItem('token')

  // Si no hay token en localStorage pero el store tiene uno, limpiar
  if (!storedToken && authStore.token) {
    authStore.token = null
    authStore.user = null
  }

  // Cargar usuario del localStorage si existe
  if (!authStore.user && authStore.token) {
    authStore.loadUserFromStorage()
  }

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  // Si requiere autenticación y no está autenticado
  if (requiresAuth && !isAuthenticated) {
    // Si venimos de otra ruta protegida, evitar loop
    if (from.path !== '/login' && to.path !== '/login') {
      return next({ path: '/login', replace: true })
    }
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
        console.error('[Router] Error al cargar suscripción:', error)
        // Si es error 401/403, el interceptor manejará el logout
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
        console.error('[Router] Error al cargar límites del plan:', error)
        // Si es error 401/403, el interceptor manejará el logout
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