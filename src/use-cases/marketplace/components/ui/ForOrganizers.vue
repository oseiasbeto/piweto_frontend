<script setup>
import Container from "./Container";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore()

const hasLogged = computed(() => {
    return store.getters.hasLogged
})
</script>

<template>
    <Container>
        <div class="p-4 lg:mb-10 w-full text-center bg-gray-50">
            <h1 class="font-bold mt-7 text-center my-2 leading-6 text-xl lg:text-3xl">Para Produtores de Eventos</h1>
            <h3 class="text-sm lg:text-base">Tecnologia para você divulgar, vender e acompanhar as vendas do seu evento
                em tempo-real.</h3>
            <hr class="w-1/3 my-3 mx-auto">
            <ul class="flex flex-col gap-3 lg:flex-row justify-center py-4 mt-3 items-center lg:gap-3">
                <li> <a :href="hasLogged ? '/eventos/novo-evento?tipo=presencial' : '/conta/login?r=/eventos/novo-evento?tipo=presencial'"
                        class="border flex items-center gap-1 text-sm lg:text-base border-brand-primary text-brand-primary font-semibold py-2 lg:py-2.5 px-4 hover:bg-brand-primary hover:text-white"
                        >Publicar evento
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24px" height="24px"
                            viewBox="-3 0 19 19" class="cf-icon-svg">
                            <path
                                d="M11.882 3.187a.476.476 0 0 1 .475.475v11.063a.476.476 0 0 1-.475.475H1.118a.476.476 0 0 1-.475-.475V3.662a.476.476 0 0 1 .475-.475h1.328v.721a1.425 1.425 0 0 0 2.85 0v-.72H7.71v.72a1.425 1.425 0 0 0 2.85 0v-.72zm-.634 3.37H1.752v7.535h9.496zm-7.384.821H2.621V8.67h1.243zm0 2.292H2.621v1.292h1.243zm0 2.292H2.621v1.291h1.243zm.561-8.054V2.475a.554.554 0 1 0-1.108 0v1.433a.554.554 0 1 0 1.108 0zm1.613 3.47H4.794V8.67h1.244zm0 2.292H4.794v1.292h1.244zm0 2.292H4.794v1.291h1.244zm2.174-4.584H6.968V8.67h1.244zm0 2.292H6.968v1.292h1.244zm0 2.292H6.968v1.291h1.244zm1.477-8.054V2.475a.554.554 0 0 0-1.108 0v1.433a.554.554 0 0 0 1.108 0zm.696 3.47H9.142V8.67h1.243zm0 2.292H9.142v1.292h1.243zm0 2.292H9.142v1.291h1.243z" />
                        </svg>
                    </a> </li>
                <li>
                    <a href="/como-funciona"
                        class="border flex items-center gap-1.5 text-sm lg:text-base border-brand-primary text-brand-primary font-semibold py-2 lg:py-2.5 px-4 hover:bg-brand-primary hover:text-white"
                        to="/">Saber mais
                        <svg xmlns:x="http://ns.adobe.com/Extensibility/1.0/"
                            xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/"
                            xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" fill="currentColor"
                            version="1.1" baseProfile="tiny" id="Layer_1" width="16px" height="16px" viewBox="0 0 42 42"
                            xml:space="preserve">
                            <polygon fill-rule="evenodd"
                                points="13.933,1 34,21.068 14.431,40.637 9.498,35.704 24.136,21.068 9,5.933 " />
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
    </Container>
</template>