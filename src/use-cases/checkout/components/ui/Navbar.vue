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
    <div class="bg-[#343a40] relative z-[100] top-0 h-[56px] w-full">
        <Container>
            <div class="flex relative justify-center px-4 items-center">
                <Logo :is-white="true" size="w-[100px] h-[56px]"/>
                <div class="absolute right-[16px]">
                    <a v-if="!hasLogged" :href="`/conta/login?r=${route.fullPath}`" class="text-base text-white">Login</a>
                    <UserMenu v-else :show-border="false" :show-name="false"/>
                </div>
            </div>
        </Container>
    </div>
</template>