<template>
    <div class="bg-white lg:hidden flex fixed z-[9999] left-0 bottom-[-148px] w-full overflow-hidden flex-col-reverse rounded-t-[8px] transition-all shadow-[0px_6px_24px_rgba(221,224,228)]"
        :class="{ '!bottom-0': props.show }">
        <div>
            <div class="p-4">
                <div v-if="amount > 0"
                    class="flex mb-2 text-[rgb(25,31,40)] justify-between gap-1 items-center flex-row">
                    <div class="flex items-center gap-1">
                        <small class="text-muted text-sm py-2">Total</small>
                        <p v-if="!props.amountAfterDiscount" class="text-lg font-bold">{{ formatAmount(props.amount) }}</p>
                        <p v-else class="text-lg font-bold">{{ formatAmount(props.amountAfterDiscount) }}</p>
                    </div>
                    <div v-if="props.amountAfterDiscount">
                        <p class="text-sm line-through font-semibold">{{ formatAmount(props.amount) }}</p>
                    </div>
                </div>

                <div class="mb-4">
                    <button v-if="!showCouponInput" @click="toggleCouponInput()"
                        class="flex mx-auto items-center text-sm font-semibold gap-2 p-3 text-[rgb(0,151,255)]">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 22 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 9C21.2652 9 21.5196 8.89464 21.7071 8.70711C21.8946 8.51957 22 8.26522 22 8V4.67C22.0093 4.32771 21.9509 3.98695 21.8281 3.6673C21.7054 3.34764 21.5207 3.05537 21.2847 2.80728C21.0487 2.55919 20.766 2.36017 20.4529 2.22163C20.1397 2.08309 19.8023 2.00778 19.46 2L2.53998 2C2.19766 2.00778 1.86024 2.08309 1.5471 2.22163C1.23396 2.36017 0.951268 2.55919 0.715258 2.80728C0.479249 3.05537 0.294568 3.34764 0.171821 3.6673C0.0490736 3.98695 -0.00932306 4.32771 -1.58838e-05 4.67V8C-1.58838e-05 8.26522 0.105341 8.51957 0.292877 8.70711C0.480414 8.89464 0.734768 9 0.999984 9C1.37244 9.02566 1.71951 9.19798 1.96509 9.47918C2.21066 9.76037 2.3347 10.1275 2.30998 10.5C2.3347 10.8725 2.21066 11.2396 1.96509 11.5208C1.71951 11.802 1.37244 11.9743 0.999984 12C0.734768 12 0.480414 12.1054 0.292877 12.2929C0.105341 12.4804 -1.58838e-05 12.7348 -1.58838e-05 13V16.33C-0.00932306 16.6723 0.0490736 17.013 0.171821 17.3327C0.294568 17.6524 0.479249 17.9446 0.715258 18.1927C0.951268 18.4408 1.23396 18.6398 1.5471 18.7784C1.86024 18.9169 2.19766 18.9922 2.53998 19H19.46C19.8023 18.9922 20.1397 18.9169 20.4529 18.7784C20.766 18.6398 21.0487 18.4408 21.2847 18.1927C21.5207 17.9446 21.7054 17.6524 21.8281 17.3327C21.9509 17.013 22.0093 16.6723 22 16.33V13C22 12.7348 21.8946 12.4804 21.7071 12.2929C21.5196 12.1054 21.2652 12 21 12C20.6275 11.9743 20.2805 11.802 20.0349 11.5208C19.7893 11.2396 19.6653 10.8725 19.69 10.5C19.6653 10.1275 19.7893 9.76037 20.0349 9.47918C20.2805 9.19798 20.6275 9.02566 21 9ZM20 7.16C19.3213 7.41617 18.7368 7.87301 18.3242 8.46969C17.9117 9.06638 17.6907 9.77458 17.6907 10.5C17.6907 11.2254 17.9117 11.9336 18.3242 12.5303C18.7368 13.127 19.3213 13.5838 20 13.84V16.33C20.0168 16.4904 19.9695 16.6509 19.8683 16.7764C19.7671 16.902 19.6203 16.9824 19.46 17H2.53998C2.37969 16.9824 2.2329 16.902 2.13171 16.7764C2.03052 16.6509 1.98316 16.4904 1.99998 16.33V13.84C2.67867 13.5838 3.26321 13.127 3.67576 12.5303C4.08832 11.9336 4.30931 11.2254 4.30931 10.5C4.30931 9.77458 4.08832 9.06638 3.67576 8.46969C3.26321 7.87301 2.67867 7.41617 1.99998 7.16V4.67C1.98316 4.50962 2.03052 4.34911 2.13171 4.22356C2.2329 4.098 2.37969 4.01762 2.53998 4H12V14C12 14.2652 12.1053 14.5196 12.2929 14.7071C12.4804 14.8946 12.7348 15 13 15C13.2652 15 13.5196 14.8946 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14V4H19.46C19.6203 4.01762 19.7671 4.098 19.8683 4.22356C19.9695 4.34911 20.0168 4.50962 20 4.67V7.16Z">
                            </path>
                        </svg>
                        <span>Inserir código promocional</span>
                    </button>
                    <div class="flex relative gap-3 items-center justify-between" v-else>
                        <div class="relative flex-1">
                            <input
                                class="flex flex-row items-center w-full text-[rgb(25,31,40)] border border-[rgb(221,224,228)] rounded-[4px] py-2 pr-12 p-4 text-base transition-[border-color] focus:border-[rgb(0,151,255)] focus:ring-1 focus:ring-[rgb(0,151,255)] duration-300 outline-none gap-4"
                                :value="props.couponName" @input="$emit('update:couponName', $event.target.value)"
                                type="text" placeholder="Código" :readonly="coupon._id || props.amountAfterDiscount">
                            <button v-show="!props.amountAfterDiscount" @click="toggleCouponInput()" class="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg width="24" fill="rgb(132, 140, 155)" height="24" viewBox="0 0 24 24"
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



                        <button :disabled="props.couponName == '' || props.loadingCoupon"
                            class="rounded-lg outline-none border text-sm font-semibold font-sans leading-4 inline-flex items-center justify-center min-w-fit w-max cursor-pointer transition-all ease-in duration-200 no-underline hover:bg-[rgb(0,151,255)] text-[rgb(0,151,255)] hover:text-white border-[rgb(0,151,255)] py-3 px-4 disabled:pointer-events-none"
                            v-if="props.couponName == '' || !coupon._id" @click="_applyCoupon()">Aplicar</button>
                        <button
                            class="rounded-lg outline-none border text-sm font-semibold font-sans leading-4 inline-flex items-center justify-center min-w-fit w-max cursor-pointer transition-all ease-in duration-200 no-underline hover:bg-[rgb(0,151,255)] text-[rgb(0,151,255)] hover:text-white border-[rgb(0,151,255)] py-3 px-4 disabled:pointer-events-none"
                            v-else @click="removeCoupon()">Remover</button>
                    </div>

                </div>

                <button style="letter-spacing: 0.5px;"
                    class=" bg-[rgb(23,178,106)] hover:bg-[rgb(7,148,85)] h-[48px]  rounded-[8px] disabled:bg-gray-400 disabled:cursor-default disabled:hover:bg-gray-400 disabled:hover:border-gray-400 transition-colors w-full font-semibold text-[14px] py-2.5 px-3 text-[#fff] btn-submit mb-1"
                    @click="sendToCart" :disabled="loadingCart || amount == 0">
                    <span v-if="!loadingCart">{{ amount == 0 ? 'Selecione um Ingresso' :
                        'Comprar ingressos' }}</span>
                    <span v-else>Carregando...</span>
                </button>


            </div>
        </div>
    </div>
</template>

<script setup>
import formatAmount from "@/utils/formatAmount";
import { ref } from "vue";

const props = defineProps({
    amount: {
        type: Number,
        required: true
    },
    amountAfterDiscount: {
        type: Number,
        default: 0
    },
    loadingCoupon: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    },
    coupon: {
        type: Object,
        default: () => ({})
    },
    couponName: {
        type: String,
        required: true,
    },
    loadingCart: {
        type: Boolean,
        default: false
    },
})


const emit = defineEmits(['sendToCart', 'update:couponName', 'applyCoupon', 'removeCoupon']);
const sendToCart = () => {
    emit('sendToCart');
};

const showCouponInput = ref(false);

const _applyCoupon = () => {
    emit('applyCoupon', props.couponName);
};

const toggleCouponInput = () => {
    showCouponInput.value = !showCouponInput.value;
    if (!showCouponInput.value) {
        clearCoupon()
    }
}

const removeCoupon = () => {
    emit('removeCoupon');
};
const clearCoupon = () => {
    emit('update:couponName', ''); // Emite valor vazio
};
</script>