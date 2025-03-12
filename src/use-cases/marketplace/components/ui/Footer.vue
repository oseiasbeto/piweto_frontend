<script setup>
import Logo from '@/components/Logo.vue';
import Container from '@/use-cases/marketplace/components/ui/Container.vue';

</script>

<template>
    <div class="w-full bg-white relative border-t-2 border-brand-primary">
        <Container>
            <div class="flex px-4 justify-center pt-10 pb-16">
                <div>
                    <div class="flex justify-center">
                        <Logo size="w-[100px] h-[56px]" />
                    </div>

                    <ul class="flex flex-wrap text-sm justify-center items-center gap-2 lg:gap-3 py-4">
                        <li class="flex items-center gap-1.5"><a href="/conta/login" class="flex flex-nowrap hover:underline">Login</a> | </li>
                        <li class="flex items-center gap-1.5"><a class="flex flex-nowrap hover:underline" href="/conta/registrar-se">Criar
                                Conta</a> | </li>
                        <li class="flex items-center gap-1.5"><a class="flex flex-nowrap hover:underline" href="/meus-ingressos">Meus Ingressos</a> | </li>
                        <li class="flex items-center gap-1.5"><a class="flex flex-nowrap hover:underline" href="/como-funciona">Sou organizador</a> | </li>

                        <li class="flex items-center gap-1.5"><a class="flex flex-nowrap hover:underline" href="https://wa.me/948360831" target="_blank">Fale
                                conosco</a> </li>

                    </ul>
                    <div class="pt-3 pb-8">
                         <hr>
                    </div>
            
                    <div class="subfooter text-sm text-center">
                        <p>
                            © Piweto - Todos os direitos reservados.

                            <br>

                            NIF: 482819381281671



                        </p>
                       
                     
                        <ul class="flex gap-1.5 my-3 justify-center items-center mx-auto">

                            <li><a href="/termos-de-uso/" target="_blank">Termos de uso</a>
                            </li>
                            <li><a href="/politica-de-privacidade/" target="_blank">Política de
                                    privacidade</a></li>

                        </ul>
                    </div>
                </div>
            </div>
        </Container>

    </div>
</template>