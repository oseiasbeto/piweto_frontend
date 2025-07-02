<script setup>
import { useRoute } from "vue-router";
import Logo from '@/components/Logo.vue';
import { useStore } from "vuex";
import { computed } from "vue";
import Container from '@/use-cases/marketplace/components/ui/Container.vue';
import UserMenu from "@/components/UserMenu.vue";

const route = useRoute()
const store = useStore()

const hasLogged = computed(() => {
    return store.getters.hasLogged
})

</script>

<template>
    <div class="bg-[#191f28] sticky border-b border-b-[rgb(76,87,108)] z-[9999] top-0 h-12 lg:h-16 w-full">
        <Container>
            <div class="flex relative justify-center px-4 items-center">
                <Logo :is-white="true" size="lg:w-[100px] hover:opacity-80 transition-opacity w-[80px] h-12 lg:h-16"/>
                <div class="absolute right-[16px]">
                    <a v-if="!hasLogged" :href="`/conta/login?r=${route.fullPath}`" class="text-base text-white">Login</a>
                    <UserMenu v-else :show-border="false" :show-name="false"/>
                </div>
            </div>
        </Container>
    </div>
</template>