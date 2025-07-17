<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify"
import { onMounted, ref, computed } from "vue";
import { useEvents } from "../../../repositories/events-repository";
import { useBatches } from "../../../repositories/batches-repository";
import formatAmount from "@/utils/formatAmount";
import { useStore } from "vuex";
import Container from "@/use-cases/marketplace/components/ui/Container.vue";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import CartDrawer from "../components/drawers/CartDrawer.vue";
import BtnSpinner from "../../marketplace/components/spinners/BtnSpinner";
import moment from "moment";
import copyToClipboard from "../../../utils/copyToClipboard"
import formatEventDates from "@/utils/formatEventDates";
import formatEventTime from "@/utils/formatEventTime";
import { useCoupons } from "@/repositories/coupons-repository";
import SplashScreen from "../components/ui/SplashScreen.vue";

const { getEvent, loading: loadingEvent, error: errorEvent } = useEvents();
const { getBatches, loading: loadingBatches, error: errorBatches } = useBatches()
const { applyCoupon, loading: loadingCoupon } = useCoupons()

const route = useRoute()
const router = useRouter()
const store = useStore()
const form = ref({
    couponName: ""
})
const showCouponInput = ref(false)
const coupon = ref({})
const amount = ref(0)
const loadingCart = ref(false)
const amountAfterDiscount = ref(0)

const alert = ref({
    show: false,
    message: "",
    type: "warning"
})

// esta funcao computada tem como finalidade retornar o corrente evento.
const event = computed(() => {
    return store.getters.event
})

const isEventOver = computed(() => {
    return moment().isAfter(moment(event.value.ends_at.date, "YYYY-MM-DD HH:mm"));
});

// esta funcao computada tem como finalidade retornar todos os lotes disponiveis 
const batches = computed(() => {
    return store.getters.batches
})

// Esta função computada tem como finalidade verificar se o corrente usuário está autenticado no sistema.
const hasLogged = computed(() => {
    return store.getters.hasLogged
})


const formattedDate = (date) => {
    return moment(date).format("DD/MM/YY"); // Formata para 03/03/25
}


// Esta função computada tem como finalidade retornar o lote de ingressos selecionado pelo corrente usuário.
const batchesSelected = computed(() => {
    return batches.value.data.filter(batch => batch.quantitySelected > 0)
})

// Esta função tem como finalidade somar a quantidade de ingressos de um lote através do seu index na lista de lotes disponíveis do corrente evento.
function addBatch(index) {
    const currentBatch = batches.value.data[index]
    const max = currentBatch.quantity_for_purchase.max
    const min = currentBatch.quantity_for_purchase.min
    const quantity = currentBatch.quantitySelected

    if (currentBatch.quantity - currentBatch.quantitySelected <= min) {
        currentBatch.quantitySelected = currentBatch.quantity
        calcTotalAmount()
    } else {
        if (quantity <= max) {
            currentBatch.quantitySelected += min
            if (currentBatch.quantitySelected > max) {
                currentBatch.quantitySelected = max
            }
            calcTotalAmount()
        } else return
    }
}

// Esta função tem como finalidade subrair a quantidade de ingressos de um lote através do seu index na lista de lotes disponíveis do corrente evento.
function reduceBatch(index) {
    const currentBatch = batches.value.data[index]
    const min = currentBatch.quantity_for_purchase.min
    const quantity = currentBatch.quantitySelected

    if (quantity >= min) {
        currentBatch.quantitySelected -= 1

        if (currentBatch.quantitySelected < min) {
            currentBatch.quantitySelected = 0
            if (batchesSelected.value.length == 0) {
                amount.value = 0
            }
        }
        calcTotalAmount()
    } else {
        amount.value = 0
        currentBatch.quantitySelected = 0
        calcTotalAmount()
    }
}

// Esta função tem como finalidade calcular a quantia total do carrinho de compras.
function calcTotalAmount() {
    batchesSelected.value.reduce((acc, batch) => amount.value = acc + batch.price * batch.quantitySelected, 0)
    if (coupon?.value?._id != undefined) {
        amountAfterDiscount.value = amount.value - (amount.value * coupon?.value?.discount / 100)
    }
}

function isDatePassed(targetDate) {
    // Converte a data informada para objeto Date (caso seja string)
    const endDate = new Date(targetDate);
    // Pega a data/hora atual
    const now = new Date();

    // Compara os timestamps (milissegundos desde 1970)
    return now > endDate;
}

function canReleaseSales(targetDate) {
    // Converte a data informada para objeto Date (caso seja string)
    const endDate = new Date(targetDate);
    // Pega a data/hora atual
    const now = new Date();

    // Compara os timestamps (milissegundos desde 1970)
    return now >= endDate;
}


// Esta função tem como finalidade fazer uma requesição REST a api para criar um carrinho de compras com os ingressos selecionados pelo corrente usuário. 
function sendToCart() {
    if (batchesSelected.value.length) {

        const id = `RES-${Date.now()}`
        store.dispatch("setCart", {
            id,
            amount: amount.value,
            event: event.value,
            amount_after_discount: amountAfterDiscount.value,
            coupon: coupon.value,
            batches: batchesSelected.value
        })
        loadingCart.value = true
        setTimeout(() => {
            router.push('/checkout/carrinho/' + event.value.slug)
            loadingCart.value = false
        }, 1030)
    } else {
        alert.value = {
            show: true,
            message: "Nenhum ingresso foi selecionado.",
            type: "warning"
        }
    }
}

// Esta função tem como finalidade fazer uma requesição REST a api e aplicar um cupom de desconto para o carrinho de compras. 
async function _applyCoupon(code) {
    if (loadingCoupon.value || code !== "") {
        await applyCoupon({
            couponName: code
        })
            .then(_coupon => {
                if (_coupon.event_type == 'specific' && _coupon.applicable_event.toString() !== event.value._id.toString()) {
                    toast("Cupom de desconto inválido!", {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2000,
                        type: 'error'
                    })
                } else {
                    coupon.value = _coupon
                    toast("Cupom de desconto adicionado!", {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 1000,
                        type: 'success'
                    })
                    amountAfterDiscount.value = amount.value - (amount.value * _coupon.discount_value / 100)
                }
            })
            .catch((err) => {
                toast("Cupom de desconto inválido!", {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2000,
                    type: 'error'
                })
                form.value.couponName = ""
                console.error(err.message)
            })
            .finally(() => {
                loadingCoupon.value = false
            })
    } else return
}

// Esta função tem como finalidade remover o cupom de desconto adicionado ao carrinho de compras. 
function removeCoupon() {
    Swal.fire({
        title: "Voce deseja remover o cupom de desconto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            coupon.value = {}
            amountAfterDiscount.value = 0
            form.value.couponName = ""
            toast("Cupom de desconto removido!", {
                theme: "colored",
                position: "bottom-center",
                autoClose: 1000,
                type: 'success'
            })
        }
    })
}

onMounted(async () => {
    if (!event.value?.slug || event.value?.slug !== route.params.slug) {
        await getEvent(route.params.slug).then(async () => {
            document.title = event.value.name
            await getBatches({
                event: event.value._id,
                page: 1,
                visibility: 'public',
                limit: 10
            });
        })
    } else {
        loadingEvent.value = false
        await getBatches({
            event: event.value._id,
            page: 1,
            visibility: 'public',
            limit: 10
        });
    }
})
</script>

<template>
    <div class="mb-10">
        <div v-if="!loadingEvent">
            <section>
                <!--start header-->
                <div>
                    <div class="flex z-50 justify-center w-full min-w-[320px] bg-white relative h-[180px] max-h-[280px] min-h-[180px] event-background lg:h-[64vh] lg:max-h-[336px] lg:min-h-[336px] bg-[position:50%_50%] bg-[size:120%] before:absolute before:w-full before:h-full before:backdrop-blur-[24px] before:bg-[rgba(0,0,0,0.7)] before:content-['']"
                        :style="`background-image: url(${event.cover.medium || 'https://i.ibb.co/RpzZJGzc/5f282a0c6a2d9.png'})`">

                        <Container>
                            <div class="flex h-full w-full relative items-center lg:px-8">
                                <section class="hidden lg:block min-w-[320px]">
                                    <div class="pr-8">
                                        <h1
                                            class="font-bold text-[28px] text-white mt-2 mb-4 break-words leading-[40px] tracking-[-0.05rem]">
                                            {{ event?.name }}</h1>
                                        <div class="flex text-sm mb-2 gap-2 text-white">
                                            <svg width="16" fill="#fff" height="16" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M7 16C7 15.8022 7.05865 15.6089 7.16853 15.4444C7.27841 15.28 7.43459 15.1518 7.61732 15.0761C7.80004 15.0004 8.00111 14.9806 8.19509 15.0192C8.38907 15.0578 8.56725 15.153 8.70711 15.2929C8.84696 15.4327 8.9422 15.6109 8.98079 15.8049C9.01937 15.9989 8.99957 16.2 8.92388 16.3827C8.84819 16.5654 8.72002 16.7216 8.55557 16.8315C8.39112 16.9414 8.19778 17 8 17C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16ZM12 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7L3 19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4Z">
                                                </path>
                                            </svg>

                                            <p>{{ formatDate(event.starts_at.date) }} às {{
                                                formatTime(event.starts_at.hm)
                                                }}
                                                > {{
                                                    formatDate(event.ends_at.date) }} às {{ formatTime(event.ends_at.hm) }}
                                            </p>
                                        </div>
                                        <div class="flex items-center text-sm gap-2 text-white">
                                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M4 9.92004C4 7.79831 4.84285 5.76348 6.34315 4.26319C7.84344 2.7629 9.87827 1.92004 12 1.92004C14.1217 1.92004 16.1566 2.7629 17.6569 4.26319C19.1571 5.76348 20 7.79831 20 9.92004C20 15.4 13 21.5 12.65 21.76C12.4689 21.915 12.2384 22.0001 12 22.0001C11.7616 22.0001 11.5311 21.915 11.35 21.76C11.05 21.5 4 15.4 4 9.92004ZM12 19.65C10.32 18.06 6 13.65 6 9.92004C6 8.32874 6.63214 6.80262 7.75736 5.6774C8.88258 4.55219 10.4087 3.92004 12 3.92004C13.5913 3.92004 15.1174 4.55219 16.2426 5.6774C17.3679 6.80262 18 8.32874 18 9.92004C18 13.61 13.68 18.06 12 19.65ZM8.5 9.50004C8.5 8.80781 8.70527 8.13112 9.08986 7.55555C9.47444 6.97998 10.0211 6.53137 10.6606 6.26647C11.3001 6.00156 12.0039 5.93225 12.6828 6.0673C13.3617 6.20234 13.9854 6.53569 14.4749 7.02517C14.9644 7.51465 15.2977 8.13829 15.4327 8.81723C15.5678 9.49616 15.4985 10.1999 15.2336 10.8394C14.9687 11.479 14.5201 12.0256 13.9445 12.4102C13.3689 12.7948 12.6922 13 12 13C11.0717 13 10.1815 12.6313 9.52513 11.9749C8.86875 11.3185 8.5 10.4283 8.5 9.50004ZM10.5 9.50004C10.5 9.79672 10.588 10.0867 10.7528 10.3334C10.9176 10.5801 11.1519 10.7723 11.426 10.8859C11.7001 10.9994 12.0017 11.0291 12.2926 10.9712C12.5836 10.9133 12.8509 10.7705 13.0607 10.5607C13.2704 10.3509 13.4133 10.0837 13.4712 9.79268C13.5291 9.50171 13.4994 9.20011 13.3858 8.92602C13.2723 8.65193 13.08 8.41766 12.8334 8.25284C12.5867 8.08802 12.2967 8.00004 12 8.00004C11.6022 8.00004 11.2206 8.15808 10.9393 8.43938C10.658 8.72069 10.5 9.10222 10.5 9.50004Z">
                                                </path>
                                            </svg>

                                            <p>Evento presencial em <a
                                                    :href="`https://www.google.com/maps/search/${event.address.location}`"
                                                    target="_blank" class="text-[rgb(58,175,255)]"><b>{{
                                                        event.address.location }}</b></a> </p>
                                        </div>
                                    </div>
                                </section>

                                <section
                                    class="relative lg:mb-3.5 flex items-end justify-center h-full w-full lg:max-w-[540px] max-h-[280px] mx-auto lg:rounded-xl bg-center bg-cover bg-no-repeat lg:shadow-[0_20px_36px_0_rgba(25,31,40,0.2)]"
                                    :style="`background-image: url(${event.cover.medium || 'https://i.ibb.co/RpzZJGzc/5f282a0c6a2d9.png'})`">
                                    <button @click="copyToClipboard('https://piweto.it.ao/' + route.fullPath)"
                                        class="-mb-[21px] bg-white text-[rgb(0,151,255)] lg:rounded-full outline-none border-transparent shadow-[0_1px_4px_0_rgba(0,0,0,0.15),0_0_4px_0_rgba(0,0,0,0.12)] lg:shadow-none border font-semibold font-sans text-sm leading-4 inline-flex items-center justify-center min-w-fit absolute lg:relative w-full lg:w-max cursor-pointer transition-[0.2s] ease-in no-underline px-4 py-2 flex-row uppercase">
                                        <svg viewBox="0 0 24 24" class="w-6 h-6 mr-2"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill="#0097ff" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M15.26 10.5c.318-.038.64.007.936.131a.7.7 0 0 1 .298.298c.124.295.17.618.13.936v4.27c.04.318-.006.64-.13.936a.7.7 0 0 1-.298.298c-.295.124-.618.17-.936.131H5.74a1.846 1.846 0 0 1-.936-.131.7.7 0 0 1-.298-.298 1.846 1.846 0 0 1-.131-.936v-4.27c-.038-.318.007-.64.131-.936a.7.7 0 0 1 .298-.298c.295-.124.618-.17.936-.131a.875.875 0 0 0 0-1.75 3.36 3.36 0 0 0-1.75.341 2.371 2.371 0 0 0-1.024 1.015 3.36 3.36 0 0 0-.341 1.75v4.27a3.36 3.36 0 0 0 .341 1.75c.225.435.58.79 1.015 1.015a3.36 3.36 0 0 0 1.75.342h9.529a3.36 3.36 0 0 0 1.75-.342c.435-.225.79-.58 1.015-1.015a3.36 3.36 0 0 0 .341-1.75v-4.261a3.36 3.36 0 0 0-.341-1.75A2.372 2.372 0 0 0 17.01 9.1a3.36 3.36 0 0 0-1.75-.341.875.875 0 1 0 0 1.75V10.5ZM9.625 4.742V14a.875.875 0 0 0 1.75 0V4.734l2.004 2.012a.875.875 0 1 0 1.242-1.234l-3.5-3.5a.875.875 0 0 0-1.33.088L6.38 5.512A.879.879 0 1 0 7.62 6.755l2.004-2.013Z">
                                            </path>
                                        </svg>
                                        Compartilhar
                                    </button>
                                </section>
                            </div>
                        </Container>

                    </div>
                </div>
                <!--end header-->

                <!--data start-->
                <Container>
                    <div class="lg:mt-5">
                        <div class="flex flex-col lg:flex-row">
                            <div class="w-full lg:w-2/3">
                                <div class="bg-white pb-10 block mb-5 lg:mb-0 lg:hidden mt-7 lg:mt-0 pt-3 lg:pt-4 px-4">
                                    <h3 style="letter-spacing: 0.2px;"
                                        class="text-[#4c576c] mb-1 font-bold text-[28px] lg:text-3xl">{{
                                            event.name
                                        }}</h3>

                                    <div class="text-[#4c576c] mb-4 text-sm font-semibold lg:text-[15px]">
                                        <span class="flex mb-4 items-center gap-2">
                                            <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" fill="#848c9b" clip-rule="evenodd"
                                                    d="M7 16C7 15.8022 7.05865 15.6089 7.16853 15.4444C7.27841 15.28 7.43459 15.1518 7.61732 15.0761C7.80004 15.0004 8.00111 14.9806 8.19509 15.0192C8.38907 15.0578 8.56725 15.153 8.70711 15.2929C8.84696 15.4327 8.9422 15.6109 8.98079 15.8049C9.01937 15.9989 8.99957 16.2 8.92388 16.3827C8.84819 16.5654 8.72002 16.7216 8.55557 16.8315C8.39112 16.9414 8.19778 17 8 17C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16ZM12 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7L3 19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4Z">
                                                </path>
                                            </svg>
                                            <p>{{ formatEventDates(event.starts_at.date, event.ends_at.date) }}</p>

                                        </span>
                                        <p class="font-bold text-base">
                                            Horários e local das apresentações
                                        </p>
                                        <p class="mb-5">Os horários são referentes ao local do evento.</p>
                                        <span class="flex items-center mb-1 gap-1.5">
                                            <svg class="shrink-0" viewBox="0 0 24 24" fill="#848c9b" width="15px"
                                                height="15px">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM13 8V12H17C17.553 12 18 12.447 18 13C18 13.553 17.553 14 17 14H12C11.448 14 11 13.553 11 13V8C11 7.447 11.448 7 12 7C12.552 7 13 7.447 13 8Z">
                                                </path>
                                            </svg>

                                            <p>{{ formatEventTime(event.starts_at,
                                                event.ends_at) }}</p>
                                        </span>
                                        <span class="flex items-center gap-1.5">
                                            <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" fill="#848c9b" clip-rule="evenodd"
                                                    d="M4 9.92004C4 7.79831 4.84285 5.76348 6.34315 4.26319C7.84344 2.7629 9.87827 1.92004 12 1.92004C14.1217 1.92004 16.1566 2.7629 17.6569 4.26319C19.1571 5.76348 20 7.79831 20 9.92004C20 15.4 13 21.5 12.65 21.76C12.4689 21.915 12.2384 22.0001 12 22.0001C11.7616 22.0001 11.5311 21.915 11.35 21.76C11.05 21.5 4 15.4 4 9.92004ZM12 19.65C10.32 18.06 6 13.65 6 9.92004C6 8.32874 6.63214 6.80262 7.75736 5.6774C8.88258 4.55219 10.4087 3.92004 12 3.92004C13.5913 3.92004 15.1174 4.55219 16.2426 5.6774C17.3679 6.80262 18 8.32874 18 9.92004C18 13.61 13.68 18.06 12 19.65ZM8.5 9.50004C8.5 8.80781 8.70527 8.13112 9.08986 7.55555C9.47444 6.97998 10.0211 6.53137 10.6606 6.26647C11.3001 6.00156 12.0039 5.93225 12.6828 6.0673C13.3617 6.20234 13.9854 6.53569 14.4749 7.02517C14.9644 7.51465 15.2977 8.13829 15.4327 8.81723C15.5678 9.49616 15.4985 10.1999 15.2336 10.8394C14.9687 11.479 14.5201 12.0256 13.9445 12.4102C13.3689 12.7948 12.6922 13 12 13C11.0717 13 10.1815 12.6313 9.52513 11.9749C8.86875 11.3185 8.5 10.4283 8.5 9.50004ZM10.5 9.50004C10.5 9.79672 10.588 10.0867 10.7528 10.3334C10.9176 10.5801 11.1519 10.7723 11.426 10.8859C11.7001 10.9994 12.0017 11.0291 12.2926 10.9712C12.5836 10.9133 12.8509 10.7705 13.0607 10.5607C13.2704 10.3509 13.4133 10.0837 13.4712 9.79268C13.5291 9.50171 13.4994 9.20011 13.3858 8.92602C13.2723 8.65193 13.08 8.41766 12.8334 8.25284C12.5867 8.08802 12.2967 8.00004 12 8.00004C11.6022 8.00004 11.2206 8.15808 10.9393 8.43938C10.658 8.72069 10.5 9.10222 10.5 9.50004Z">
                                                </path>
                                            </svg>

                                            <p>{{ event.address.location }}</p>
                                        </span>

                                    </div>

                                    <!--cart start-->
                                    <div
                                        class="border rounded-[12px] w-full bg-white shadow-[0px_6px_24px_rgb(221,224,228)] overflow-hidden lg:block select-none">
                                        <div
                                            class="bg-[rgb(76,87,108)] text-white flex rounded-t-xl justify-between p-3 text-base font-semibold leading-6">
                                            <span>Ingressos</span>

                                        </div>
                                        <div v-if="!loadingBatches">
                                            <div class="max-h-[345px] overflow-y-auto">
                                                <ul v-if="batches.data.length">
                                                    <li class="border-t py-2 px-4 text-[13px] text-[#50525f] border-[rgb(221,224,228)]"
                                                        v-for="(batch, index) in batches.data" :index="index">


                                                        <div class="flex justify-between mb-0.5 items-center">
                                                            <div class="flex-1">
                                                                <div
                                                                    class="flex text-sm text-[rgb(25,31,40)] items-center gap-1">
                                                                    <div class="font-bold">{{ batch.name }}</div>
                                                                    <!--
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                                data-testid="question-mark-icon" width="16" height="16">
                                                                <path fill="currentColor"
                                                                    d="M18.927 7.984A7.83 7.83 0 0 1 20 12c0 1.451-.358 2.79-1.073 4.016a7.967 7.967 0 0 1-2.911 2.911A7.825 7.825 0 0 1 12 20a7.83 7.83 0 0 1-4.016-1.073 7.965 7.965 0 0 1-2.911-2.911A7.826 7.826 0 0 1 4 12c0-1.451.358-2.79 1.073-4.016a7.96 7.96 0 0 1 2.912-2.91A7.824 7.824 0 0 1 12 4a7.83 7.83 0 0 1 4.016 1.073 7.966 7.966 0 0 1 2.911 2.911zm-3.057 2.86a2.797 2.797 0 0 0-.448-2.542 3.945 3.945 0 0 0-1.442-1.208 3.952 3.952 0 0 0-1.771-.428c-1.688 0-2.976.74-3.865 2.22-.104.166-.076.312.083.437l1.375 1.042a.297.297 0 0 0 .198.062.307.307 0 0 0 .26-.125c.369-.472.667-.792.897-.959.236-.166.534-.25.896-.25.333 0 .63.09.89.271.26.181.39.386.39.615 0 .264-.069.476-.208.635-.138.16-.374.316-.708.47a3.566 3.566 0 0 0-1.203.9c-.365.406-.547.842-.547 1.307v.376c0 .097.031.177.094.24A.324.324 0 0 0 11 14h2a.326.326 0 0 0 .24-.094.325.325 0 0 0 .094-.24c0-.131.075-.303.224-.515.149-.212.338-.383.567-.516.222-.125.392-.223.51-.296.119-.073.279-.195.48-.365a2.43 2.43 0 0 0 .463-.5c.108-.163.205-.373.292-.63zM13.334 17v-2a.322.322 0 0 0-.333-.333H11a.327.327 0 0 0-.24.093.325.325 0 0 0-.093.24v2c0 .097.031.177.093.24a.325.325 0 0 0 .24.093h2a.32.32 0 0 0 .334-.333z">
                                                                </path>
                                                            </svg>-->
                                                                </div>
                                                                <p>{{ formatAmount(batch.price) }}</p>
                                                                <p class="text-[rgb(132,140,155)] italic text-xs">Vendas
                                                                    até
                                                                    {{
                                                                        formattedDate(batch.ends_at.date) }}</p>
                                                            </div>
                                                            <div>
                                                                <div v-if="batch.quantity > 0 && !isDatePassed(batch.ends_at.date) && canReleaseSales(batch?.starts_at?.date)"
                                                                    class="flex items-center">
                                                                    <button
                                                                        class="w-[32px] h-[32px] m-1 flex justify-center items-center text-[#fff] bg-[rgb(0,151,255)] rounded-[8px]"
                                                                        @click="reduceBatch(index)" :class="{
                                                                            'cursor-not-allowed text-[#848C9B] bg-[rgb(221,224,228)]': batch.quantitySelected <= 0
                                                                        }">
                                                                        <svg viewBox="0 0 16 16" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="13">
                                                                            <path
                                                                                d="M3.294 7.637h9.412c.347 0 .628.298.628.667 0 .368-.281.666-.628.666H3.294c-.346 0-.627-.298-.627-.666 0-.369.28-.667.627-.667Z"
                                                                                fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <p
                                                                        class="text-base font-semibold text-[rgb(76,87,108)] w-[26px] text-center">
                                                                        {{ batch.quantitySelected }}</p>
                                                                    <button
                                                                        class=" w-[32px] h-[32px] m-1 flex justify-center items-center text-[#fff] bg-[rgb(0,151,255)] rounded-[8px]"
                                                                        @click="addBatch(index)" :class="{
                                                                            'cursor-not-allowed text-[#848C9B] bg-[rgb(221,224,228)]': batch.quantitySelected >= batch.quantity_for_purchase.max
                                                                        }">
                                                                        <svg viewBox="0 0 13 13" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="13">
                                                                            <path
                                                                                d="M.667 6.99H11.98a.667.667 0 0 0 0-1.333H6.99V.667a.667.667 0 0 0-1.333 0v4.99H.667a.667.667 0 0 0 0 1.333Z"
                                                                                fill="#fff"></path>
                                                                            <path
                                                                                d="M5.657 11.98V6.04a.667.667 0 0 1 1.333 0v5.94a.667.667 0 0 1-1.333 0Z"
                                                                                fill="#fff"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>

                                                                <div class="italic"
                                                                    v-else-if="isDatePassed(batch.ends_at.date)">
                                                                    <p>Encerrado</p>
                                                                </div>
                                                                <div class="italic"
                                                                    v-else-if="!canReleaseSales(batch?.starts_at?.date)">
                                                                    <p>Em breve</p>
                                                                </div>

                                                                <div class="italic lmax"
                                                                    v-else-if="batch.quantity == 0">
                                                                    <p>Esgotado</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div v-else class="flex justify-center items-center py-5">
                                            <BtnSpinner />
                                        </div>

                                    </div>
                                    <!--end start-->
                                </div>
                                <div class="px-4 lg:mt-4 mb-5">
                                    <div class="mb-5">
                                        <h3 class="text-[rgb(25,31,40)] font-bold text-lg lg:text-[20px]">Descrição do
                                            evento</h3>
                                    </div>
                                    <div class="text-[rgb(25,31,40)] font-normal text-base" v-html="event.description">
                                    </div>
                                </div>
                                <hr>
                                <div class="px-4 mt-4 mb-8">
                                    <div class="mb-3">
                                        <h3 class="text-[#6c757d] mb-3 font-bold text-lg">Sobre o organizador</h3>
                                        <div class="text-[#495057] mb-4 text-[15px]">
                                            <div class="gap-3 text-base py-4 flex text-[#1b1e21]">
                                                <div class="shrink-0">
                                                    <img class="w-10 h-10 border rounded-full border-gray-300 bg-white"
                                                        v-lazy="'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'">
                                                </div>
                                                <div>
                                                    <div
                                                        class="font-bold flex gap-0.5 items-center whitespace-break-spaces max-w-full lg:w-full">
                                                        {{
                                                            event?.created_by?.first_name }} {{
                                                            event?.created_by?.last_name }}
                                                        <svg v-if="event?.created_by?.is_checked"
                                                            aria-label="Verificado" role="img" viewBox="0 0 40 40"
                                                            class="w-4 h-4 shrink-0">
                                                            <title>Verificado</title>
                                                            <path fill="#0095f6"
                                                                d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z">
                                                            </path>
                                                        </svg>
                                                    </div>
                                                    <div class="max-w-full lg:w-full text-gray-500">{{
                                                        event?.created_by?.bio }}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-1 items-center lg:flex-row flex-col gap-3">
                                            <a v-if="event?.created_by?.email?.length" style="letter-spacing: 0.5px;"
                                                :href="`mailto:contato@evento.com?subject=Informações sobre ${encodeURIComponent(event?.name)}&body=Olá,%0D%0A%0D%0AGostaria de saber mais sobre ${encodeURIComponent(event?.name)}.%0D%0A%0D%0AObrigado!`"
                                                target="_blank"
                                                class="rounded-full  gap-1 hover:bg-brand-primary hover:text-white transition-colors px-5 py-2 border uppercase text-[14px] font-bold border-brand-primary text-brand-primary lg:w-auto w-full"
                                                role="button" aria-pressed="true">


                                                Enviar e-mail
                                            </a>

                                            <a v-if="event?.created_by?.phone?.length" style="letter-spacing: 0.5px;"
                                                :href="`https://wa.me/${event?.created_by?.phone}?text=${encodeURIComponent('Olá, gostaria de informações sobre ' + event?.name)}`"
                                                target="_blank"
                                                class="rounded-full  gap-1 hover:bg-brand-primary hover:text-white transition-colors px-5 py-2 border uppercase text-[14px] font-bold border-brand-primary text-brand-primary lg:w-auto w-full"
                                                role="button" aria-pressed="true">
                                                Contato via WhatsApp
                                            </a>
                                        </div>

                                    </div>
                                </div>
                                <hr />
                                <div class="px-4 mt-4">
                                    <div class="mb-3">
                                        <h3 class="text-[#6c757d] mb-1 font-bold text-lg">Local</h3>
                                        <div class="text-[#495057] mb-4 text-[15px]">
                                            <span class="flex items-center gap-1">
                                                <svg width="15" height="15" viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" fill="currentColor" clip-rule="evenodd"
                                                        d="M4 9.92004C4 7.79831 4.84285 5.76348 6.34315 4.26319C7.84344 2.7629 9.87827 1.92004 12 1.92004C14.1217 1.92004 16.1566 2.7629 17.6569 4.26319C19.1571 5.76348 20 7.79831 20 9.92004C20 15.4 13 21.5 12.65 21.76C12.4689 21.915 12.2384 22.0001 12 22.0001C11.7616 22.0001 11.5311 21.915 11.35 21.76C11.05 21.5 4 15.4 4 9.92004ZM12 19.65C10.32 18.06 6 13.65 6 9.92004C6 8.32874 6.63214 6.80262 7.75736 5.6774C8.88258 4.55219 10.4087 3.92004 12 3.92004C13.5913 3.92004 15.1174 4.55219 16.2426 5.6774C17.3679 6.80262 18 8.32874 18 9.92004C18 13.61 13.68 18.06 12 19.65ZM8.5 9.50004C8.5 8.80781 8.70527 8.13112 9.08986 7.55555C9.47444 6.97998 10.0211 6.53137 10.6606 6.26647C11.3001 6.00156 12.0039 5.93225 12.6828 6.0673C13.3617 6.20234 13.9854 6.53569 14.4749 7.02517C14.9644 7.51465 15.2977 8.13829 15.4327 8.81723C15.5678 9.49616 15.4985 10.1999 15.2336 10.8394C14.9687 11.479 14.5201 12.0256 13.9445 12.4102C13.3689 12.7948 12.6922 13 12 13C11.0717 13 10.1815 12.6313 9.52513 11.9749C8.86875 11.3185 8.5 10.4283 8.5 9.50004ZM10.5 9.50004C10.5 9.79672 10.588 10.0867 10.7528 10.3334C10.9176 10.5801 11.1519 10.7723 11.426 10.8859C11.7001 10.9994 12.0017 11.0291 12.2926 10.9712C12.5836 10.9133 12.8509 10.7705 13.0607 10.5607C13.2704 10.3509 13.4133 10.0837 13.4712 9.79268C13.5291 9.50171 13.4994 9.20011 13.3858 8.92602C13.2723 8.65193 13.08 8.41766 12.8334 8.25284C12.5867 8.08802 12.2967 8.00004 12 8.00004C11.6022 8.00004 11.2206 8.15808 10.9393 8.43938C10.658 8.72069 10.5 9.10222 10.5 9.50004Z">
                                                    </path>
                                                </svg>

                                                <p>{{ event.address.location }}</p>
                                            </span>
                                        </div>
                                        <a style="letter-spacing: 0.5px;"
                                            :href="`https://www.google.com/maps/search/${event.address.location}`"
                                            target="_blank"
                                            class="rounded-full hover:bg-brand-primary hover:text-white transition-colors px-5 py-2 border uppercase text-[14px] font-bold border-brand-primary text-brand-primary"
                                            role="button" aria-pressed="true">
                                            Ver Mapa
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="px-4 hidden shrink-0 lg:block w-[335px]">
                                <div class="sticky top-0 w-full">
                                    <!--cart start-->
                                    <div
                                        class="border rounded-[12px] w-[335px] bg-white shadow-[0px_6px_24px_rgb(221,224,228)] overflow-hidden lg:block select-none">
                                        <div
                                            class="bg-[rgb(76,87,108)] text-white flex rounded-t-xl justify-between p-3 text-base font-semibold leading-6">
                                            <span>Ingressos</span>

                                        </div>
                                        <div v-if="!loadingBatches">
                                            <div class="max-h-[345px] overflow-y-auto">
                                                <ul v-if="batches.data.length">
                                                    <li class="border-b py-2 px-4 text-[13px] text-[#50525f] border-[rgb(221,224,228)]"
                                                        v-for="(batch, index) in batches.data" :index="index">
                                                        <div class="flex justify-between mb-0.5 items-center">
                                                            <div class="flex-1">
                                                                <div
                                                                    class="flex text-sm text-[rgb(25,31,40)] items-center gap-1">
                                                                    <div class="font-bold">{{ batch.name }}</div>
                                                                    <!--
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                                data-testid="question-mark-icon" width="16" height="16">
                                                                <path fill="currentColor"
                                                                    d="M18.927 7.984A7.83 7.83 0 0 1 20 12c0 1.451-.358 2.79-1.073 4.016a7.967 7.967 0 0 1-2.911 2.911A7.825 7.825 0 0 1 12 20a7.83 7.83 0 0 1-4.016-1.073 7.965 7.965 0 0 1-2.911-2.911A7.826 7.826 0 0 1 4 12c0-1.451.358-2.79 1.073-4.016a7.96 7.96 0 0 1 2.912-2.91A7.824 7.824 0 0 1 12 4a7.83 7.83 0 0 1 4.016 1.073 7.966 7.966 0 0 1 2.911 2.911zm-3.057 2.86a2.797 2.797 0 0 0-.448-2.542 3.945 3.945 0 0 0-1.442-1.208 3.952 3.952 0 0 0-1.771-.428c-1.688 0-2.976.74-3.865 2.22-.104.166-.076.312.083.437l1.375 1.042a.297.297 0 0 0 .198.062.307.307 0 0 0 .26-.125c.369-.472.667-.792.897-.959.236-.166.534-.25.896-.25.333 0 .63.09.89.271.26.181.39.386.39.615 0 .264-.069.476-.208.635-.138.16-.374.316-.708.47a3.566 3.566 0 0 0-1.203.9c-.365.406-.547.842-.547 1.307v.376c0 .097.031.177.094.24A.324.324 0 0 0 11 14h2a.326.326 0 0 0 .24-.094.325.325 0 0 0 .094-.24c0-.131.075-.303.224-.515.149-.212.338-.383.567-.516.222-.125.392-.223.51-.296.119-.073.279-.195.48-.365a2.43 2.43 0 0 0 .463-.5c.108-.163.205-.373.292-.63zM13.334 17v-2a.322.322 0 0 0-.333-.333H11a.327.327 0 0 0-.24.093.325.325 0 0 0-.093.24v2c0 .097.031.177.093.24a.325.325 0 0 0 .24.093h2a.32.32 0 0 0 .334-.333z">
                                                                </path>
                                                            </svg>-->
                                                                </div>
                                                                <p>{{ formatAmount(batch.price) }}</p>
                                                                <p class="text-[rgb(132,140,155)] italic text-xs">Vendas
                                                                    até
                                                                    {{
                                                                        formattedDate(batch.ends_at.date) }}</p>
                                                            </div>
                                                            <div>
                                                                <div v-if="batch.quantity > 0 && !isDatePassed(batch.ends_at.date) && canReleaseSales(batch?.starts_at?.date)"
                                                                    class="flex items-center">
                                                                    <button
                                                                        class="w-[32px] h-[32px] m-1 flex justify-center items-center text-[#fff] bg-[rgb(0,151,255)] rounded-[8px]"
                                                                        @click="reduceBatch(index)" :class="{
                                                                            'cursor-not-allowed text-[#848C9B] bg-[rgb(221,224,228)]': batch.quantitySelected <= 0
                                                                        }">
                                                                        <svg viewBox="0 0 16 16" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="13">
                                                                            <path
                                                                                d="M3.294 7.637h9.412c.347 0 .628.298.628.667 0 .368-.281.666-.628.666H3.294c-.346 0-.627-.298-.627-.666 0-.369.28-.667.627-.667Z"
                                                                                fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <p
                                                                        class="text-base font-semibold text-[rgb(76,87,108)] w-[26px] text-center">
                                                                        {{ batch.quantitySelected }}</p>
                                                                    <button
                                                                        class=" w-[32px] h-[32px] m-1 flex justify-center items-center text-[#fff] bg-[rgb(0,151,255)] rounded-[8px]"
                                                                        @click="addBatch(index)" :class="{
                                                                            'cursor-not-allowed text-[#848C9B] bg-[rgb(221,224,228)]': batch.quantitySelected >= batch.quantity_for_purchase.max
                                                                        }">
                                                                        <svg viewBox="0 0 13 13" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="13">
                                                                            <path
                                                                                d="M.667 6.99H11.98a.667.667 0 0 0 0-1.333H6.99V.667a.667.667 0 0 0-1.333 0v4.99H.667a.667.667 0 0 0 0 1.333Z"
                                                                                fill="#fff"></path>
                                                                            <path
                                                                                d="M5.657 11.98V6.04a.667.667 0 0 1 1.333 0v5.94a.667.667 0 0 1-1.333 0Z"
                                                                                fill="#fff"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>

                                                                <div class="italic"
                                                                    v-else-if="isDatePassed(batch.ends_at.date)">
                                                                    <p>Encerrado</p>
                                                                </div>
                                                                <div class="italic"
                                                                    v-else-if="!canReleaseSales(batch?.starts_at?.date)">
                                                                    <p>Em breve</p>
                                                                </div>

                                                                <div class="italic lmax"
                                                                    v-else-if="batch.quantity == 0">
                                                                    <p>Esgotado</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="p-4">
                                                <div v-if="amount > 0"
                                                    class="flex mb-2 text-[rgb(25,31,40)] justify-between gap-1 items-center flex-row">
                                                    <div class="flex items-center gap-1">
                                                        <small class="text-muted text-sm py-2">Total</small>
                                                        <p v-if="!amountAfterDiscount" class="text-lg font-bold">{{
                                                            formatAmount(amount) }}</p>
                                                        <p v-else class="text-lg font-bold">{{
                                                            formatAmount(amountAfterDiscount) }}</p>
                                                    </div>
                                                    <div v-if="amountAfterDiscount">
                                                        <p class="text-sm line-through font-semibold">{{
                                                            formatAmount(amount) }}</p>
                                                    </div>
                                                </div>

                                                <div class="mb-4">
                                                    <button v-if="!showCouponInput"
                                                        @click="showCouponInput = !showCouponInput"
                                                        class="flex mx-auto items-center text-sm font-semibold gap-2 p-3 text-[rgb(0,151,255)]">
                                                        <svg width="16" height="16" fill="currentColor"
                                                            viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M21 9C21.2652 9 21.5196 8.89464 21.7071 8.70711C21.8946 8.51957 22 8.26522 22 8V4.67C22.0093 4.32771 21.9509 3.98695 21.8281 3.6673C21.7054 3.34764 21.5207 3.05537 21.2847 2.80728C21.0487 2.55919 20.766 2.36017 20.4529 2.22163C20.1397 2.08309 19.8023 2.00778 19.46 2L2.53998 2C2.19766 2.00778 1.86024 2.08309 1.5471 2.22163C1.23396 2.36017 0.951268 2.55919 0.715258 2.80728C0.479249 3.05537 0.294568 3.34764 0.171821 3.6673C0.0490736 3.98695 -0.00932306 4.32771 -1.58838e-05 4.67V8C-1.58838e-05 8.26522 0.105341 8.51957 0.292877 8.70711C0.480414 8.89464 0.734768 9 0.999984 9C1.37244 9.02566 1.71951 9.19798 1.96509 9.47918C2.21066 9.76037 2.3347 10.1275 2.30998 10.5C2.3347 10.8725 2.21066 11.2396 1.96509 11.5208C1.71951 11.802 1.37244 11.9743 0.999984 12C0.734768 12 0.480414 12.1054 0.292877 12.2929C0.105341 12.4804 -1.58838e-05 12.7348 -1.58838e-05 13V16.33C-0.00932306 16.6723 0.0490736 17.013 0.171821 17.3327C0.294568 17.6524 0.479249 17.9446 0.715258 18.1927C0.951268 18.4408 1.23396 18.6398 1.5471 18.7784C1.86024 18.9169 2.19766 18.9922 2.53998 19H19.46C19.8023 18.9922 20.1397 18.9169 20.4529 18.7784C20.766 18.6398 21.0487 18.4408 21.2847 18.1927C21.5207 17.9446 21.7054 17.6524 21.8281 17.3327C21.9509 17.013 22.0093 16.6723 22 16.33V13C22 12.7348 21.8946 12.4804 21.7071 12.2929C21.5196 12.1054 21.2652 12 21 12C20.6275 11.9743 20.2805 11.802 20.0349 11.5208C19.7893 11.2396 19.6653 10.8725 19.69 10.5C19.6653 10.1275 19.7893 9.76037 20.0349 9.47918C20.2805 9.19798 20.6275 9.02566 21 9ZM20 7.16C19.3213 7.41617 18.7368 7.87301 18.3242 8.46969C17.9117 9.06638 17.6907 9.77458 17.6907 10.5C17.6907 11.2254 17.9117 11.9336 18.3242 12.5303C18.7368 13.127 19.3213 13.5838 20 13.84V16.33C20.0168 16.4904 19.9695 16.6509 19.8683 16.7764C19.7671 16.902 19.6203 16.9824 19.46 17H2.53998C2.37969 16.9824 2.2329 16.902 2.13171 16.7764C2.03052 16.6509 1.98316 16.4904 1.99998 16.33V13.84C2.67867 13.5838 3.26321 13.127 3.67576 12.5303C4.08832 11.9336 4.30931 11.2254 4.30931 10.5C4.30931 9.77458 4.08832 9.06638 3.67576 8.46969C3.26321 7.87301 2.67867 7.41617 1.99998 7.16V4.67C1.98316 4.50962 2.03052 4.34911 2.13171 4.22356C2.2329 4.098 2.37969 4.01762 2.53998 4H12V14C12 14.2652 12.1053 14.5196 12.2929 14.7071C12.4804 14.8946 12.7348 15 13 15C13.2652 15 13.5196 14.8946 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14V4H19.46C19.6203 4.01762 19.7671 4.098 19.8683 4.22356C19.9695 4.34911 20.0168 4.50962 20 4.67V7.16Z">
                                                            </path>
                                                        </svg>
                                                        <span>Inserir código promocional</span>
                                                    </button>
                                                    <div class="flex relative gap-3 items-center justify-between"
                                                        v-else>
                                                        <div class="relative flex-1">
                                                            <input
                                                                class="flex flex-row items-center w-full text-[rgb(25,31,40)] border border-[rgb(221,224,228)] rounded-[4px] py-2 pr-12 p-4 text-base transition-[border-color] focus:border-[rgb(0,151,255)] focus:ring-1 focus:ring-[rgb(0,151,255)] duration-300 outline-none gap-4"
                                                                v-model="form.couponName" type="text"
                                                                placeholder="Código" :readonly="coupon._id">
                                                            <button
                                                                @click="showCouponInput = !showCouponInput; form.couponName = ''"
                                                                class="absolute right-3 top-1/2 -translate-y-1/2">
                                                                <svg width="24" fill="rgb(132, 140, 155)" height="24"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M6.70711 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071Z">
                                                                    </path>
                                                                    <path
                                                                        d="M17.2929 18.7071L13.8201 15.2343C13.4296 14.8438 13.4296 14.2106 13.8201 13.8201C14.2106 13.4296 14.8438 13.4296 15.2343 13.8201L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071Z">
                                                                    </path>
                                                                </svg>
                                                            </button>
                                                        </div>



                                                        <button :disabled="form.couponName == '' || loadingCoupon"
                                                            class="rounded-lg outline-none border text-sm font-semibold font-sans leading-4 inline-flex items-center justify-center min-w-fit w-max cursor-pointer transition-all ease-in duration-200 no-underline hover:bg-[rgb(0,151,255)] text-[rgb(0,151,255)] hover:text-white border-[rgb(0,151,255)] py-3 px-4"
                                                            v-if="form.couponName == '' || !coupon._id"
                                                            @click="_applyCoupon(form.couponName)">Aplicar</button>
                                                        <button
                                                            class="rounded-lg outline-none border text-sm font-semibold font-sans leading-4 inline-flex items-center justify-center min-w-fit w-max cursor-pointer transition-all ease-in duration-200 no-underline hover:bg-[rgb(0,151,255)] text-[rgb(0,151,255)] hover:text-white border-[rgb(0,151,255)] py-3 px-4"
                                                            v-else @click="removeCoupon()">Remover</button>
                                                    </div>

                                                </div>

                                                <button style="letter-spacing: 0.5px;"
                                                    class=" bg-[rgb(23,178,106)] hover:bg-[rgb(7,148,85)] h-[48px]  rounded-[8px] disabled:bg-gray-400 disabled:cursor-default disabled:hover:bg-gray-400 disabled:hover:border-gray-400 transition-colors w-full font-semibold text-[14px] py-2.5 px-3 text-[#fff] btn-submit mb-1"
                                                    @click="sendToCart"
                                                    :disabled="isEventOver || loadingCart || amount == 0">
                                                    <span v-if="!loadingCart">{{ amount == 0 ? 'Selecione um Ingresso' :
                                                        'Comprar ingressos' }}</span>
                                                    <span v-else>Carregando...</span>
                                                </button>


                                            </div>
                                        </div>
                                        <div v-else class="flex justify-center items-center py-5">
                                            <BtnSpinner />
                                        </div>

                                    </div>
                                    <!--end start-->
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
                <!--data end-->
            </section>
            <CartDrawer :amount="amount" :show="amount > 0" v-model:couponName="form.couponName"
                :amount-after-discount="amountAfterDiscount" :coupon="coupon" :loadingCart="loadingCart"
                :showCouponInput="showCouponInput" @toggle-coupon-input="showCouponInput = $event"
                @sendToCart="sendToCart" @applyCoupon="_applyCoupon" @removeCoupon="removeCoupon" />
        </div>
        <SplashScreen :visible="loadingEvent" />
    </div>

</template>