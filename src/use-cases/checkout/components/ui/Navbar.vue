<script setup>
import { useRoute } from "vue-router";
import Logo from '@/components/Logo.vue';
import { useStore } from "vuex";
import { computed } from "vue";
import Container from '@/use-cases/marketplace/components/ui/Container.vue';
import UserMenu from "@/components/UserMenu.vue";
import LocaleSelector from "./LocaleSelector.vue";
import NavToggle from "./NavToggle.vue";

const route = useRoute()
const store = useStore()

const hasLogged = computed(() => {
    return store.getters.hasLogged
})

</script>

<template>
    <div class="bg-[#191f28] sticky border-b border-b-[rgb(76,87,108)] z-[9999] top-0 h-12 lg:h-16 w-full">
        <Container>
            <div class="flex relative justify-between lg:px-4 items-center">
                <div>
                   <NavToggle/>
                </div>
                <Logo :is-white="true"
                    size="lg:w-[100px] ml-6 lg:ml-0 hover:opacity-80 transition-opacity w-[80px] h-12 lg:h-16" />

                <div class="mr-3 lg:mr-0">
                    <LocaleSelector />
                </div>
            </div>
        </Container>
    </div>
</template>