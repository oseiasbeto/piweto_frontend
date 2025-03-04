<script setup>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";

const showCookieBanner = ref(false);
const COOKIE_NAME = "cookies_accepted"; // Nome do cookie
const COOKIE_EXPIRY_DAYS = 365; // Dias até expirar

// Função para aceitar os cookies
const acceptCookies = () => {
    Cookies.set(COOKIE_NAME, "true", { expires: COOKIE_EXPIRY_DAYS });
    showCookieBanner.value = false; // Oculta o banner
};

// Função para verificar se o cookie já existe
const checkCookieConsent = () => {
    return Cookies.get(COOKIE_NAME) === "true";
};

// Verifica o consentimento no carregamento do componente
onMounted(() => {
    if (!checkCookieConsent()) {
    
        setTimeout(() => {
            showCookieBanner.value = true
        }, 1999)
    } else showCookieBanner.value = false
});

</script>


<template>

    <Transition name="fade">
        <div v-show="showCookieBanner"
            class="fixed left-0 bottom-0 m-2 my-3 border border-gray-200 w-auto md:m-0 md:left-8 md:bottom-10 md:w-96 d4w  bg-white z-[9999] rounded-md py-5">
            <div class="px-4 relative">
                <!--start header alert cookies-->
                <div class="hidden md:block">
                    <button @click="acceptCookies" class="absolute top-[-24px] right-[-16px]  w-10 h-10"
                        aria-label="Fechar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12px" viewBox="0 0 348.333 348.334">
                            <path fill="#565656"
                                d="M336.559 68.611L231.016 174.165l105.543 105.549c15.699 15.705 15.699 41.145 0 56.85-7.844 7.844-18.128 11.769-28.407 11.769-10.296 0-20.581-3.919-28.419-11.769L174.167 231.003 68.609 336.563c-7.843 7.844-18.128 11.769-28.416 11.769-10.285 0-20.563-3.919-28.413-11.769-15.699-15.698-15.699-41.139 0-56.85l105.54-105.549L11.774 68.611c-15.699-15.699-15.699-41.145 0-56.844 15.696-15.687 41.127-15.687 56.829 0l105.563 105.554L279.721 11.767c15.705-15.687 41.139-15.687 56.832 0 15.705 15.699 15.705 41.145.006 56.844z" />
                        </svg>
                    </button>
                </div>
                <!--end header alert cookies-->

                <!--start body alert cookies-->
                <div>
                    <div class="px-2 gap-2 flex items-center pb-3">
                        <div class="banner_logo">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                width="34px" version="1.1" id="Layer_1" viewBox="0 0 512 512" xml:space="preserve">
                                <path style="fill:#FFC033;"
                                    d="M471.801,434.713C423.206,484.554,358.118,512,288.536,512c-13.594,0-26.945-1.07-39.97-3.114  C126.312,489.645,32.533,383.558,32.533,255.997c0-68.08,26.308-132.124,74.091-180.327c38.833-39.172,88.241-64.261,141.941-72.588  c12.376-1.936,24.968-2.965,37.723-3.074c27.798-0.217,55.217,3.967,81.444,12.498c8.652,2.816,15.49,9.681,18.279,18.347  c2.789,8.652,1.232,18.184-4.143,25.482c-19.308,26.254-29.517,57.41-29.517,90.109c0,48.636,22.422,93.197,61.54,122.267  c8.896,6.608,12.863,18.239,9.884,28.949c-1.977,7.095-2.979,14.434-2.979,21.813c0,30.574,16.898,58.29,44.087,72.358  c7.555,3.9,12.877,11.252,14.244,19.674C480.48,419.927,477.745,428.606,471.801,434.713z" />
                                <path style="fill:#F9A926;"
                                    d="M471.801,434.713C423.206,484.554,358.118,512,288.536,512c-13.594,0-26.945-1.07-39.97-3.114V3.082  c12.376-1.936,24.968-2.965,37.723-3.074c27.798-0.217,55.217,3.967,81.444,12.498c8.652,2.816,15.49,9.681,18.279,18.347  c2.789,8.652,1.232,18.184-4.143,25.482c-19.308,26.254-29.517,57.41-29.517,90.109c0,48.636,22.422,93.197,61.54,122.267  c8.896,6.608,12.863,18.239,9.884,28.949c-1.977,7.095-2.979,14.434-2.979,21.813c0,30.574,16.898,58.29,44.087,72.358  c7.555,3.9,12.877,11.252,14.244,19.674C480.48,419.927,477.745,428.606,471.801,434.713z" />
                                <path style="fill:#A6673A;"
                                    d="M270.027,177.519c0,31.237-25.401,56.638-56.638,56.638s-56.638-25.401-56.638-56.638  s25.401-56.638,56.638-56.638S270.027,146.282,270.027,177.519z" />
                                <path style="fill:#99522E;"
                                    d="M270.027,177.519c0,31.237-25.401,56.638-56.638,56.638V120.88  C244.625,120.88,270.027,146.282,270.027,177.519z" />
                                <path style="fill:#A6673A;"
                                    d="M253.63,315.709c0,35.665-29.03,64.681-64.695,64.681s-64.681-29.016-64.681-64.681  s29.016-64.695,64.681-64.695S253.63,280.044,253.63,315.709z" />
                                <path style="fill:#99522E;"
                                    d="M253.63,315.709c0,35.665-29.03,64.681-64.695,64.681V251.014  C224.6,251.014,253.63,280.044,253.63,315.709z" />
                                <path style="fill:#A6673A;"
                                    d="M356.751,362.314c0,27.134-22.084,49.218-49.232,49.218c-27.134,0-49.218-22.084-49.218-49.218  c0-27.148,22.084-49.232,49.218-49.232C334.667,313.082,356.751,335.166,356.751,362.314z" />
                                <path style="fill:#99522E;"
                                    d="M356.751,362.314c0,27.134-22.084,49.218-49.232,49.218v-98.45  C334.667,313.082,356.751,335.166,356.751,362.314z" />
                            </svg>
                        </div>
                        <div class="text-xs nd:text-sm font-semibold text-gray-600">
                            <div id="onetrust-policy-text">Utilizamos cookies para melhorar a sua experiência.
                                <a class="text-brand-info underline" href="/termos-de-uso"
                                    aria-label="Termos e Políticas, abre num separador novo" rel="noopener"
                                    target="_blank">Termos de uso</a>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex flex-row items-center gap-2">
                        <button @click="acceptCookies"
                            class="flex items-center font-semibold text-sm flex-1 border border-brand-primary justify-center p-1.5 rounded-md bg-brand-primary text-white hover:opacity-80">Aceito</button>
                    </div>
                </div>

                <!--start end alert cookies-->
            </div>
        </div>
    </Transition>

</template>


<style>
.shlg {
    box-shadow: 0px 2px 10px -3px #999;
}

.d4w {
    box-shadow: 0 0 18px rgba(0, 0, 0, .2);
}
</style>