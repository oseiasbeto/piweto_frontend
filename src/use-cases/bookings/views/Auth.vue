<script setup>
import { useBookings } from "@/repositories/bookings-repository";
import BtnSpinner from "@/use-cases/marketplace/components/spinners/BtnSpinner.vue";
import { computed, ref } from "vue";
import { toast } from "vue3-toastify";
const { getOrderByIdAndPin, loading: loadingGetBooking } = useBookings()

const form = ref({
    id: "",
    pin: "",
    viewPin: false
})

const hasValidForm = computed(() => form.value?.id?.length > 0 && form.value?.pin?.length > 0)

const resetForm = () => {
    form.value = {
        id: "",
        pin: "",
        viewPin: false
    }
}

const handleAuth = async () => {
    if (!hasValidForm.value) return

    await getOrderByIdAndPin({
        id: form.value?.id,
        pin: form.value?.pin
    }).then(() => {
        toast('Reserva encontrada!', {
            theme: "colored",
            position: "bottom-right",
            autoClose: 1500,
            type: 'success'
        })
    }).catch(err => {
        if (err?.status == 400) {
            resetForm()
            toast('Credenciais invalidas!', {
                theme: "colored",
                position: "bottom-right",
                autoClose: 2500,
                type: 'error'
            })
        }
    })
}
</script>

<template>
    <div class="w-auto">
        <div class="flex flex-col mb-4">
            <div class="flex flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="id">Nº da reserva <span
                        class="text-brand-danger">*</span></label>
                <input :readonly="loadingGetBooking"
                    class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                    type="text" id="id" autocomplete="off" oncontextmenu="false" v-model="form.id">

            </div>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="pin">PIN <span
                    class="text-brand-danger">*</span></label>
            <div class="relative flex items-center">
                <input :readonly="loadingGetBooking"
                    class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                    :type="form.viewPin ? 'text' : 'password'" id="pin" v-model="form.pin">
                <button v-if="form.pin.length > 0"
                    class="absolute flex justify-center items-center text-brand-primary w-[24px] h-[24px] right-[16px]"
                    @click="form.viewPin = !form.viewPin">
                    <svg v-if="!form.viewPin" xmlns="http://www.w3.org/2000/svg" version="1.0" width="16px"
                        height="16px" viewBox="0 0 982.000000 472.000000" preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,472.000000) scale(0.100000,-0.100000)" fill="currentColor"
                            stroke="none">
                            <path
                                d="M337 4710 c-269 -68 -406 -410 -276 -686 52 -111 264 -371 545 -668 90 -96 164 -177 164 -180 0 -4 -560 -797 -676 -956 l-33 -46 311 -294 c171 -162 314 -296 318 -298 3 -1 170 228 370 510 199 282 366 516 369 520 3 4 75 -42 158 -101 246 -175 505 -332 786 -476 84 -43 135 -75 132 -82 -25 -70 -404 -1297 -401 -1300 2 -2 174 -76 382 -163 363 -151 379 -157 386 -136 5 11 98 308 207 660 110 351 202 640 205 643 3 3 72 -13 153 -36 289 -80 586 -136 893 -167 l170 -18 0 -718 0 -718 410 0 410 0 0 719 0 718 78 7 c328 28 739 104 1052 195 57 17 107 27 111 23 3 -4 95 -290 203 -637 109 -346 203 -642 210 -657 l11 -27 375 159 c206 87 376 164 378 172 1 7 -89 303 -202 658 l-204 645 167 85 c258 134 596 344 816 508 l40 30 364 -519 c199 -285 366 -521 370 -524 8 -4 607 550 625 578 6 10 -89 153 -343 515 -193 275 -351 505 -351 511 0 6 11 18 26 27 34 23 311 319 439 469 218 257 290 367 314 483 47 223 -59 456 -247 545 -59 28 -77 32 -152 32 -76 0 -93 -4 -150 -32 -76 -38 -111 -72 -257 -255 -501 -629 -1213 -1201 -1938 -1558 -1705 -837 -3606 -634 -5180 554 -348 263 -791 684 -1020 970 -170 212 -209 252 -280 287 -68 33 -170 46 -238 29z" />
                        </g>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"
                        fill="none">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="w-full mb-6">
            <button :disabled="loadingGetBooking || !hasValidForm"
                class="bg-brand-primary flex justify-center gap-2 text-white items-center disabled:text-gray-400 hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 p-2 uppercase disabled:bg-gray-200"
                @click="handleAuth">
                <BtnSpinner v-if="loadingGetBooking" />
                <p v-else>Confirmar</p>
            </button>
        </div>
    </div>
</template>
