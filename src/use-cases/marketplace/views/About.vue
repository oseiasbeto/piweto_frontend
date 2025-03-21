<script setup>
import { computed } from 'vue';
import Container from '../components/ui/Container.vue';
import { useStore } from 'vuex';

const store = useStore()
const scrollToContent = () => {
    // Seleciona o elemento com o ID "content"
    const element = document.getElementById('content');

    // Verifica se o elemento existe
    if (element) {
        // Usa o método scrollIntoView com comportamento suave
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('Elemento com ID "content" não encontrado.');
    }
}
const hasLogged = computed(() => {
    return store.getters.hasLogged
})
</script>

<template>
    <div>
        <div class="h-[400px] lg:h-[450px] bg-[#612a92] bg-center bg-fixed" :style="{
            backgroundImage: 'url(https://img.goodfon.com/original/1361x769/9/1b/party-glow-neon-paint-fluorescent-dark-girl-light-model-uv-b.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }">
            <div class="w-full h-full flex justify-center">
                <div class="mt-24 px-4">
                    <h2 class="text-center mb-3.5 text-4xl lg:text-6xl font-bold text-white" data-animate-delay="0.2"
                        style="animation-delay: 0.2s;">
                        Plataforma de Eventos
                    </h2>
                    <h3 class="text-white text-lg lg:text-3xl text-center font-weight-normal" data-animate-delay="0.35"
                        style="animation-delay: 0.35s;">
                        Plataforma de venda de ingressos e gestão de participantes!
                    </h3>

                    <div class="flex justify-center mt-10 items-center gap-1.5">
                        <router-link
                            class="py-3.5 px-8 text-center rounded-full uppercase text-black bg-white text-sm font-semibold hover:opacity-90 transition-all"
                            to="/eventos/novo-evento?tipo=presencial">
                            Publicar evento
                        </router-link>
                        <button @click="scrollToContent()"
                            class="py-3.5 px-8 text-center rounded-full uppercase text-black bg-white text-sm font-semibold hover:opacity-90 transition-all">
                            Saiba mais
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-5 lg:mt-8 px-4">
            <Container>
                <div id="content" class="p-6 text-center">
                    <hr class="w-[20%] lg:w-[10%] my-3 mx-auto h-[3px] bg-[#612a92]">
                    <h2 class="text-3xl uppercase font-bold">Como funciona?</h2>
                    <p class="mt-1 font-light">Uma plataforma para ajudar você a criar, gerenciar e crescer o seu
                        evento.</p>
                    <hr class="my-3 w-[40%] mx-auto">
                </div>

                <div class="flex flex-wrap justify-center text-center">
                    <div class="w-full mb-2 lg:mb-5 md:w-1/2 lg:w-1/3 p-2">
                        <svg class="mx-auto w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]"
                            xmlns="http://www.w3.org/2000/svg" fill="#612a92" width="100px" height="100px"
                            viewBox="0 0 16 16">
                            <path
                                d="M14.25 2.1a1.25 1.25 0 0 0-1.17-.1L6.91 4.43a1.22 1.22 0 0 1-.46.09H2.5a1.25 1.25 0 0 0-1.25 1.25v.1H0v3h1.25V9a1.25 1.25 0 0 0 1.25 1.22L4 13.4a1.26 1.26 0 0 0 1.13.72h.63A1.25 1.25 0 0 0 7 12.87v-2.53l6.08 2.43a1.27 1.27 0 0 0 .47.09 1.29 1.29 0 0 0 .7-.22 1.25 1.25 0 0 0 .55-1V3.13a1.25 1.25 0 0 0-.55-1.03zm-8.5 3.67V9H2.5V5.77zm0 7.1h-.63l-1.23-2.65h1.86zm1.62-3.72A2.29 2.29 0 0 0 7 9V5.7a2.26 2.26 0 0 0 .37-.11l6.18-2.46v8.48zm7.46-3.03v2.5a1.25 1.25 0 0 0 0-2.5z" />
                        </svg>
                        <h4 class="mt-2 text-lg lg:text-xl font-bold lg:font-semibold">
                            Comece a vender em minutos
                        </h4>
                        <p class="text-gray-600 text-[15px] lg:text-base">Crie ingressos/inscrições para eventos e uma
                            página profissional.</p>
                    </div>
                    <div class="w-full mb-2 lg:mb-5 md:w-1/2 lg:w-1/3 p-2">
                        <svg class="mx-auto w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]"
                            xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"
                            fill="none">
                            <path
                                d="M9 13C9 15.2091 10.7909 17 13 17C14.1046 17 15.1046 16.5523 15.8284 15.8284M9 13H5M9 13C9 11.448 9.88388 10.1025 11.1757 9.43928M5 13C5 13.5523 4.55228 14 4 14C3.44772 14 3 13.5523 3 13C3 12.4477 3.44772 12 4 12C4.55228 12 5 12.4477 5 13ZM19.2929 6.70711C19.1119 6.52614 19 6.27614 19 6C19 5.44772 19.4477 5 20 5C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7C19.7239 7 19.4739 6.88807 19.2929 6.70711ZM19.2929 6.70711L15.8284 10.1716M9.37149 4.92872C9.73983 4.78126 10 4.42101 10 4C10 3.44772 9.55228 3 9 3C8.44772 3 8 3.44772 8 4C8 4.55228 8.44772 5 9 5C9.13127 5 9.25664 4.97471 9.37149 4.92872ZM9.37149 4.92872L11.1757 9.43928M15.8284 15.8284C16.5523 15.1046 17 14.1046 17 13C17 11.8954 16.5523 10.8954 15.8284 10.1716M15.8284 15.8284L19.2929 19.2929M19.2929 19.2929C19.1119 19.4739 19 19.7239 19 20C19 20.5523 19.4477 21 20 21C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19C19.7239 19 19.4739 19.1119 19.2929 19.2929ZM15.8284 10.1716C15.1046 9.44772 14.1046 9 13 9C12.3428 9 11.7227 9.15847 11.1757 9.43928"
                                stroke="#612a92" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <h4 class="mt-2 text-lg lg:text-xl font-bold lg:font-semibold">
                            Relatórios em tempo real
                        </h4>
                        <p class="text-gray-600 text-[15px] lg:text-base">Tenha acesso a dados de vendas e de check-in
                            em tempo real.</p>
                    </div>
                    <div class="w-full mb-2 lg:mb-5 md:w-1/2 lg:w-1/3 p-2">
                        <svg class="mx-auto w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]"
                            xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"
                            fill="none">
                            <path
                                d="M3 12V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.0799 19 6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V12M3 12H6.67452C7.16369 12 7.40829 12 7.63846 12.0553C7.84254 12.1043 8.03763 12.1851 8.21657 12.2947C8.4184 12.4184 8.59136 12.5914 8.93726 12.9373L9.06274 13.0627C9.40865 13.4086 9.5816 13.5816 9.78343 13.7053C9.96237 13.8149 10.1575 13.8957 10.3615 13.9447C10.5917 14 10.8363 14 11.3255 14H12.6745C13.1637 14 13.4083 14 13.6385 13.9447C13.8425 13.8957 14.0376 13.8149 14.2166 13.7053C14.4184 13.5816 14.5914 13.4086 14.9373 13.0627L15.0627 12.9373C15.4086 12.5914 15.5816 12.4184 15.7834 12.2947C15.9624 12.1851 16.1575 12.1043 16.3615 12.0553C16.5917 12 16.8363 12 17.3255 12H21M3 12L5.32639 6.83025C5.78752 5.8055 6.0181 5.29312 6.38026 4.91755C6.70041 4.58556 7.09278 4.33186 7.52691 4.17615C8.01802 4 8.57988 4 9.70361 4H14.2964C15.4201 4 15.982 4 16.4731 4.17615C16.9072 4.33186 17.2996 4.58556 17.6197 4.91755C17.9819 5.29312 18.2125 5.8055 18.6736 6.83025L21 12"
                                stroke="#612a92" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <h4 class="mt-2 text-lg lg:text-xl font-bold lg:font-semibold">
                            Mailing valioso
                        </h4>
                        <p class="text-gray-600 text-[15px] lg:text-base">Alcance seu público-alvo onde quer que esteja.
                        </p>
                    </div>
                    <div class="w-full mb-2 lg:mb-5 md:w-1/2 lg:w-1/3 p-2">
                        <svg class="mx-auto w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]"
                            xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"
                            id="Layer_1" data-name="Layer 1">
                            <rect class="cls-1" x="5.16" y="1.25" width="13.68" height="21.5" rx="1.95" />
                            <path class="cls-1" d="M14,2.23h-3.9a1,1,0,0,1-1-1h5.86A1,1,0,0,1,14,2.23Z" />
                            <path class="cls-1"
                                d="M18.84,8c2.38.73,3.91,1.81,3.91,3s-1.53,2.3-3.91,3a20.46,20.46,0,0,1-3.91.74" />
                            <path class="cls-1"
                                d="M12,14.93A24.37,24.37,0,0,1,5.16,14c-2.38-.72-3.91-1.81-3.91-3S2.78,8.73,5.16,8" />
                            <polyline class="cls-1" points="9.07 12 12 14.93 9.07 17.86" />
                        </svg>
                        <h4 class="mt-2 text-lg lg:text-xl font-bold lg:font-semibold">
                            App Organizador
                        </h4>
                        <p class="text-gray-600 text-[15px] lg:text-base">Aplicativo para controle de portaria, ágil e
                            seguro contra
                            falsificações.</p>
                    </div>
                    <div class="w-full mb-2 lg:mb-5 md:w-1/2 lg:w-1/3 p-2">
                        <svg class="mx-auto w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]"
                            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#612a92"
                            height="100px" width="100px" version="1.1" id="Layer_1" viewBox="0 0 512 512"
                            xml:space="preserve">
                            <g>
                                <g>
                                    <g>
                                        <path
                                            d="M149.333,405.333c-11.776,0-21.333,9.557-21.333,21.333S137.557,448,149.333,448s21.333-9.557,21.333-21.333     S161.109,405.333,149.333,405.333z" />
                                        <path
                                            d="M490.667,85.333h-192V42.624C298.667,19.087,279.579,0,256.043,0H42.624C19.087,0,0,19.087,0,42.624v426.752     C0,492.913,19.087,512,42.624,512h213.419c23.537,0,42.624-19.087,42.624-42.624V384h192c11.782,0,21.333-9.551,21.333-21.333     v-256C512,94.885,502.449,85.333,490.667,85.333z M469.333,170.667H192V128h85.333h192V170.667z M256,469.333H42.667V42.667H256     v42.667h-85.333c-11.782,0-21.333,9.551-21.333,21.333v256c0,11.782,9.551,21.333,21.333,21.333H256V469.333z M277.333,341.333     H192v-128h277.333v128H277.333z" />
                                        <path
                                            d="M427.509,256h-65.685c-11.307,0-20.501,9.173-20.501,20.48v23.04c0,11.307,9.195,20.48,20.501,20.48h65.685     c11.307,0,20.48-9.173,20.48-20.48v-23.04C447.989,265.173,438.816,256,427.509,256z" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <h4 class="mt-2 text-lg lg:text-xl font-bold lg:font-semibold">
                            Venda segura
                        </h4>
                        <p class="text-gray-600 text-[15px] lg:text-base">Processo de compra extremamente simples e
                            seguro com diversas formas de
                            pagamento.</p>
                    </div>
                    <div class="w-full mb-2 lg:mb-5 md:w-1/2 lg:w-1/3 p-2">
                        <svg class="mx-auto w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]"
                            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#612a92"
                            height="100px" width="100px" version="1.1" id="Layer_1" viewBox="0 0 512.009 512.009"
                            xml:space="preserve">
                            <g>
                                <g>
                                    <g>
                                        <path
                                            d="M480.896,389.792c-41.331-21.743-80.525-37.184-115.208-44.616c16.162-20.617,28.406-45.064,34.767-70.954     c15.37-6.276,26.231-21.378,26.231-38.979v-65.152c0-16.072-9.055-30.061-22.329-37.15C395.588,59.585,329.114,0,256.013,0     c-22.312,0-44.672,5.781-65.267,16.415C172.206,5.968,150.807,0,128.013,0c-70.683,0-128,57.317-128,128     c0,63.845,46.764,116.778,107.902,126.424c4.099,33.126,18.19,64.94,38.422,90.75c-34.675,7.432-73.871,22.875-115.198,44.615     c-19.132,10.071-31.134,29.948-31.134,51.563v49.323c0,11.782,9.551,21.333,21.333,21.333h469.333     c11.782,0,21.333-9.551,21.333-21.333v-49.323C512.004,419.735,500.021,399.86,480.896,389.792z M256.013,42.667     c55.209,0,106.667,49.873,106.667,106.667v85.333c0,8.79-1.023,17.564-2.91,26.166c-29.315,9.323-68.973,16.501-103.75,16.501     c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333c26.867,0,55.815-3.673,82.086-9.366     c-8.967,13.225-19.864,24.742-31.797,33.555c-0.592,0.34-1.174,0.699-1.734,1.097c-11.868,8.433-24.344,13.916-36.643,16.126     c-4.146,0.729-7.307,1.105-10.092,1.22c-0.609,0.017-1.218,0.035-1.827,0.035c-0.577,0-1.155-0.014-1.732-0.03     c-2.793-0.108-5.909-0.469-9.585-1.102c-12.897-2.334-25.373-7.816-37.241-16.249c-0.557-0.396-1.137-0.753-1.725-1.092     c-27.108-20.015-48.887-53.979-54.796-90.24c0.948-0.172,1.893-0.354,2.834-0.546c0.159-0.032,0.316-0.069,0.475-0.102     c0.827-0.172,1.652-0.35,2.474-0.539c0.348-0.08,0.693-0.166,1.039-0.248c0.631-0.15,1.262-0.302,1.89-0.461     c0.387-0.099,0.772-0.202,1.158-0.304c0.586-0.155,1.171-0.312,1.754-0.475c0.398-0.111,0.794-0.226,1.19-0.341     c0.567-0.165,1.133-0.333,1.697-0.505c0.399-0.122,0.798-0.245,1.195-0.371c0.563-0.178,1.124-0.361,1.684-0.547     c0.387-0.128,0.774-0.256,1.159-0.388c0.58-0.199,1.158-0.404,1.734-0.611c0.358-0.128,0.718-0.255,1.074-0.386     c0.644-0.238,1.284-0.484,1.923-0.731c0.283-0.11,0.568-0.215,0.85-0.326c0.917-0.363,1.829-0.735,2.735-1.118     c0.139-0.059,0.275-0.121,0.414-0.18c0.769-0.328,1.536-0.662,2.297-1.005c0.31-0.139,0.616-0.285,0.924-0.427     c0.586-0.269,1.17-0.54,1.751-0.818c0.351-0.168,0.699-0.341,1.049-0.512c0.535-0.262,1.07-0.526,1.601-0.796     c0.362-0.183,0.721-0.37,1.081-0.557c0.515-0.268,1.029-0.538,1.54-0.813c0.36-0.193,0.719-0.388,1.077-0.584     c0.512-0.281,1.021-0.567,1.528-0.854c0.347-0.197,0.694-0.393,1.04-0.594c0.524-0.304,1.043-0.613,1.562-0.924     c0.321-0.192,0.644-0.383,0.963-0.578c0.579-0.354,1.153-0.715,1.726-1.078c0.251-0.159,0.505-0.315,0.756-0.475     c0.82-0.527,1.635-1.063,2.443-1.608c0.103-0.07,0.204-0.142,0.307-0.212c0.703-0.478,1.402-0.961,2.095-1.452     c0.274-0.194,0.544-0.393,0.816-0.59c0.518-0.373,1.035-0.748,1.547-1.128c0.31-0.23,0.616-0.465,0.924-0.698     c0.47-0.356,0.939-0.714,1.404-1.076c0.318-0.248,0.633-0.498,0.948-0.749c0.451-0.358,0.899-0.719,1.345-1.083     c0.315-0.257,0.629-0.516,0.941-0.776c0.444-0.37,0.885-0.744,1.324-1.12c0.302-0.259,0.605-0.517,0.904-0.779     c0.453-0.395,0.901-0.795,1.349-1.197c0.277-0.249,0.556-0.496,0.832-0.747c0.494-0.451,0.981-0.908,1.467-1.366     c0.221-0.208,0.445-0.414,0.665-0.624c0.702-0.671,1.397-1.348,2.083-2.034c0.073-0.073,0.143-0.147,0.216-0.22     c0.612-0.615,1.219-1.235,1.818-1.862c0.231-0.242,0.457-0.487,0.686-0.731c0.438-0.465,0.875-0.931,1.306-1.403     c0.258-0.283,0.513-0.569,0.769-0.854c0.394-0.44,0.788-0.88,1.176-1.325c0.265-0.303,0.527-0.609,0.789-0.915     c0.374-0.436,0.745-0.875,1.113-1.317c0.261-0.313,0.52-0.626,0.778-0.942c0.366-0.447,0.727-0.897,1.087-1.349     c0.249-0.313,0.497-0.625,0.743-0.94c0.368-0.472,0.731-0.948,1.093-1.425c0.228-0.3,0.457-0.599,0.682-0.901     c0.397-0.534,0.788-1.073,1.177-1.613c0.18-0.25,0.363-0.497,0.541-0.748c0.564-0.794,1.119-1.594,1.665-2.402     c0.044-0.065,0.086-0.131,0.129-0.196c0.501-0.744,0.994-1.492,1.479-2.247c0.177-0.276,0.349-0.555,0.524-0.832     c0.347-0.548,0.692-1.097,1.031-1.651c0.2-0.328,0.396-0.658,0.593-0.987c0.306-0.511,0.61-1.023,0.909-1.538     c0.202-0.348,0.401-0.699,0.6-1.049c0.287-0.505,0.571-1.013,0.851-1.522c0.196-0.357,0.391-0.715,0.584-1.075     c0.276-0.514,0.548-1.031,0.818-1.549c0.185-0.356,0.37-0.712,0.552-1.07c0.273-0.539,0.541-1.081,0.807-1.624     c0.167-0.341,0.336-0.681,0.5-1.023c0.29-0.605,0.571-1.214,0.852-1.824c0.131-0.284,0.265-0.566,0.394-0.852     c0.404-0.897,0.8-1.798,1.184-2.705c0.027-0.063,0.051-0.127,0.078-0.19c0.356-0.845,0.704-1.695,1.042-2.55     c0.122-0.308,0.238-0.62,0.358-0.929c0.237-0.613,0.474-1.227,0.702-1.845c0.134-0.364,0.264-0.731,0.395-1.096     c0.204-0.569,0.407-1.139,0.603-1.712c0.133-0.387,0.262-0.777,0.391-1.166c0.185-0.559,0.368-1.119,0.546-1.681     c0.126-0.397,0.249-0.795,0.371-1.193c0.173-0.566,0.341-1.133,0.506-1.702c0.114-0.394,0.229-0.787,0.34-1.182     c0.165-0.59,0.324-1.182,0.481-1.776c0.1-0.377,0.202-0.753,0.298-1.132c0.167-0.654,0.324-1.311,0.481-1.969     c0.076-0.32,0.156-0.638,0.23-0.958c0.225-0.979,0.44-1.962,0.642-2.95c0.005-0.024,0.009-0.048,0.014-0.073     c0.197-0.964,0.381-1.931,0.556-2.903c0.059-0.328,0.112-0.659,0.168-0.989c0.115-0.67,0.229-1.34,0.334-2.013     c0.061-0.391,0.116-0.785,0.173-1.177c0.09-0.618,0.178-1.236,0.26-1.857c0.054-0.414,0.104-0.829,0.155-1.244     c0.073-0.605,0.143-1.212,0.208-1.819c0.045-0.424,0.088-0.849,0.129-1.274c0.059-0.608,0.112-1.217,0.162-1.827     c0.035-0.422,0.069-0.843,0.1-1.266c0.046-0.632,0.084-1.265,0.12-1.9c0.023-0.402,0.049-0.803,0.068-1.205     c0.034-0.697,0.057-1.396,0.08-2.095c0.011-0.341,0.026-0.682,0.035-1.024c0.025-1.042,0.04-2.086,0.04-3.133     c0-1.02-0.015-2.037-0.039-3.052c-0.01-0.41-0.027-0.818-0.04-1.227c-0.019-0.582-0.039-1.164-0.066-1.745     c-0.025-0.547-0.057-1.093-0.09-1.638c-0.024-0.407-0.049-0.814-0.077-1.221c-0.046-0.67-0.097-1.339-0.154-2.007     c-0.018-0.213-0.037-0.425-0.057-0.637c-2.333-26.122-12.512-49.986-28.169-69.219l4.415-1.298     C239.805,43.788,247.965,42.667,256.013,42.667z M42.679,128c0-47.119,38.214-85.333,85.333-85.333     c17.525,0,33.814,5.294,47.368,14.359c0.66,0.612,1.367,1.192,2.123,1.735c18.075,12.974,30.336,32.076,34.38,53.564     c0.066,0.356,0.13,0.713,0.191,1.071c0.158,0.904,0.3,1.812,0.429,2.724c0.11,0.791,0.214,1.585,0.303,2.383     c0.049,0.433,0.096,0.866,0.138,1.3c0.11,1.153,0.201,2.312,0.265,3.478c0.015,0.275,0.025,0.55,0.038,0.825     c0.058,1.292,0.099,2.588,0.099,3.894c0,47.119-38.214,85.333-85.333,85.333S42.679,175.119,42.679,128z M469.338,469.342H42.671     v-27.989c0-5.773,3.226-11.114,8.337-13.805c45.473-23.922,87.51-39.302,120.968-43.539h16.405     c19.864,12.844,41.933,20.62,64.541,21.273c1.029,0.036,2.057,0.061,3.082,0.061c1.026,0,2.053-0.025,3.081-0.061     c22.614-0.649,44.689-8.426,64.559-21.273h16.389c33.474,4.237,75.511,19.615,120.994,43.542     c5.095,2.682,8.311,8.016,8.311,13.802V469.342z" />
                                        <path
                                            d="M136.1,144.192h32.363v16.171c0,4.48,3.627,8.107,8.107,8.107c4.459,0,8.085-3.627,8.085-8.107v-16.171h8.085     c4.48,0,8.107-3.627,8.107-8.107c0-4.459-3.627-8.085-8.107-8.085h-8.085V87.531c0-3.392-2.133-6.443-5.333-7.595     c-3.2-1.152-6.784-0.192-8.981,2.432l-40.448,48.555c-2.005,2.389-2.453,5.76-1.109,8.597     C130.106,142.357,132.964,144.192,136.1,144.192z M168.463,109.888V128H153.38L168.463,109.888z" />
                                        <path
                                            d="M119.921,152.267H87.068l27.968-24.128c8.171-8.171,10.624-20.459,6.251-31.275     c-4.288-10.56-13.888-17.237-25.643-17.408c-17.856,0-32.363,14.507-32.363,32.363c0,4.459,3.605,8.085,8.085,8.085     c4.48,0,8.085-3.627,8.085-8.085c0-8.917,7.253-16.192,16.469-16.192c6.912,0.128,9.664,5.611,10.347,7.296     c1.557,3.819,1.664,9.451-2.24,13.376l-36.651,31.595c-3.755,3.243-5.056,8.32-3.328,12.949     c1.728,4.629,6.037,7.616,10.965,7.616h44.907c4.48,0,8.085-3.627,8.085-8.085C128.006,155.893,124.401,152.267,119.921,152.267z     " />
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <h4 class="mt-2 text-lg lg:text-xl font-bold lg:font-semibold">
                            Gestão compartilhada
                        </h4>
                        <p class="text-gray-600 text-[15px] lg:text-base">Administre seu evento dando acesso individual
                            à área específica de cada
                            colaborador.</p>
                    </div>
                </div>
            </Container>
        </div>
        <div id="preco" class="bg-gray-50 py-8 lg:py-12">
            <div class="container mx-auto px-4">
                <!-- Linha decorativa e título -->
                <hr class="w-[20%] lg:w-[10%] my-3 mx-auto h-[3px] bg-[#612a92]">
                <h2 class="text-3xl mb-4 text-center uppercase font-bold">Quanto custa?</h2>
                <hr class="w-1/2 mx-auto border-t-2 border-gray-300 mb-8">

                <!-- Preços para eventos gratuitos e pagos -->
                <div class="flex flex-wrap justify-center">
                    <!-- Eventos gratuitos -->


                    <!-- Eventos pagos -->
                    <div class="w-full md:w-1/2 lg:w-1/2 text-center p-4">
                        <h4 class="text-primary text-[#612a92] text-2xl font-semibold mb-4">EVENTOS PAGOS</h4>
                        <h1 class="text-5xl font-bold mb-2">4%</h1>
                        <h6 class="text-gray-600 text-lg">(Por cada venda de ingresso)</h6>
                        <br>
                        <p class="text-[15px] lg:text-base">
                            Taxa cobrada por ingresso vendido. Já inclui o valor cobrado pelas administradoras de
                            transações via Multicaixa e pode ser repassada integralmente ao comprador, sem nenhum custo
                            para o produtor.
                        </p>
                    </div>
                </div>

                <!-- Como receber pelas vendas -->
                <hr class="w-1/2 mx-auto border-t-2 border-gray-300 my-4">
                <div class="text-center">
                    <h4 class="text-2xl font-bold mb-4">Como recebo pelas vendas?</h4>
                    <hr class="w-1/2 mx-auto border-t-2 border-gray-300 mb-6">
                    <div class="flex justify-center">
                        <div class="w-full md:w-1/2 text-center">
                            <h5 class="text-xl font-semibold mb-4">Transferência Bancária</h5>
                            <p class="text-[15px] lg:text-base">
                                O valor vendido será creditado na conta bancária de sua preferência de acordo com as
                                solicitações de saque.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Container>
            <div class="p-4 lg:mb-10 w-full text-center bg-white">
                <h1 class="font-bold mt-7 text-center my-2 leading-6 text-2xl lg:text-3xl">Para Revolucione seus
                    eventos!
                </h1>
                <h3 class="text-sm w-full lg:w-[80%] mx-auto lg:text-base">Tecnologia para você divulgar, vender e
                    acompanhar as ecnologia para você divulgar, vender e acompanhar as vendas do seu evento em
                    tempo-real.</h3>
                <hr class="w-1/3 my-3 mx-auto">
                <ul class="flex flex-col gap-3 lg:flex-row justify-center py-4 mt-3 items-center lg:gap-3">
                    <li> <a :href="hasLogged ? '/eventos/novo-evento?tipo=presencial' : '/conta/login?r=/eventos/novo-evento?tipo=presencial'"
                            class="border flex items-center gap-1 text-sm lg:text-base border-[#612a92] text-[#612a92] font-semibold py-2 lg:py-2.5 px-4 hover:bg-[#612a92] hover:text-white">Publicar
                            evento
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24px" height="24px"
                                viewBox="-3 0 19 19" class="cf-icon-svg">
                                <path
                                    d="M11.882 3.187a.476.476 0 0 1 .475.475v11.063a.476.476 0 0 1-.475.475H1.118a.476.476 0 0 1-.475-.475V3.662a.476.476 0 0 1 .475-.475h1.328v.721a1.425 1.425 0 0 0 2.85 0v-.72H7.71v.72a1.425 1.425 0 0 0 2.85 0v-.72zm-.634 3.37H1.752v7.535h9.496zm-7.384.821H2.621V8.67h1.243zm0 2.292H2.621v1.292h1.243zm0 2.292H2.621v1.291h1.243zm.561-8.054V2.475a.554.554 0 1 0-1.108 0v1.433a.554.554 0 1 0 1.108 0zm1.613 3.47H4.794V8.67h1.244zm0 2.292H4.794v1.292h1.244zm0 2.292H4.794v1.291h1.244zm2.174-4.584H6.968V8.67h1.244zm0 2.292H6.968v1.292h1.244zm0 2.292H6.968v1.291h1.244zm1.477-8.054V2.475a.554.554 0 0 0-1.108 0v1.433a.554.554 0 0 0 1.108 0zm.696 3.47H9.142V8.67h1.243zm0 2.292H9.142v1.292h1.243zm0 2.292H9.142v1.291h1.243z" />
                            </svg>
                        </a> </li>
                    <li>
                        <a href="https://wa.me/948360831" target="_blank"
                            class="border flex items-center gap-1.5 text-sm lg:text-base border-[#612a92] text-[#612a92] font-semibold py-2 lg:py-2.5 px-4 hover:bg-[#612a92] hover:text-white"
                            to="/">Fale conosco
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16px" height="16px"
                                viewBox="0 0 32 32" version="1.1">
                                <title>whatsapp</title>
                                <path
                                    d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </Container>
    </div>
</template>

<style scoped>
.cls-1 {
    fill: none;
    stroke: #612a92;
    stroke-miterlimit: 10;
    stroke-width: 1.95px;
}
</style>