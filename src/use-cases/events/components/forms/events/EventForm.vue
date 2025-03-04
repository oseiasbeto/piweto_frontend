<script setup>
import DropzoneImage from "../../ui/DropzoneImage.vue";
import PreviewImage from "../../ui/PreviewImage.vue"
import { useStore } from "vuex"
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Quill from 'quill';
import { toast } from "vue3-toastify"
import Swal from "sweetalert2"
import DatePicker from '@jobinsjp/vue3-datepicker';
import { useRouter } from "vue-router";
import { useEvents } from "@/repositories/events-repository";
import Multiselect from 'vue-multiselect'
const store = useStore()
const categories = ref([
    'Festas & Shows',
    'Teatro & Espetaculos',
    'Familia',
    'Tom Cook',
    'Tanya Fox',
    'Hellen Schmidt'
])
const hasError = ref(true)
const { newEvent, loading: loadingEvent } = useEvents()
const router = useRouter()

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
    title: {
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
    startsAt: {
        show: false,
        message: ""
    },
    endsAt: {
        show: false,
        message: ""
    },
    startsTimeAt: {
        show: false,
        message: ""
    },
    endsTimeAt: {
        show: false,
        message: ""
    }
})

// esta funcao computada deve retornar os dados do formulario de criacao de um evento.
const form = computed(() => {
    return store.getters.eventForm
})

const disabledStartsDate = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

const disabledEndsDate = computed(() => {
    const today = new Date(form.value.startsAt.date ?? new Date());
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

// Esta função tem como finalidade validar o formulário da criação do evento.
function validateForm() {
    if (form.value.title == '') {
        errors.value.title = {
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
    else if (props.type == 'presencial' && form.value.address.location == "") {
        errors.value.address.location = {
            show: true,
            message: "Informe o nome do local do seu evento."
        }
        const fieldToScroll = document.querySelector("#locationField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (!form.value.showOnMap && props.type == 'presencial' && form.value.address.street == "") {
        errors.value.address.street = {
            show: true,
            message: "Informe a Av/Rua onde será realizado o seu evento."
        }
        const fieldToScroll = document.querySelector("#streetField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (!form.value.showOnMap && props.type == 'presencial' && form.value.address.neighborhood == "") {
        errors.value.address.neighborhood = {
            show: true,
            message: "Informe o bairro onde será realizado o seu evento."
        }
        const fieldToScroll = document.querySelector("#neighborhoodField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (!form.value.showOnMap && props.type == 'presencial' && form.value.address.city == "") {
        errors.value.address.city = {
            show: true,
            message: "Informe a cidade onde será realizado o seu evento."
        }
        const fieldToScroll = document.querySelector("#cityField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (!form.value.showOnMap && props.type == 'online' && form.value.meeting.url == "") {
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
    else if (form.value.startsAt.date == null) {
        errors.value.startsAt = {
            show: true,
            message: "Informe a data de Início do seu evento."
        }
        const fieldToScroll = document.querySelector("#startsAtDateField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.startsAt.hm == null) {
        errors.value.startsTimeAt = {
            show: true,
            message: "Informe o horario de Início do seu evento."
        }
        const fieldToScroll = document.querySelector("#startsAtHmField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.endsAt.date == null) {
        errors.value.endsAt = {
            show: true,
            message: "Informe a data de término do seu evento."
        }
        const fieldToScroll = document.querySelector("#endsAtDateField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (form.value.endsAt.hm == null) {
        errors.value.endsTimeAt = {
            show: true,
            message: "Informe o horario de término do seu evento."
        }
        const fieldToScroll = document.querySelector("#endsAtHmField")
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
    errors.value.startsAt = {
        show: false,
        message: ""
    }
}
function handleEndsDateChange() {
    errors.value.endsAt = {
        show: false,
        message: ""
    }
}

function handleStartsTimeDateChange(e) {
    errors.value.startsTimeAt = {
        show: false,
        message: ""
    }
}
function handleEndsTimeDateChange(e) {
    errors.value.endsTimeAt = {
        show: false,
        message: ""
    }
}

// Esta função tem como finalidade eliminar um lote de ingressos através de um index específico.
function deleteTicket(index) {
    Swal.fire({
        title: "Você tem certeza?",
        text: "you won't able revert this!",
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
function validateCover(file) {
    const allowedTypes = ['image/jpg',
        'image/png',
        'image/jpeg'];
    const MAX_SIZE = 5 * 1024 * 1024;
    const sizeOk = file.size < MAX_SIZE;
    const typeOk = allowedTypes.includes(file.type)

    if (typeOk && sizeOk) {
        form.value.file = file;
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

// Esta função tem como finalidade remover a imagem selecionada.
function replaceCover() {
    store.state.dashboard.eventForm.file = null
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
const createEvent = (status) => {
    validateForm()
    if (hasError.value) return
    else {
        console.log(form.value)
        newEvent({
            ...form.value,
            status,
            type: props.type
        }).then(() => {
            router.push(`/gerenciador-de-eventos/pagina-inicial/${currentEvent.value.id}`)
        })
    }
}

onMounted(() => {
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
        console.log(form.value.description)
    });
});
onBeforeUnmount(() => {
    if (quillInstance) {
        quillInstance = null;
    }
});
</script>

<template>
    <!--start new event form -->
    <div>
        <!--start basics information group form -->
        <div class="flex flex-col">
            <div class="mb-4">
                <h3>1. Informações básicas</h3>
                <p>Adicione as principais informações do evento.</p>
            </div>
            <div class="flex flex-col">
                <label class="flex flex-row gap-1" for="titleField">
                    Titulo do evento

                    <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                </label>
                <input @input="form.title != '' ? errors.title.show = false : errors.title.show = true" id="titleField"
                    type="text" v-model="form.title" :class="{ 'form-danger': errors.title.show }">
                <small class="feedback" :class="{ danger: errors.title.show }">
                    <small v-if="errors.title.show">
                        {{ errors.title.message }}
                    </small>
                </small>
            </div>
            <div class="form-group mt-4 mb-5">
                <label class="flex flex-row gap-1">
                    Imagem de divulgação (opcional)</label>
                <div class="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mt-2">
                    <div class="w-full md:w-auto">
                        <DropzoneImage @drop.prevent="dropCover" @change="selectCover" v-if="!form.file" />
                        <PreviewImage v-else :image="form.file" />
                    </div>
                    <div class="w-full md:w-auto">
                        <div class="flex gap-3 mb-3 items-center" v-if="form.file">
                            <label for="changeCover">
                                Trocar de imagem
                                <input @change="selectCover" id="changeCover" type="file" accept="images/*"
                                    style="display: none">
                            </label>
                            <button @click="replaceCover">Remover</button>
                        </div>
                        <p class="text-sm text-gray-500">A dimensão recomendada é de <strong>1600 x
                                838</strong><br>(mesma proporção do formato utilizado nas páginas de evento no
                            <b>Facebook</b>).<br>Formato <strong>JPEG, GIF ou PNG de no máximo 2MB.</strong><br>Imagens
                            com dimensões diferentes serão redimensionadas.
                        </p>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="flex flex-row gap-1">
                    Categoria
                    <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                </label>

                <multiselect id="categoryField" placeholder="Selecione a categoria" v-model="form.category"
                    :options="categories">
                </multiselect>

                <small class="feedback" :class="{ danger: errors.category.show }">
                    <span v-if="errors.category.show">
                        {{ errors.category.message }}
                    </span>
                </small>
            </div>
            <!--start address-->
            <div v-if="props.type == 'presencial'">
                <div>
                    <div class="form-group">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1">
                            Nome do Local
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <input id="locationField"
                            @input="form.address.location != '' ? errors.address.location.show = false : errors.address.location.show = true"
                            v-model="form.address.location" maxlength="100" type="text" placeholder="Endereço"
                            :class="{ 'form-danger': errors.address.location.show }">
                        <small class="feedback" :class="{ danger: errors.address.location.show }">
                            <span v-if="errors.address.location.show">
                                {{ errors.address.location.message }}
                            </span>
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1">
                            Av./Rua</label>
                        <input id="streetField"
                            @input="form.address.street != '' ? errors.address.street.show = false : errors.address.street.show = true"
                            v-model="form.address.street" maxlength="100" type="text"
                            :class="{ 'form-danger': errors.address.street.show && !form.showOnMap }"
                            :readonly="form.showOnMap">
                        <small class="feedback" :class="{ danger: errors.address.street.show && !form.showOnMap }">
                            <span v-if="!form.showOnMap && errors.address.street.show">
                                {{ errors.address.street.message }}
                            </span>
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="text-[12px] mb-1 text-gray-600 text-bold">
                            Número</label>
                        <input v-model="form.address.number" maxlength="100" type="text">
                    </div>
                    <div class="form-group">
                        <label class="text-[12px] mb-1 text-gray-600 text-bold">
                            Complemento</label>
                        <input v-model="form.address.complement" maxlength="100" type="text">
                    </div>
                    <div class="form-group">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1">
                            Bairro</label>
                        <input
                            @input="form.address.neighborhood != '' ? errors.address.neighborhood.show = false : errors.address.neighborhood.show = true"
                            id="neighborhoodField" v-model="form.address.neighborhood" maxlength="100" type="text"
                            :class="{ 'form-danger': errors.address.neighborhood.show && !form.showOnMap }"
                            :readonly="form.showOnMap">
                        <small class="feedback"
                            :class="{ danger: errors.address.neighborhood.show && !form.showOnMap }">
                            <span v-if="!form.showOnMap && errors.address.neighborhood.show">
                                {{ errors.address.neighborhood.message }}
                            </span>
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1">
                            Cidade</label>
                        <input
                            @input="form.address.city != '' ? errors.address.city.show = false : errors.address.city.show = true"
                            id="cityField" v-model="form.address.city" maxlength="100" type="text"
                            :class="{ 'form-danger': errors.address.city.show && !form.showOnMap }"
                            :readonly="form.showOnMap">
                        <small class="feedback" :class="{ danger: errors.address.city.show && !form.showOnMap }">
                            <span v-if="!form.showOnMap && errors.address.city.show">
                                {{ errors.address.city.message }}
                            </span>
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1">
                            Estado</label>
                        <input maxlength="100" type="text" value="Angola" readonly>
                    </div>
                    <div class="form-group">
                        <label for="viewMap" class="flex items-center gap-[3px] text-[12px] mb-1">
                            Mostrar no mapa</label>
                        <input v-model="form.showOnMap" id="viewMap" maxlength="100" type="checkbox">
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
                    <input v-model="form.meeting.url" maxlength="100" type="text" placeholder="Link"
                        :class="{ 'form-danger': errors.meeting.url.show }">
                    <small class="feedback" :class="{ danger: errors.meeting.url.show }">
                        <span v-if="errors.meeting.show">
                            {{ errors.meeting.url.message }}
                        </span>
                    </small>
                </div>
            </div>
            <!--end link meet-->
        </div>
        <!--end basics information group form -->

        <!--start description group form -->
        <div>
            <div class="mb-4">
                <h3>3. Descrição do evento</h3>
                <p>Conte todos os detalhes do seu evento, como a programação e
                    os
                    diferenciais da sua produção!</p>
            </div>
            <div class="form-group">
                <div id="descriptionField" ref="editorContainer" style="height: 300px; border: 1px solid #d1d5db;">
                </div>
                <small class="feedback" :class="{ danger: errors.description.show }">
                    <span v-if="errors.description.show">
                        {{ errors.description.message }}
                    </span>
                </small>
            </div>
        </div>
        <!--end description group form -->

        <!--start date and times information group form -->
        <div>
            <div class="mb-4">
                <h3>4. Data e horário</h3>
                <p>Informe aos participantes quando seu evento vai acontecer.
                </p>
            </div>
            <div>
                <div class="w-full lg:w-[50%] flex flex-col lg:flex-row items-center gap-4">
                    <div class="w-full">
                        <label for="startsAtDate" class="flex items-center gap-[3px] text-[12px] mb-1">
                            Data de Início
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>

                        <div id="startsAtDateField" class="w-full md:w-[210px]">
                            <date-picker :clearable="false" @change="handleStartsDateChange"
                                :disabled-date="disabledStartsDate" :lang="langConfig"
                                v-model:value="form.startsAt.date"></date-picker>
                        </div>


                        <small class="feedback" :class="{ danger: errors.startsAt.show }">
                            <span v-if="errors.startsAt.show">
                                {{ errors.startsAt.message }}
                            </span>
                        </small>
                    </div>
                    <div class="w-full">
                        <label for="StartsAtHm" class="flex items-center gap-[3px] text-[12px] mb-1">
                            Hora de Início
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>

                        <div id="startsAtHmField" class="w-full md:w-[210px]">
                            <date-picker :clearable="false" @change="handleStartsTimeDateChange"
                                v-model:value="form.startsAt.hm" format="HH:mm" type="time"></date-picker>
                        </div>


                        <small class="feedback" :class="{ danger: errors.startsTimeAt.show }">
                            <span v-if="errors.startsTimeAt.show">
                                {{ errors.startsTimeAt.message }}
                            </span>
                        </small>
                    </div>
                </div>
                <div class="w-full lg:w-[50%] flex flex-col lg:flex-row items-center gap-4">
                    <div class="w-full">
                        <label for="endsAtDate" class="flex items-center gap-[3px] text-[12px] mb-1">
                            Data de Término
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>

                        <div id="endsAtDateField" class="w-full md:w-[210px]">
                            <date-picker :clearable="false" @change="handleEndsDateChange"
                                :disabled-date="disabledEndsDate" :lang="langConfig"
                                v-model:value="form.endsAt.date"></date-picker>
                        </div>


                        <small class="feedback" :class="{ danger: errors.endsAt.show }">
                            <span v-if="errors.endsAt.show">
                                {{ errors.endsAt.message }}
                            </span>
                        </small>
                    </div>
                    <div class="w-full">
                        <label for="exitTimeHm" class="flex items-center gap-[3px] text-[12px] mb-1">
                            Hora de Término
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>

                        <div id="endsAtHmField" class="w-full md:w-[210px]">
                            <date-picker :clearable="false" @change="handleEndsTimeDateChange"
                                v-model:value="form.endsAt.hm" format="HH:mm" type="time"></date-picker>
                        </div>


                        <small class="feedback" :class="{ danger: errors.endsTimeAt.show }">
                            <span v-if="errors.endsTimeAt.show">
                                {{ errors.endsTimeAt.message }}
                            </span>
                        </small>
                    </div>
                </div>
            </div>
        </div>
        <!--end date and times information group form -->

        <!--start tickets information group form -->
        <div>
            <div class="mb-4">
                <h3>5. Ingressos</h3>
            </div>
            <div class="form-group">
                <div class="w-full mt-6 mb-12">
                    <p class="ml-[22px] text-center text-[15px] text-gray-600">Que tipo de ingresso você deseja criar?
                    </p>
                </div>
                <div id="ticketsField" class="flex flex-col lg:flex-row w-full justify-center gap-4">
                    <button @click="openBatchModal('premium')">
                        + INGRESSO PAGO
                    </button>
                    <button @click="openBatchModal('free')">
                        + INGRESSO GRÁTIS
                    </button>
                </div>
                <table v-if="form.batches.length">
                    <thead>
                        <tr>
                            <th class="width-100 order-column">
                                Tipo
                            </th>
                            <th class="width-120">
                                Vendidos/Total
                            </th>
                            <th class="width-120">
                                Valor
                            </th>
                            <th class="width-50 order-column">
                                Taixa
                            </th>
                            <th class="width-90 order-column">
                                Preço total
                            </th>
                            <th class="width-50 order-column">
                                Visibilidade do ingresso
                            </th>
                            <th class="width-100">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(batch, index) in form.batches" :key="batch.id">
                            <td>
                                {{ batch.title }}
                            </td>
                            <td>
                                0/{{ batch.quantity }}
                            </td>
                            <td>
                                {{ batch.price }}
                            </td>
                            <td>
                                {{ batch.price }}
                            </td>
                            <td>
                                {{ batch.price }}
                            </td>
                            <td>
                                {{ batch.visibility }}
                            </td>
                            <td>
                                <button @click="openModalEditTicket(batch, index)">Editar</button>
                                <button @click="deleteTicket(index)">Excluir</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <small v-if="!form.batches.length" class="feedback" :class="{ danger: errors.batches.show }">
                    <span v-if="errors.batches.show">
                        {{ errors.batches.message }}
                    </span>
                </small>
            </div>
            <div class="row justify-space-between gap-1 align-center">
                <div class="col">
                    <div class="form-group">
                        <label class="text-[12px] mb-1 text-gray-600 text-bold">
                            Configuração da taxia</label>
                        <div class="row gap-1">

                            <span class="text">Absorver a taxa de serviço</span>
                        </div>

                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1 text-gray-600 font-medium required">
                            Nomeclatura</label>
                        <multiselect placeholder="Selecione a categoria" v-model="form.nameclature"
                            :options="nameclatures">
                        </multiselect>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-space-between gap-1 align-center">
            <div class="col">
                <div class="form-group">
                    <label class="text-[12px] mb-1 text-gray-600 text-bold">
                        Configuração da taxia</label>
                    <div class="row gap-1">

                        <span class="text">Absorver a taxa de serviço</span>
                    </div>

                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label class="flex items-center gap-[3px] text-[12px] mb-1 text-gray-600 font-medium required">
                        Nomeclature</label>

                </div>
            </div>
        </div>
        <!--end tickets information group form -->

        <!--start status information group form -->
        <div class="create-event-definition">
            <div class="row justify-space-between gap-1">
                <div class="col">
                    <strong style="position: relative; top: 1px;">Visibilidade do evento:</strong>
                    <div class="form-group">
                        <label class="visibility__label" style="vertical-align: baseline;">
                            <input type="radio" v-model="form.visibility" value="public">
                            Público
                        </label>
                        <label class="visibility__label" style="vertical-align: baseline;">
                            <input type="radio" v-model="form.visibility" value="private">
                            Privado
                        </label>
                    </div>
                </div>
                <div class="col">
                    <div class="row gap-1">
                        <button @click="createEvent('publish')" class="btn btn-yellow rounded">Publicar evento</button>
                        <button class="btn btn-primary-outline rounded">Pré visualizar</button>
                        <button @click="createEvent('draft')" class="btn btn-primary-outline rounded">Salvar como
                            rascunho</button>
                    </div>
                </div>
            </div>
        </div>
        <!--end status information group form -->
    </div>
    <!--end new event form -->
</template>