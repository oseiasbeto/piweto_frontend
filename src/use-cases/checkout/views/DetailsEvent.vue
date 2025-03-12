<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify"
import { onMounted, ref, computed } from "vue";
import { useEvents } from "../../../repositories/events-repository";
import { useBatches } from "../../../repositories/batches-repository";
import { useCarts } from "../../../repositories/carts-repository";
import formatAmount from "@/utils/formatAmount";
import { useStore } from "vuex";
import Container from "@/use-cases/marketplace/components/ui/Container.vue";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import Spinner from "../components/ui/Spinner.vue";
import BtnSpinner from "../../marketplace/components/spinners/BtnSpinner";
import moment from "moment";

const { getEvent, loading: loadingEvent, error: errorEvent } = useEvents();
const { getBatches, loading: loadingBatches, error: errorBatches } = useBatches()
const { newCart, loading: loadingCart, error: errorCart } = useCarts()

const route = useRoute()
const router = useRouter()
const store = useStore()
const form = ref({
    couponName: ""
})
const coupon = ref({})
const amount = ref(0)
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

// Esta função computada tem como finalidade verificar se o corrente usuário está autenticado no sistema.
const generateColorAlert = computed(() => {
    switch (alert.value.type) {
        case 'warning':
            return 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]'
            break;

        default:
            return 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'
            break;
    }
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
    if (coupon.value._id != undefined) {
        amountAfterDiscount.value = amount.value - (amount.value * coupon.value.discount / 100)
    }
}

function setModalSignIn() {
    store.dispatch("setModal", {
        name: "signin",
        show: true,
        data: {}
    })
}

// esta funcao tem como finalizade setar algumas informacoes no head do documento html (titulo, og:image)
function setHeadDocument(ev) {
    document.title = ev.name
    let image = document.querySelector('meta[property="og:image"]')

    if (ev.cover.url != null) {
        image.setAttribute("content", ev.cover.medium)
    }
}
// Esta função tem como finalidade fazer uma requesição REST a api para criar um carrinho de compras com os ingressos selecionados pelo corrente usuário. 
async function sendToCart() {
    if (batchesSelected.value.length) {
        if (hasLogged.value) {
            loadingCart.value = true
            setTimeout(() => {
                const id = `RES-${Date.now()}`
                store.dispatch("setCart", {
                    id,
                    amount: amount.value,
                    event: event.value,
                    amount_after_discount: amountAfterDiscount.value,
                    coupon: coupon.value,
                    batches: batchesSelected.value
                })

                router.push('/checkout/carrinho/' + event.value.slug)
                loadingCart.value = false
            }, 1030)
        } else {
            loadingCart.value = true
            setTimeout(() => {
                loadingCart.value = false
                router.push({
                    path: "/conta/login",
                    query: {
                        r: route.fullPath
                    }
                })
            }, 750)
        }
    } else {
        alert.value = {
            show: true,
            message: "Nenhum ingresso foi selecionado.",
            type: "warning"
        }
    }
}

// Esta função tem como finalidade fazer uma requesição REST a api e aplicar um cupom de desconto para o carrinho de compras. 
async function _applyCoupon() {
    if (hasLogged.value) {
        if (loadingCoupon.value || form.value.couponName !== "") {
            await applyCoupon({
                couponName: form.value.couponName
            })
                .then(_coupon => {
                    if (_coupon.event_type == 'specific' && _coupon.event !== event.value._id) {
                        toast("Cupom de desconto inválido!", {
                            theme: "colored",
                            position: "bottom-center",
                            autoClose: 2000,
                            type: 'error'
                        })
                    } else {
                        coupon.value = _coupon
                        toast("Cupom de desconto adicionado!", {
                            theme: "colored",
                            position: "bottom-center",
                            autoClose: 1000,
                            type: 'success'
                        })
                        amountAfterDiscount.value = amount.value - (amount.value * _coupon.discount / 100)
                    }

                })
                .catch((err) => {
                    toast("Cupom de desconto inválido!", {
                        theme: "colored",
                        position: "bottom-center",
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
    } else {
        loadingCoupon.value = true
        setTimeout(() => {
            loadingCoupon.value = false
            router.push({
                path: "/login",
                query: {
                    r: route.fullPath
                }
            })
        }, 750)
    }
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
    await getEvent(route.params.slug).then(async () => {
        setHeadDocument(event.value)

        await getBatches({
            event: event.value._id,
            page: 1,
            visibility: 'public',
            limit: 10
        });
    })
})
</script>

<template>
    <div class="mb-10">
        <div v-if="!loadingEvent">
            <section>
                <!--start header-->
                <div>
                    <!--start bg wrapper-->
                    <div class="hidden lg:flex h-[92vh] overflow-hidden max-h-[480px] min-h-[480px]">
                        <div class="relative h-full flex-1 text-center z-10">
                            <div class="max-h-[480px] h-full block">
                                <div :style="`background-image: linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.2)) , url(${event.cover.medium})`"
                                    class="img-blur-event"></div>
                            </div>
                        </div>
                    </div>
                    <!--end bg wrapper-->

                    <!--start cover-->
                    <div class="flex justify-center items-center mx-auto">
                        <div class="mx-auto w-full flex items-center justify-center">
                            <img v-lazy="event.cover.medium"
                                class="relative rounded-none lg:absolute lg:mt-[-460px] img-event lg:rounded-[30px] w-full h-[190px] lg:w-[1000px] lg:h-[500px]">
                        </div>
                    </div>
                    <!--end cover-->
                </div>
                <!--end header-->

                <!--data start-->
                <Container>
                    <div class="mt-7 lg:mt-20">
                        <div class="flex flex-col lg:flex-row justify-between">
                            <div class="px-4 flex-shrink-0 w-full lg:w-2/3">
                                <h3 style="letter-spacing: 0.2px;"
                                    class="text-[#191f28] mb-4 font-bold text-xl lg:text-3xl">{{
                                        event.name
                                    }}</h3>
                                <div class="text-[#495057] mb-4 text-[13px] lg:text-[15px]">
                                    <span class="flex items-center gap-1">
                                        <svg width="15" height="15" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" fill="currentColor" clip-rule="evenodd"
                                                d="M4 9.92004C4 7.79831 4.84285 5.76348 6.34315 4.26319C7.84344 2.7629 9.87827 1.92004 12 1.92004C14.1217 1.92004 16.1566 2.7629 17.6569 4.26319C19.1571 5.76348 20 7.79831 20 9.92004C20 15.4 13 21.5 12.65 21.76C12.4689 21.915 12.2384 22.0001 12 22.0001C11.7616 22.0001 11.5311 21.915 11.35 21.76C11.05 21.5 4 15.4 4 9.92004ZM12 19.65C10.32 18.06 6 13.65 6 9.92004C6 8.32874 6.63214 6.80262 7.75736 5.6774C8.88258 4.55219 10.4087 3.92004 12 3.92004C13.5913 3.92004 15.1174 4.55219 16.2426 5.6774C17.3679 6.80262 18 8.32874 18 9.92004C18 13.61 13.68 18.06 12 19.65ZM8.5 9.50004C8.5 8.80781 8.70527 8.13112 9.08986 7.55555C9.47444 6.97998 10.0211 6.53137 10.6606 6.26647C11.3001 6.00156 12.0039 5.93225 12.6828 6.0673C13.3617 6.20234 13.9854 6.53569 14.4749 7.02517C14.9644 7.51465 15.2977 8.13829 15.4327 8.81723C15.5678 9.49616 15.4985 10.1999 15.2336 10.8394C14.9687 11.479 14.5201 12.0256 13.9445 12.4102C13.3689 12.7948 12.6922 13 12 13C11.0717 13 10.1815 12.6313 9.52513 11.9749C8.86875 11.3185 8.5 10.4283 8.5 9.50004ZM10.5 9.50004C10.5 9.79672 10.588 10.0867 10.7528 10.3334C10.9176 10.5801 11.1519 10.7723 11.426 10.8859C11.7001 10.9994 12.0017 11.0291 12.2926 10.9712C12.5836 10.9133 12.8509 10.7705 13.0607 10.5607C13.2704 10.3509 13.4133 10.0837 13.4712 9.79268C13.5291 9.50171 13.4994 9.20011 13.3858 8.92602C13.2723 8.65193 13.08 8.41766 12.8334 8.25284C12.5867 8.08802 12.2967 8.00004 12 8.00004C11.6022 8.00004 11.2206 8.15808 10.9393 8.43938C10.658 8.72069 10.5 9.10222 10.5 9.50004Z">
                                            </path>
                                        </svg>

                                        <p>{{ event.address.location }}</p>
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <svg width="15" height="15" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" fill="currentColor" clip-rule="evenodd"
                                                d="M7 16C7 15.8022 7.05865 15.6089 7.16853 15.4444C7.27841 15.28 7.43459 15.1518 7.61732 15.0761C7.80004 15.0004 8.00111 14.9806 8.19509 15.0192C8.38907 15.0578 8.56725 15.153 8.70711 15.2929C8.84696 15.4327 8.9422 15.6109 8.98079 15.8049C9.01937 15.9989 8.99957 16.2 8.92388 16.3827C8.84819 16.5654 8.72002 16.7216 8.55557 16.8315C8.39112 16.9414 8.19778 17 8 17C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16ZM12 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7L3 19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4Z">
                                            </path>
                                        </svg>

                                        <p>{{ formatDate(event.starts_at.date) }} às {{ formatTime(event.starts_at.hm)
                                            }}
                                            > {{
                                                formatDate(event.ends_at.date) }} às {{ formatTime(event.ends_at.hm) }}</p>
                                    </span>
                                </div>
                                <!--start alert-->
                                <div class="p-2 text-base bg-[#f8d7da] text-[#721c24] border-[#f5c6cb] mb-3 border"
                                    v-show="isEventOver">
                                    <p>Este evento ja foi encerrado!</p>
                                </div>
                                <!--end alert-->

                                <!--cart start-->
                                <div class="border block mb-4 lg:hidden border-[#dee2e6] select-none">
                                    <!--start alert-->
                                    <div class="p-2 text-base mb-3 border" :class="generateColorAlert"
                                        v-show="alert.show && amount == 0">
                                        <p>{{ alert.message }}</p>
                                    </div>
                                    <!--end alert-->
                                    <div
                                        class="bg-[#3B3C3C] border-b border-[#dee2e6] px-3 flex justify-between items-center text-[14px] font-bold h-[46px] text-white">
                                        <span>Ingressos</span>
                                        <span class="flex gap-1 items-center">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M19.382 6C20.08 6 20.716 6.354 21.083 6.948C21.45 7.542 21.483 8.269 21.171 8.894L17.895 15.447C17.725 15.786 17.379 16 17 16H8C7.549 16 7.154 15.698 7.035 15.263L4.236 5H3C2.447 5 2 4.552 2 4C2 3.448 2.447 3 3 3H5C5.451 3 5.846 3.302 5.965 3.737L6.582 6H19.382ZM16.382 14H8.764L7.127 8H19.382L16.382 14ZM7.5 21C8.328 21 9 20.329 9 19.5C9 18.671 8.328 18 7.5 18C6.672 18 6 18.671 6 19.5C6 20.329 6.672 21 7.5 21ZM17.5 21C18.328 21 19 20.329 19 19.5C19 18.671 18.328 18 17.5 18C16.672 18 16 18.671 16 19.5C16 20.329 16.672 21 17.5 21Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                            <div class="flex gap-1 items-center">

                                                <span> {{ formatAmount(amount) }}</span>
                                            </div>

                                        </span>
                                    </div>
                                    <div v-if="!loadingBatches">
                                        <div>
                                            <ul v-if="batches.data.length">
                                                <li class="border-b py-2 px-3 text-[13px] text-[#50525f] border-[#dee2e6]"
                                                    v-for="(batch, index) in batches.data" :index="index">
                                                    <div class="flex text-[#50525f] items-center gap-1">
                                                        <div class="font-bold">{{ batch.name }}</div>
                                                        <!--
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                                data-testid="question-mark-icon" width="16" height="16">
                                                                <path fill="currentColor"
                                                                    d="M18.927 7.984A7.83 7.83 0 0 1 20 12c0 1.451-.358 2.79-1.073 4.016a7.967 7.967 0 0 1-2.911 2.911A7.825 7.825 0 0 1 12 20a7.83 7.83 0 0 1-4.016-1.073 7.965 7.965 0 0 1-2.911-2.911A7.826 7.826 0 0 1 4 12c0-1.451.358-2.79 1.073-4.016a7.96 7.96 0 0 1 2.912-2.91A7.824 7.824 0 0 1 12 4a7.83 7.83 0 0 1 4.016 1.073 7.966 7.966 0 0 1 2.911 2.911zm-3.057 2.86a2.797 2.797 0 0 0-.448-2.542 3.945 3.945 0 0 0-1.442-1.208 3.952 3.952 0 0 0-1.771-.428c-1.688 0-2.976.74-3.865 2.22-.104.166-.076.312.083.437l1.375 1.042a.297.297 0 0 0 .198.062.307.307 0 0 0 .26-.125c.369-.472.667-.792.897-.959.236-.166.534-.25.896-.25.333 0 .63.09.89.271.26.181.39.386.39.615 0 .264-.069.476-.208.635-.138.16-.374.316-.708.47a3.566 3.566 0 0 0-1.203.9c-.365.406-.547.842-.547 1.307v.376c0 .097.031.177.094.24A.324.324 0 0 0 11 14h2a.326.326 0 0 0 .24-.094.325.325 0 0 0 .094-.24c0-.131.075-.303.224-.515.149-.212.338-.383.567-.516.222-.125.392-.223.51-.296.119-.073.279-.195.48-.365a2.43 2.43 0 0 0 .463-.5c.108-.163.205-.373.292-.63zM13.334 17v-2a.322.322 0 0 0-.333-.333H11a.327.327 0 0 0-.24.093.325.325 0 0 0-.093.24v2c0 .097.031.177.093.24a.325.325 0 0 0 .24.093h2a.32.32 0 0 0 .334-.333z">
                                                                </path>
                                                            </svg>-->
                                                    </div>

                                                    <div class="flex justify-between items-center">
                                                        <div>
                                                            <div>
                                                            </div>

                                                            <p>{{ formatAmount(batch.price) }}</p>
                                                        </div>
                                                        <div>
                                                            <div v-if="batch.quantity > 0 && !isEventOver"
                                                                class="flex items-center gap-2">
                                                                <button class="text-[#28a745]"
                                                                    @click="reduceBatch(index)">
                                                                    <svg width="20" viewBox="0 0 24 24" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                                            d="M2 12C2 10.0222 2.58649 8.08879 3.6853 6.4443C4.78412 4.79981 6.3459 3.51809 8.17317 2.76121C10.0004 2.00433 12.0111 1.8063 13.9509 2.19215C15.8907 2.578 17.6725 3.53041 19.0711 4.92894C20.4696 6.32746 21.422 8.10929 21.8079 10.0491C22.1937 11.9889 21.9957 13.9996 21.2388 15.8268C20.4819 17.6541 19.2002 19.2159 17.5557 20.3147C15.9112 21.4135 13.9778 22 12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12H2ZM12 20C10.4177 20 8.87103 19.5308 7.55544 18.6518C6.23984 17.7727 5.21446 16.5233 4.60896 15.0615C4.00346 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00347 15.0615 4.60897C16.5233 5.21447 17.7727 6.23985 18.6518 7.55544C19.5308 8.87104 20 10.4178 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1572 14.1217 20 12 20ZM9 11C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12C8 12.2652 8.10536 12.5196 8.29289 12.7071C8.48043 12.8946 8.73478 13 9 13H15C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11H9Z"
                                                                            fill="currentColor"></path>
                                                                    </svg>
                                                                </button>
                                                                <p>{{ batch.quantitySelected }}</p>
                                                                <button class="text-[#28a745]" @click="addBatch(index)">
                                                                    <svg width="20" viewBox="0 0 24 24" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                                            d="M2 12C2 10.0222 2.58649 8.08879 3.6853 6.4443C4.78412 4.79981 6.3459 3.51809 8.17317 2.76121C10.0004 2.00433 12.0111 1.8063 13.9509 2.19215C15.8907 2.578 17.6725 3.53041 19.0711 4.92894C20.4696 6.32746 21.422 8.10929 21.8079 10.0491C22.1937 11.9889 21.9957 13.9996 21.2388 15.8268C20.4819 17.6541 19.2002 19.2159 17.5557 20.3147C15.9112 21.4135 13.9778 22 12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12H2ZM12 20C10.4177 20 8.87103 19.5308 7.55544 18.6518C6.23984 17.7727 5.21446 16.5233 4.60896 15.0615C4.00346 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00347 15.0615 4.60897C16.5233 5.21447 17.7727 6.23985 18.6518 7.55544C19.5308 8.87104 20 10.4178 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1572 14.1217 20 12 20ZM15 11H13V9C13 8.73479 12.8946 8.48043 12.7071 8.2929C12.5196 8.10536 12.2652 8 12 8C11.7348 8 11.4804 8.10536 11.2929 8.2929C11.1054 8.48043 11 8.73479 11 9V11H9C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12C8 12.2652 8.10536 12.5196 8.29289 12.7071C8.48043 12.8946 8.73478 13 9 13H11V15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8946 11.7348 16 12 16C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V13H15C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11Z"
                                                                            fill="currentColor"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div v-if="batch.quantity == 0" class="lmax">
                                                                <p>Esgotado</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="mt-1 mb-1">
                                                        <p class="text-[#B6B6B6] italic text-xs">Vendas até {{
                                                            formattedDate(batch.ends_at.date) }}</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="py-2 px-3">
                                            <div v-if="!isEventOver"
                                                class="flex mb-2 text-[#212529] justify-center gap-1 items-center flex-row">
                                                <small class="text-muted py-2">Total:</small>
                                                <p class="text-base font-bold">{{ formatAmount(amount) }}</p>
                                            </div>
                                            <button style="letter-spacing: 0.5px;"
                                                class="bg-[#28a745] disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500 hover:bg-[#1e7e34] transition-colors w-full font-bold text-[14px] py-2.5 px-3 text-[#fff] uppercase btn-submit mb-1"
                                                @click="sendToCart"
                                                :disabled="loadingCart || isEventOver || amount == 0">
                                                <span v-if="!loadingCart">Comprar ingressos</span>
                                                <span v-else>Processando...</span>
                                            </button>
                                            <!--
                                       <input v-model="form.couponName" type="text" placeholder="Código promocional"
                                        :readonly="coupon._id">
                                    <button v-if="form.couponName == '' || !coupon._id" @click="_applyCoupon()"
                                        class="btn-apply">Aplicar</button>
                                    <button v-else @click="removeCoupon()" class="btn-apply">Remover</button>
                                    -->

                                        </div>
                                    </div>
                                    <div v-else class="flex justify-center items-center py-5">
                                        <BtnSpinner />
                                    </div>

                                </div>
                                <!--end start-->
                                <div class="mt-7 hidden lg:block mb-4">
                                    <hr />
                                </div>
                                <div>
                                    <div class="mb-3">
                                        <h3 class="text-[#6c757d] font-bold text-lg">Descrição do evento</h3>
                                    </div>
                                    <div class="text-[#212529] font-normal text-base" v-html="event.description"></div>
                                </div>
                                <div class="mt-4">
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
                            <div class="px-4 hidden lg:block w-full">
                                <div class="sticky top-0">
                                    <!--start alert-->
                                    <div class="p-2 text-base mb-3 border" :class="generateColorAlert"
                                        v-show="alert.show && amount == 0">
                                        <p>{{ alert.message }}</p>
                                    </div>
                                    <!--end alert-->

                                    <!--cart start-->
                                    <div class="border  lg:block border-[#dee2e6] select-none">
                                        <div
                                            class="bg-[#3B3C3C] border-b border-[#dee2e6] px-3 flex justify-between items-center text-[14px] font-bold h-[46px] text-white">
                                            <span>Ingressos</span>
                                            <span class="flex gap-1 items-center">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M19.382 6C20.08 6 20.716 6.354 21.083 6.948C21.45 7.542 21.483 8.269 21.171 8.894L17.895 15.447C17.725 15.786 17.379 16 17 16H8C7.549 16 7.154 15.698 7.035 15.263L4.236 5H3C2.447 5 2 4.552 2 4C2 3.448 2.447 3 3 3H5C5.451 3 5.846 3.302 5.965 3.737L6.582 6H19.382ZM16.382 14H8.764L7.127 8H19.382L16.382 14ZM7.5 21C8.328 21 9 20.329 9 19.5C9 18.671 8.328 18 7.5 18C6.672 18 6 18.671 6 19.5C6 20.329 6.672 21 7.5 21ZM17.5 21C18.328 21 19 20.329 19 19.5C19 18.671 18.328 18 17.5 18C16.672 18 16 18.671 16 19.5C16 20.329 16.672 21 17.5 21Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                                <div class="flex gap-1 items-center">
                                                    <span> {{ formatAmount(amount) }}</span>
                                                </div>

                                            </span>
                                        </div>
                                        <div v-if="!loadingBatches">
                                            <div>
                                                <ul v-if="batches.data.length">
                                                    <li class="border-b py-2 px-3 text-[13px] text-[#50525f] border-[#dee2e6]"
                                                        v-for="(batch, index) in batches.data" :index="index">
                                                        <div class="flex text-[#50525f] items-center gap-1">
                                                            <div class="font-bold">{{ batch.name }}</div>
                                                            <!--
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                                data-testid="question-mark-icon" width="16" height="16">
                                                                <path fill="currentColor"
                                                                    d="M18.927 7.984A7.83 7.83 0 0 1 20 12c0 1.451-.358 2.79-1.073 4.016a7.967 7.967 0 0 1-2.911 2.911A7.825 7.825 0 0 1 12 20a7.83 7.83 0 0 1-4.016-1.073 7.965 7.965 0 0 1-2.911-2.911A7.826 7.826 0 0 1 4 12c0-1.451.358-2.79 1.073-4.016a7.96 7.96 0 0 1 2.912-2.91A7.824 7.824 0 0 1 12 4a7.83 7.83 0 0 1 4.016 1.073 7.966 7.966 0 0 1 2.911 2.911zm-3.057 2.86a2.797 2.797 0 0 0-.448-2.542 3.945 3.945 0 0 0-1.442-1.208 3.952 3.952 0 0 0-1.771-.428c-1.688 0-2.976.74-3.865 2.22-.104.166-.076.312.083.437l1.375 1.042a.297.297 0 0 0 .198.062.307.307 0 0 0 .26-.125c.369-.472.667-.792.897-.959.236-.166.534-.25.896-.25.333 0 .63.09.89.271.26.181.39.386.39.615 0 .264-.069.476-.208.635-.138.16-.374.316-.708.47a3.566 3.566 0 0 0-1.203.9c-.365.406-.547.842-.547 1.307v.376c0 .097.031.177.094.24A.324.324 0 0 0 11 14h2a.326.326 0 0 0 .24-.094.325.325 0 0 0 .094-.24c0-.131.075-.303.224-.515.149-.212.338-.383.567-.516.222-.125.392-.223.51-.296.119-.073.279-.195.48-.365a2.43 2.43 0 0 0 .463-.5c.108-.163.205-.373.292-.63zM13.334 17v-2a.322.322 0 0 0-.333-.333H11a.327.327 0 0 0-.24.093.325.325 0 0 0-.093.24v2c0 .097.031.177.093.24a.325.325 0 0 0 .24.093h2a.32.32 0 0 0 .334-.333z">
                                                                </path>
                                                            </svg>-->
                                                        </div>

                                                        <div class="flex justify-between items-center">
                                                            <div>
                                                                <div>
                                                                </div>

                                                                <p>{{ formatAmount(batch.price) }}</p>
                                                            </div>
                                                            <div>
                                                                <div v-if="batch.quantity > 0 && !isEventOver"
                                                                    class="flex items-center gap-2">
                                                                    <button class="text-[#28a745]"
                                                                        @click="reduceBatch(index)">
                                                                        <svg width="20" viewBox="0 0 24 24" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path fill-rule="evenodd"
                                                                                clip-rule="evenodd"
                                                                                d="M2 12C2 10.0222 2.58649 8.08879 3.6853 6.4443C4.78412 4.79981 6.3459 3.51809 8.17317 2.76121C10.0004 2.00433 12.0111 1.8063 13.9509 2.19215C15.8907 2.578 17.6725 3.53041 19.0711 4.92894C20.4696 6.32746 21.422 8.10929 21.8079 10.0491C22.1937 11.9889 21.9957 13.9996 21.2388 15.8268C20.4819 17.6541 19.2002 19.2159 17.5557 20.3147C15.9112 21.4135 13.9778 22 12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12H2ZM12 20C10.4177 20 8.87103 19.5308 7.55544 18.6518C6.23984 17.7727 5.21446 16.5233 4.60896 15.0615C4.00346 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00347 15.0615 4.60897C16.5233 5.21447 17.7727 6.23985 18.6518 7.55544C19.5308 8.87104 20 10.4178 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1572 14.1217 20 12 20ZM9 11C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12C8 12.2652 8.10536 12.5196 8.29289 12.7071C8.48043 12.8946 8.73478 13 9 13H15C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11H9Z"
                                                                                fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <p>{{ batch.quantitySelected }}</p>
                                                                    <button class="text-[#28a745]"
                                                                        @click="addBatch(index)">
                                                                        <svg width="20" viewBox="0 0 24 24" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path fill-rule="evenodd"
                                                                                clip-rule="evenodd"
                                                                                d="M2 12C2 10.0222 2.58649 8.08879 3.6853 6.4443C4.78412 4.79981 6.3459 3.51809 8.17317 2.76121C10.0004 2.00433 12.0111 1.8063 13.9509 2.19215C15.8907 2.578 17.6725 3.53041 19.0711 4.92894C20.4696 6.32746 21.422 8.10929 21.8079 10.0491C22.1937 11.9889 21.9957 13.9996 21.2388 15.8268C20.4819 17.6541 19.2002 19.2159 17.5557 20.3147C15.9112 21.4135 13.9778 22 12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12H2ZM12 20C10.4177 20 8.87103 19.5308 7.55544 18.6518C6.23984 17.7727 5.21446 16.5233 4.60896 15.0615C4.00346 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00347 15.0615 4.60897C16.5233 5.21447 17.7727 6.23985 18.6518 7.55544C19.5308 8.87104 20 10.4178 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1572 14.1217 20 12 20ZM15 11H13V9C13 8.73479 12.8946 8.48043 12.7071 8.2929C12.5196 8.10536 12.2652 8 12 8C11.7348 8 11.4804 8.10536 11.2929 8.2929C11.1054 8.48043 11 8.73479 11 9V11H9C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12C8 12.2652 8.10536 12.5196 8.29289 12.7071C8.48043 12.8946 8.73478 13 9 13H11V15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8946 11.7348 16 12 16C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V13H15C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11Z"
                                                                                fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <div v-if="batch.quantity == 0" class="lmax">
                                                                    <p>Esgotado</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="mt-1 mb-1">
                                                            <p class="text-[#B6B6B6] italic text-xs">Vendas até {{
                                                                formattedDate(batch.ends_at.date) }}</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="py-2 px-3">
                                                <div v-if="!isEventOver"
                                                    class="flex mb-2 text-[#212529] justify-center gap-1 items-center flex-row">
                                                    <small class="text-muted py-2">Total:</small>
                                                    <p class="text-base font-bold">{{ formatAmount(amount) }}</p>
                                                </div>
                                                <button style="letter-spacing: 0.5px;"
                                                    class="bg-[#28a745] disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500 transition-colors w-full font-bold text-[14px] py-2.5 px-3 text-[#fff] uppercase btn-submit mb-1"
                                                    @click="sendToCart"
                                                    :disabled="isEventOver || loadingCart || amount == 0">
                                                    <span v-if="!loadingCart">Comprar ingressos</span>
                                                    <span v-else>Processando...</span>
                                                </button>
                                                <!--
                                       <input v-model="form.couponName" type="text" placeholder="Código promocional"
                                        :readonly="coupon._id">
                                    <button v-if="form.couponName == '' || !coupon._id" @click="_applyCoupon()"
                                        class="btn-apply">Aplicar</button>
                                    <button v-else @click="removeCoupon()" class="btn-apply">Remover</button>
                                    -->

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

        </div>
        <div v-else>
            <div class="flex justify-center items-center h-[500px]">
                <Spinner />
            </div>
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

.btn-submit {
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(0, 0, 0, 0.075);
}
</style>