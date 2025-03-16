<script setup>
import UserMenu from "@/components/UserMenu.vue";
import { useCarts } from "@/repositories/carts-repository";
import { useOrders } from "@/repositories/orders-repository";
import Container from "@/use-cases/marketplace/components/ui/Container.vue";
import formatAmount from "@/utils/formatAmount";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import intlTelInput from 'intl-tel-input';
import AlertConfirmEmail from "@/components/AlertConfirmEmail.vue";

const { newOrder, loading: loadingOrder, error: errorOrder } = useOrders()

const route = useRoute()
const router = useRouter()
const store = useStore()

const form = ref({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: ""
})

const formattedDate = (date) => {
    return moment(date).format("DD/MM/YY"); // Formata para 03/03/25
}

const intl = ref({})
const inputPhone = ref(null);

const errors = ref({
    phone: {
        show: false,
        message: "",
        data: ""
    },
    paymentMethod: {
        show: false,
        message: "",
        data: ""
    }
})

function validatePhone() {
    if (!form.value.phone) {
        errors.value.phone.show = true
        errors.value.phone.message = "Este campo é obrigatório."
    }
    else if (!intl.value.isValidNumber()) {
        errors.value.phone = {
            show: true,
            message: "Por favor, digite um número de telefone válido."
        }
    } else if (/[^\d\s]/.test(form.value.phone)) {
        errors.value.phone = {
            show: true,
            message: "O número de telefone só pode conter dígitos."
        }
    } else {
        errors.value.phone.show = false
        errors.value.phone.message = ""
    }
}

// busque os dados do corrente carrinho
const cart = computed(() => {
    return store.getters.cart
})

// busque os dados do currente usuario
const user = computed(() => {
    return store.getters.currentUser
})

// tem como finalidade finalizar a compra, criando um novo pedido.
function finishPurchase() {
    validatePhone()

    // isto impede do usuario fazer uma requesicao enquanto ja tiver uma em andamento.
    if (loadingOrder.value || errors.value.phone.show || !form.value.paymentMethod) return

    // isto deve criar um novo pedido e redirecionar para a pagina de obrigado caso tenha prosseguido com exito.

    if (form.value.paymentMethod == 'mult') {
        form.value.paymentMethod = 'reference'
    }
    newOrder({
        cart: cart?.value,
        eventId: cart?.value.event?._id,
        paymentMethod: form.value.paymentMethod,
        data: {
            fullName: user.value.full_name,
            email: form.value.email ?? user.value.email,
            phone: form.value.phone ?? user.value.phone
        }
    })
}

// quando montar a tela, faca a requisicao para api buscando um carrinho com base no id passado na routa desta pagina e seta o formulario de pagamento do usuario com os dados do corrente usuario.
onMounted(async () => {
    if (cart?.value) {
        form.value = {
            firstName: user.value.first_name,
            lastName: user.value.last_name,
            phone: user.value.phone,
            email: user.value.email
        }

        const input = inputPhone.value;
        intl.value = intlTelInput(input, {
            loadUtilsOnInit: () => import("intl-tel-input/utils"),
            initialCountry: "ao",
            onlyCountries: ["ao"]
        });
    } else {
        const slug = route.params.slug
        router.replace(`/evento/${slug}`)
    }
})
</script>

<template>

    <div v-if="cart">
        <!--data start-->
        <Container>
            <div v-if="!user?.email" class="mt-4 px-3">
                <AlertConfirmEmail />
            </div>
            <div class="mt-7 mb-10 lg:mt-20">

                <div class="flex flex-col lg:flex-row justify-between">
                    <div class="px-4 flex-shrink-0 w-full lg:w-2/3">
                        <h3 style="letter-spacing: 0.2px;" class="text-[#191f28] mb-4 font-bold text-xl lg:text-3xl">{{
                            cart?.event?.name
                        }}</h3>
                        <div class="text-[#495057] mb-4 text-[13px] lg:text-[15px]">
                            <span class="flex items-center gap-1">
                                <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" fill="currentColor" clip-rule="evenodd"
                                        d="M4 9.92004C4 7.79831 4.84285 5.76348 6.34315 4.26319C7.84344 2.7629 9.87827 1.92004 12 1.92004C14.1217 1.92004 16.1566 2.7629 17.6569 4.26319C19.1571 5.76348 20 7.79831 20 9.92004C20 15.4 13 21.5 12.65 21.76C12.4689 21.915 12.2384 22.0001 12 22.0001C11.7616 22.0001 11.5311 21.915 11.35 21.76C11.05 21.5 4 15.4 4 9.92004ZM12 19.65C10.32 18.06 6 13.65 6 9.92004C6 8.32874 6.63214 6.80262 7.75736 5.6774C8.88258 4.55219 10.4087 3.92004 12 3.92004C13.5913 3.92004 15.1174 4.55219 16.2426 5.6774C17.3679 6.80262 18 8.32874 18 9.92004C18 13.61 13.68 18.06 12 19.65ZM8.5 9.50004C8.5 8.80781 8.70527 8.13112 9.08986 7.55555C9.47444 6.97998 10.0211 6.53137 10.6606 6.26647C11.3001 6.00156 12.0039 5.93225 12.6828 6.0673C13.3617 6.20234 13.9854 6.53569 14.4749 7.02517C14.9644 7.51465 15.2977 8.13829 15.4327 8.81723C15.5678 9.49616 15.4985 10.1999 15.2336 10.8394C14.9687 11.479 14.5201 12.0256 13.9445 12.4102C13.3689 12.7948 12.6922 13 12 13C11.0717 13 10.1815 12.6313 9.52513 11.9749C8.86875 11.3185 8.5 10.4283 8.5 9.50004ZM10.5 9.50004C10.5 9.79672 10.588 10.0867 10.7528 10.3334C10.9176 10.5801 11.1519 10.7723 11.426 10.8859C11.7001 10.9994 12.0017 11.0291 12.2926 10.9712C12.5836 10.9133 12.8509 10.7705 13.0607 10.5607C13.2704 10.3509 13.4133 10.0837 13.4712 9.79268C13.5291 9.50171 13.4994 9.20011 13.3858 8.92602C13.2723 8.65193 13.08 8.41766 12.8334 8.25284C12.5867 8.08802 12.2967 8.00004 12 8.00004C11.6022 8.00004 11.2206 8.15808 10.9393 8.43938C10.658 8.72069 10.5 9.10222 10.5 9.50004Z">
                                    </path>
                                </svg>

                                <p>{{ cart?.event?.address?.location }}</p>
                            </span>
                            <span class="flex items-center gap-1">
                                <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" fill="currentColor" clip-rule="evenodd"
                                        d="M7 16C7 15.8022 7.05865 15.6089 7.16853 15.4444C7.27841 15.28 7.43459 15.1518 7.61732 15.0761C7.80004 15.0004 8.00111 14.9806 8.19509 15.0192C8.38907 15.0578 8.56725 15.153 8.70711 15.2929C8.84696 15.4327 8.9422 15.6109 8.98079 15.8049C9.01937 15.9989 8.99957 16.2 8.92388 16.3827C8.84819 16.5654 8.72002 16.7216 8.55557 16.8315C8.39112 16.9414 8.19778 17 8 17C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16ZM12 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7L3 19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4Z">
                                    </path>
                                </svg>

                                <p>{{ formatDate(cart?.event?.starts_at.date) }} às {{
                                    formatTime(cart?.event?.starts_at.hm)
                                    }} > {{
                                        formatDate(cart?.event?.ends_at.date) }} às {{ formatTime(cart?.event?.ends_at.hm)
                                    }}
                                </p>
                            </span>
                        </div>

                        <!--cart start-->
                        <div class="border block mb-4 lg:hidden border-[#dee2e6] select-none">
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
                                        <span> {{
                                            formatAmount(cart?.amount) }}</span>
                                    </div>

                                </span>
                            </div>
                            <div>
                                <div>
                                    <ul v-if="cart?.batches?.length">
                                        <li class="border-b py-2 px-3 text-[13px] text-[#50525f] border-[#dee2e6]"
                                            v-for="(batch, index) in cart?.batches" :index="index">
                                            <div class="flex text-[#50525f] items-center gap-1">
                                                <div class="font-bold">{{ batch?.name }}</div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                    data-testid="question-mark-icon" width="16" height="16">
                                                    <path fill="currentColor"
                                                        d="M18.927 7.984A7.83 7.83 0 0 1 20 12c0 1.451-.358 2.79-1.073 4.016a7.967 7.967 0 0 1-2.911 2.911A7.825 7.825 0 0 1 12 20a7.83 7.83 0 0 1-4.016-1.073 7.965 7.965 0 0 1-2.911-2.911A7.826 7.826 0 0 1 4 12c0-1.451.358-2.79 1.073-4.016a7.96 7.96 0 0 1 2.912-2.91A7.824 7.824 0 0 1 12 4a7.83 7.83 0 0 1 4.016 1.073 7.966 7.966 0 0 1 2.911 2.911zm-3.057 2.86a2.797 2.797 0 0 0-.448-2.542 3.945 3.945 0 0 0-1.442-1.208 3.952 3.952 0 0 0-1.771-.428c-1.688 0-2.976.74-3.865 2.22-.104.166-.076.312.083.437l1.375 1.042a.297.297 0 0 0 .198.062.307.307 0 0 0 .26-.125c.369-.472.667-.792.897-.959.236-.166.534-.25.896-.25.333 0 .63.09.89.271.26.181.39.386.39.615 0 .264-.069.476-.208.635-.138.16-.374.316-.708.47a3.566 3.566 0 0 0-1.203.9c-.365.406-.547.842-.547 1.307v.376c0 .097.031.177.094.24A.324.324 0 0 0 11 14h2a.326.326 0 0 0 .24-.094.325.325 0 0 0 .094-.24c0-.131.075-.303.224-.515.149-.212.338-.383.567-.516.222-.125.392-.223.51-.296.119-.073.279-.195.48-.365a2.43 2.43 0 0 0 .463-.5c.108-.163.205-.373.292-.63zM13.334 17v-2a.322.322 0 0 0-.333-.333H11a.327.327 0 0 0-.24.093.325.325 0 0 0-.093.24v2c0 .097.031.177.093.24a.325.325 0 0 0 .24.093h2a.32.32 0 0 0 .334-.333z">
                                                    </path>
                                                </svg>
                                            </div>

                                            <div class="flex justify-between items-center">
                                                <div>
                                                    <div>
                                                    </div>

                                                    <p>{{ formatAmount(batch?.price) }} Kz</p>
                                                </div>
                                                <div>
                                                    <div v-if="batch?.quantity > 0" class="flex items-center gap-2">
                                                        <p>{{ batch?.quantitySelected }}</p>
                                                    </div>
                                                    <div v-else class="lmax">
                                                        <p>Esgotado</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="mt-1 mb-1">
                                                <p class="text-[#B6B6B6] italic text-xs">Vendas até {{
                                                    formattedDate(batch?.ends_at.date) }}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <!--end start-->
                        <div class="mt-7 hidden lg:block mb-4">
                            <hr />
                        </div>

                        <div class="mb-5">
                            <h1 style="letter-spacing: 0.2px; line-height: 1.2"
                                class="text-lg text-[#191f28] mb-4 font-bold">Informações para o recebimento do ingresso
                            </h1>
                            <div
                                class="bg-[#f9f9f9] gap-3 text-base py-4 px-5 flex items-center rounded-md border border-[#dee2e6] text-[#1b1e21]">
                                <div>
                                    <UserMenu :show-border="false" :show-menu="false" :show-name="false" />
                                </div>
                                <div>
                                    <div class="font-bold max-w-full lg:w-full truncate">{{ form.firstName }} {{
                                        form.lastName }}</div>
                                    <div class="max-w-full lg:w-full truncate">{{ form.email }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col mb-4">
                            <label class="text-xs text-gray-500 mb-2 font-bold" for="phone">Telefone <span
                                    class="text-brand-danger">*</span></label>
                            <input
                                class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                @input="validatePhone" type="tel" ref="inputPhone" autocomplete="off"
                                oncontextmenu="false" v-model="form.phone"
                                :class="{ '!border-brand-danger': errors.phone.show }">
                            <span class="text-brand-danger text-xs font-medium my-1" v-show="errors.phone.show">
                                {{ errors.phone.message }}
                            </span>
                        </div>

                        <div class="mt-7 block mb-4">
                            <hr />
                        </div>
                        <div>
                            <h1 class="text-lg text-[#191f28] mb-4 font-bold">Informações de pagamento</h1>

                            <div
                                class="flex overflow-hidden rounded-md border border-[#00000020] flex-col items-center">
                                <label
                                    class="w-full py-3 flex gap-2.5 font-bold text-[#495057] cursor-pointer hover:bg-[#f8f9fa] items-center px-5 border-b border-[#00000020]"
                                    for="reference_pay">
                                    <input class="scale-[1.3]" v-model="form.paymentMethod" id="reference_pay"
                                        type="radio" value="reference">

                                    <div class="w-[20px] h-[20px] mt-[2px] overflow-hidden">
                                        <img width="30px" class="object-cover" src="@/assets/imgs/ref.webp">
                                    </div>
                                    Referencia
                                </label>

                                <label
                                    class="w-full py-3 flex gap-2.5 font-bold text-[#495057] cursor-pointer hover:bg-[#f8f9fa] items-center px-5"
                                    for="reference_mult">
                                    <input class="scale-[1.3]" v-model="form.paymentMethod" id="reference_mult"
                                        type="radio" value="mult">
                                    <div class="w-[20px] h-[20px] mt-[2px] overflow-hidden">
                                        <img width="30px" class="object-cover" src="@/assets/imgs/express_logo.webp">
                                    </div>

                                    Multicaixa Express
                                </label>
                            </div>
                        </div>
                        <div
                            class="flex flex-col-reverse gap-3 lg:gap-0 text-center lg:text-left lg:flex-row justify-between items-center py-3">
                            <p class="text-xs mb-0">Ao prosseguir, você declara estar ciente dos nossos <a
                                    class="text-[#2887a7]" href="/termos-de-uso/" target="_blank">Termos e
                                    Políticas.</a></p>
                            <button
                                class="text-base disabled:bg-gray-300 disabled:text-gray-500 w-full lg:w-auto font-bold py-[15px] px-[45px] text-white uppercase bg-[#28a745] transition-colors hover:bg-[#218838]"
                                :disabled="!form.paymentMethod || loadingOrder" @click="finishPurchase" type="submit">
                                {{ loadingOrder ? 'Carregando..' : 'Pagar Agora' }}
                            </button>
                        </div>
                    </div>
                    <div class="px-4 hidden lg:block w-full">
                        <div class="sticky top-0">
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
                                            <span> {{ formatAmount(cart?.amount) }}</span>
                                        </div>

                                    </span>
                                </div>
                                <div>
                                    <div>
                                        <ul v-if="cart?.batches?.length">
                                            <li style="background-color: rgba(0, 0, 0, 0.02);"
                                                class="border-b py-2 px-3 text-[13px] text-[#50525f] border-[#dee2e6]"
                                                v-for="(batch, index) in cart?.batches" :index="index">
                                                <div class="flex text-[#50525f] items-center gap-1">
                                                    <div class="font-bold">{{ batch?.name }}</div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        data-testid="question-mark-icon" width="16" height="16">
                                                        <path fill="currentColor"
                                                            d="M18.927 7.984A7.83 7.83 0 0 1 20 12c0 1.451-.358 2.79-1.073 4.016a7.967 7.967 0 0 1-2.911 2.911A7.825 7.825 0 0 1 12 20a7.83 7.83 0 0 1-4.016-1.073 7.965 7.965 0 0 1-2.911-2.911A7.826 7.826 0 0 1 4 12c0-1.451.358-2.79 1.073-4.016a7.96 7.96 0 0 1 2.912-2.91A7.824 7.824 0 0 1 12 4a7.83 7.83 0 0 1 4.016 1.073 7.966 7.966 0 0 1 2.911 2.911zm-3.057 2.86a2.797 2.797 0 0 0-.448-2.542 3.945 3.945 0 0 0-1.442-1.208 3.952 3.952 0 0 0-1.771-.428c-1.688 0-2.976.74-3.865 2.22-.104.166-.076.312.083.437l1.375 1.042a.297.297 0 0 0 .198.062.307.307 0 0 0 .26-.125c.369-.472.667-.792.897-.959.236-.166.534-.25.896-.25.333 0 .63.09.89.271.26.181.39.386.39.615 0 .264-.069.476-.208.635-.138.16-.374.316-.708.47a3.566 3.566 0 0 0-1.203.9c-.365.406-.547.842-.547 1.307v.376c0 .097.031.177.094.24A.324.324 0 0 0 11 14h2a.326.326 0 0 0 .24-.094.325.325 0 0 0 .094-.24c0-.131.075-.303.224-.515.149-.212.338-.383.567-.516.222-.125.392-.223.51-.296.119-.073.279-.195.48-.365a2.43 2.43 0 0 0 .463-.5c.108-.163.205-.373.292-.63zM13.334 17v-2a.322.322 0 0 0-.333-.333H11a.327.327 0 0 0-.24.093.325.325 0 0 0-.093.24v2c0 .097.031.177.093.24a.325.325 0 0 0 .24.093h2a.32.32 0 0 0 .334-.333z">
                                                        </path>
                                                    </svg>
                                                </div>

                                                <div class="flex justify-between items-center">
                                                    <div>
                                                        <div>
                                                        </div>

                                                        <p>{{ formatAmount(batch?.price) }}</p>
                                                    </div>
                                                    <div>
                                                        <div v-if="batch?.quantity > 0" class="flex items-center gap-2">
                                                            <p class="text-base">{{ batch?.quantitySelected }}</p>
                                                        </div>
                                                        <div v-else class="lmax">
                                                            <p>Esgotado</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mt-1 mb-1">
                                                    <p class="text-[#B6B6B6] italic text-xs">Vendas até {{
                                                        formattedDate(batch?.ends_at.date) }}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!--end start-->
                        </div>
                    </div>
                </div>
            </div>
        </Container>
        <!--data end-->
    </div>
</template>

<style scoped>
.st0 {
    fill: #F09234;
}

.st1 {
    fill: #D93840;
}
</style>
