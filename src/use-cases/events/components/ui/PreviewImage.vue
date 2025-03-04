<script>
export default {
    name: "PreviewImage",
    props: {
        image: {
            type: null,
            required: true
        },
        createUrl: {
            type: Boolean,
            default: true
        },
        title: String
    },
    methods: {
        createURLMedia(media) {
            return URL.createObjectURL(media)
        }
    }
}
</script>


<template>
    <div class="relative border border-gray-400 float-left text-left">
        <div class="w-[280px] h-[144px]">
            <img class="w-full h-full object-cover" :src="createUrl ? createURLMedia(image) : image" :alt="title" :title="title">
        </div>
    </div>
</template>