<script setup>
import { useOrders } from "../../../repositories/orders-repository";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { onMounted, computed, ref } from "vue";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import formatAmount from "@/utils/formatAmount";
import Container from "../../marketplace/components/ui/Container";
import Spinner from "../components/ui/Spinner.vue";
import moment from "moment";

const { getOrderById, loading } = useOrders()
loading.value = true

const route = useRoute()
const store = useStore()

// busque os dados do currente pedido
const order = computed(() => {
    return store.getters.order
})

// quando montar a tela, faca a requisicao para api buscando um pedido com base no id passado na routa desta pagina.
onMounted(async () => {
    const id = route.params.id
    await getOrderById(id)
})
</script>

<template>
    <div v-if="!loading">
        <!--start header-->
        <div>
            <!--start bg wrapper-->
            <div class="hidden lg:flex h-[92vh] overflow-hidden max-h-[480px] min-h-[480px]">
                <div class="relative h-full flex-1 text-center z-10">
                    <div class="max-h-[480px] h-full block">
                        <div :style="`background-image: linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.2)) , url(${order.event.cover.medium || 'https://i.ibb.co/RpzZJGzc/5f282a0c6a2d9.png'})`"
                            class="img-blur-event"></div>
                    </div>
                </div>
            </div>
            <!--end bg wrapper-->

            <!--start cover-->
            <div class="flex justify-center items-center mx-auto">
                <div class="mx-auto w-full flex items-center justify-center">
                    <img v-lazy="order.event.cover.medium || 'https://i.ibb.co/RpzZJGzc/5f282a0c6a2d9.png'"
                        class="relative rounded-none lg:absolute lg:mt-[-460px] img-event lg:rounded-[30px] w-full h-[190px] lg:w-[1000px] lg:h-[500px]">
                </div>
            </div>
            <!--end cover-->
        </div>
        <!--end header-->

        <!--data start-->
        <Container>
            <div class="mt-7 lg:mt-20">
                <div class="flex flex-col text-[#191f28] lg:flex-row justify-between">
                    <div class="px-4 flex-shrink-0 w-full">
                        <h3 style="letter-spacing: 0.2px;" class="text-[#191f28] mb-4 font-bold text-xl lg:text-3xl">{{
                            order.event.name
                            }}</h3>
                        <div class="text-[#495057] mb-4 text-[13px] lg:text-[15px]">
                            <span class="flex items-center gap-1">
                                <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" fill="currentColor" clip-rule="evenodd"
                                        d="M4 9.92004C4 7.79831 4.84285 5.76348 6.34315 4.26319C7.84344 2.7629 9.87827 1.92004 12 1.92004C14.1217 1.92004 16.1566 2.7629 17.6569 4.26319C19.1571 5.76348 20 7.79831 20 9.92004C20 15.4 13 21.5 12.65 21.76C12.4689 21.915 12.2384 22.0001 12 22.0001C11.7616 22.0001 11.5311 21.915 11.35 21.76C11.05 21.5 4 15.4 4 9.92004ZM12 19.65C10.32 18.06 6 13.65 6 9.92004C6 8.32874 6.63214 6.80262 7.75736 5.6774C8.88258 4.55219 10.4087 3.92004 12 3.92004C13.5913 3.92004 15.1174 4.55219 16.2426 5.6774C17.3679 6.80262 18 8.32874 18 9.92004C18 13.61 13.68 18.06 12 19.65ZM8.5 9.50004C8.5 8.80781 8.70527 8.13112 9.08986 7.55555C9.47444 6.97998 10.0211 6.53137 10.6606 6.26647C11.3001 6.00156 12.0039 5.93225 12.6828 6.0673C13.3617 6.20234 13.9854 6.53569 14.4749 7.02517C14.9644 7.51465 15.2977 8.13829 15.4327 8.81723C15.5678 9.49616 15.4985 10.1999 15.2336 10.8394C14.9687 11.479 14.5201 12.0256 13.9445 12.4102C13.3689 12.7948 12.6922 13 12 13C11.0717 13 10.1815 12.6313 9.52513 11.9749C8.86875 11.3185 8.5 10.4283 8.5 9.50004ZM10.5 9.50004C10.5 9.79672 10.588 10.0867 10.7528 10.3334C10.9176 10.5801 11.1519 10.7723 11.426 10.8859C11.7001 10.9994 12.0017 11.0291 12.2926 10.9712C12.5836 10.9133 12.8509 10.7705 13.0607 10.5607C13.2704 10.3509 13.4133 10.0837 13.4712 9.79268C13.5291 9.50171 13.4994 9.20011 13.3858 8.92602C13.2723 8.65193 13.08 8.41766 12.8334 8.25284C12.5867 8.08802 12.2967 8.00004 12 8.00004C11.6022 8.00004 11.2206 8.15808 10.9393 8.43938C10.658 8.72069 10.5 9.10222 10.5 9.50004Z">
                                    </path>
                                </svg>

                                <p>{{ order.event.address.location }}</p>
                            </span>
                            <span class="flex items-center gap-1">
                                <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" fill="currentColor" clip-rule="evenodd"
                                        d="M7 16C7 15.8022 7.05865 15.6089 7.16853 15.4444C7.27841 15.28 7.43459 15.1518 7.61732 15.0761C7.80004 15.0004 8.00111 14.9806 8.19509 15.0192C8.38907 15.0578 8.56725 15.153 8.70711 15.2929C8.84696 15.4327 8.9422 15.6109 8.98079 15.8049C9.01937 15.9989 8.99957 16.2 8.92388 16.3827C8.84819 16.5654 8.72002 16.7216 8.55557 16.8315C8.39112 16.9414 8.19778 17 8 17C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16ZM12 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7L3 19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4Z">
                                    </path>
                                </svg>

                                <p>{{ formatDate(order.event.starts_at.date) }} às {{ formatTime(order.event.starts_at.hm)
                                    }} > {{
                                        formatDate(order.event.ends_at.date) }} às {{ formatTime(order.event.ends_at.hm) }}
                                </p>
                            </span>
                        </div>
                        <hr>

                        <div class="flex justify-center">
                            <div class="py-4 text-center">
                                <svg class="mx-auto" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="80px" height="80px"
                                    viewBox="0 0 256 256" xml:space="preserve">

                                    <defs>
                                    </defs>
                                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
                                        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                        <circle cx="45" cy="45" r="45"
                                            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #ffc107; fill-rule: nonzero; opacity: 1;"
                                            transform="  matrix(1 0 0 1 0 0) " />
                                        <path
                                            d="M 38.478 64.5 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 c 1.862 1.646 2.037 4.49 0.391 6.352 l -26.521 30 C 40.995 63.947 39.767 64.5 38.478 64.5 z"
                                            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"
                                            transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                    </g>
                                </svg>

                                <h3 style="letter-spacing: 0.2px;"
                                    class="mt-4  mb-4 font-bold text-[1.75rem] lg:text-3xl">Pedido realizado com
                                    sucesso!</h3>

                                <p class="mt-5 mb-8">O número do seu pedido é: <b>{{ order.id }}</b></p>

                                <p class="font-bold text-base mb-3 mt-4">Agora só falta efectuar o pagamento!</p>
                                <p>Você tem 30 min para efectuar o pagamento abaixo, via Multicaixa ou internet banking:</p>

                                <div class="mx-auto my-6 p-5 bg-[#d4edda] text-[#155724] border border-[#c3e6cb]">
                                    <p class="pb-0 mt-2 fs-24 text-dark"><strong>Entidade:</strong> {{
                                        order.biz_content.entity_id }}</p>
                                    <p class="pb-0 mt-2 fs-24 text-dark"><strong>Referência:</strong> {{
                                        order.biz_content.reference_id }}</p>
                                    <p class="pb-0 mt-2 fs-24 text-dark"><strong>Montante:</strong> {{
                                        formatAmount(order.amount) }} </p>
                                    <p class="pb-0 mt-2 fs-24 text-dark"><strong>Valido ate:</strong> {{
                                        moment(order.expires_at).format("YYYY/MM/DD HH:mm") }}</p>
                                </div>

                                <small>Os ingressos solicitados serão enviados para o seu e-mail
                                    ({{ order.data.email }}) assim que recebermos a confirmação do pagamento.
                                    <br>(verifique também a caixa de spam).</small>
                                <div class="py-5">
                                    <hr>
                                </div>
                                <div>
                                    <a class="flex whitespace-nowrap w-min hover:underline hover:text-brand-success py-3 items-center gap-1"
                                        href="/">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" id="Layer_1"
                                            width="23px" height="23px" viewBox="0 0 64 64"
                                            enable-background="new 0 0 64 64" xml:space="preserve">
                                            <g>
                                                <circle fill="#231F20" cx="44" cy="60" r="4" />
                                                <circle fill="#231F20" cx="28" cy="60" r="4" />
                                                <path fill="#231F20"
                                                    d="M63.246,21.66C62.492,20.617,61.285,20,60,20H18.977L15.934,3.285C15.59,1.383,13.934,0,12,0H4   C1.789,0,0,1.789,0,4s1.789,4,4,4h4.66l7.406,40.715C16.41,50.617,18.066,52,20,52h32c1.723,0,3.25-1.102,3.793-2.734l8-24   C64.203,24.047,63.996,22.703,63.246,21.66z" />
                                            </g>
                                        </svg>
                                        <p>Continuar comprando</p>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Container>
        <!--data end-->
    </div>
    <div v-else>
        <div class="flex justify-center items-center h-[500px]">
            <Spinner />
        </div>
    </div>
</template>

<style scoped>
.img-blur-event {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    width: 120%;
    height: 120%;
    margin-top: -5%;
    margin-left: -10%;
    background-position: 0px 0px, 50% 50%;
    background-size: auto, cover;
    background-repeat: repeat, no-repeat;
    opacity: 1;
    -webkit-filter: blur(24px);
    filter: blur(24px);
}

.img-event {
    z-index: 90;
    object-fit: cover;
    box-shadow: 0 30px 80px 10px rgba(0, 0, 0, .12), 0 11px 30px -7px rgba(0, 0, 0, .3);
}
</style>