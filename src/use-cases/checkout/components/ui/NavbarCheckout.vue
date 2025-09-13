<script setup>
import { useRoute, useRouter } from "vue-router";
import Logo from '@/components/Logo.vue';
import { useStore } from "vuex";
import { computed, ref, onMounted, onUnmounted } from "vue";
import Container from '@/use-cases/marketplace/components/ui/Container.vue';
import LocaleSelector from "./LocaleSelector.vue";
import Swal from 'sweetalert2';

const route = useRoute()
const router = useRouter()
const store = useStore()

// Timer logic
const timeLeft = ref(5 * 60) // 5 minutos em segundos
const timer = ref(null)
const isCriticalTime = ref(false) // Indica se o tempo está crítico (1 minuto ou menos)

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
    // Limpar timer existente se houver
    if (timer.value) {
        clearInterval(timer.value)
    }

    // Iniciar novo timer
    timeLeft.value = 5 * 60

    timer.value = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--

            // Ativar cor vermelha quando faltar 1 minuto ou menos
            if (timeLeft.value <= 60 && !isCriticalTime.value) {
                isCriticalTime.value = true
            }
        } else {
            clearInterval(timer.value)
            showTimeUpAlert()
        }
    }, 1000)
}

const showTimeUpAlert = () => {
    Swal.fire({
        title: 'Tempo esgotado!',
        html: 'O tempo para preenchimento do formulário terminou.<br>Sua reserva foi liberada para outros usuários.',
        icon: 'warning',
        confirmButtonText: 'Entendi',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(() => {
        // Redirecionar para a página anterior
        router.replace('/evento/' + route.params.slug)
    })
}

// Iniciar o timer quando o componente for montado
onMounted(() => {
    startTimer()
})

// Limpar o timer quando o componente for desmontado
onUnmounted(() => {
    if (timer.value) {
        clearInterval(timer.value)
    }
})

// Limpar o timer se o usuário finalizar a compra com sucesso
// (você pode chamar esta função no finishPurchase após sucesso)
const clearReservationTimer = () => {
    if (timer.value) {
        clearInterval(timer.value)
    }
}

// Expor a função para ser usada em outros componentes
defineExpose({
    clearReservationTimer
})
</script>

<template>
    <div class="bg-white sticky border-b border-b-gray-300 z-[444] lg:px-0 px-4 top-0 h-12 lg:h-16 w-full">
        <Container>
            <div class="flex relative justify-between lg:px-4 items-center">
                <div>
                    <Logo size="lg:w-[100px] transition-opacity w-[80px] h-12 lg:h-16" />
                </div>

                <div>
                    <div :class="[
                        'flex items-center gap-1 border border-gray-300 rounded-full py-1 lg:py-[6px] px-[12px] transition-colors duration-300',
                        isCriticalTime
                            ? 'text-red-600 border-red-300 bg-red-50'
                            : 'text-gray-500'
                    ]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="lg:w-4 lg:h-4 w-[14px] h-[14px]"
                            viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.8284 6.75736C12.3807 6.75736 12.8284 7.20507 12.8284 7.75736V12.7245L16.3553 14.0653C16.8716 14.2615 17.131 14.8391 16.9347 15.3553C16.7385 15.8716 16.1609 16.131 15.6447 15.9347L11.4731 14.349C11.085 14.2014 10.8284 13.8294 10.8284 13.4142V7.75736C10.8284 7.20507 11.2761 6.75736 11.8284 6.75736Z"
                                fill="currentColor" />
                        </svg>
                        <p class="font-bold text-inherit text-sm lg:text-base">{{ formatTime(timeLeft) }}</p>
                    </div>
                </div>
            </div>
        </Container>
    </div>
</template>