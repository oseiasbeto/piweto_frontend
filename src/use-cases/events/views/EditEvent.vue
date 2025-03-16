<script setup>
import DropzoneImage from "../components/ui/DropzoneImage.vue";
import PreviewImage from "../components/ui/PreviewImage.vue"
import { useStore } from "vuex"
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import Quill from 'quill';
import Swal from "sweetalert2"
import DatePicker from '@jobinsjp/vue3-datepicker';
import formatAmount from "@/utils/formatAmount";
import { toast } from "vue3-toastify"
import { useRouter, useRoute } from "vue-router";
import 'vue-multiselect/dist/vue-multiselect.css';
import { useEvents } from "@/repositories/events-repository";
import { useBatches } from "@/repositories/batches-repository";
import Multiselect from 'vue-multiselect'
import Spinner from "@/use-cases/checkout/components/ui/Spinner.vue";
import { useStaffs } from "@/repositories/staffs-repository";

const store = useStore()
const loadingGlobal = ref(true)
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
const { editEvent } = useEvents()
const { getEventById } = useEvents()
const { getBatches, deleteBatch } = useBatches()
const { getStaffs } = useStaffs()

const loadingEditEvent = ref(false)
loadingEditEvent.value = false
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


// Esta função computada tem como finalidade retornar os dados do corrente evento.
const user = computed(() => {
    return store.getters.currentUser
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

// esta funcao computada deve retornar os dados do formulario de criacao de um evento.
const form = computed(() => {
    return store.getters.eventForm
})

const disabledStartsDate = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

function calcularValorComTaxa(valor) {
    const taxa = 0.04; // 4% de taxa
    const valorComTaxa = valor * (1 - taxa);
    return valorComTaxa;
}

const disabledEndsDate = computed(() => {
    const today = new Date(form.value.starts_at.date ?? new Date());
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
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
}

// Esta função tem como finalidade eliminar um lote de ingressos através de um index específico.
function deleteTicket(index, batch_id) {
    Swal.fire({
        title: "Você tem certeza?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, eu tenho",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            store.dispatch("removeBatchFromBatches", index)
            Swal.fire({
                title: "Eliminado!",
                text: "O seu ingresso foi eliminado com sucesso.",
                icon: "success"
            })

            await deleteBatch(batch_id)
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
    form.value.file = null
    form.value.cover = {
        high: null,
        key: null,
        low: null,
        medium: null,
        original: null
    }
}

function openBatchModal(type) {
    store.dispatch("setModal", {
        name: "form-batch",
        show: true,
        data: {
            type,
            requestApi: true,
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
            requestApi: true,
            action: "edit"
        }
    })
}

// Esta função tem como finalidade emitir um evento de 'criação de evento' para o componente pai.
const createEvent = async (status) => {
    validateForm()
    if (hasError.value || loadingEditEvent.value) return
    else {
        loadingEditEvent.value = true
        const formatToISO = (dateString) => {
            return new Date(dateString).toISOString();
        };

        function createEventFormData(eventForm) {
            const formData = new FormData();

            formData.append("_id", eventForm._id || "");
            formData.append("name", eventForm.name || "");
            formData.append("cover", JSON.stringify(eventForm.cover));
            formData.append("category", eventForm.category || "");
            formData.append("description", eventForm.description || "");
            formData.append("status", String(eventForm.status || "pending"));
            formData.append("visibility", eventForm.visibility || "public");
            formData.append("nameclature", eventForm.nameclature || "ticket");
            formData.append("type", "presencial");
            formData.append("showOnMap", String(eventForm.showOnMap));

            if (eventForm.file) {
                formData.append("file", eventForm.file);
            }

            // ✅ Corrigindo starts_at e ends_at
            formData.append("starts_at[date]", formatToISO(eventForm.starts_at.date) || "");
            formData.append("starts_at[hm]", formatToISO(eventForm.starts_at.hm) || "");
            formData.append("ends_at[date]", formatToISO(eventForm.ends_at.date) || "");
            formData.append("ends_at[hm]", formatToISO(eventForm.ends_at.hm) || "");

            // ✅ Corrigindo address
            Object.keys(eventForm.address).forEach(key => {
                formData.append(`address[${key}]`, eventForm.address[key] || "");
            });

            // ✅ Corrigindo batches (se houver)
            if (Array.isArray(eventForm.batches) && eventForm.batches.length > 0) {
                eventForm.batches.forEach((batch, index) => {
                    formData.append(`batches[${index}][name]`, batch.name);
                    formData.append(`batches[${index}][type]`, batch.type);
                    formData.append(`batches[${index}][nomenclature]`, batch.nomenclature);
                    formData.append(`batches[${index}][available_tickets]`, batch.available_tickets);
                    formData.append(`batches[${index}][description]`, batch.description);
                    formData.append(`batches[${index}][visibility]`, batch.visibility);
                    formData.append(`batches[${index}][quantity]`, batch.quantity ? Number(batch.quantity) : 0);
                    formData.append(`batches[${index}][price]`, batch.price ? Number(batch.price) : 0);
                    formData.append(`batches[${index}][starts_at.date]`, formatToISO(batch.starts_at?.date));
                    formData.append(`batches[${index}][starts_at.hm]`, formatToISO(batch.starts_at?.hm));
                    formData.append(`batches[${index}][ends_at.date]`, formatToISO(batch.ends_at?.date));
                    formData.append(`batches[${index}][ends_at.hm]`, formatToISO(batch.ends_at?.hm));
                    formData.append(`batches[${index}][quantity_for_purchase.min]`, batch.quantity_for_purchase?.min ? Number(batch.quantity_for_purchase.min) : 1);
                    formData.append(`batches[${index}][quantity_for_purchase.max]`, batch.quantity_for_purchase?.max ? Number(batch.quantity_for_purchase.max) : 1);
                });
            }

            return formData;
        }

        form.value.status = status
        const formData = createEventFormData(form.value)

        await editEvent(formData).then(async () => {
            toast('Evento editado com sucesso!', {
                theme: "colored",
                position: "top-right",
                autoClose: 2500,
                type: 'success'
            })

            await getStaffs({
                page: 1,
                limit: 10,
                member: user?.value?._id
            }).then((res) => {
                const data = res?.data?.staffs;
                const metadata = res?.data?.metadata;
                store.dispatch("setMyEvents", {
                    data,
                    metadata,
                    hasViewed: true
                })
                toast('Evento eliminado com sucesso!', {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2500,
                    type: 'success'
                })

                loadingEditEvent.value = false
                router.replace(`/eventos/meus-eventos`)
            })
        })
            .catch(() => {
                loadingEditEvent.value = false
            })
    }
}

function removeAllHTML(html) {
    // Cria um elemento div temporário para manipular o HTML
    const div = document.createElement('div');
    div.innerHTML = html;

    // Função recursiva para remover todas as tags e atributos
    function removeTagsAndAttributes(node) {
        // Remove todos os atributos do nó atual
        while (node.attributes && node.attributes.length > 0) {
            node.removeAttribute(node.attributes[0].name);
        }

        // Processa todos os nós filhos
        Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                // Se for um elemento, chama a função recursivamente
                removeTagsAndAttributes(child);
            }
        });

        // Se o nó não for um nó de texto e tiver um parentNode, substitui por seu conteúdo interno
        if (node.nodeType !== Node.TEXT_NODE && node.parentNode) {
            const fragment = document.createDocumentFragment();
            while (node.firstChild) {
                fragment.appendChild(node.firstChild);
            }
            node.parentNode.replaceChild(fragment, node);
        }
    }

    // Inicia a remoção de tags e atributos a partir do div
    removeTagsAndAttributes(div);

    // Retorna o conteúdo do div sem as tags HTML
    return div.innerHTML;
}

onMounted(async () => {
    const id = route.params.id;

    await getEventById(id).then(async (res) => {
        const event = res;

        // Converte as datas para objetos Date
        event.starts_at.date = new Date(event.starts_at.date);
        event.ends_at.date = new Date(event.ends_at.date);
        event.starts_at.hm = new Date(event.starts_at.hm);
        event.ends_at.hm = new Date(event.ends_at.hm);

        // Define o formulário com os dados do evento
        store.dispatch("setEventForm", event);

        await getBatches({
            event: event._id,
            page: 1,
            limit: 10,
        }).then((res) => {
            const batches = res.data.batches;
            store.dispatch("setBatchFromBatches", batches);
            loadingGlobal.value = false;

            // Usar nextTick para garantir que o DOM esteja pronto
            nextTick(() => {
                if (editorContainer.value) {
                    // Inicializa o Quill
                    quillInstance = new Quill(editorContainer.value, {
                        theme: 'snow',
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

                    // Define o conteúdo do Quill com o valor de event.description
                    if (event.description) {
                        const cleanDescription = removeAllHTML(event.description);

                        // Define o conteúdo como texto puro
                        quillInstance.setText(cleanDescription);
                    }

                    // Monitora as mudanças no editor
                    quillInstance.on('text-change', () => {
                        form.value.description = quillInstance.root.innerHTML;
                        if (quillInstance.root.innerHTML === "" || quillInstance.root.innerHTML === '<p><br></p>') {
                            errors.value.description.show = true;
                        } else {
                            errors.value.description.show = false;
                        }
                    });
                } else {
                    console.error("Editor container not found!");
                }
            });
        });
    });
});

onBeforeUnmount(() => {
    if (quillInstance) {
        quillInstance = null;
    }
});
</script>


<template>
    <div>
        <div v-if="!loadingGlobal" class="min-h-screen">
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
                                    <p class="ml-[22px] text-sm text-gray-500">Adicione as principais informações do
                                        evento.
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
                                        <div class="w-full md:w-auto">
                                            <DropzoneImage @drop.prevent="dropCover" @change="selectCover"
                                                v-if="!form.file && !form?.cover?.low" />
                                            <PreviewImage :createUrl="!form.file && form?.cover?.low ? false : true"
                                                v-else :image="form?.file || form?.cover?.low" />
                                        </div>
                                        <div class="w-full md:w-auto">
                                            <div class="flex gap-3 mb-3 items-center"
                                                v-if="form?.file || form?.cover?.low">
                                                <label
                                                    class="border cursor-pointer border-[#0097ff] text-[#0097ff] text-[10px] font-medium  uppercase rounded-full py-[6px] px-3 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                                    for="changeCover">
                                                    Trocar de imagem
                                                    <input
                                                        class="p-[10px] border !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                                        @change="selectCover" id="changeCover" type="file"
                                                        accept="image/*" style="display: none">
                                                </label>
                                                <button
                                                    class="border cursor-pointer border-[#0097ff] text-[#0097ff] text-[10px] font-medium  uppercase rounded-full py-[6px] px-3 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                                    @click="replaceCover">Remover</button>
                                            </div>
                                            <p class="text-sm text-gray-500">A dimensão recomendada é de <strong>1600 x
                                                    838</strong><br>(mesma proporção do formato utilizado nas páginas de
                                                evento
                                                no
                                                <b>Facebook</b>).<br>Formato <strong>JPEG, GIF ou PNG de no máximo
                                                    2MB.</strong><br>Imagens
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
                                        placeholder="Selecione a categoria" v-model="form.category"
                                        :options="categories">
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
                                    <h3 class="text-xl mb-1 font-medium text-[#0097ff]">2. Onde o seu evento vai
                                        acontecer?
                                    </h3>
                                </div>
                                <!--start address-->
                                <div>
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
                            </div>
                        </div>
                        <!--start description group form -->
                        <div class="w-full mb-6 lg:p-6 bg-white lg:rounded-md shadow-md">
                            <div class="py-4 px-4 lg:py-0 lg:px-0">
                                <div class="mb-4">
                                    <h3 class="text-xl mb-1 font-medium text-[#0097ff]">3. Descrição do evento</h3>
                                    <p class="ml-[22px] text-sm text-gray-500">Conte todos os detalhes do seu evento,
                                        como a
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
                                    <p class="ml-[22px] text-sm text-gray-500">Informe aos participantes quando seu
                                        evento
                                        vai
                                        acontecer.
                                    </p>
                                </div>
                                <div>
                                    <div class="w-full lg:w-[50%] flex flex-col lg:flex-row items-center gap-4">
                                        <div class="w-full">
                                            <label for="starts_atDate"
                                                class="flex items-center gap-[3px] text-[12px] mb-1">
                                                Data de Início
                                                <span
                                                    class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                            </label>

                                            <div id="starts_atDateField" class="w-full md:w-[210px]">
                                                <date-picker :clearable="false" @change="handleStartsDateChange"
                                                    :disabled-date="disabledStartsDate" :lang="langConfig"
                                                    v-model:value="form.starts_at.date"></date-picker>
                                            </div>


                                            <small class="text-xs text-red-500"
                                                :class="{ danger: errors.starts_at.show }">
                                                <span v-if="errors.starts_at.show">
                                                    {{ errors.starts_at.message }}
                                                </span>
                                            </small>
                                        </div>
                                        <div class="w-full">
                                            <label for="Starts_atHm"
                                                class="flex items-center gap-[3px] text-[12px] mb-1">
                                                Hora de Início
                                                <span
                                                    class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                            </label>

                                            <div id="starts_atHmField" class="w-full md:w-[210px]">
                                                <date-picker :clearable="false" @change="handleStartsTimeDateChange"
                                                    v-model:value="form.starts_at.hm" format="HH:mm"
                                                    type="time"></date-picker>
                                            </div>


                                            <small class="text-xs text-red-500"
                                                :class="{ danger: errors.starts_time_At.show }">
                                                <span v-if="errors.starts_time_At.show">
                                                    {{ errors.starts_time_At.message }}
                                                </span>
                                            </small>
                                        </div>
                                    </div>
                                    <div class="w-full lg:w-[50%] flex flex-col lg:flex-row items-center gap-4">
                                        <div class="w-full">
                                            <label for="ends_atDate"
                                                class="flex items-center gap-[3px] text-[12px] mb-1">
                                                Data de Término
                                                <span
                                                    class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                            </label>

                                            <div id="ends_atDateField" class="w-full md:w-[210px]">
                                                <date-picker :clearable="false" @change="handleEndsDateChange"
                                                    :disabled-date="disabledEndsDate" :lang="langConfig"
                                                    v-model:value="form.ends_at.date"></date-picker>
                                            </div>


                                            <small class="text-xs text-red-500"
                                                :class="{ danger: errors.ends_at.show }">
                                                <span v-if="errors.ends_at.show">
                                                    {{ errors.ends_at.message }}
                                                </span>
                                            </small>
                                        </div>
                                        <div class="w-full">
                                            <label for="exitTimeHm"
                                                class="flex items-center gap-[3px] text-[12px] mb-1">
                                                Hora de Término
                                                <span
                                                    class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                            </label>

                                            <div id="ends_atHmField" class="w-full md:w-[210px]">
                                                <date-picker :clearable="false" @change="handleEndsTimeDateChange"
                                                    v-model:value="form.ends_at.hm" format="HH:mm"
                                                    type="time"></date-picker>
                                            </div>


                                            <small class="text-xs text-red-500"
                                                :class="{ danger: errors.ends_time_at.show }">
                                                <span v-if="errors.ends_time_at.show">
                                                    {{ errors.ends_time_at.message }}
                                                </span>
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
                                        <p class="ml-[22px] text-center text-[13px] text-gray-600">Que tipo de ingresso
                                            você
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
                                                    <td class="px-4 py-3 text-center text-sm">{{
                                                        formatAmount(batch.price) }}</td>
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
                                        <button :disabled="loadingEditEvent" @click="createEvent('p')"
                                            class="btn disabled:bg-gray-300 disabled:text-gray-500 bg-brand-primary text-sm font-bold hover:opacity-80 py-2 px-4 text-white rounded-full">
                                            {{ loadingEditEvent ? 'Editando...' : 'Editar evento' }}
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
        <div v-else>
            <div class="flex justify-center items-center h-[500px]">
                <Spinner />
            </div>
        </div>
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
</style>