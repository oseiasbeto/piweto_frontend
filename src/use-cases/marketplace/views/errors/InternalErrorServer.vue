<script setup>
import Container from '../../components/ui/Container.vue';
</script>

<template>
    <Container>
        <div class="px-4 xl:px-0">
            <div class="flex pt-3 mt-3 lg:mt-7 pb-2 lg:py-3 flex-col lg:flex-row lg:justify-between lg:items-center">
                <div></div>
                <div class="flex items-center text-[#6c757d]">
                    <router-link class="text-brand-primary hover:underline" to="/">Home</router-link>
                    <span class="mx-1.5">/</span>
                    <p>Erro interno</p>
                </div>
            </div>
        </div>
    </Container>
    <div class="mt-5 lg:mt-4 mb-2">
        <hr>
    </div>
    <Container>
        <div class=" pt-16 pb-32">
            <div class="px-4 text-center">
                <svg class="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" width="56px" height="56px"
                    viewBox="0 0 24 24" fill="none">
                    <path
                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="#6c757d" stroke-width="2" />
                    <path d="M8 16C8.91221 14.7856 10.3645 14 12.0004 14C13.6362 14 15.0885 14.7856 16.0007 16"
                        stroke="#6c757d" stroke-width="2" stroke-linecap="round" />
                    <path d="M9 10.0112V10" stroke="#6c757d" stroke-width="2" stroke-linecap="round" />
                    <path d="M15 10.0112V10" stroke="#6c757d" stroke-width="2" stroke-linecap="round" />
                </svg>

                <h1 class="font-bold mb-3 text-3xl">Oopss!! Algo deu errado!</h1>

                <p class="my-2">Estamos enfrentando problemas internos e não conseguimos processar sua solicitação.</p>
                <br>
                <p>Que tal tentar voltar para a página inicial?</p>
                <div class="mt-5">
                    <router-link
                        class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] w-min mx-auto whitespace-nowrap font-bold text-sm rounded px-4 h-10 p-2 uppercase disabled:bg-gray-200"
                        to="/">Voltar para Home</router-link>
                </div>

            </div>
        </div>
    </Container>
</template>
