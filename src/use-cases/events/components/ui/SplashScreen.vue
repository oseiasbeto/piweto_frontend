<template>
    <div v-if="isVisible" class="fixed inset-0 z-[9998] flex items-center justify-center bg-white" @wheel.prevent
        @touchmove.prevent>
        <div class="loader"></div>
    </div>
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
/* HTML: <div class="loader"></div> */
.loader {
    width: 70px;
    aspect-ratio: 1;
    background:
        radial-gradient(farthest-side, #ffcd35 90%, #0000) center/16px 16px,
        radial-gradient(farthest-side, #32ba78 90%, #0000) bottom/12px 12px;
    background-repeat: no-repeat;
    animation: l17 1s infinite linear;
    position: relative;
}

.loader::before {
    content: "";
    position: absolute;
    width: 8px;
    aspect-ratio: 1;
    inset: auto 0 16px;
    margin: auto;
    background: #ccc;
    border-radius: 50%;
    transform-origin: 50% calc(100% + 10px);
    animation: inherit;
    animation-duration: 0.5s;
}

@keyframes l17 {
    100% {
        transform: rotate(1turn)
    }
}
</style>