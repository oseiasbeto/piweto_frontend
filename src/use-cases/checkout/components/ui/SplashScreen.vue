<template>
  <transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9998] flex items-center justify-center bg-white"
      @wheel.prevent
      @touchmove.prevent
    >
      <div class="w-8 h-8 lg:w-12 lg:h-12 text-brand-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          class="w-full h-full"
          viewBox="0 0 378.000000 387.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,387.000000) scale(0.100000,-0.100000)"
            stroke="none"
          >
            <!-- ponto 1 -->
            <path
              class="dot top"
              d="M2422 3823 c-40 -12 -62 -27 -93 -61 -159 -181 -289 -510 -289 -731 0 -220 162 -321 305 -190 47 43 88 117 155 277 34 81 58 120 110 180 159 185 201 301 149 410 -53 108 -195 157 -337 115z"
            />

            <!-- ponto 2 -->
            <path
              class="dot middle"
              d="M3182 3214 c-332 -89 -684 -390 -699 -598 -6 -69 26 -132 82 -163 81 -45 158 -25 340 87 126 78 162 93 295 125 95 23 202 78 260 135 92 89 113 180 64 278 -31 63 -87 106 -173 132 -74 23 -97 24 -169 4z"
            />

            <!-- parte preta -->
            <path
              fill="currentColor"
              d="M1070 2744 c-296 -28 -520 -128 -699 -313 -170 -177 -260 -379 -317 -711 -21 -125 -24 -449 -5 -575 25 -161 69 -347 100 -420 68 -159 133 -255 235 -352 91 -87 166 -136 285 -188 330 -144 713 -153 1048 -25 224 86 411 263 529 501 47 95 109 287 130 404 26 142 26 539 1 675 -41 218 -134 452 -237 590 -199 269 -484 404 -870 414 -85 2 -175 2 -200 0z m310 -590 c143 -55 271 -207 320 -378 48 -169 53 -480 10 -681 -50 -234 -186 -408 -363 -462 -69 -21 -198 -21 -262 1 -153 52 -230 116 -289 238 -114 238 -141 685 -55 940 66 199 169 300 359 353 70 19 217 14 280 -11z"
            />

            <!-- ponto 3 -->
            <path
              class="dot bottom"
              d="M3187 2334 c-208 -32 -373 -92 -439 -159 -91 -92 -90 -261 2 -307 51 -26 101 -22 253 17 100 26 156 35 216 35 262 0 416 134 342 297 -20 43 -79 93 -140 119 -41 17 -117 17 -234 -2z"
            />
          </g>
        </svg>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const isVisible = ref(props.visible)

// Bloqueia scroll da página
const toggleScrollLock = (lock) => {
  if (lock) {
    document.body.style.overflow = "hidden"
    document.body.style.touchAction = "none"
  } else {
    document.body.style.overflow = ""
    document.body.style.touchAction = ""
  }
}

watch(() => props.visible, (val) => {
  isVisible.value = val
  toggleScrollLock(val)
})

onMounted(() => {
  toggleScrollLock(isVisible.value)
})

onBeforeUnmount(() => {
  toggleScrollLock(false)
})
</script>

<style scoped>
.dot{
  fill:#fff;
  animation: loadingDots 1.6s infinite;
}

.bottom{
  animation-delay:0s;
}

.middle{
  animation-delay:0.25s;
}

.top{
  animation-delay:0.5s;
}

@keyframes loadingDots{

  0%{
    fill:#fff;
  }

  20%{
    fill:#ffcd35;
  }

  40%{
    fill:#ffcd35;
  }

  60%{
    fill:#fff;
  }

  100%{
    fill:#fff;
  }

}
</style>