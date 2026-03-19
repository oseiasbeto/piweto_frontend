<script setup>
import Logo from '@/components/Logo.vue';
import UserMenu from '@/components/UserMenu'
import { computed } from "vue"
import { useRouter } from 'vue-router';

// Define as props deste componente.
const props = defineProps({
    sticked: {
        type: Boolean,
        default: true
    }
})

const router = useRouter()

// Esta função computada tem como finalidade atribuir uma classe dinâmica a este componente.
const positionClass = computed(() => {
    if (props.sticked) {
        return "sticky top-0"
    } else {
        return "relative"
    }
})
</script>

<template>
    <!--start navbar component-->
    <div class="bg-white border-b z-[100] lg:border-none border-[#dfe0df] px-[20px] lg:px-8 
    lg:shadow-[0_1px_4px_0_rgba(0,0,0,0.2)] flex justify-between items-center w-[100%] h-[47px] lg:h-[70px]"
        :class="positionClass">
        <!--start left area-->
        <button class="w-8 h-8 text-brand-primary block lg:hidden">

        </button>
        <div class="flex items-center">
            <Logo size="w-[80px] lg:w-[100px]" />
            <a href="/eventos/meus-eventos"
                class="hidden lg:block text-brand-gray-500 border-l-2 px-2 ml-2 cursor-pointer border-gray-200 text-xs uppercase">
                <p>Área do produtor</p>
            </a>
        </div>
        <!--end left area-->

        <!--start right area-->
        <div>
            <!--start avatar area-->
            <UserMenu />
            <!--end avatar area-->
        </div>
        <!--end right area-->
    </div>
    <!--end navbar component-->
</template>
