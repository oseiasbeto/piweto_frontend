<script setup>
import { _ } from 'core-js';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    showBtnClose: {
        type: Boolean,
        default: true
    },
    message: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: "success"
    }
})

const emits = defineEmits(['onclose'])

const close = () => {
    emits('onclose')
}

const generateColors = (type) => {
    switch (type) {
        case 'error':
            return 'bg-[#fceeef] text-[#b6202a] border-[#fae1e2]'
        case 'warning':
            return 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]'
        case 'success':
            return 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]'
    }
}
</script>

<template>
    <div v-show="props.show" :class="generateColors(props.type)"
        class="text-xs relative border p-2 rounded-sm">
        <p>{{ props.message }}</p>
        <button v-if="props.showBtnClose" @click="close"
            class="bg-transparent flex justify-end absolute right-0 top-0 opacity-80 text-inherit hover:opacity-100 outline-none w-5 h-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none">
                <g clip-path="url(#clip0_429_11083)">
                    <path d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_429_11083">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </button>
    </div>
</template>