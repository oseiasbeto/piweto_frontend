<script setup>
import UserMenu from "@/components/UserMenu.vue";
import { useOrders } from "@/repositories/orders-repository";
import Container from "@/use-cases/marketplace/components/ui/Container.vue";
import formatAmount from "@/utils/formatAmount";
import calculateTotalPrice from "@/utils/calculateTotalPrice";
import getTotalTicketsSelected from "@/utils/getTotalTicketsSelected";
import formatEventDateTime from "@/utils/formatEventDateTime";
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Swal from "sweetalert2"
import moment from "moment";
import intlTelInput from 'intl-tel-input';
import OrderSumary from "../components/drawers/OrderSumary.vue";

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
    firstName: {
        show: false,
        message: "",
        data: ""
    },
    lastName: {
        show: false,
        message: "",
        data: ""
    },
    email: {
        show: false,
        message: "",
        data: ""
    },
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
async function finishPurchase() {
    validatePhone()

    // isto impede do usuario fazer uma requesicao enquanto ja tiver uma em andamento.
    if (loadingOrder.value || errors.value.phone.show || !form.value.paymentMethod) return

    // isto deve criar um novo pedido e redirecionar para a pagina de obrigado caso tenha prosseguido com exito.
    await newOrder({
        cart: cart?.value,
        eventId: cart?.value.event?._id,
        paymentMethod: form.value.paymentMethod,
        data: {
            fullName: user.value.full_name,
            email: form.value.email ?? user.value.email,
            phone: form.value.phone ?? user.value.phone
        }
    }).then(res => {
        switch (form.value.paymentMethod) {
            case 'reference':
                const newOrder = res.data.newOrder
                router.replace(`/checkout/detalhes-do-pedido/${newOrder.id}`)
                break;
            case 'mul':
                Swal.fire({
                    icon: "success",
                    title: "Notificação enviada com sucesso",
                    text: "Enviamos uma notificação para o seu Multicaixa Express. Finalize o pagamento em até 15 minutos para concluir a operação.",
                    confirmButtonText: "Entendi"
                }).then(() => {
                    router.replace('/meus-ingressos')
                })
        }
    }).catch(err => {
        if (err.response.status === 400) {
            if (form.value.paymentMethod === 'mul') {
                Swal.fire({
                    icon: "error",
                    title: "Número não reconhecido",
                    text: "O número informado não está associado a uma conta Multicaixa Express. Verifique os dados e tente novamente.",
                    confirmButtonText: "OK"
                }).then(() => {
                    form.value.phone = ''
                });
            }
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
            <div class="mt-5 mb-10 lg:mt-8">

                <div class="flex gap-4 lg:gap-8 px-0 lg:px-4 lg:flex-row justify-between">
                    <div
                        class="p-4 lg:p-8 bg-white flex-shrink-0 w-full shadow-[0px_1px_2px_0px_rgba(25,31,40,0.15)] lg:w-2/3 lg:rounded-[8px]">
                        <!--start forn-->
                        <div>
                            <div class="mb-5">
                                <h1 style="letter-spacing: 0.2px; line-height: 1.2"
                                    class="text-base lg:text-lg text-[rgb(76,87,108)] mb-4 font-bold">Recebimento do
                                    ingresso
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
                            <!--start name costumer group-->
                            <div class="flex gap-4 flex-col lg:flex-row item-center">
                                <div class="flex flex-1 flex-col mb-4">
                                    <label class="text-xs text-gray-500 mb-2 font-bold" for="firstName">Primeiro nome
                                        <span class="text-brand-danger">*</span></label>
                                    <input
                                        class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                        id="firstName" @input="validatePhone" autocomplete="off" oncontextmenu="false"
                                        v-model="form.firstName"
                                        :class="{ '!border-brand-danger': errors.firstName.show }">
                                    <span class="text-brand-danger text-xs font-medium my-1"
                                        v-if="errors.firstName.show">
                                        {{ errors.firstName.message }}
                                    </span>

                                </div>
                                <div class="flex flex-1 flex-col mb-4">
                                    <label class="text-xs text-gray-500 mb-2 font-bold" for="lastName">Último nome <span
                                            class="text-brand-danger">*</span></label>
                                    <input
                                        class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                        id="lastName" @input="validatePhone" autocomplete="off" oncontextmenu="false"
                                        v-model="form.lastName"
                                        :class="{ '!border-brand-danger': errors.lastName.show }">
                                    <span class="text-brand-danger text-xs font-medium my-1"
                                        v-if="errors.lastName.show">
                                        {{ errors.lastName.message }}
                                    </span>

                                </div>
                            </div>
                            <!--end name costumer group-->


                            <!--start number phone group-->
                            <div class="flex flex-col mb-4">
                                <label class="text-xs text-gray-500 mb-2 font-bold" for="phone">Telefone <span
                                        class="text-brand-danger">*</span></label>
                                <input
                                    class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                    @input="validatePhone" type="tel" ref="inputPhone" autocomplete="off"
                                    oncontextmenu="false" v-model="form.phone"
                                    :class="{ '!border-brand-danger': errors.phone.show }">
                                <span class="text-brand-danger text-xs font-medium my-1" v-if="errors.phone.show">
                                    {{ errors.phone.message }}
                                </span>
                                <span class="text-gray-500 text-xs font-medium my-1"
                                    v-else-if="form.paymentMethod == 'mul'">
                                    Por favor, informe o número de telefone associado à sua conta Multicaixa Express
                                    para
                                    continuarmos.
                                </span>
                            </div>
                            <!--end number phone group-->

                            <!--start e-mail form-->
                            <div class="flex gap-4 flex-col lg:flex-row item-center">
                                <div class="flex flex-1 flex-col mb-4">
                                    <label class="text-xs text-gray-500 mb-2 font-bold" for="email">E-mail <span
                                            class="text-brand-danger">*</span></label>
                                    <input
                                        class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                        id="email" @input="validatePhone" autocomplete="off" oncontextmenu="false"
                                        v-model="form.email" :class="{ '!border-brand-danger': errors.email.show }">
                                    <span class="text-brand-danger text-xs font-medium my-1" v-if="errors.email.show">
                                        {{ errors.phone.message }}
                                    </span>

                                </div>
                                <div class="flex flex-1 flex-col mb-4">
                                    <label class="text-xs text-gray-500 mb-2 font-bold" for="email">Confirmação do
                                        e-mail <span class="text-brand-danger">*</span></label>
                                    <input
                                        class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                        @input="validatePhone" autocomplete="off" oncontextmenu="false"
                                        v-model="form.email" :class="{ '!border-brand-danger': errors.phone.show }">
                                    <span class="text-brand-danger text-xs font-medium my-1" v-if="errors.phone.show">
                                        {{ errors.phone.message }}
                                    </span>

                                </div>
                            </div>
                            <!--end e-mail form-->

                        </div>
                        <!--end form-->

                        <div class="mt-7 block mb-4">
                            <hr />
                        </div>

                        <!--start payment methods-->
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
                                    Referência
                                </label>

                                <label
                                    class="w-full py-3 flex gap-2.5 font-bold text-[#495057] cursor-pointer hover:bg-[#f8f9fa] items-center px-5"
                                    for="reference_mult">
                                    <input class="scale-[1.3]" v-model="form.paymentMethod" id="reference_mult"
                                        type="radio" value="mul">
                                    <div class="w-[20px] h-[20px] mt-[2px] overflow-hidden">
                                        <img width="30px" class="object-cover" src="@/assets/imgs/express_logo.webp">
                                    </div>

                                    Multicaixa Express
                                </label>
                            </div>
                        </div>
                        <!--end payment methods-->


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
                    <div class="hidden lg:block w-full">
                        <div class="sticky flex flex-col gap-4 top-20">
                            <!--start event card-->
                            <div
                                class="bg-white p-4 flex gap-4 rounded-[8px] shadow-[0px_1px_2px_0px_rgba(25,31,40,0.15)]">
                                <div class="w-[108px] shrink-0 h-[64px]">
                                    <img v-lazy="cart?.event?.cover?.low" class="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h2 class="text-[14px] text-[rgb(25,31,40)] line-clamp-2 leading-4 font-bold mb-[6px] overflow-hidden text-ellipsis 
       [display:-webkit-box] [webkit-line-clamp:4] [webkit-box-orient:vertical]">
                                        {{ cart?.event?.name }}
                                    </h2>
                                    <div class="flex items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" fill="rgb(0, 151, 255)" clip-rule="evenodd"
                                                d="M7 16C7 15.8022 7.05865 15.6089 7.16853 15.4444C7.27841 15.28 7.43459 15.1518 7.61732 15.0761C7.80004 15.0004 8.00111 14.9806 8.19509 15.0192C8.38907 15.0578 8.56725 15.153 8.70711 15.2929C8.84696 15.4327 8.9422 15.6109 8.98079 15.8049C9.01937 15.9989 8.99957 16.2 8.92388 16.3827C8.84819 16.5654 8.72002 16.7216 8.55557 16.8315C8.39112 16.9414 8.19778 17 8 17C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16ZM12 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7L3 19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4Z">
                                            </path>
                                        </svg>
                                        <span class="text-xs text-[rgb(76,87,108)]">
                                            {{ formatEventDateTime(cart?.event?.starts_at?.date,
                                                cart?.event?.starts_at?.hm)
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <!--end event card-->

                            <!--start order summary-->
                            <div
                                class="bg-white z-[9999] w-full relative overflow-hidden flex-col lg:gap-4 rounded-[8px] shadow-[0px_-9px_19px_-6px_rgba(0,0,0,0.2)] lg:shadow-[0px_1px_2px_0px_rgba(25,31,40,0.15)]">
                                <div
                                    class="flex p-1 mb-2 lg:mb-0 items-center px-3 h-[28px] justify-center gap-1 w-full bg-[rgb(242,235,253)] text-[rgb(128,49,255)]">
                                    <svg width="15" height="15" viewBox="0 0 25 24" fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M18.8126 13.608C18.4768 13.4457 18.0871 13.4918 17.8185 13.7257L13.6854 17.3248C13.4672 17.5149 13.3592 17.8033 13.3954 18.0999L14.0081 23.1255C14.052 23.4853 14.3001 23.7978 14.6436 23.9257C14.9871 24.0537 15.3633 23.9737 15.6072 23.721C18.676 20.5401 19.3954 17.0695 19.3707 14.4761C19.3672 14.1107 19.1484 13.7704 18.8126 13.608ZM15.5733 20.7808L15.2883 18.4438L17.3121 16.6815C17.0573 17.9722 16.5369 19.3782 15.5733 20.7808Z">
                                        </path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M11.3312 6.12662C11.4935 6.46242 11.4474 6.85212 11.2135 7.12069L7.61437 11.2538C7.42428 11.472 7.13589 11.58 6.83933 11.5438L1.81374 10.9311C1.45387 10.8873 1.14143 10.6391 1.01349 10.2956C0.885551 9.95206 0.965473 9.57587 1.2182 9.33205C4.39911 6.26317 7.86974 5.54378 10.4631 5.56856C10.8285 5.57205 11.1688 5.79082 11.3312 6.12662ZM4.15836 9.36594L6.49543 9.65087L8.25773 7.62716C6.96696 7.88193 5.56096 8.40231 4.15836 9.36594Z">
                                        </path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M23.8726 0.296184C24.3041 0.345862 24.6385 0.696553 24.6677 1.12987C24.8911 4.45081 23.6193 7.60049 22.1578 10.0634C20.6897 12.5372 18.9743 14.4119 18.1723 15.2139C17.3719 16.0143 15.9715 17.2206 14.7964 18.2076C14.2036 18.7054 13.6595 19.1547 13.2636 19.4795C13.0655 19.6419 12.9045 19.7734 12.7927 19.8643L12.6637 19.9692L12.6188 20.0055L12.052 19.3064L12.618 20.0062C12.26 20.2957 11.7412 20.2684 11.4156 19.9428L4.98701 13.5142C4.67823 13.2054 4.63566 12.7195 4.88602 12.3618L5.6234 12.8778C4.88602 12.3618 4.88602 12.3618 4.88602 12.3618L4.88826 12.3586L4.89361 12.351L4.91352 12.3227C4.93083 12.2983 4.95613 12.2627 4.98899 12.2168C5.0547 12.1251 5.15067 11.9922 5.27337 11.8254C5.51867 11.4919 5.87131 11.0221 6.30297 10.4732C7.16377 9.37877 8.34969 7.95638 9.63234 6.67381C10.9373 5.36896 13.1 3.63615 15.6065 2.29894C18.098 0.969764 21.0435 -0.029578 23.8726 0.296184ZM6.80277 12.7844L12.1133 18.0949C12.1162 18.0926 12.119 18.0902 12.1219 18.0879C12.514 17.7662 13.0526 17.3215 13.6387 16.8292C14.8213 15.836 16.1628 14.6778 16.8996 13.9411C17.6348 13.2058 19.2423 11.4491 20.6098 9.14478C21.8555 7.04573 22.8566 4.56856 22.8922 2.03506C20.799 2.00478 18.5452 2.77133 16.4538 3.88707C14.1168 5.13383 12.0953 6.75649 10.9051 7.94664C9.6926 9.15906 8.55586 10.5205 7.7178 11.586C7.3448 12.0602 7.03313 12.4731 6.80277 12.7844Z">
                                        </path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M18.0661 6.78137C17.7015 6.4168 17.1105 6.4168 16.7459 6.78137C16.3813 7.14593 16.3813 7.737 16.7459 8.10156C17.1105 8.46613 17.7015 8.46613 18.0661 8.10156C18.4307 7.737 18.4307 7.14593 18.0661 6.78137ZM15.4731 5.50857C16.5406 4.44107 18.2714 4.44107 19.3389 5.50857C20.4064 6.57608 20.4064 8.30685 19.3389 9.37436C18.2714 10.4419 16.5406 10.4419 15.4731 9.37436C14.4056 8.30685 14.4056 6.57608 15.4731 5.50857Z">
                                        </path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M9.6349 19.073C10.0536 19.3409 10.1759 19.8975 9.90798 20.3162C9.49635 20.9595 8.79085 21.3878 8.13038 21.6824C7.44423 21.9884 6.66681 22.2104 5.95691 22.3712C5.2419 22.533 4.56638 22.6391 4.07166 22.7048C3.82348 22.7377 3.61883 22.7607 3.47504 22.7756C3.4031 22.783 3.34627 22.7884 3.3067 22.7921L3.26052 22.7962L3.24762 22.7973L3.24256 22.7977C3.24239 22.7977 3.24177 22.7977 3.16938 21.9007C2.27229 21.8283 2.27231 21.8281 2.27232 21.8279L2.27246 21.8262L2.27277 21.8224L2.27385 21.8097L2.2779 21.7642C2.28147 21.7253 2.28681 21.6694 2.29416 21.5987C2.30884 21.4573 2.33158 21.256 2.36422 21.0116C2.42929 20.5244 2.53468 19.8581 2.69611 19.1494C2.85649 18.4452 3.07808 17.6725 3.38343 16.9836C3.67922 16.3163 4.10191 15.615 4.72478 15.1815C5.13276 14.8975 5.69367 14.9981 5.97761 15.406C6.26155 15.814 6.16099 16.3749 5.75302 16.6589C5.53523 16.8104 5.2789 17.1492 5.02902 17.713C4.78872 18.2551 4.598 18.9044 4.45117 19.5491C4.34327 20.0228 4.26223 20.4798 4.20297 20.8683C4.60203 20.8082 5.07296 20.7257 5.55942 20.6156C6.21082 20.4681 6.86161 20.2773 7.39717 20.0385C7.9584 19.7881 8.2681 19.5394 8.39175 19.3461C8.65963 18.9274 9.21621 18.8051 9.6349 19.073ZM3.16938 21.9007L2.27232 21.8279C2.25109 22.091 2.34637 22.3504 2.53298 22.5371C2.7196 22.7237 2.9795 22.8189 3.24256 22.7977L3.16938 21.9007Z">
                                        </path>
                                    </svg>
                                    <p class="text-xs font-semibold">Ingressos voando</p>
                                </div>
                                <div class="p-4 max-h-[575px] overflow-y-auto">
                                    <h1 class="text-[rgb(25,31,40)] hidden lg:block mb-1 text-base font-bold">
                                        Resumo do Pedido
                                    </h1>

                                    <ul class="flex flex-col py-4 border-b border-[rgb(221,224,228)] gap-3"
                                        v-if="cart?.batches?.length">
                                        <li class="text-[rgb(76,87,108)] leading-4 text-sm"
                                            v-for="(batch, index) in cart?.batches" :index="index">
                                            <div class="flex justify-between items-center gap-1">
                                                <div class="flex items-center gap-1.5">
                                                    <strong>{{ batch?.quantitySelected }}</strong>
                                                    <span>{{ batch?.name }}</span>
                                                </div>

                                                <strong>
                                                    {{ formatAmount(calculateTotalPrice(batch?.price,
                                                        batch?.quantitySelected)) }}
                                                </strong>
                                            </div>
                                            <div class="ml-3 text-[10px] text-[rgb(132,140,155)]">
                                                <p>({{ formatAmount(batch?.price) }} cada)</p>
                                            </div>
                                        </li>
                                    </ul>

                                    <div class="flex lg:pt-4 items-center text-[rgb(132,140,155)] justify-between">
                                        <div class="flex flex-col">
                                            <h2 class="text-sm lg:text-base font-semibold">Total </h2>
                                            <p class="text-[10px]">({{ getTotalTicketsSelected(cart.batches) +
                                                `${getTotalTicketsSelected(cart.batches) ===
                                                    1 ? ' ingresso' : ' ingressos'}` }})</p>
                                        </div>
                                        <div>
                                            <h2
                                                class="text-[rgb(25,31,40)] flex justify-end leading-5 lg:leading-6 text-base lg:text-lg font-bold">
                                                {{
                                                    formatAmount(cart?.amount) }}</h2>
                                            <p class="text-[10px]">(selecione a forma de pagamento)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <!-- 
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
                            </div>-->
                            <!--end order summary-->
                        </div>
                    </div>
                </div>
            </div>
        </Container>
        <!--data end-->

        <!--start drawers-->
        <OrderSumary :cart="cart" />
        <!--end drawers-->
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
