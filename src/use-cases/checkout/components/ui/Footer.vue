<script setup>
import Logo from '@/components/Logo.vue';
import Container from '@/use-cases/marketplace/components/ui/Container.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<template>
    <div class="bg-[rgb(221,224,228)] text-[rgb(132,140,155)] w-full p-6">
        <Container>
            <div :class="{ 'pb-[72px] lg:pb-0': route.name === 'Cart' }">
                <div class="mb-4">
                    <ul class="flex flex-wrap gap-4 text-sm">
                        <li>
                            <a class="text-xs hover:underline"
                                href="https://api.whatsapp.com/send/?phone=948360831&text&type=phone_number&app_absent=0"
                                target="_blank" rel="noopener noreferrer">
                                Central de ajuda
                            </a>
                        </li>

                        <li>
                            <a class="text-xs hover:underline" href="/termos-de-uso" target="_blank"
                                rel="noopener noreferrer">
                                Termos de Uso
                            </a>
                        </li>

                        <li>
                            <a class="text-xs hover:underline" href="/politica-de-privacidade" target="_blank"
                                rel="noopener noreferrer">
                                Privacidade
                            </a>
                        </li>
                        <li>
                            <a class="text-xs hover:underline" href="/como-funciona" target="_blank"
                                rel="noopener noreferrer">
                                Sou organizador de eventos
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="flex">
                    <div class="flex items-center gap-2">
                        <Logo :is-gray="true" size="w-[80px] h-[56px]" />
                        <p class="text-[10px]"><span>Piweto Internet Soluções S.A.</span> © Copyright 2025</p>
                    </div>
                </div>
            </div>

        </Container>
    </div>
</template>