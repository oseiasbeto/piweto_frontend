<script setup>
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Logo from "@/components/Logo.vue";
import { toast } from "vue3-toastify"

const hasScroll = ref(false);

defineProps({
    fixed: {
        type: Boolean,
        default: true
    }
})

const store = useStore()
const router = useRouter()
const route = useRoute()

const sidebar = computed(() => {
    return store.getters.sidebar
})

const toggleSidebar = () => {
    store.dispatch('setSidebar', {
        show: !sidebar.value.show
    })
}

const handleScroll = () => {
    hasScroll.value = window.scrollY > 12;
};


const hasLogged = computed(() => {
    return store.getters.hasLogged
})

const copyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
        toast('Link copiado com sucesso!', {
            theme: "colored",
            position: "top-right",
            autoClose: 2500,
            type: 'success'
        })
    }).catch(err => {
        console.error("Erro ao copiar:", err);
    });
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div class="top-0 z-[90]" :class="{ 'sticky': fixed }">
        <div class="
            relative backdrop-blur-md shadow-[0_.5px_rgb(0,0,0,0.16)] bg-white/[0.92] h-[56px] transition-all duration-200
        ">
            <div class="w-full h-full max-w-[1000px] mx-auto">
                <div class="flex h-full px-4 lg:px-0 lg:mx-auto items-center justify-between">
                    <div class="flex items-center gap-5">
                        <Logo size="w-[84px] ml-[-4px] lg:ml-[-4px] lg:w-[100px]" />
                    </div>
                    <div class="flex gap-3 items-center">
                         <button @click="copyLink(`https://piweto.it.ao/evento/${route.params?.slug}`)"
                                class="lg:py-1 gap-1 w-[32px] h-[32px] lg:w-auto lg:h-auto rounded-lg lg:px-3 lg:pb-1 flex items-center justify-center lg:justify-start hover:bg-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.08)] font-medium text-[15px]">
                                <span class="hidden lg:block">Compartilhar</span>

                                <svg class=" shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" x2="12" y1="2" y2="15"></line></svg>
                            </button>

                        <a class="py-1 rounded-lg bg-brand-primary text-white px-3 pb-1 flex items-center hover:bg-brand-primary-dark font-medium text-[15px] shadow-[0_0.3259259164px_0.7333333492px_0_#0000001f,0_1.5407407284px_2.8666665554px_0_#00000012,0_4px_9px_0_#0000000d]"
                            href="#cart">
                            <p class="block pr-1.5">Tickets</p>

                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-ticket-icon">
                                <path
                                    d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z">
                                </path>
                                <path d="M13 5v2"></path>
                                <path d="M13 17v2"></path>
                                <path d="M13 11v2"></path>
                            </svg>
                        </a>

                       
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>