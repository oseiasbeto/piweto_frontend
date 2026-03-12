<script setup>
import DropzoneImage from "../components/ui/DropzoneImage.vue";
import PreviewImage from "../components/ui/PreviewImage.vue"
import { useStore } from "vuex"
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import Quill from 'quill';
import Swal from "sweetalert2"
import formatAmount from "@/utils/formatAmount";
import DatePicker from '@jobinsjp/vue3-datepicker';
import { useRouter, useRoute } from "vue-router";
import 'vue-multiselect/dist/vue-multiselect.css';
import { useEvents } from "@/repositories/events-repository";
import Multiselect from 'vue-multiselect'
import { toast } from "vue3-toastify"
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const store = useStore()
const categories = ref([
    'Festas & Shows',
    'Teatro & Espetáculos',
    'Família',
    'Esportes',
    'Gastronomia',
    'Palestras & Workshops',
    'Festivais',
    'Eventos Corporativos',
    'Feiras & Exposições',
    'Religião & Espiritualidade',
    'Cultura & Arte',
    'Música',
    'Cinema & Audiovisual',
    'Bem-estar & Saúde',
    'Tecnologia & Startups'
]);
const hasError = ref(true)
const { newEvent, loading: loadingEvent } = useEvents()

loadingEvent.value = false

// Referências para os DatePickers de horário
const startsTimePickerRef = ref(null);
const endsTimePickerRef = ref(null);

// Constantes do Cloudinary
const CLOUD_NAME = 'daujoblcc';
const UPLOAD_PRESET = 'social_media_upload';
const API_KEY = '686559434489718';
const API_SECRET = 'oAYl12OIZf2HkieFNDQQk2romHM';

// Refs para upload
const mediaPreviews = ref([]);
const uploadProgress = ref({});
const cancelTokens = ref({});
const selectFileLoading = ref(false);
const uploadedMediaIds = ref([]);
const mediaContainer = ref(null);

const router = useRouter()
const route = useRoute()

// configura datepicker para o idioma PT-AO
const langConfig = computed(() => {
    return {
        days: ['DOM', '2ª', '3ª', '4ª', '5ª', '6ª', 'SÁB'],
        daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        months: [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ],
        monthFormat: 'MM'
    }
})

function calcularValorComTaxa(valor) {
    const taxa = 0.04; // 4% de taxa
    const valorComTaxa = valor * (1 - taxa);
    return parseFloat(valorComTaxa.toFixed(2));
}

// define as nomeclaturas dos ingressos.
const nameclatures = ref([
    'ticket',
    'inscription'
])

// Esta função computada tem como finalidade retornar os dados do corrente evento.
const currentEvent = computed(() => {
    return store.getters.event
})

// Crie os eventos de emissão deste componente.
const emit = defineEmits(["oncreate", "on-clear-error"])

const editorContainer = ref(null);
let quillInstance = null; // Instância do Quill

// crie as props deste componente.
const props = defineProps({
    type: String
})

const errors = ref({
    name: {
        show: false,
        message: ""
    },
    category: {
        show: false,
        message: ""
    },
    address: {
        location: {
            show: false,
            message: ""
        },
        street: {
            show: false,
            message: ""
        },
        neighborhood: {
            show: false,
            message: ""
        },
        city: {
            show: false,
            message: ""
        }
    },
    meeting: {
        url: {
            show: false,
            message: ""
        },
    },
    description: {
        show: false,
        message: ""
    },
    batches: {
        show: false,
        message: ""
    },
    starts_at: {
        show: false,
        message: ""
    },
    ends_at: {
        show: false,
        message: ""
    },
    starts_time_At: {
        show: false,
        message: ""
    },
    ends_time_at: {
        show: false,
        message: ""
    }
})

const dropzoneRef = ref(null);

// esta funcao computada deve retornar os dados do formulario de criacao de um evento.
const form = computed(() => {
    return store.getters.eventForm
})

const cover = ref(null) 

const disabledStartsDate = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

const disabledEndsDate = computed(() => {
    const today = new Date(form.value.starts_at.date ?? new Date());
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

// Computed properties para upload
const isUploading = computed(() => {
    return Object.values(uploadProgress.value).some(progress => progress < 100);
});

const uploadProgressPercentage = computed(() => {
    const progresses = Object.values(uploadProgress.value);
    if (progresses.length === 0) return 0;
    const totalProgress = progresses.reduce((sum, progress) => sum + progress, 0);
    return Math.round(totalProgress / progresses.length);
});

const dashArrayUploadProgress = computed(() => {
    const circumference = 2 * Math.PI * 12.5;
    if (isUploading.value) {
        const dash = (uploadProgressPercentage.value / 100) * circumference;
        return `${dash} ${circumference - dash}`;
    }
    return `0 ${circumference}`;
});

// Esta função computada tem como finalidade retornar o tipo do evento a ser criado.
const type = computed(() => {
    return route.query.tipo
})

// Esta função tem como finalidade validar o formulário da criação do evento.
function validateForm() {
    if (form.value.name == '') {
        errors.value.name = {
            show: true,
            message: "Informe o nome do seu evento."
        }
        const fieldToScroll = document.querySelector("#titleField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.category == '') {
        errors.value.category = {
            show: true,
            message: "Informe a categoria do seu evento."
        }
        const fieldToScroll = document.querySelector("#categoryField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true

    }
    else if (type.value == 'presencial' && form.value.address.location == "") {
        errors.value.address.location = {
            show: true,
            message: "Informe o nome do local do seu evento."
        }
        const fieldToScroll = document.querySelector("#locationField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (!form.value.showOnMap && type.value == 'online' && form.value.meeting.url == "") {
        errors.value.meeting.url = {
            show: true,
            message: "Digite o link da reuniao."
        }
        const fieldToScroll = document.querySelector("#urlField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.description == '' || form.value.description == '<p><br></p>') {
        errors.value.description = {
            show: true,
            message: "Informe a descrição do seu evento."
        }
        const fieldToScroll = document.querySelector("#descriptionField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.starts_at.date == null) {
        errors.value.starts_at = {
            show: true,
            message: "Informe a data de Início do seu evento."
        }
        const fieldToScroll = document.querySelector("#starts_atDateField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.starts_at.hm == null) {
        errors.value.starts_time_At = {
            show: true,
            message: "Informe o horario de Início do seu evento."
        }
        const fieldToScroll = document.querySelector("#starts_atHmField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.ends_at.date == null) {
        errors.value.ends_at = {
            show: true,
            message: "Informe a data de término do seu evento."
        }
        const fieldToScroll = document.querySelector("#ends_atDateField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.ends_at.hm == null) {
        errors.value.ends_time_at = {
            show: true,
            message: "Informe o horario de término do seu evento."
        }
        const fieldToScroll = document.querySelector("#ends_atHmField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.batches.length == 0) {
        errors.value.batches = {
            show: true,
            message: "Adicione pelo menos 1 tipo de ingresso."
        }
        const fieldToScroll = document.querySelector("#ticketsField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else {
        hasError.value = false
    }
}

// Funções do Cloudinary
const deleteMediaFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureString = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
        const signature = CryptoJS.SHA1(signatureString).toString();

        await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`,
            {
                public_id: publicId,
                api_key: API_KEY,
                timestamp: timestamp,
                signature: signature,
            }
        );
        uploadedMediaIds.value = uploadedMediaIds.value.filter(id => id !== publicId);
    } catch (error) {
        console.error('Erro ao excluir mídia do Cloudinary:', error);
    }
};

const uploadMedia = async (media) => {
    const source = axios.CancelToken.source();
    cancelTokens.value[media.id] = source;

    try {
        const formData = new FormData();
        formData.append('file', media.file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('cloud_name', CLOUD_NAME);
        formData.append('folder', 'event_covers');

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            formData,
            {
                cancelToken: source.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    uploadProgress.value = {
                        ...uploadProgress.value,
                        [media.id]: progress
                    };
                },
            }
        );

        delete cancelTokens.value[media.id];

        if (!response.data) {
            const newProgress = { ...uploadProgress.value };
            delete newProgress[media.id];
            uploadProgress.value = newProgress;
            return null;
        }

        media.public_id = response.data?.asset_id;
        uploadedMediaIds.value.push(response.data?.asset_id);

        const newProgress = { ...uploadProgress.value };
        delete newProgress[media.id];
        uploadProgress.value = newProgress;

        return {
            public_id: response.data.public_id,
            url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_80,w_1200/${response.data.public_id}`,
            type: 'image',
            format: response.data.format,
            width: response.data.width,
            height: response.data.height,
        };
    } catch (err) {
        if (axios.isCancel(err)) {
            const newProgress = { ...uploadProgress.value };
            delete newProgress[media.id];
            uploadProgress.value = newProgress;
            return null;
        } else {
            const newProgress = { ...uploadProgress.value };
            delete newProgress[media.id];
            uploadProgress.value = newProgress;
            throw err;
        }
    }
};

const removeMedia = async (index) => {
    const media = mediaPreviews.value[index];

    if (uploadProgress.value[media.id] !== undefined && cancelTokens.value[media.id]) {
        cancelTokens.value[media.id].cancel('Upload cancelado pelo usuário');
        delete cancelTokens.value[media.id];
    }

    mediaPreviews.value.splice(index, 1);

    const newProgress = { ...uploadProgress.value };
    delete newProgress[media.id];
    uploadProgress.value = newProgress;

    if (media.public_id) {
        await deleteMediaFromCloudinary(media.public_id, 'image');
    }

    form.value.file = null;
};

// Esta função tem como finalidade realizar um drop da imagem.
function dropCover(e) {
    const file = e.dataTransfer.files[0];
    if (file) {
        validateCover(file)
    } else {
        Swal.fire({
            title: "Erro!",
            text: "Aconteceu um erro ao arrastar o arquivo",
            icon: 'error'
        })
    }
}

function handleStartsDateChange() {
    errors.value.starts_at = {
        show: false,
        message: ""
    }
}
function handleEndsDateChange() {
    errors.value.ends_at = {
        show: false,
        message: ""
    }
}

function handleStartsTimeDateChange(e) {
    errors.value.starts_time_At = {
        show: false,
        message: ""
    }
}

function handleEndsTimeDateChange(e) {
    errors.value.ends_time_at = {
        show: false,
        message: ""
    }
    if (endsTimePickerRef.value) {
        endsTimePickerRef.value.blur(); // Fecha o modal após selecionar o horário
    }
}

// Esta função tem como finalidade eliminar um lote de ingressos através de um index específico.
function deleteTicket(index) {
    Swal.fire({
        title: "Você tem certeza?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, eu tenho",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            store.dispatch("removeBatchFromBatches", index)
            Swal.fire({
                title: "Eliminado!",
                text: "O seu ingresso foi eliminado com sucesso.",
                icon: "success"
            })
        }
    })
}

// Esta função tem como finalidade selecionar a imagem de capa.
function selectCover(e) {
    const file = e.target.files[0];
    if (file) {
        validateCover(file)
    } else {
        Swal.fire({
            title: "Erro!",
            text: "Aconteceu um erro ao selecionar o arquivo",
            icon: 'error'
        })
    }
}

// Esta função tem como finalidade validar a imagem selecionada.
// Função de validação da imagem
function validateCover(file) {
    const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
    const MAX_SIZE = 5 * 1024 * 1024;
    const sizeOk = file.size < MAX_SIZE;
    const typeOk = allowedTypes.includes(file.type);

    if (typeOk && sizeOk) {
        selectFileLoading.value = true;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const id = uuidv4();
            const media = {
                id,
                url: e.target.result,
                type: 'image',
                format: file.type.split('/')[1],
                file
            };

            mediaPreviews.value = [media];
            uploadProgress.value[id] = 0;

            try {
                const uploadedMedia = await uploadMedia(media);
                if (uploadedMedia) {
                    mediaPreviews.value[0] = {
                        ...mediaPreviews.value[0],
                        ...uploadedMedia
                    };
                    // Armazena apenas o objeto da mídia completa, não apenas o file
                    cover.value = mediaPreviews.value[0];
                    form.value.file = mediaPreviews.value[0];
                }
            } catch (err) {
                Swal.fire({
                    title: "Erro!",
                    text: err.message || 'Erro ao fazer upload da imagem. Tente novamente.',
                    icon: 'error'
                });
                mediaPreviews.value = [];
                form.value.file = null;

                // LIMPA O VALOR DO INPUT FILE - SOLUÇÃO PARA O PROBLEMA
                if (dropzoneRef.value) {
                    dropzoneRef.value.clearInput();
                }
            } finally {
                selectFileLoading.value = false;
            }
        };
        reader.onerror = () => {
            Swal.fire({
                title: "Erro!",
                text: 'Erro ao carregar a imagem. Tente novamente.',
                icon: 'error'
            });
            selectFileLoading.value = false;
            cover.value = null;
            form.value.file = null;
        };
        reader.readAsDataURL(file);
    } else {
        form.value.file = null
        if (typeOk && !sizeOk) {
            Swal.fire({
                title: "Erro!",
                text: "O arquivo deve ter no máximo 5 MB.",
                icon: 'error'
            })
        } else if (!typeOk) {
            Swal.fire({
                title: "Erro!",
                text: "O arquivo deve estar nos formatos: jpeg, jpg ou png.",
                icon: 'error'
            })
        }
    }
}

const cancelUpload = () => {
    // Encontra a mídia que está em upload
    const uploadingMedia = mediaPreviews.value.find(media => uploadProgress.value[media.id] !== undefined);

    if (uploadingMedia && cancelTokens.value[uploadingMedia.id]) {
        // Cancela o upload
        cancelTokens.value[uploadingMedia.id].cancel('Upload cancelado pelo usuário');

        // Remove o token
        delete cancelTokens.value[uploadingMedia.id];

        // Remove o progresso
        const newProgress = { ...uploadProgress.value };
        delete newProgress[uploadingMedia.id];
        uploadProgress.value = newProgress;

        // Remove a mídia da prévia
        const index = mediaPreviews.value.findIndex(m => m.id === uploadingMedia.id);
        if (index !== -1) {
            mediaPreviews.value.splice(index, 1);
        }

        // Reseta o estado de loading
        selectFileLoading.value = false;

        // Reseta o form.file
        form.value.file = null;

        // LIMPA O VALOR DO INPUT FILE - SOLUÇÃO PARA O PROBLEMA
        if (dropzoneRef.value) {
            dropzoneRef.value.clearInput();
        }

        toast("O upload da imagem foi cancelado.", {
            theme: "colored",
            position: "top-right",
            autoClose: 2517,
            type: "info"
        })
    }
};

// Esta função tem como finalidade remover a imagem selecionada.
function replaceCover() {
    if (mediaPreviews.value.length > 0) {
        removeMedia(0);
        form.value.file = null;
        cover.value = null
    } else {
        form.value.file = null;
        cover.value = null
    }
    // LIMPA O VALOR DO INPUT FILE - SOLUÇÃO PARA O PROBLEMA
    if (dropzoneRef.value) {
        dropzoneRef.value.clearInput();
    }
}

function openBatchModal(type) {
    store.dispatch("setModal", {
        name: "form-batch",
        show: true,
        data: {
            type,
            requestApi: false,
            action: "create"
        }
    })
}

function openModalEditTicket(batch, index) {
    store.dispatch("setModal", {
        name: "form-batch",
        show: true,
        data: {
            batch,
            index,
            requestApi: false,
            action: "edit"
        }
    })
}

// Esta função tem como finalidade emitir um evento de 'criação de evento' para o componente pai.
const createEvent = async (status) => {
    validateForm()
    if (hasError.value || loadingEvent.value) return

    const formatToISO = (dateString) => {
        return dateString ? new Date(dateString).toISOString() : null
    }

    function createEventPayload(eventForm) {
        const payload = {
            name: eventForm.name || "",
            cover: cover.value || null,
            category: eventForm.category || "",
            description: eventForm.description || "",
            status: eventForm.status || "pending",
            visibility: eventForm.visibility || "public",
            nameclature: eventForm.nameclature || "ticket",
            type: "presencial",
            showOnMap: Boolean(eventForm.showOnMap),

            starts_at: {
                date: formatToISO(eventForm.starts_at?.date),
                hm: formatToISO(eventForm.starts_at?.hm)
            },

            ends_at: {
                date: formatToISO(eventForm.ends_at?.date),
                hm: formatToISO(eventForm.ends_at?.hm)
            },

            address: {
                ...eventForm.address
            },

            batches: Array.isArray(eventForm.batches)
                ? eventForm.batches.map((batch) => ({
                    name: batch.name,
                    type: batch.type,
                    nomenclature: batch.nomenclature,
                    available_tickets: batch.available_tickets,
                    description: batch.description,
                    visibility: batch.visibility,
                    quantity: batch.quantity ? Number(batch.quantity) : 0,
                    price: batch.price ? Number(batch.price) : 0,

                    starts_at: {
                        date: formatToISO(batch.starts_at?.date),
                        hm: formatToISO(batch.starts_at?.hm)
                    },

                    ends_at: {
                        date: formatToISO(batch.ends_at?.date),
                        hm: formatToISO(batch.ends_at?.hm)
                    },

                    quantity_for_purchase: {
                        min: batch.quantity_for_purchase?.min
                            ? Number(batch.quantity_for_purchase.min)
                            : 1,
                        max: batch.quantity_for_purchase?.max
                            ? Number(batch.quantity_for_purchase.max)
                            : 1
                    }
                }))
                : []
        }
        return payload
    }

    form.value.status = status
    const payload = createEventPayload(form.value)

    await newEvent(payload)
        .then(() => {
            router.replace(`/gerenciador-de-eventos/pagina-inicial/${currentEvent.value.id}`)

            store.dispatch("setToast", {
                show: true,
                message: "Evento criado com sucesso.",
                type: "success",
                timeout: 3000
            })
        })
        .then(() => {
            store.dispatch("resetEventForm")
        })
}

const handleLabelClick = async () => {
    if (form.value.file) {
        // Se há uma imagem, resetamos form.file para mostrar o DropzoneImage
        form.value.file = null;
        cover.value = null
        // Aguarda o próximo tick para garantir que o DropzoneImage seja montado
        await nextTick();
    }
    if (dropzoneRef.value && typeof dropzoneRef.value.triggerInput === 'function') {
        dropzoneRef.value.triggerInput();
    } else {
        console.error('triggerInput não está disponível em dropzoneRef');
    }
};

onMounted(() => {
    if (!type.value || !['presencial', 'online'].includes(type.value)) {
        router.push({ path: "/eventos/meus-eventos" })
    } else {
        store.dispatch("resetEventForm")
        quillInstance = new Quill(editorContainer.value, {
            theme: 'snow', // Tema: snow ou bubble
            placeholder: 'Digite algo aqui...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link'],
                ],
            },
        });

        quillInstance.on('text-change', () => {
            form.value.description = quillInstance.root.innerHTML; // Atualiza o conteúdo do v-model
            if (quillInstance.root.innerHTML == "" || quillInstance.root.innerHTML == '<p><br></p>') {
                errors.value.description.show = true
            } else {
                errors.value.description.show = false
            }
        });
    }
})

onBeforeUnmount(() => {
    if (quillInstance) {
        quillInstance = null;
    }
});
</script>


<template>
    <div class="min-h-screen">
        <!--start body -->
        <div class="lg:max-w-[1100px] relative z-10 lg:mx-auto">
            <div class="w-full mb-6 lg:p-6">
                <!--start new event form -->
                <div>
                    <!--start basics information group form -->
                    <div class="w-full mb-6 lg:p-6 bg-white lg:rounded-md shadow-md">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-medium text-[#0097ff]">1. Informações básicas</h3>
                                <p class="ml-[22px] text-sm text-gray-500">Adicione as principais informações do evento.
                                </p>
                            </div>
                            <div class="flex flex-col">
                                <label
                                    class="flex items-center gap-[3px] text-[12px] mb-1 text-gray-600 font-medium required flex-row"
                                    for="titleField">
                                    Titulo do evento

                                    <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                </label>
                                <input
                                    class="p-[10px] border !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                    @input="form.name != '' ? errors.name.show = false : errors.name.show = true"
                                    id="titleField" type="text" v-model="form.name"
                                    :class="{ 'border-red-500': errors.name.show }">
                                <small class="text-xs text-red-500" :class="{ danger: errors.name.show }">
                                    <small v-if="errors.name.show">
                                        {{ errors.name.message }}
                                    </small>
                                </small>
                            </div>
                            <div class="form-group mt-4 mb-5">
                                <label
                                    class="flex items-center gap-[3px] text-[12px] mb-1 text-gray-600 font-medium required flex-row">
                                    Imagem de divulgação (opcional)</label>
                                <div class="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mt-2">
                                    <div class="w-full md:w-auto relative">
                                        <!-- Overlay de loading com barra de progresso e botão cancelar -->
                                        <div v-if="selectFileLoading"
                                            class="absolute inset-0 w-full lg:w-[280px] h-[144px] bg-black bg-opacity-50 rounded-lg flex flex-col items-center justify-center z-10">
                                            <div class="bg-white p-4 rounded-lg shadow-lg w-48">
                                                <p class="text-sm text-center mb-2 font-medium">Uploading...</p>
                                                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                                        :style="{ width: uploadProgressPercentage + '%' }">
                                                    </div>
                                                </div>
                                                <p class="text-xs text-center text-gray-600">
                                                    {{ uploadProgressPercentage }}% concluído
                                                </p>

                                                <!-- Botão Cancelar -->
                                                <button @click="cancelUpload"
                                                    class="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 px-3 rounded-full transition-colors duration-200 flex items-center justify-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3"
                                                        viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    Cancelar Upload
                                                </button>
                                            </div>
                                        </div>

                                        <DropzoneImage ref="dropzoneRef" @drop.prevent="dropCover" @change="selectCover"
                                            :class="{ 'opacity-50 pointer-events-none': selectFileLoading }"
                                            v-if="!form.file" />
                                        <PreviewImage v-else :image="form.file" />
                                    </div>
                                    <div class="w-full md:w-auto">
                                        <div class="flex gap-3 mb-3 items-center" v-if="form.file">
                                            <button
                                                class="border cursor-pointer border-[#0097ff] text-[#0097ff] text-[10px] font-medium uppercase rounded-full py-[6px] px-3 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                                :disabled="selectFileLoading"
                                                :class="{ 'opacity-50 cursor-not-allowed': selectFileLoading }"
                                                @click="handleLabelClick">
                                                Trocar de imagem
                                            </button>
                                            <button
                                                class="border cursor-pointer border-[#0097ff] text-[#0097ff] text-[10px] font-medium uppercase rounded-full py-[6px] px-3 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                                :disabled="selectFileLoading"
                                                :class="{ 'opacity-50 cursor-not-allowed': selectFileLoading }"
                                                @click="replaceCover">Remover</button>
                                        </div>

                                        <!-- Barra de progresso alternativa para quando já tem imagem -->
                                        <div v-if="selectFileLoading && form.file" class="w-48 mb-3">
                                            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    :style="{ width: uploadProgressPercentage + '%' }">
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between">
                                                <p class="text-xs text-gray-600">
                                                    {{ uploadProgressPercentage }}% - Atualizando...
                                                </p>
                                                <!-- Botão Cancelar pequeno -->
                                                <button @click="cancelUpload"
                                                    class="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3"
                                                        viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>

                                        <p class="text-sm text-gray-500">A dimensão recomendada é de <strong>1600 x
                                                838</strong><br>(mesma proporção do formato utilizado nas páginas de
                                            evento
                                            no
                                            <b>Facebook</b>).<br>Formato <strong>JPEG, GIF ou PNG de no máximo
                                                5MB.</strong><br>Imagens
                                            com dimensões diferentes serão redimensionadas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label
                                    class="flex items-center gap-[3px] text-[12px] mb-1 text-gray-600 font-medium required flex-row">
                                    Categoria
                                    <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                </label>

                                <multiselect id="categoryField" :class="{ '!border-red-500': errors.category.show }"
                                    placeholder="Selecione a categoria" v-model="form.category" :options="categories">
                                </multiselect>

                                <small class="text-xs text-red-500">
                                    <span v-if="errors.category.show">
                                        {{ errors.category.message }}
                                    </span>
                                </small>
                            </div>
                        </div>

                    </div>
                    <!--end basics information group form -->
                    <div class="w-full mb-6 lg:p-6 bg-white lg:rounded-md shadow-md">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-medium text-[#0097ff]">2. Onde o seu evento vai acontecer?
                                </h3>
                            </div>
                            <!--start address-->
                            <div v-if="type == 'presencial'">
                                <div>
                                    <div class="w-full">
                                        <label
                                            class="flex items-center gap-[3px] text-[12px] mb-1 text-gray-600 font-medium reqitems-center">
                                            Nome do Local
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <input
                                            class="p-[10px] border w-full !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                            id="locationField"
                                            @input="form.address.location != '' ? errors.address.location.show = false : errors.address.location.show = true"
                                            v-model="form.address.location" maxlength="100" type="text"
                                            placeholder="Ex: Hotel CHick Chick, Saurimo, Lunda-sul"
                                            :class="{ 'border-red-500': errors.address.location.show }">
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.address.location.show }">
                                            <span v-if="errors.address.location.show">
                                                {{ errors.address.location.message }}
                                            </span>
                                        </small>
                                    </div>
                                </div>
                                <div>
                                    <!--google maps-->
                                </div>
                            </div>
                            <!--end address-->

                            <!--start link meet-->
                            <div v-else>
                                <div class="form-group">
                                    <input
                                        class="p-[10px] border !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                        v-model="form.meeting.url" maxlength="100" type="text" placeholder="Link"
                                        :class="{ 'border-red-500': errors.meeting.url.show }">
                                    <small class="text-xs text-red-500" :class="{ danger: errors.meeting.url.show }">
                                        <span v-if="errors.meeting.show">
                                            {{ errors.meeting.url.message }}
                                        </span>
                                    </small>
                                </div>
                            </div>
                            <!--end link meet-->
                        </div>
                    </div>
                    <!--start description group form -->
                    <div class="w-full mb-6 lg:p-6 bg-white lg:rounded-md shadow-md">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-medium text-[#0097ff]">3. Descrição do evento</h3>
                                <p class="ml-[22px] text-sm text-gray-500">Conte todos os detalhes do seu evento, como a
                                    programação e
                                    os
                                    diferenciais da sua produção!</p>
                            </div>
                            <div class="form-group">
                                <div id="descriptionField" ref="editorContainer"
                                    style="height: 300px; border: 1px solid #d1d5db;">
                                </div>
                                <small class="text-xs text-red-500" :class="{ danger: errors.description.show }">
                                    <span v-if="errors.description.show">
                                        {{ errors.description.message }}
                                    </span>
                                </small>
                            </div>
                        </div>
                    </div>
                    <!--end description group form -->

                    <!--start date and times information group form -->
                    <div class="w-full mb-6 lg:p-6 bg-white lg:rounded-md shadow-md">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-medium text-[#0097ff]">4. Data e horário</h3>
                                <p class="ml-[22px] text-sm text-gray-500">Informe aos participantes quando seu evento
                                    vai acontecer.</p>
                            </div>
                            <div>
                                <div class="w-full flex flex-row items-center gap-4">
                                    <div class="w-full">
                                        <label for="starts_atDate" class="flex items-center gap-[3px] text-[12px] mb-1">
                                            Data de Início
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="starts_atDateField" class="w-full">
                                            <date-picker :clearable="false" @change="handleStartsDateChange"
                                                :disabled-date="disabledStartsDate" :lang="langConfig"
                                                v-model:value="form.starts_at.date"
                                                class="responsive-datepicker"></date-picker>
                                        </div>
                                        <small class="text-xs text-red-500" :class="{ danger: errors.starts_at.show }">
                                            <span v-if="errors.starts_at.show">{{ errors.starts_at.message }}</span>
                                        </small>
                                    </div>
                                    <div class="w-full">
                                        <label for="starts_atHm" class="flex items-center gap-[3px] text-[12px] mb-1">
                                            Hora de Início
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="starts_atHmField" class="w-full">
                                            <date-picker ref="startsTimePickerRef" :clearable="false"
                                                @change="handleStartsTimeDateChange" v-model:value="form.starts_at.hm"
                                                format="HH:mm" type="time" class="responsive-datepicker"></date-picker>
                                        </div>
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.starts_time_At.show }">
                                            <span v-if="errors.starts_time_At.show">{{ errors.starts_time_At.message
                                            }}</span>
                                        </small>
                                    </div>
                                </div>
                                <div class="w-full flex flex-row items-center gap-4">
                                    <div class="w-full">
                                        <label for="ends_atDate" class="flex items-center gap-[3px] text-[12px] mb-1">
                                            Data de Término
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="ends_atDateField" class="w-full">
                                            <date-picker :clearable="false" @change="handleEndsDateChange"
                                                :disabled-date="disabledEndsDate" :lang="langConfig"
                                                v-model:value="form.ends_at.date"
                                                class="responsive-datepicker"></date-picker>
                                        </div>
                                        <small class="text-xs text-red-500" :class="{ danger: errors.ends_at.show }">
                                            <span v-if="errors.ends_at.show">{{ errors.ends_at.message }}</span>
                                        </small>
                                    </div>
                                    <div class="w-full">
                                        <label for="ends_atHm" class="flex items-center gap-[3px] text-[12px] mb-1">
                                            Hora de Término
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="ends_atHmField" class="w-full">
                                            <date-picker ref="endsTimePickerRef" :clearable="false"
                                                @change="handleEndsTimeDateChange" v-model:value="form.ends_at.hm"
                                                format="HH:mm" type="time" class="responsive-datepicker"></date-picker>
                                        </div>
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.ends_time_at.show }">
                                            <span v-if="errors.ends_time_at.show">{{ errors.ends_time_at.message
                                            }}</span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end date and times information group form -->

                    <!--start tickets information group form -->
                    <div class="w-full mb-6 lg:p-6 bg-white lg:rounded-md shadow-md">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-medium text-[#0097ff]">5. Ingressos</h3>
                            </div>
                            <div class="form-group">
                                <div class="w-full mt-6 mb-12">
                                    <p class="ml-[22px] text-center text-[13px] text-gray-600">Que tipo de ingresso você
                                        deseja
                                        criar?
                                    </p>
                                </div>
                                <div id="ticketsField"
                                    class="flex mb-5 flex-col lg:flex-row w-full justify-center gap-4">
                                    <button
                                        class="border border-[#0097ff] text-[#0097ff] text-sm font-medium  uppercase rounded-full py-[10px] px-10 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                        @click="openBatchModal('premium')">
                                        + INGRESSO PAGO
                                    </button>
                                </div>
                                <div class="overflow-x-auto">
                                    <table v-if="form.batches.length"
                                        class="w-full border-collapse rounded-lg shadow-md overflow-hidden">
                                        <thead class="bg-gray-50 text-gray-700">
                                            <tr>
                                                <th class="px-4 py-3 text-left whitespace-nowrap">Tipo</th>
                                                <th
                                                    class="px-4 py-3 text-center text-sm whitespace-nowrap hidden sm:table-cell">
                                                    Quantidade</th>
                                                <th class="px-4 py-3 text-center text-sm whitespace-nowrap">Valor
                                                </th>
                                                <th
                                                    class="px-4 py-3 text-center text-sm whitespace-nowrap hidden md:table-cell">
                                                    Taxa</th>
                                                <th
                                                    class="px-4 py-3 text-center text-sm whitespace-nowrap hidden md:table-cell">
                                                    Repasse</th>
                                                <th
                                                    class="px-4 py-3 text-center text-sm whitespace-nowrap hidden lg:table-cell">
                                                    Visibilidade</th>
                                                <th class="px-4 py-3 text-center text-sm whitespace-nowrap">Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(batch, index) in form.batches" :key="batch.id"
                                                class="border-b hover:bg-gray-100 transition">
                                                <td class="px-4 text-sm py-3">{{ batch.name }}</td>
                                                <td class="px-4 py-3 text-center text-sm hidden sm:table-cell">
                                                    {{ batch.quantity }}</td>
                                                <td class="px-4 py-3 text-center text-sm">{{ formatAmount(batch.price)
                                                }}</td>
                                                <td class="px-4 py-3 text-center text-sm hidden md:table-cell">
                                                    4%</td>
                                                <td class="px-4 py-3 text-center text-sm hidden md:table-cell">
                                                    {{ formatAmount(calcularValorComTaxa(batch.price)) }}</td>
                                                <td class="px-4 py-3 text-center text-sm hidden lg:table-cell">{{
                                                    batch.visibility == 'public' ? 'Público' : 'Privado' }}</td>
                                                <td class="px-4 py-3 flex justify-center gap-2">
                                                    <button @click="openModalEditTicket(batch, index)"
                                                        class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                                        Editar
                                                    </button>
                                                    <button @click="deleteTicket(index, batch._id)"
                                                        class="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <small v-if="!form.batches.length" class="text-xs text-red-500"
                                    :class="{ danger: errors.batches.show }">
                                    <span v-if="errors.batches.show">
                                        {{ errors.batches.message }}
                                    </span>
                                </small>
                            </div>
                        </div>
                    </div>
                    <!--end tickets information group form -->

                    <!--start status information group form -->
                    <div class="px-5 lg:px-0 lg:pb-2 pb-[110px]">
                        <div class="row justify-space-between gap-1">
                            <div class="mb-4">
                                <strong style="position: relative; top: 1px;">Visibilidade do evento:</strong>
                                <div class="flex items-center gap-4">
                                    <label
                                        class="flex cursor-pointer text-sm items-center gap-1.5 mb-1 text-gray-600 font-medium reqility__label"
                                        style="vertical-align: baseline;">
                                        <input
                                            class="p-[10px] border !rounded-sm border-gray-300 h-[40px] scale-[1.3] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                            type="radio" v-model="form.visibility" value="public">
                                        Público
                                    </label>
                                    <label
                                        class="flex cursor-pointer text-sm items-center gap-1.5 mb-1 text-gray-600 font-medium reqility__label"
                                        style="vertical-align: baseline;">
                                        <input
                                            class="p-[10px] border !rounded-sm border-gray-300 h-[40px] scale-[1.3] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                            type="radio" v-model="form.visibility" value="private">
                                        Privado
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center gap-3">
                                    <button :disabled="loadingEvent || selectFileLoading" @click="createEvent('p')"
                                        class="btn disabled:bg-gray-300 disabled:text-gray-500 bg-brand-primary text-sm font-bold hover:opacity-80 py-2 px-4 text-white rounded-full">
                                        {{ loadingEvent ? 'Publicando...' : 'Publicar evento' }}
                                    </button>
                                    <button @click="router.back()"
                                        class="bg-brand-info disabled:bg-gray-300 disabled:text-gray-500 text-sm font-bold hover:opacity-80 text-white py-2 px-4 rounded-full">
                                        Voltar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end status information group form -->
                </div>
                <!--end new event form -->
            </div>
        </div>
        <!--end body -->
        <div class="fixed top-0 h-screen w-screen bg-gray-50"></div>
    </div>
</template>


<style>
/* Personalizando a borda e fundo */
.multiselect {
    border: 1px solid rgb(209 213 219 / 1) !important;
    /* Cor da borda */
    border-radius: 2px !important;
    /* Cantos arredondados */
    background-color: #fff !important;
    /* Fundo */
    font-size: 13px !important;
    box-shadow: none !important;
    height: 40px;
}

.mx-input-wrapper input {
    border: 1px solid rgb(209 213 219 / 1) !important;
    /* Cor da borda */
    border-radius: 2px !important;
    /* Cantos arredondados */
    background-color: #fff !important;
    /* Fundo */
    font-size: 13px !important;
    box-shadow: none !important;
    height: 40px;
}

/* Personalizando o texto e a seta */
.multiselect__single {
    color: rgb(75 85 99 /1) !important;
    font-size: 13px !important;
}

.multiselect__input {
    font-size: 13px !important;
}

.multiselect__select {
    color: #0097ff !important;
    /* Cor da seta */
}

/* Estilizando as opções do dropdown */
.multiselect__option {
    color: rgb(75 85 99 /1) !important;
    padding: 10px !important;
}

.multiselect__tags {
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
}

.multiselect__option--highlight {
    background: #0097ff !important;
    color: white !important;
}

.responsive-datepicker {
    width: 100% !important;
    /* Largura total por padrão */
}

/* Ajusta o container principal do DatePicker */
.mx-datepicker {
    width: 100% !important;
    max-width: 210px;
    /* Largura máxima em telas maiores */
}

/* Ajusta o input dentro do DatePicker */
.mx-input-wrapper input {
    width: 100% !important;
    border: 1px solid rgb(209 213 219 / 1) !important;
    border-radius: 2px !important;
    background-color: #fff !important;
    font-size: 13px !important;
    box-shadow: none !important;
    height: 40px;
}

/* Ajusta o popup do DatePicker em telas menores */
@media (max-width: 768px) {
    .mx-datepicker {
        max-width: 100% !important;
        /* Ocupa toda a largura em mobile */
    }

    .mx-datepicker-popup {
        width: 90vw !important;
        /* Largura relativa à viewport em mobile */
        max-width: 300px;
        /* Limite máximo para evitar overflow */
        left: 50% !important;
        transform: translateX(-50%) !important;
        /* Centraliza o popup */
    }
}

/* Garante que o layout não quebre em mobile */
@media (max-width: 640px) {
    .w-full.flex.flex-col.lg\\:flex-row {
        flex-direction: column !important;
    }
}
</style>