<script setup>
import Logo from '@/components/Logo.vue'
import Container from '@/use-cases/marketplace/components/ui/Container.vue'
</script>

<template>
    <footer class="w-full bg-white mt-20">
        <Container>
            <div class="px-6 border-t border-neutral-200 lg:px-0 pt-14 pb-20">

                <!-- GRID PRINCIPAL -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    <!-- Para o organizador -->
                    <div>
                        <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-5">
                            Para o organizador
                        </h3>

                        <ul class="space-y-3 text-sm text-black/[.65]">
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Vender
                                    ingressos online</a></li>
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Área do
                                    produtor</a></li>
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Falar com um
                                    consultor</a></li>
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Criar
                                    evento</a></li>
                        </ul>
                    </div>

                    <!-- Para o participante -->
                    <div>
                        <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-5">
                            Para o participante
                        </h3>

                        <ul class="space-y-3 text-sm text-black/[.65]">
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Minhas
                                    compras</a></li>
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Central do
                                    participante</a></li>
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Falar com a
                                    Piweto</a></li>
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Termos de
                                    uso</a></li>
                            <li><a href="#" class="hover:text-black transition-colors duration-200">Política de
                                    privacidade</a></li>
                        </ul>
                    </div>

                    <!-- Categorias -->
                    <div>
                        <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-5">
                            Categorias
                        </h3>
                        

                        <ul class="space-y-3 text-sm text-black/[.65]">
                            <li><a href="/categoria/comedia-stand-up" class="hover:text-black transition-colors duration-200">Comédia Stand-up</a></li>
                            <li><a href="/categoria/corridas-e-esportes" class="hover:text-black transition-colors duration-200">Corridas e Esportes</a></li>
                            <li><a href="/categoria/cursos-e-workshops" class="hover:text-black transition-colors duration-200">Cursos e Workshops</a></li>
                            <li><a href="/categoria/Eventos-religiosos" class="hover:text-black transition-colors duration-200">Eventos Religiosos</a></li>
                            <li><a href="/categoria/excursoes-e-passeios" class="hover:text-black transition-colors duration-200">Excursões e passeios</a></li>
                            <li><a href="/categoria/shows-e-festas" class="hover:text-black transition-colors duration-200">Shows e festas</a></li>
                            <li><a href="/categoria/sociais-e-empresariais" class="hover:text-black transition-colors duration-200">Sociais e Empresariais</a>
                            </li>
                            <li><a href="/categoria/teatros-e-cultura" class="hover:text-black transition-colors duration-200">Teatros e Cultura</a></li>
                        </ul>
                    </div>

                    <!-- Marca -->
                    <div class="space-y-6 md:w-[240px] lg:w-[240px]">
                        <Logo :is-gray="true" size="w-[90px] h-auto" />

                        <p class="text-xs text-black/[0.40] leading-[18px]">
                           © 2025 Piweto Internet Solutions Ltda. - 18.540.147/0001-30 - Av. 4 de Fevereiro, 1234 - 3º andar - Luanda - Angola
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    </footer>
</template>