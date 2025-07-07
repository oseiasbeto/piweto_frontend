<script setup>
import { useOrders } from "../../../repositories/orders-repository";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { onMounted, computed, ref } from "vue";
import Container from "../../marketplace/components/ui/Container";
import QrcodeVue from 'qrcode.vue'
import SplashScreen from "../components/ui/SplashScreen.vue";
import copyToClipboard from "../../../utils/copyToClipboard"
import formatAmount from "@/utils/formatAmount";

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
        <!--data start-->
        <Container>
            <div class="mt-7 mb-20 lg:mt-10 px-4">
                <div class="mb-5 lg:mb-10">
                    <h1 class="text-[22px] text-center lg:text-left lg:text-[2.625rem] font-bold my-2 lg:my-4">Seu
                        pedido foi iniciado
                    </h1>

                    <div class="block lg:hidden text-[#00a832] w-[50px] h-[50px] mx-auto">
                        <svg fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
                            <path fill-rule="evenodd" clip-rule="currentColor"
                                d="M2.1001 12.09C2.1001 6.59998 6.6001 2.09998 12.0901 2.09998C17.5801 2.09998 22.0801 6.59998 22.0801 12.09C22.0801 17.58 17.5801 22.08 12.0901 22.08C6.6001 22.08 2.1001 17.61 2.1001 12.09ZM4.1101 12.09C4.1101 16.5 7.6801 20.1 12.0901 20.1C16.5001 20.1 20.1001 16.5 20.1001 12.09C20.1001 7.67998 16.5001 4.10998 12.0901 4.10998C7.6801 4.10998 4.1101 7.67998 4.1101 12.09ZM9.6001 11.13C9.3001 10.77 8.7601 10.71 8.4001 11.01C8.0401 11.31 7.9801 11.85 8.2801 12.21L10.3801 14.79C10.7401 15.21 11.4001 15.21 11.7001 14.73L15.9001 10.44C16.1701 10.05 16.0801 9.50997 15.6901 9.23997C15.3001 8.96997 14.7901 9.05998 14.5201 9.44998L11.0101 12.84L9.6001 11.13Z">
                            </path>
                        </svg>
                    </div>

                    <div class="hidden lg:flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="text-[#848c9b] font-semibold text-xs">Nº DO PEDIDO</span>
                            <span class="font-bold text-[22px] text-[#191f28]">{{ order.id }}</span>
                        </div>

                        <div class="text-[#ff9036] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-[33px] h-[33px]" viewBox="0 0 24 24"
                                fill="none">
                                <path
                                    d="M5.06152 12C5.55362 8.05369 8.92001 5 12.9996 5C17.4179 5 20.9996 8.58172 20.9996 13C20.9996 17.4183 17.4179 21 12.9996 21H8M13 13V9M11 3H15M3 15H8M5 18H10"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <span class="font-bold">Aguardando pagamento</span>
                        </div>

                    </div>

                </div>

                <div class="!bg-[#f5f7f8] mb-8 border-[#dde0e4] border rounded-[16px]">
                    <h1 class="p-4 py-6  text-lg text-center font-bold mx-auto text-[#4c576c]">Agora só falta confirmar
                        seu pagamento!</h1>

                    <div class="bg-white rounded-lg p-5 m-4 mt-0">
                        <!--start paypay method-->
                        <div v-if="order?.data?.payment_method === 'paypay'" class="flex items-center gap-8">
                            <!--start qrCode box-->
                            <div
                                class="p-4 shrink-0 w-80 h-80 border rounded-lg flex items-center justify-center border-[#dde0e4]">
                                <div>
                                    <img src="@/assets/imgs/paypay.png" class="w-[100px] mx-auto my-2.5">

                                    <div class="flex justify-center w-full">
                                        <qrcode-vue :value="order?.biz_content?.dynamic_link" :size="156" level="M"
                                            :margin="4" />
                                    </div>

                                    <div class="hidden mt-3">
                                        <a :href="order?.biz_content?.dynamic_link"
                                            class="flex py-2 px-4 justify-center items-center gap-2 rounded-lg h-10 font-bold normal-case text-sm mt-1 bg-blue-500 text-white">Abrir
                                            no App</a>
                                    </div>

                                </div>

                            </div>
                            <!--start qrCode box-->

                            <!--start steps-->
                            <div class="flex-1 text-[#4c576c]">
                                <div class="mb-3">
                                    <strong class="text-base">Como pagar?</strong>
                                </div>

                                <div class="flex text-xs py-3 items-center gap-1.5">
                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" fill="#848c9b" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" clip-rule="currentColor"
                                            d="M9 4H15C16.1046 4 17 4.89543 17 6V18C17 19.1046 16.1046 20 15 20H9C7.89543 20 7 19.1046 7 18V6C7 4.89543 7.89543 4 9 4ZM5 6C5 3.79086 6.79086 2 9 2H15C17.2091 2 19 3.79086 19 6V18C19 20.2091 17.2091 22 15 22H9C6.79086 22 5 20.2091 5 18V6ZM11 17C10.4477 17 10 17.4477 10 18C10 18.5523 10.4477 19 11 19H13C13.5523 19 14 18.5523 14 18C14 17.4477 13.5523 17 13 17H11Z">
                                        </path>
                                    </svg>
                                    <p>
                                        Abra o app da carteira digital <b>PayPay</b> e clique em
                                        <b>Scanear</b>
                                    </p>
                                </div>
                                <div class="flex text-xs py-3 items-center gap-1.5">
                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" fill="#848c9b" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M9.5 6.5V9.5H6.5V6.5H9.5ZM11 5H5V11H11V5ZM9.5 14.5V17.5H6.5V14.5H9.5ZM11 13H5V19H11V13ZM17.5 6.5V9.5H14.5V6.5H17.5ZM19 5H13V11H19V5ZM13 13H14.5V14.5H13V13ZM14.5 14.5H16V16H14.5V14.5ZM16 13H17.5V14.5H16V13ZM13 16H14.5V17.5H13V16ZM14.5 17.5H16V19H14.5V17.5ZM16 16H17.5V17.5H16V16ZM17.5 14.5H19V16H17.5V14.5ZM17.5 17.5H19V19H17.5V17.5ZM21 7C20.45 7 20 6.55 20 6V4H18C17.45 4 17 3.55 17 3C17 2.45 17.45 2 18 2H21C21.55 2 22 2.45 22 3V6C22 6.55 21.55 7 21 7ZM22 21V18C22 17.45 21.55 17 21 17C20.45 17 20 17.45 20 18V20H18C17.45 20 17 20.45 17 21C17 21.55 17.45 22 18 22H21C21.55 22 22 21.55 22 21ZM3 22H6C6.55 22 7 21.55 7 21C7 20.45 6.55 20 6 20H4V18C4 17.45 3.55 17 3 17C2.45 17 2 17.45 2 18V21C2 21.55 2.45 22 3 22ZM2 3V6C2 6.55 2.45 7 3 7C3.55 7 4 6.55 4 6V4H6C6.55 4 7 3.55 7 3C7 2.45 6.55 2 6 2H3C2.45 2 2 2.45 2 3Z">
                                        </path>
                                    </svg>
                                    <p>
                                        Scaneie o <b>QR Code</b>
                                    </p>
                                </div>
                                <div class="flex text-xs py-3 items-center gap-1.5">
                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" fill="#848c9b" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M2.1001 12.09C2.1001 6.59998 6.6001 2.09998 12.0901 2.09998C17.5801 2.09998 22.0801 6.59998 22.0801 12.09C22.0801 17.58 17.5801 22.08 12.0901 22.08C6.6001 22.08 2.1001 17.61 2.1001 12.09ZM4.1101 12.09C4.1101 16.5 7.6801 20.1 12.0901 20.1C16.5001 20.1 20.1001 16.5 20.1001 12.09C20.1001 7.67998 16.5001 4.10998 12.0901 4.10998C7.6801 4.10998 4.1101 7.67998 4.1101 12.09ZM9.6001 11.13C9.3001 10.77 8.7601 10.71 8.4001 11.01C8.0401 11.31 7.9801 11.85 8.2801 12.21L10.3801 14.79C10.7401 15.21 11.4001 15.21 11.7001 14.73L15.9001 10.44C16.1701 10.05 16.0801 9.50997 15.6901 9.23997C15.3001 8.96997 14.7901 9.05998 14.5201 9.44998L11.0101 12.84L9.6001 11.13Z">
                                        </path>
                                    </svg>
                                    <p>
                                        Confirme as informações e clique em <b>Pagar agora</b>
                                    </p>
                                </div>

                                <div class="h-[1px] mt-5 my-5 bg-[#dde0e4]"></div>
                                <div>
                                    <p class="text-sm">Este código expira em <strong
                                            class="text-[#ff6a00]">15:00</strong> minutos e não será mais válido.</p>
                                </div>
                            </div>
                            <!--end steps-->
                        </div>
                        <!--end paypay method-->

                        <!--start reference pay-->
                        <div v-if="order?.data?.payment_method === 'reference'"
                            class="flex flex-col lg:flex-row items-center gap-8">
                            <!--start icon emis box-->
                            <div
                                class="p-4 shrink-0 w-full h-40 lg:w-80 lg:h-80 border rounded-lg flex items-center justify-center border-[#dde0e4]">
                                <div>
                                    <div class="flex justify-center w-full">
                                        <img src="@/assets/imgs/multicaixa_logo.png" class="w-[100px] mx-auto my-2.5">
                                    </div>
                                </div>

                            </div>
                            <!--start icon emis box-->

                            <!--start steps-->
                            <div class="flex-1 text-[#4c576c]">
                                <div class="mb-3">
                                    <strong class="text-base">Como pagar?</strong>
                                </div>

                                <div class="flex text-xs py-3 items-center gap-1.5">

                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" xmlns="http://www.w3.org/2000/svg"
                                        width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                        <path d="M3.92969 15.8792L15.8797 3.9292" stroke="#848c9b" stroke-width="2"
                                            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.1013 18.2791L12.3013 17.0791" stroke="#848c9b" stroke-width="2"
                                            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M13.793 15.5887L16.183 13.1987" stroke="#848c9b" stroke-width="2"
                                            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path
                                            d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path d="M2 21.9985H22" stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                    <p>
                                        Introduza o seu cartão <b>Multicaixa</b> no <b>ATM</b>
                                    </p>
                                </div>
                                <div class="flex text-xs py-3 items-center gap-1.5">
                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M8 14.5714L6.17716 12.8354C5.53522 12.224 4.51329 12.2705 3.92953 12.9377V12.9377C3.40196 13.5406 3.41749 14.4453 3.96544 15.0298L9.90739 21.3679C10.2855 21.7712 10.8127 22 11.3655 22C12.4505 22 14.2343 22 16 22C18.4 22 20 20 20 18C20 18 20 18 20 18C20 18 20 11.1429 20 9.42859"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M17 9.99995C17 9.99995 17 9.87483 17 9.42852C17 7.1428 20 7.1428 20 9.42852"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M14 9.99998C14 9.99998 14 9.17832 14 8.2857C14 5.99998 17 5.99998 17 8.2857C17 8.50885 17 9.2054 17 9.42855C17 9.87487 17 9.99998 17 9.99998"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M11 10.0001C11 10.0001 11 8.61584 11 7.50005C11 5.21434 14 5.21434 14 7.50005C14 7.50005 14 7.50005 14 7.50005C14 7.50005 14 8.06261 14 8.28577C14 9.17839 14 10.0001 14 10.0001"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M8 14.5714V3.5C8 2.67157 8.67157 2 9.5 2V2C10.3284 2 11 2.67056 11 3.49899C11 4.68968 11 6.34156 11 7.5C11 8.61578 11 10 11 10"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                    <p>
                                        Digite o seu <b>PIN</b> e selecione <b>Pagamentos</b> >> <b>Pagamentos de
                                            serviços</b> >> <b>Pagamento Por Referência</b>
                                    </p>
                                </div>
                                <div class="flex text-xs py-3 items-center gap-1.5">
                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" fill="#848c9b" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M2.1001 12.09C2.1001 6.59998 6.6001 2.09998 12.0901 2.09998C17.5801 2.09998 22.0801 6.59998 22.0801 12.09C22.0801 17.58 17.5801 22.08 12.0901 22.08C6.6001 22.08 2.1001 17.61 2.1001 12.09ZM4.1101 12.09C4.1101 16.5 7.6801 20.1 12.0901 20.1C16.5001 20.1 20.1001 16.5 20.1001 12.09C20.1001 7.67998 16.5001 4.10998 12.0901 4.10998C7.6801 4.10998 4.1101 7.67998 4.1101 12.09ZM9.6001 11.13C9.3001 10.77 8.7601 10.71 8.4001 11.01C8.0401 11.31 7.9801 11.85 8.2801 12.21L10.3801 14.79C10.7401 15.21 11.4001 15.21 11.7001 14.73L15.9001 10.44C16.1701 10.05 16.0801 9.50997 15.6901 9.23997C15.3001 8.96997 14.7901 9.05998 14.5201 9.44998L11.0101 12.84L9.6001 11.13Z">
                                        </path>
                                    </svg>
                                    <p>
                                        Informe a <b>entidade</b>, <b>referência</b> e o <b>montante</b> indicados
                                        abaixo.
                                    </p>
                                </div>
                                <div class="flex flex-col text-xs py-3 gap-1.5">
                                    <p>
                                        ID da entidade: <b class="text-[#f0861f]">{{
                                            order?.biz_content?.entity_id }}</b>
                                    <p>
                                        Montante: <b class="text-[#f0861f]">{{ formatAmount(order?.amount) }}</b>
                                    </p>
                                    </p>
                                    <div>
                                        <p>Referência:</p>
                                        <div
                                            class="w-full flex items-center justify-between mt-2 p-2 border border-dotted border-[#f0861f] rounded-lg bg-[#f0861f]/5">
                                            <b class="text-sm text-[#f0861f]">{{ order?.biz_content?.reference_id }}</b>
                                            <button @click="copyToClipboard(order?.biz_content?.reference_id)"
                                                class="text-xs font-semibold outline-none bg-[#f0861f] text-white py-1.5 px-2 rounded-lg">Copiar</button>
                                        </div>
                                    </div>

                                </div>
                                <div class="mt-2">
                                    <p class="text-xs">Este código expira em <strong
                                            class="text-[#ff6a00]">15:00</strong> minutos e não será mais válido.</p>
                                </div>
                            </div>
                            <!--end steps-->
                        </div>
                        <!--end reference pay-->

                         <!--start express pay-->
                        <div v-if="order?.data?.payment_method === 'mul'"
                            class="flex flex-col lg:flex-row items-center gap-8">
                            <!--start icon emis box-->
                            <div
                                class="p-4 shrink-0 w-full h-40 lg:w-80 lg:h-80 border rounded-lg flex items-center justify-center border-[#dde0e4]">
                                <div>
                                    <div class="flex justify-center w-full">
                                        <img src="@/assets/imgs/multicaixa_logo.png" class="w-[100px] mx-auto my-2.5">
                                    </div>
                                </div>

                            </div>
                            <!--start icon emis box-->

                            <!--start steps-->
                            <div class="flex-1 text-[#4c576c]">
                                <div class="mb-3">
                                    <strong class="text-base">Como pagar?</strong>
                                </div>

                                <div class="flex text-xs py-3 items-center gap-1.5">

                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" xmlns="http://www.w3.org/2000/svg"
                                        width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                        <path d="M3.92969 15.8792L15.8797 3.9292" stroke="#848c9b" stroke-width="2"
                                            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.1013 18.2791L12.3013 17.0791" stroke="#848c9b" stroke-width="2"
                                            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M13.793 15.5887L16.183 13.1987" stroke="#848c9b" stroke-width="2"
                                            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path
                                            d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path d="M2 21.9985H22" stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                    <p>
                                        Introduza o seu cartão <b>Multicaixa</b> no <b>ATM</b>
                                    </p>
                                </div>
                                <div class="flex text-xs py-3 items-center gap-1.5">
                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M8 14.5714L6.17716 12.8354C5.53522 12.224 4.51329 12.2705 3.92953 12.9377V12.9377C3.40196 13.5406 3.41749 14.4453 3.96544 15.0298L9.90739 21.3679C10.2855 21.7712 10.8127 22 11.3655 22C12.4505 22 14.2343 22 16 22C18.4 22 20 20 20 18C20 18 20 18 20 18C20 18 20 11.1429 20 9.42859"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M17 9.99995C17 9.99995 17 9.87483 17 9.42852C17 7.1428 20 7.1428 20 9.42852"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M14 9.99998C14 9.99998 14 9.17832 14 8.2857C14 5.99998 17 5.99998 17 8.2857C17 8.50885 17 9.2054 17 9.42855C17 9.87487 17 9.99998 17 9.99998"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M11 10.0001C11 10.0001 11 8.61584 11 7.50005C11 5.21434 14 5.21434 14 7.50005C14 7.50005 14 7.50005 14 7.50005C14 7.50005 14 8.06261 14 8.28577C14 9.17839 14 10.0001 14 10.0001"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M8 14.5714V3.5C8 2.67157 8.67157 2 9.5 2V2C10.3284 2 11 2.67056 11 3.49899C11 4.68968 11 6.34156 11 7.5C11 8.61578 11 10 11 10"
                                            stroke="#848c9b" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                    <p>
                                        Digite o seu <b>PIN</b> e selecione <b>Pagamentos</b> >> <b>Pagamentos de
                                            serviços</b> >> <b>Pagamento Por Referência</b>
                                    </p>
                                </div>
                                <div class="flex text-xs py-3 items-center gap-1.5">
                                    <svg class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" fill="#848c9b" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M2.1001 12.09C2.1001 6.59998 6.6001 2.09998 12.0901 2.09998C17.5801 2.09998 22.0801 6.59998 22.0801 12.09C22.0801 17.58 17.5801 22.08 12.0901 22.08C6.6001 22.08 2.1001 17.61 2.1001 12.09ZM4.1101 12.09C4.1101 16.5 7.6801 20.1 12.0901 20.1C16.5001 20.1 20.1001 16.5 20.1001 12.09C20.1001 7.67998 16.5001 4.10998 12.0901 4.10998C7.6801 4.10998 4.1101 7.67998 4.1101 12.09ZM9.6001 11.13C9.3001 10.77 8.7601 10.71 8.4001 11.01C8.0401 11.31 7.9801 11.85 8.2801 12.21L10.3801 14.79C10.7401 15.21 11.4001 15.21 11.7001 14.73L15.9001 10.44C16.1701 10.05 16.0801 9.50997 15.6901 9.23997C15.3001 8.96997 14.7901 9.05998 14.5201 9.44998L11.0101 12.84L9.6001 11.13Z">
                                        </path>
                                    </svg>
                                    <p>
                                        Informe a <b>entidade</b>, <b>referência</b> e o <b>montante</b> indicados
                                        abaixo.
                                    </p>
                                </div>
                                <div class="flex flex-col text-xs py-3 gap-1.5">
                                    <p>
                                        ID da entidade: <b class="text-[#f0861f]">{{
                                            order?.biz_content?.entity_id }}</b>
                                    <p>
                                        Montante: <b class="text-[#f0861f]">{{ formatAmount(order?.amount) }}</b>
                                    </p>
                                    </p>
                                    <div>
                                        <p>Referência:</p>
                                        <div
                                            class="w-full flex items-center justify-between mt-2 p-2 border border-dotted border-[#f0861f] rounded-lg bg-[#f0861f]/5">
                                            <b class="text-sm text-[#f0861f]">{{ order?.biz_content?.reference_id }}</b>
                                            <button @click="copyToClipboard(order?.biz_content?.reference_id)"
                                                class="text-xs font-semibold outline-none bg-[#f0861f] text-white py-1.5 px-2 rounded-lg">Copiar</button>
                                        </div>
                                    </div>

                                </div>
                                <div class="mt-2">
                                    <p class="text-xs">Este código expira em <strong
                                            class="text-[#ff6a00]">15:00</strong> minutos e não será mais válido.</p>
                                </div>
                            </div>
                            <!--end steps-->
                        </div>
                        <!--end express pay-->
                    </div>
                </div>

                <div class="!bg-[#f5f7f8] mb-8 border-[#dde0e4] border rounded-[16px]">
                    <h1 class="p-4 py-4 text-sm text-center font-bold mx-auto text-[#4c576c]">E-mail utilizado no pedido
                    </h1>

                    <div class="bg-white text-[#4c576c] font-semibold text-sm text-center rounded-lg p-2 m-4 mt-0">
                        <p>{{ order?.data?.email }}</p>
                    </div>
                </div>

                <div class="!bg-[#f5f7f8] mb-10 border-[#dde0e4] border rounded-[16px]">
                    <h1 class="p-4 py-6  text-lg text-center font-bold mx-auto text-[#4c576c]">Como acessar seus
                        ingressos</h1>

                    <div class="bg-white rounded-lg py-3 p-5 m-4 mt-0">
                        <div class="text-[#4c576c]">
                            <div class="flex text-xs lg:text-sm py-3 items-center gap-2">
                                <svg class="w-4 h-4 lg:w-[20px] lg:h-[21px] shrink-0" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 21" fill="none">
                                    <path
                                        d="M10 5.19922C9.73479 5.19922 9.48043 5.30458 9.2929 5.49211C9.10536 5.67965 9 5.934 9 6.19922V11.1992C9 11.4644 9.10536 11.7188 9.2929 11.9063C9.48043 12.0939 9.73479 12.1992 10 12.1992C10.2652 12.1992 10.5196 12.0939 10.7071 11.9063C10.8946 11.7188 11 11.4644 11 11.1992V6.19922C11 5.934 10.8946 5.67965 10.7071 5.49211C10.5196 5.30458 10.2652 5.19922 10 5.19922ZM10 13.1992C9.80222 13.1992 9.60888 13.2579 9.44443 13.3677C9.27999 13.4776 9.15181 13.6338 9.07613 13.8165C9.00044 13.9993 8.98063 14.2003 9.01922 14.3943C9.05781 14.5883 9.15305 14.7665 9.2929 14.9063C9.43275 15.0462 9.61093 15.1414 9.80491 15.18C9.9989 15.2186 10.2 15.1988 10.3827 15.1231C10.5654 15.0474 10.7216 14.9192 10.8315 14.7548C10.9414 14.5903 11 14.397 11 14.1992C11 13.934 10.8946 13.6796 10.7071 13.4921C10.5196 13.3046 10.2652 13.1992 10 13.1992ZM10 0.199219C8.02219 0.199219 6.08879 0.785709 4.4443 1.88452C2.79981 2.98334 1.51809 4.54512 0.761209 6.37238C0.00433284 8.19965 -0.193701 10.2103 0.192152 12.1501C0.578004 14.0899 1.53041 15.8718 2.92894 17.2703C4.32746 18.6688 6.10929 19.6212 8.0491 20.0071C9.98891 20.3929 11.9996 20.1949 13.8268 19.438C15.6541 18.6811 17.2159 17.3994 18.3147 15.7549C19.4135 14.1104 20 12.177 20 10.1992C20 7.54705 18.9464 5.00351 17.0711 3.12815C15.1957 1.25279 12.6522 0.199219 10 0.199219V0.199219ZM2 10.1992C2 8.61697 2.4692 7.07025 3.34825 5.75466C4.2273 4.43906 5.47673 3.41368 6.93854 2.80818C8.40035 2.20268 10.0089 2.04425 11.5607 2.35294C13.1126 2.66162 14.538 3.42354 15.6569 4.54236C16.7757 5.66118 17.5376 7.08665 17.8463 8.6385C18.155 10.1903 17.9965 11.7989 17.391 13.2607C16.7855 14.7225 15.7602 15.9719 14.4446 16.851C13.129 17.73 11.5823 18.1992 10 18.1992C7.87827 18.1992 5.84344 17.3564 4.34315 15.8561C2.84286 14.3558 2 12.321 2 10.1992Z"
                                        fill="#848C9B" />
                                </svg>
                                <p>
                                    <strong>Não geramos um cadastro automático</strong>
                                    com o e-mail ou número de telefone utilizado no pedido.
                                </p>
                            </div>

                            <div class="flex text-xs lg:text-sm py-3 items-center gap-2">
                                <svg class="w-4 h-4 lg:w-[18px] lg:h-[18px] shrink-0" xmlns="http://www.w3.org/2000/svg"
                                    width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M9 8.19922C9.79113 8.19922 10.5645 7.96462 11.2223 7.5251C11.8801 7.08557 12.3928 6.46086 12.6955 5.72995C12.9983 4.99905 13.0775 4.19478 12.9231 3.41886C12.7688 2.64294 12.3878 1.9302 11.8284 1.37079C11.269 0.811383 10.5563 0.43042 9.78036 0.276079C9.00444 0.121739 8.20017 0.200952 7.46927 0.503702C6.73836 0.806453 6.11365 1.31914 5.67412 1.97694C5.2346 2.63474 5 3.4081 5 4.19922C5 5.26009 5.42143 6.2775 6.17157 7.02765C6.92172 7.77779 7.93913 8.19922 9 8.19922ZM9 6.19922C9.39556 6.19922 9.78224 6.08192 10.1111 5.86216C10.44 5.6424 10.6964 5.33004 10.8478 4.96459C10.9991 4.59914 11.0387 4.197 10.9616 3.80904C10.8844 3.42108 10.6939 3.06471 10.4142 2.78501C10.1345 2.5053 9.77814 2.31482 9.39018 2.23765C9.00222 2.16048 8.60009 2.20009 8.23463 2.35146C7.86918 2.50284 7.55682 2.75918 7.33706 3.08808C7.1173 3.41698 7 3.80366 7 4.19922C7 4.72965 7.21071 5.23836 7.58579 5.61343C7.96086 5.98851 8.46957 6.19922 9 6.19922ZM6 11.1992C4.93913 11.1992 3.92172 11.6206 3.17157 12.3708C2.42143 13.1209 2 14.1384 2 15.1992V16.1992C2 16.4644 1.89464 16.7188 1.70711 16.9063C1.51957 17.0939 1.26522 17.1992 1 17.1992C0.734784 17.1992 0.48043 17.0939 0.292893 16.9063C0.105357 16.7188 0 16.4644 0 16.1992V15.1992C0 13.6079 0.632141 12.0818 1.75736 10.9566C2.88258 9.83136 4.4087 9.19922 6 9.19922H12C13.5913 9.19922 15.1174 9.83136 16.2426 10.9566C17.3679 12.0818 18 13.6079 18 15.1992V16.1992C18 16.4644 17.8946 16.7188 17.7071 16.9063C17.5196 17.0939 17.2652 17.1992 17 17.1992C16.7348 17.1992 16.4804 17.0939 16.2929 16.9063C16.1054 16.7188 16 16.4644 16 16.1992V15.1992C16 14.1384 15.5786 13.1209 14.8284 12.3708C14.0783 11.6206 13.0609 11.1992 12 11.1992H6Z"
                                        fill="#848C9B" />
                                </svg>
                                <p>
                                    <a href="/conta/registrar-se" class="text-[#0096ff] font-bold">Cadastre-se</a>
                                    ou <a href="/conta/login" class="text-[#0096ff] font-bold">acesse sua conta</a>
                                    com o número de telefone utilizado no pedido.
                                </p>
                            </div>

                            <div class="flex text-xs lg:text-sm py-3 items-center gap-2">
                                <svg class="w-4 h-4 lg:w-[20px] lg:h-[17px] shrink-0" xmlns="http://www.w3.org/2000/svg"
                                    width="20" height="17" viewBox="0 0 20 17" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M17 14.1992H3C2.449 14.1992 2 13.7512 2 13.1992V3.44922L9.4 8.99922C9.578 9.13322 9.789 9.19922 10 9.19922C10.211 9.19922 10.422 9.13322 10.6 8.99922L18 3.44922V13.1992C18 13.7512 17.551 14.1992 17 14.1992ZM16.333 2.19922L10 6.94922L3.667 2.19922H16.333ZM17 0.199219H3C1.346 0.199219 0 1.54522 0 3.19922V13.1992C0 14.8532 1.346 16.1992 3 16.1992H17C18.654 16.1992 20 14.8532 20 13.1992V3.19922C20 1.54522 18.654 0.199219 17 0.199219Z"
                                        fill="#848C9B" />
                                </svg>
                                <p>
                                    Os ingressos e a confirmação do pedido <strong>serão enviados no e-mail
                                        informado</strong>.
                                    Lembre-se de conferir sua Caixa de entrada e Spam.
                                </p>
                            </div>

                            <div class="flex text-xs lg:text-sm py-3 items-center gap-2">
                                <svg class="w-4 h-4 lg:w-[20px] lg:h-[21] shrink-0" xmlns="http://www.w3.org/2000/svg"
                                    width="20" height="21" viewBox="0 0 20 21" fill="none">
                                    <path
                                        d="M10 4.19922C9.07174 4.19922 8.1815 4.56797 7.52513 5.22435C6.86875 5.88073 6.5 6.77097 6.5 7.69922C6.5 7.96444 6.60536 8.21879 6.79289 8.40633C6.98043 8.59387 7.23478 8.69922 7.5 8.69922C7.76522 8.69922 8.01957 8.59387 8.20711 8.40633C8.39464 8.21879 8.5 7.96444 8.5 7.69922C8.5 7.40255 8.58797 7.11254 8.7528 6.86587C8.91762 6.61919 9.15189 6.42694 9.42597 6.3134C9.70006 6.19987 10.0017 6.17017 10.2926 6.22804C10.5836 6.28592 10.8509 6.42878 11.0607 6.63856C11.2704 6.84834 11.4133 7.11562 11.4712 7.40659C11.5291 7.69756 11.4994 7.99916 11.3858 8.27325C11.2723 8.54734 11.08 8.78161 10.8334 8.94643C10.5867 9.11125 10.2967 9.19922 10 9.19922C9.73478 9.19922 9.48043 9.30458 9.29289 9.49212C9.10536 9.67965 9 9.93401 9 10.1992V12.1992C9 12.4644 9.10536 12.7188 9.29289 12.9063C9.48043 13.0939 9.73478 13.1992 10 13.1992C10.2652 13.1992 10.5196 13.0939 10.7071 12.9063C10.8946 12.7188 11 12.4644 11 12.1992V11.0392C11.8081 10.8032 12.5037 10.2831 12.9585 9.57466C13.4133 8.86624 13.5967 8.01729 13.4749 7.18429C13.3532 6.35129 12.9344 5.59038 12.2958 5.04181C11.6572 4.49325 10.8418 4.194 10 4.19922ZM9 15.1992C9 15.0014 9.05865 14.8081 9.16853 14.6437C9.27841 14.4792 9.43459 14.351 9.61732 14.2753C9.80004 14.1997 10.0011 14.1799 10.1951 14.2184C10.3891 14.257 10.5673 14.3523 10.7071 14.4921C10.847 14.632 10.9422 14.8102 10.9808 15.0041C11.0194 15.1981 10.9996 15.3992 10.9239 15.5819C10.8482 15.7646 10.72 15.9208 10.5556 16.0307C10.3911 16.1406 10.1978 16.1992 10 16.1992C9.73478 16.1992 9.48043 16.0939 9.29289 15.9063C9.10536 15.7188 9 15.4644 9 15.1992ZM0 10.1992C0 8.22141 0.58649 6.28801 1.6853 4.64352C2.78412 2.99903 4.3459 1.7173 6.17317 0.960428C8.00043 0.203552 10.0111 0.00551824 11.9509 0.39137C13.8907 0.777223 15.6725 1.72963 17.0711 3.12816C18.4696 4.52668 19.422 6.30851 19.8079 8.24832C20.1937 10.1881 19.9957 12.1988 19.2388 14.0261C18.4819 15.8533 17.2002 17.4151 15.5557 18.5139C13.9112 19.6127 11.9778 20.1992 10 20.1992C7.34784 20.1992 4.8043 19.1457 2.92893 17.2703C1.05357 15.3949 0 12.8514 0 10.1992H0ZM10 2.19922C8.41775 2.19922 6.87103 2.66842 5.55544 3.54747C4.23984 4.42652 3.21446 5.67595 2.60896 7.13776C2.00346 8.59956 1.84504 10.2081 2.15372 11.7599C2.4624 13.3118 3.22433 14.7373 4.34315 15.8561C5.46197 16.9749 6.88743 17.7368 8.43928 18.0455C9.99113 18.3542 11.5997 18.1958 13.0615 17.5903C14.5233 16.9848 15.7727 15.9594 16.6518 14.6438C17.5308 13.3282 18 11.7815 18 10.1992C18 8.07749 17.1571 6.04266 15.6569 4.54237C14.1566 3.04208 12.1217 2.19922 10 2.19922Z"
                                        fill="#848C9B" />
                                </svg>
                                <p>
                                    Dúvidas? Entre em contato com a nossa
                                    <a class="text-[#0096ff] font-bold"
                                        href="https://api.whatsapp.com/send/?phone=948360831&text&type=phone_number&app_absent=0"
                                        target="_blank" rel="noopener">
                                        Central de ajuda.
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
        <!--data end-->
    </div>
    <div>
        <SplashScreen :visible="loading" />
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