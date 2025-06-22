<template>
    <div
        class="bg-white lg:hidden flex fixed z-[9999] left-0 bottom-0 w-full overflow-hidden flex-col-reverse rounded-t-[8px] shadow-[0px_-9px_19px_-6px_rgba(0,0,0,0.2)] ">

        <div>
            <div
                class="flex p-4 items-center border-b border-[rgb(221,224,228)] text-[rgb(132,140,155)] justify-between">
                <div>
                    <div class="flex gap-1.5">
                        <h2 class="text-sm text-[rgb(76,87,108)] lg:text-base font-semibold">Total </h2>
                        <h2 class="text-[rgb(25,31,40)] flex justify-end leading-5 text-base lg:text-lg font-bold">
                            {{
                                formatAmount(cart?.amount) }}
                        </h2>
                    </div>
                    <p class="text-[10px] mt-1">(selecione a forma de pagamento)</p>
                </div>
                <div>
                    <div @click="toggleShowMore()" class="flex gap-1 items-center">
                        <span class="text-[rgb(0,151,255)] text-sm font-bold">{{ isShowMore ? 'Ver menos' : 'Ver nais' }}</span>
                        <div
                            class="bg-[rgb(0,151,255)] shrink-0 w-3.5 h-3.5 leading-none rounded-full transition-all duration-200 transform-none">
                            <svg :class="{ 'transform rotate-180': isShowMore }" width="14" fill="#fff" height="14"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M17.6785 14.6972C17.2634 15.1082 16.5948 15.1085 16.1793 14.698L12 10.5689L7.8207 14.698C7.40515 15.1085 6.7366 15.1082 6.3215 14.6972C5.90022 14.28 5.90022 13.5993 6.3215 13.1822L11.9374 7.62167C11.9721 7.58736 12.0279 7.58736 12.0625 7.62167L17.6785 13.1822C18.0997 13.5993 18.0997 14.28 17.6785 14.6972Z">
                                </path>
                            </svg>
                        </div>
                    </div>
                    <p class="text-[10px] mt-1 flex justify-end">({{ getTotalTicketsSelected(cart.batches) +
                        `${getTotalTicketsSelected(cart.batches) ===
                            1 ? ' ingresso' : ' ingressos'}` }})</p>

                </div>
            </div>

            <div class="overflow-y-auto transition-all duration-100 ease-in-out"
                :style="{ 'max-height': isShowMore ? '300px' : '0' }">
                <!--start event card-->
                <div class="p-4 py-4 border-b border-[rgb(221,224,228)] flex gap-4">
                    <div class="w-[108px] shrink-0 h-[64px]">
                        <img v-lazy="cart?.event?.cover?.low" class="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 class="text-[14px] text-[rgb(25,31,40)] line-clamp-2 leading-4 font-bold mb-[6px] overflow-hidden text-ellipsis 
       [display:-webkit-box] [webkit-line-clamp:4] [webkit-box-orient:vertical]">
                            {{ cart?.event?.name }}
                        </h2>
                        <div class="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

                <!--start batches list-->
                <ul class="flex flex-col px-4 py-4 gap-3" v-if="cart?.batches?.length">
                    <li class="text-[rgb(76,87,108)] leading-4 text-sm" v-for="(batch, index) in cart?.batches"
                        :index="index">
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
                <!--end batches list-->
            </div>

        </div>
    </div>

    <!--start backdrop-->
    <div class="fixed inset-0 w-full pointer-events-none h-full z-[8888] bg-[rgba(25,31,40,0.6)] transition-opacity duration-100 ease-in-out opacity-0 animate-fade-in"
        :class="{'opacity-100 pointer-events-auto': isShowMore, '!pointer-events-none': !isShowMore}">
        <!-- Conteúdo do backdrop -->
    </div>
    <!--end backdrop-->
</template>

<script setup>
import formatAmount from "@/utils/formatAmount";
import calculateTotalPrice from "@/utils/calculateTotalPrice";
import getTotalTicketsSelected from "@/utils/getTotalTicketsSelected";
import formatEventDateTime from "@/utils/formatEventDateTime";
import { onBeforeUnmount, ref } from "vue";

defineProps({
    cart: {
        type: Object,
        required: true
    }
})

const isShowMore = ref(false)

const toggleShowMore = () => {
    isShowMore.value = !isShowMore.value
    if (isShowMore.value) {
        console.log("aki")
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
}

onBeforeUnmount(() => {
    document.body.classList.remove('overflow-hidden');
});
</script>