<script setup>
const emit = defineEmits(['onpress'])

const props = defineProps({
    active: {
        type: Boolean,
        default: true
    }
})

const handlePress = () => {
    emit("onpress")
}
</script>

<template>
    <li @click="handlePress" class="px-[14px] cursor-pointer pt-[14px] grow  hover:bg-light-bg-light">
        <div class="text-center font-normal relative">
            <p class="relative whitespace-nowrap text-[15px] w-min mx-auto leading-5 pb-[13px]" :class="props.active ? 'text-light-text font-semibold' : 'text-light-text-gray'">
                <slot></slot>
                <span v-show="props.active" class="bg-light-primary absolute w-full left-0 bottom-0 h-[4px] rounded-[30px]"></span>
            </p>
        </div>
    </li>
</template>