<script>
export default {
    name: "PreviewImage",
    props: {
        image: {
            type: [Object, String, File], // Aceita vários tipos
            required: true
        },
        createUrl: {
            type: Boolean,
            default: true
        },
        title: String
    },
    computed: {
        imageSource() {
            // Se for string (URL), retorna diretamente
            if (typeof this.image === 'string') {
                return this.image;
            }
            // Se for File/Blob e createUrl for true, cria object URL
            if (this.createUrl && this.image instanceof File) {
                return URL.createObjectURL(this.image);
            }
            // Se for objeto do Cloudinary com propriedade url
            if (this.image && this.image.url) {
                return this.image.url;
            }
            // Fallback: tenta usar o objeto diretamente (pode ser File)
            return this.image;
        }
    },
    methods: {
        createURLMedia(media) {
            // Verifica se é File/Blob antes de criar URL
            if (media instanceof File || media instanceof Blob) {
                return URL.createObjectURL(media);
            }
            // Se já for string (URL), retorna ela mesma
            if (typeof media === 'string') {
                return media;
            }
            // Se for objeto com propriedade url
            if (media && media.url) {
                return media.url;
            }
            return '';
        }
    },
    beforeUnmount() {
        // Limpa object URLs criados para evitar memory leaks
        if (this.image instanceof File && this.createUrl) {
            URL.revokeObjectURL(this.imageSource);
        }
    }
}
</script>

<template>
    <div class="relative border border-gray-400 float-left text-left">
        <div class="w-full lg:w-[280px] h-[144px]">
            <img 
                class="w-full h-full object-cover" 
                :src="createUrl ? createURLMedia(image) : (typeof image === 'string' ? image : image?.url)" 
                :alt="title" 
                :title="title"
            >
        </div>
    </div>
</template>