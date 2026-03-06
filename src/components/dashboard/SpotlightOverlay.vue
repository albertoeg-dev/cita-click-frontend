<template>
  <Teleport to="body">
    <Transition name="spotlight-fade">
      <div
        v-if="hayTourActivo && posicion"
        class="spotlight-overlay"
        @click.self="omitirTour"
      >
        <!-- Spotlight highlight box (el "recorte" luminoso) -->
        <div
          class="spotlight-box"
          :style="estiloBox"
        ></div>

        <!-- Tooltip con instrucción -->
        <div
          class="spotlight-tooltip"
          :style="estiloTooltip"
        >
          <!-- Flecha CSS que apunta al elemento -->
          <div class="spotlight-arrow" :class="claseFlecha"></div>

          <!-- Contenido del tooltip -->
          <div class="spotlight-content">
            <div class="spotlight-icon">👆</div>
            <p class="spotlight-instruccion">{{ instruccionTour }}</p>
          </div>

          <!-- Botones -->
          <div class="spotlight-actions">
            <button class="btn-omitir" @click="omitirTour">Omitir tour</button>
            <button class="btn-entendido" @click="entendido">Entendido ✓</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useOnboardingStore } from '../../stores/onboardingStore'

const onboardingStore = useOnboardingStore()

const posicion = ref(null)
const posicionTooltip = ref({ top: 0, left: 0 })
const ladoTooltip = ref('bottom') // 'top' | 'bottom' | 'center'

const PADDING = 8      // espacio extra alrededor del elemento
const TOOLTIP_H = 140  // altura estimada del tooltip en px
const TOOLTIP_W = 280  // ancho del tooltip en px

// Buscar el elemento y calcular posición
async function recalcularPosicion() {
  const target = onboardingStore.tourActivo?.target
  if (!target) {
    posicion.value = null
    return
  }

  await nextTick()

  // Intentar hasta 5 veces si el elemento no está listo aún
  for (let i = 0; i < 5; i++) {
    const el = document.querySelector(`[data-tour="${target}"]`)
    if (el) {
      const rect = el.getBoundingClientRect()
      const scrollX = window.scrollX || window.pageXOffset
      const scrollY = window.scrollY || window.pageYOffset

      const box = {
        top: rect.top + scrollY - PADDING,
        left: rect.left + scrollX - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
      }

      posicion.value = box

      // Determinar si el tooltip va arriba o abajo
      const espacioAbajo = window.innerHeight - rect.bottom
      const espacioArriba = rect.top

      if (espacioAbajo >= TOOLTIP_H + 20) {
        ladoTooltip.value = 'bottom'
        posicionTooltip.value = {
          top: rect.bottom + scrollY + PADDING + 12,
          left: Math.max(12, Math.min(
            rect.left + scrollX + rect.width / 2 - TOOLTIP_W / 2,
            window.innerWidth - TOOLTIP_W - 12
          ))
        }
      } else if (espacioArriba >= TOOLTIP_H + 20) {
        ladoTooltip.value = 'top'
        posicionTooltip.value = {
          top: rect.top + scrollY - TOOLTIP_H - PADDING - 12,
          left: Math.max(12, Math.min(
            rect.left + scrollX + rect.width / 2 - TOOLTIP_W / 2,
            window.innerWidth - TOOLTIP_W - 12
          ))
        }
      } else {
        // Si no hay espacio ni arriba ni abajo, centrar en pantalla
        ladoTooltip.value = 'center'
        posicionTooltip.value = {
          top: scrollY + window.innerHeight / 2 - TOOLTIP_H / 2,
          left: window.innerWidth / 2 - TOOLTIP_W / 2
        }
      }
      return
    }
    // Esperar un poco y volver a intentar
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Si después de 5 intentos no encontró el elemento, desactivar
  posicion.value = null
}

// Watchers
watch(
  () => onboardingStore.tourActivo,
  async (val) => {
    if (val) {
      await recalcularPosicion()
    } else {
      posicion.value = null
    }
  },
  { immediate: true }
)

// Recalcular si cambia el scroll o el tamaño de ventana
let scrollListener = null
let resizeListener = null

watch(
  () => onboardingStore.hayTourActivo,
  (activo) => {
    if (activo) {
      scrollListener = () => recalcularPosicion()
      resizeListener = () => recalcularPosicion()
      window.addEventListener('scroll', scrollListener, { passive: true })
      window.addEventListener('resize', resizeListener, { passive: true })
    } else {
      if (scrollListener) {
        window.removeEventListener('scroll', scrollListener)
        scrollListener = null
      }
      if (resizeListener) {
        window.removeEventListener('resize', resizeListener)
        resizeListener = null
      }
    }
  }
)

onUnmounted(() => {
  if (scrollListener) window.removeEventListener('scroll', scrollListener)
  if (resizeListener) window.removeEventListener('resize', resizeListener)
})

// Computed
const hayTourActivo = computed(() => onboardingStore.hayTourActivo)
const instruccionTour = computed(() => onboardingStore.instruccionTour)

const estiloBox = computed(() => {
  if (!posicion.value) return {}
  return {
    position: 'absolute',
    top: `${posicion.value.top}px`,
    left: `${posicion.value.left}px`,
    width: `${posicion.value.width}px`,
    height: `${posicion.value.height}px`,
    borderRadius: '8px',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
    zIndex: '9998',
    pointerEvents: 'none',
    border: '2px solid rgba(99, 102, 241, 0.8)',
    transition: 'all 0.3s ease'
  }
})

const estiloTooltip = computed(() => {
  if (!posicion.value) return {}
  return {
    position: 'absolute',
    top: `${posicionTooltip.value.top}px`,
    left: `${posicionTooltip.value.left}px`,
    width: `${TOOLTIP_W}px`,
    zIndex: '9999',
    transition: 'all 0.3s ease'
  }
})

const claseFlecha = computed(() => ({
  'arrow-up': ladoTooltip.value === 'bottom',
  'arrow-down': ladoTooltip.value === 'top',
  'arrow-hidden': ladoTooltip.value === 'center'
}))

// Acciones
function omitirTour() {
  onboardingStore.desactivarTour()
}

function entendido() {
  onboardingStore.desactivarTour()
}
</script>

<style scoped>
.spotlight-overlay {
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: auto;
}

/* El box actúa como el "agujero" gracias al box-shadow enorme */
.spotlight-box {
  cursor: default;
  pointer-events: none;
}

/* Tooltip */
.spotlight-tooltip {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.2);
  overflow: visible;
  pointer-events: auto;
}

.spotlight-content {
  padding: 16px 16px 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.spotlight-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.spotlight-instruccion {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
}

.spotlight-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 12px 12px;
}

.btn-omitir {
  font-size: 12px;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: color 0.2s;
}

.btn-omitir:hover {
  color: #64748b;
}

.btn-entendido {
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 6px;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-entendido:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Flechas CSS */
.spotlight-arrow {
  position: absolute;
  width: 0;
  height: 0;
  left: 50%;
  transform: translateX(-50%);
}

.arrow-up {
  top: -10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}

.arrow-down {
  bottom: -10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
}

.arrow-hidden {
  display: none;
}

/* Transición de entrada/salida */
.spotlight-fade-enter-active,
.spotlight-fade-leave-active {
  transition: opacity 0.25s ease;
}

.spotlight-fade-enter-from,
.spotlight-fade-leave-to {
  opacity: 0;
}
</style>
