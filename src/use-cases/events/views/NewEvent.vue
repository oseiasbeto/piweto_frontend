<script setup>
import DropzoneImage from "../components/ui/DropzoneImage.vue";
import PreviewImage from "../components/ui/PreviewImage.vue"
import { useStore } from "vuex"
import { ref, computed, nextTick, onMounted, watch, onBeforeUnmount } from 'vue'
import Quill from 'quill';
import Swal from "sweetalert2"
import formatAmount from "@/utils/formatAmount";
import DatePicker from '@jobinsjp/vue3-datepicker';
import { useRouter, onBeforeRouteLeave, useRoute } from "vue-router";
import { useEvents } from "@/repositories/events-repository";
import { toast } from "vue3-toastify"
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
} from '@headlessui/vue'

const { newEvent, loading: loadingEvent } = useEvents()
const store = useStore()

const categories = [
    { name: 'Festas & Shows', value: 'Festas & Shows' },
    { name: 'Teatro & Espetáculos', value: 'Teatro & Espetáculos' },
    { name: 'Família', value: 'Família' },
    { name: 'Esportes', value: 'Esportes' },
    { name: 'Gastronomia', value: 'Gastronomia' },
    { name: 'Palestras & Workshops', value: 'Palestras & Workshops' },
    { name: 'Festivais', value: 'festivais' },
    { name: 'Eventos Corporativos', value: 'eventos-corporativos' },
    { name: 'Feiras & Exposições', value: 'feiras-expositions' },
    { name: 'Religião & Espiritualidade', value: 'religiao-espiritualidade' },
    { name: 'Cultura & Arte', value: 'cultura-arte' },
    { name: 'Música', value: 'música' },
    { name: 'Cinema & Audiovisual', value: 'cinema-audiovisual' },
    { name: 'Bem-estar & Saúde', value: 'bem-estar-saúde' },
    { name: 'Tecnologia & Startups', value: 'tecnologia-start-ups' }
];

const angolanProvinces = [
    { name: 'Bengo', value: 'bengo' },
    { name: 'Benguela', value: 'benguela' },
    { name: 'Bié', value: 'bie' },
    { name: 'Cabinda', value: 'cabinda' },
    { name: 'Cuando Cubango', value: 'cuando-cubango' },
    { name: 'Cuanza Norte', value: 'cuanza-norte' },
    { name: 'Cuanza Sul', value: 'cuanza-sul' },
    { name: 'Cunene', value: 'cunene' },
    { name: 'Huambo', value: 'huambo' },
    { name: 'Huíla', value: 'huila' },
    { name: 'Luanda', value: 'luanda' },
    { name: 'Lunda Norte', value: 'lunda-norte' },
    { name: 'Lunda Sul', value: 'lunda-sul' },
    { name: 'Malanje', value: 'malanje' },
    { name: 'Moxico', value: 'moxico' },
    { name: 'Namibe', value: 'namibe' },
    { name: 'Uíge', value: 'uige' },
    { name: 'Zaire', value: 'zaire' }
];

const hasError = ref(true)

loadingEvent.value = false

const isCreatedEvent = ref(false)

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

const eventTypeText = computed(() => {
    const textMap = {
        presencial: 'Onde o seu evento vai acontecer?',
        online: 'Qual é o link de acesso para sua transmissão?'
    };

    const text = textMap[type.value] || 'Configure seu evento';
    return text;
})

const publicText = ref(`Se você definir o seu evento como público,
       ele poderá aparecer em buscadores da internet (como Google, Bing, Yahoo),
      na ferramenta de busca da Piweto (disponível em nossa home) e poderá ser recomendado
      pelo nosso site, através de nossos newsletter ou posts nas redes sociais.
      Caso o seu evento seja exclusivo, marque-o como privado.`)

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
        },
        province: {
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
    },
    terms: {
        show: false,
        message: "Você precisa aceitar os termos para publicar o evento."
    }
})

const dropzoneRef = ref(null);

// esta funcao computada deve retornar os dados do formulario de criacao de um evento.
const form = computed(() => {
    return store.getters.eventForm
})

const selectedProvinceName = computed(() => {
    if (!form.value.address?.province) return 'Selecione uma província';
    const province = angolanProvinces.find(p => p.value === form.value.address.province);
    return province ? province.name : 'Selecione uma província';
});

// Adicione este computed junto com os outros:
const selectedCategoryName = computed(() => {
    if (!form.value.category) return 'Selecione uma categoria';
    const category = categories.find(c => c.value === form.value.category);
    return category ? category.name : 'Selecione uma categoria';
});

const cover = ref(null)

// Função para inicializar as datas sem segundos
function initializeDateTime() {
    // Define a data/hora atual para início (com 30 minutos de margem)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2);
    now.setSeconds(0, 0);

    // Define a data/hora para término (2 dias depois, mesmo horário)
    const twoDaysLater = new Date(now);
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    twoDaysLater.setHours(now.getHours(), now.getMinutes(), 0, 0);

    // Inicializa os valores se estiverem vazios
    if (!form.value.starts_at?.date) {
        form.value.starts_at.date = now;
        form.value.starts_at.hm = now;
    }

    if (!form.value.ends_at?.date) {
        form.value.ends_at.date = twoDaysLater;
        form.value.ends_at.hm = twoDaysLater;
    }
}

const disabledStartsDate = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

// Função para desabilitar horas e minutos para o início
function disabledStartsTime(date) {
    if (!date) return false;

    const now = new Date();
    const selectedDate = new Date(date);

    // Se for hoje, desabilita horários passados
    if (selectedDate.toDateString() === now.toDateString()) {
        const selectedHours = selectedDate.getHours();
        const selectedMinutes = selectedDate.getMinutes();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes() + 2; // 2 minutos de margem

        if (selectedHours < currentHours) return true;
        if (selectedHours === currentHours && selectedMinutes < currentMinutes) return true;
    }

    return false;
}

const disabledEndsDate = computed(() => {
    const today = new Date(form.value.starts_at.date ?? new Date());
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

const disabledEndsTime = computed(() => {
    return (date) => {

        if (!date) return false;

        const startsDate = form.value.starts_at?.date;
        const startsTime = form.value.starts_at?.hm;
        const _endsDate = form.value.ends_at?.date;
        const endsDate = date;

        // Verifica se é o mesmo dia
        const isSameDay = startsDate.toDateString() === _endsDate.toDateString();

        if (isSameDay && startsTime) {
            // Pega as horas e minutos do horário de início
            const startsHours = startsTime.getHours();
            const startsMinutes = startsTime.getMinutes();

            // Pega as horas e minutos do horário de término selecionado
            const endsHours = endsDate.getHours();
            const endsMinutes = endsDate.getMinutes();

            // Desabilita se o horário de término for menor ou igual ao de início
            if (endsHours < startsHours) return true;
            if (endsHours === startsHours && endsMinutes <= startsMinutes) return true;
        }

        return false;
    };
});

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

    const event = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 0,
        clientY: 0
    });
    document.body.dispatchEvent(event);
}


function handleEndsTimeDateChange(e) {
    errors.value.ends_time_at = {
        show: false,
        message: ""
    }
    const event = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 0,
        clientY: 0
    });
    document.body.dispatchEvent(event);
}

function getEventDuration() {
    if (!form.value.starts_at?.date || !form.value.ends_at?.date ||
        !form.value.starts_at?.hm || !form.value.ends_at?.hm) return '';

    // Combina data e hora para criar objetos Date completos
    const startDate = new Date(form.value.starts_at.date);
    const startTime = new Date(form.value.starts_at.hm);
    const endDate = new Date(form.value.ends_at.date);
    const endTime = new Date(form.value.ends_at.hm);

    // Cria datetime completo combinando data e hora
    const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes(),
        0, 0
    );

    const end = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
        0, 0
    );

    if (end <= start) return '';

    const diffTime = Math.abs(end - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    let durationText = '';

    if (diffDays > 0) {
        durationText += `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;

        if (diffHours > 0 || diffMinutes > 0) {
            durationText += ' e ';
            if (diffHours > 0) {
                durationText += `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
                if (diffMinutes > 0) {
                    durationText += ` e ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
                }
            } else if (diffMinutes > 0) {
                durationText += `${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
            }
        }
    } else {
        if (diffHours > 0) {
            durationText += `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
            if (diffMinutes > 0) {
                durationText += ` e ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
            }
        } else {
            durationText += `${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
        }
    }

    return durationText;
}

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
    // ADICIONE ESTA VALIDAÇÃO PARA A CIDADE
    else if (type.value == 'presencial' && form.value.address.city == "") {
        errors.value.address.city = {
            show: true,
            message: "Informe a cidade do seu evento."
        }
        const fieldToScroll = document.querySelector("#cityField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (type.value == 'presencial' && (!form.value.address.province || form.value.address.province == "")) {
        if (!errors.value.address.province) errors.value.address.province = {};
        errors.value.address.province = {
            show: true,
            message: "Selecione a província do seu evento."
        }
        const fieldToScroll = document.querySelector("#provinceField")
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
            message: "Adicione pelo menos um tipo de ingresso."
        }
        const fieldToScroll = document.querySelector("#ticketsField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    }
    else if (!acceptedTerms.value) {
        errors.value.terms = {
            show: true,
            message: "Você precisa aceitar os Termos de Uso, Diretrizes de Comunidade e Política de Privacidade para publicar o evento."
        }
        const fieldToScroll = document.querySelector("#termsField")
        if (fieldToScroll) {
            fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
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
            type: type.value || "presencial",
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
            isCreatedEvent.value = true
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

// Adicione após a definição do form computed
// Adicione o ref para o checkbox
const acceptedTerms = ref(true) // Inicia como true (já que tem checked no HTML)

// Adicione o watcher para limpar o erro quando marcar/desmarcar
watch(() => acceptedTerms.value, (newValue) => {
    if (newValue === true) {
        errors.value.terms.show = false
    } else {
        errors.value.terms.show = true
    }
});

// Watcher para limpar erro do nome
watch(() => form.value.name, (newValue) => {
    if (newValue && newValue.trim() !== '') {
        errors.value.name.show = false;
    }
});

// Watcher para limpar erro da categoria
watch(() => form.value.category, (newValue) => {
    if (newValue && newValue !== '') {
        errors.value.category.show = false;
    }
});

// Watcher para limpar erro do local
watch(() => form.value.address?.location, (newValue) => {
    if (newValue && newValue.trim() !== '') {
        errors.value.address.location.show = false;
    }
});

// Watcher para limpar erro da cidade
watch(() => form.value.address?.city, (newValue) => {
    if (newValue && newValue.trim() !== '') {
        errors.value.address.city.show = false;
    }
});

// Watcher para limpar erro da província
watch(() => form.value.address?.province, (newValue) => {
    if (newValue && newValue !== '') {
        errors.value.address.province.show = false;
    }
});

// Watcher para limpar erro da URL (evento online)
watch(() => form.value.meeting?.url, (newValue) => {
    if (newValue && newValue.trim() !== '') {
        errors.value.meeting.url.show = false;
    }
});

// Watcher para limpar erro da descrição
watch(() => form.value.description, (newValue) => {
    if (newValue && newValue !== '' && newValue !== '<p><br></p>') {
        errors.value.description.show = false;
    }
});

onMounted(() => {
    if (!type.value || !['presencial', 'online'].includes(type.value)) {
        router.push({ path: "/eventos/meus-eventos" })
    } else {
        store.dispatch("resetEventForm")

        initializeDateTime()

        quillInstance = new Quill(editorContainer.value, {
            theme: 'snow', // Tema: snow ou bubble
            placeholder: 'Adicione aqui a descrição do seu evento...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
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

// Navegação interna (Vue Router)
onBeforeRouteLeave((to, from, next) => {
    if (!isCreatedEvent.value) {
        const confirmed = window.confirm("Tem certeza que deseja sair? As alterações não salvas serão perdidas.")
        confirmed ? next() : next(false)
    } else {
        next()
    }
})

</script>


<template>
    <div class="min-h-[calc(100vh-76px)] mb-[76px] relative">
        <!--header-->
        <div class="sticky top-0 z-[888] mb-4 mt-5 lg:m-0 shadow-[0_2px_10px_0_rgba(25,31,40,.15)] bg-white w-full">
            <div class="lg:max-w-[1100px] py-4 px-4 lg:px-6 h-full mx-auto flex items-center">
                <h1 class="text-[24px] leading-8 lg:text-[28px] text-[#494b57]">Criar <strong>{{ type == 'presencial' ?
                    'Evento Presencial' : 'Evento Online' }}</strong>
                </h1>
            </div>
        </div>

        <!--start body -->
        <div class="lg:max-w-[1100px] relative z-10 lg:mx-auto">
            <div class="w-full mb-6 lg:p-6">
                <!--start new event form -->
                <div>
                    <!--start basics information group form -->
                    <div class="w-full mb-5 lg:p-6 bg-white lg:rounded-md shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-semibold text-[#0097ff]">1. Informações básicas</h3>
                                <p class="ml-[22px] text-[13px] text-[#50525f]">Adicione as principais informações do
                                    evento.
                                </p>
                            </div>
                            <div class="flex flex-col">
                                <label
                                    class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f] required flex-row"
                                    for="titleField">
                                    Titulo do evento

                                    <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                </label>
                                <input
                                    class="p-[10px] border !rounded-sm border-[#dfe0df] h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-[#999]"
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
                                    class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f] required flex-row">
                                    Imagem de divulgação (opcional)</label>
                                <div class="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mt-2">
                                    <div class="w-full lg:w-auto relative">
                                        <DropzoneImage :loading="selectFileLoading" ref="dropzoneRef"
                                            @drop.prevent="dropCover" @change="selectCover" v-if="!form.file" />
                                        <PreviewImage v-else :image="form.file" />
                                    </div>
                                    <div class="w-full lg:w-auto">
                                        <div class="flex gap-3 mb-3 items-center" v-if="form.file || selectFileLoading">
                                            <button
                                                class="border cursor-pointer border-[#0097ff] text-[#0097ff] text-[10px] font-medium uppercase rounded-full py-[6px] px-3 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                                :disabled="selectFileLoading"
                                                :class="{ 'opacity-50 pointer-events-none cursor-not-allowed': selectFileLoading }"
                                                @click="handleLabelClick">
                                                Trocar de imagem
                                            </button>
                                            <button
                                                class="border cursor-pointer border-[#0097ff] text-[#0097ff] text-[10px] font-medium uppercase rounded-full py-[6px] px-3 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                                :disabled="selectFileLoading"
                                                :class="{ 'opacity-50 pointer-events-none cursor-not-allowed': selectFileLoading }"
                                                @click="replaceCover">Remover
                                            </button>
                                            <button
                                                class="border cursor-pointer border-[#0097ff] text-[#0097ff] text-[10px] font-medium uppercase rounded-full py-[6px] px-3 hover:bg-[#0097ff] hover:border-[#0097ff] hover:text-white"
                                                v-if="selectFileLoading" @click="cancelUpload">Cancelar envio
                                            </button>
                                        </div>


                                        <p class="text-xs lg:max-w-[500px] leading-5 text-[#50525f]">
                                            Formatos aceitos: JPEG, GIF ou PNG de até 2MB. Dimensão recomendada: 1600 x
                                            838 pixels.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label
                                    class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f] required flex-row">
                                    Categoria
                                    <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                </label>

                                <Listbox v-model="form.category" id="categoryField">
                                    <div class="relative">
                                        <ListboxButton v-slot="{ open }"
                                            class="flex h-[40px] w-full items-center text-xs px-3.5 p-2 overflow-hidden border border-[#dfe0df] rounded-sm bg-white focus:outline-none"
                                            :class="{ 'border-red-500': errors.category.show, 'text-brand-gray-500': form.category, 'text-[#999]': !form.category }">
                                            <span class="block truncate text-inherit">{{ selectedCategoryName }}</span>

                                            <span
                                                class="pointer-events-none text-inherit absolute inset-y-0 right-0 flex items-center pr-2.5"
                                                :class="{ '!text-gray-300': open }">
                                                <svg :class="{ 'rotate-180 ': open }" class="h-3.5 w-3.5"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                    fill="currentColor">
                                                    <path
                                                        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                                                        fill="currentColor" />
                                                </svg>
                                            </span>
                                        </ListboxButton>

                                        <transition leave-active-class="transition duration-100 ease-in"
                                            leave-from-class="opacity-100" leave-to-class="opacity-0">
                                            <ListboxOptions
                                                class="absolute z-[100] max-h-60 w-full overflow-auto rounded-sm bg-white text-xs shadow-lg focus:outline-none">
                                                <ListboxOption v-for="category in categories" :key="category.value"
                                                    :value="category.value" v-slot="{ active, selected }" as="template">
                                                    <li :class="[
                                                        selected
                                                            ? 'bg-[#0097ff] text-white'
                                                            : active
                                                                ? 'bg-[#f1f1f1] text-brand-gray-500'
                                                                : 'text-brand-gray-500',
                                                        'relative cursor-default select-none py-1.5 px-4'
                                                    ]">
                                                        <span :class="[
                                                            selected ? 'font-medium' : 'font-normal',
                                                            'block truncate',
                                                        ]">{{ category.name }}</span>
                                                    </li>
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </transition>
                                    </div>
                                </Listbox>

                                <small class="text-xs text-red-500">
                                    <span v-if="errors.category.show">
                                        {{ errors.category.message }}
                                    </span>
                                </small>
                            </div>
                        </div>

                    </div>
                    <!--end basics information group form -->
                    <div class="w-full mb-5 lg:p-6 bg-white lg:rounded-md shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-semibold text-[#0097ff]">2.
                                    {{ eventTypeText }}
                                </h3>
                            </div>
                            <!--start address-->
                            <div class="mb-3" v-if="type == 'presencial'">
                                <div>
                                    <div class="w-full">
                                        <label
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f] reqitems-center">
                                            Nome do Local
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <input
                                            class="p-[10px] border w-full !rounded-sm border-[#dfe0df] h-[40px] text-[13px] focus:outline-none !text-gray-600 placeholder:text-[#999]"
                                            id="locationField"
                                            @input="form.address.location != '' ? errors.address.location.show = false : errors.address.location.show = true"
                                            v-model="form.address.location" maxlength="100" type="text"
                                            placeholder="Ex: Hotel Chick Chick"
                                            :class="{ 'border-red-500': errors.address.location.show }">
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.address.location.show }">
                                            <span v-if="errors.address.location.show">
                                                {{ errors.address.location.message }}
                                            </span>
                                        </small>
                                    </div>
                                </div>

                                <!-- Grid para Cidade e Província -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                    <!-- Campo Província com Listbox -->
                                    <div class="w-full">
                                        <label
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Província
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>

                                        <Listbox v-model="form.address.province" id="provinceField">
                                            <div class="relative">
                                                <ListboxButton v-slot="{ open }"
                                                    class="flex h-[40px] w-full text-brand-gray-500 items-center text-xs px-3.5 p-2 overflow-hidden border border-[#dfe0df] rounded-sm bg-white focus:outline-none"
                                                    :class="{ 'border-red-500': errors.address.province?.show }">
                                                    <span class="block truncate">{{ selectedProvinceName }}</span>

                                                    <span
                                                        class="pointer-events-none text-inherit absolute inset-y-0 right-0 flex items-center pr-2.5"
                                                        :class="{ '!text-gray-300': open }">
                                                        <svg :class="{ 'rotate-180 ': open }" class="h-3.5 w-3.5"
                                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                            fill="currentColor">
                                                            <path
                                                                d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                                                                fill="currentColor" />
                                                        </svg>
                                                    </span>
                                                </ListboxButton>

                                                <transition leave-active-class="transition duration-100 ease-in"
                                                    leave-from-class="opacity-100" leave-to-class="opacity-0">
                                                    <ListboxOptions
                                                        class="absolute z-[100] max-h-60 w-full overflow-auto rounded-sm bg-white text-xs shadow-lg focus:outline-none">
                                                        <ListboxOption v-for="province in angolanProvinces"
                                                            :key="province.value" :value="province?.value"
                                                            v-slot="{ active, selected }" as="template">
                                                            <li :class="[
                                                                selected
                                                                    ? 'bg-[#0097ff] text-white'
                                                                    : active
                                                                        ? 'bg-[#f1f1f1] text-brand-gray-500'
                                                                        : 'text-brand-gray-500',
                                                                'relative cursor-default select-none py-1.5 px-4'
                                                            ]">
                                                                <span :class="[
                                                                    selected ? 'font-medium' : 'font-normal',
                                                                    'block truncate',
                                                                ]">{{ province.name }}</span>
                                                            </li>
                                                        </ListboxOption>
                                                    </ListboxOptions>
                                                </transition>
                                            </div>
                                        </Listbox>

                                    </div>

                                    <!-- Campo Cidade -->
                                    <div class="w-full leading-6">
                                        <label
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Cidade

                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <input id="cityField"
                                            class="p-[10px] border w-full !rounded-sm border-[#dfe0df] h-[40px] text-[13px] focus:outline-none !text-gray-600 placeholder:text-[#999]"
                                            v-model="form.address.city" maxlength="100" type="text"
                                            placeholder="Ex: Saurimo"
                                            :class="{ 'border-red-500': errors.address.city.show }">
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.address.city.show }">
                                            <span v-if="errors.address.city.show">{{ errors.address.city.message
                                                }}</span>
                                        </small>
                                    </div>


                                </div>

                                <!-- Grid para Bairro e Complemento -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                    <div class="w-full">
                                        <label
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Bairro
                                        </label>
                                        <input
                                            class="p-[10px] border w-full !rounded-sm border-[#dfe0df] h-[40px] text-[13px] focus:outline-none !text-gray-600 placeholder:text-[#999]"
                                            v-model="form.address.neighborhood" maxlength="100" type="text"
                                            placeholder="Ex: Centro"
                                            :class="{ 'border-red-500': errors.address.neighborhood.show }">
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.address.neighborhood.show }">
                                            <span v-if="errors.address.neighborhood.show">{{
                                                errors.address.neighborhood.message }}</span>
                                        </small>
                                    </div>

                                    <div class="w-full">
                                        <label
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Complemento (opcional)
                                        </label>
                                        <input
                                            class="p-[10px] border w-full !rounded-sm border-[#dfe0df] h-[40px] text-[13px] focus:outline-none !text-gray-600 placeholder:text-[#999]"
                                            v-model="form.address.complement" maxlength="200" type="text"
                                            placeholder="Ex: Sala 101, Próximo ao shopping">
                                    </div>
                                </div>
                                <!--google maps-->
                            </div>
                            <!--end address-->

                            <!--start link meet-->
                            <div v-else>
                                <div class="w-full">
                                    <input
                                        class="p-[10px] border w-full !rounded-sm border-[#dfe0df] h-[40px] text-[13px] focus:outline-none !text-gray-600 placeholder:text-[#999]"
                                        v-model="form.meeting.url" maxlength="100" type="text"
                                        placeholder="Insira uma URL completa. Exemplo: https://www.plataforma.com/evento123"
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

                    <!--start date and times information group form -->
                    <div class="w-full mb-5 lg:p-6 bg-white lg:rounded-md shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-semibold text-[#0097ff]">3. Data e horário</h3>
                                <p class="ml-[22px] text-[13px] text-[#50525f]">Informe aos participantes quando seu
                                    evento
                                    vai acontecer.</p>
                            </div>
                            <div class="flex flex-col lg:flex-row">
                                <div class="w-full flex flex-col lg:flex-row items-center mb-2 lg:mb-0 gap-2 lg:gap-4">
                                    <div class="w-full lg:w-auto">
                                        <label for="starts_atDate"
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Data de Início
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="starts_atDateField" class="w-full">
                                            <date-picker :clearable="false" @change="handleStartsDateChange"
                                                :disabled-date="disabledStartsDate" :lang="langConfig"
                                                format="DD/MM/YYYY" v-model:value="form.starts_at.date"
                                                class="responsive-datepicker"></date-picker>
                                        </div>
                                        <small class="text-xs text-red-500" :class="{ danger: errors.starts_at.show }">
                                            <span v-if="errors.starts_at.show">{{ errors.starts_at.message }}</span>
                                        </small>
                                    </div>
                                    <div class="w-full lg:w-auto">
                                        <label for="starts_atHm"
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Hora de Início
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="starts_atHmField" class="w-full">
                                            <date-picker ref="startsTimePickerRef" :clearable="false"
                                                @change="handleStartsTimeDateChange" v-model:value="form.starts_at.hm"
                                                format="HH:mm" :disabled-time="disabledStartsTime" type="time"
                                                class="responsive-datepicker">
                                            </date-picker>
                                        </div>
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.starts_time_At.show }">
                                            <span v-if="errors.starts_time_At.show">{{ errors.starts_time_At.message
                                            }}</span>
                                        </small>
                                    </div>
                                </div>
                                <div class="w-full flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
                                    <div class="w-full lg:w-auto">
                                        <label for="ends_atDate"
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Data de Término
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="ends_atDateField" class="w-full">
                                            <date-picker :clearable="false" @change="handleEndsDateChange"
                                                :disabled-date="disabledEndsDate" :lang="langConfig"
                                                v-model:value="form.ends_at.date" format="DD/MM/YYYY"
                                                class="responsive-datepicker">
                                            </date-picker>
                                        </div>
                                        <small class="text-xs text-red-500" :class="{ danger: errors.ends_at.show }">
                                            <span v-if="errors.ends_at.show">{{ errors.ends_at.message }}</span>
                                        </small>
                                    </div>

                                    <div class="w-full lg:w-auto">
                                        <label for="ends_atHm"
                                            class="flex items-center gap-[3px] text-[12px] mb-1 font-semibold text-[#50525f]">
                                            Hora de Término
                                            <span
                                                class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                                        </label>
                                        <div id="ends_atHmField" class="w-full">
                                            <date-picker ref="endsTimePickerRef" :clearable="false"
                                                @change="handleEndsTimeDateChange" v-model:value="form.ends_at.hm"
                                                format="HH:mm" type="time" :disabled-time="disabledEndsTime"
                                                class="responsive-datepicker">
                                            </date-picker>
                                        </div>
                                        <small class="text-xs text-red-500"
                                            :class="{ danger: errors.ends_time_at.show }">
                                            <span v-if="errors.ends_time_at.show">{{ errors.ends_time_at.message
                                            }}</span>
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <!-- Div de Duração do Evento -->
                            <div v-if="form.starts_at?.date && form.ends_at?.date && !errors.ends_at.show && !errors.starts_at.show"
                                class="py-4 text-[#424D62] text-[13px]">

                                <p>Seu evento vai durar <strong class="text-[#0097ff]">{{ getEventDuration() || '...'
                                }}</strong></p>
                            </div>
                        </div>
                    </div>
                    <!--end date and times information group form -->

                    <!--start description group form -->
                    <div class="w-full mb-5 lg:p-6 bg-white lg:rounded-md shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-semibold text-[#0097ff]">4. Descrição do evento</h3>
                                <p class="ml-[22px] text-[13px] text-[#50525f]">Conte todos os detalhes do seu evento,
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



                    <!--start tickets information group form -->
                    <div class="w-full mb-5 lg:p-6 bg-white lg:rounded-md shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-semibold text-[#0097ff]">5. Ingressos</h3>
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

                    <!--start terms form -->
                    <div class="w-full mb-5 lg:p-6 bg-white lg:rounded-md shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                        <div class="py-4 px-4 lg:py-0 lg:px-0">
                            <div class="mb-4">
                                <h3 class="text-xl mb-1 font-semibold text-[#0097ff]">6. Responsabilidades</h3>
                            </div>
                            <div id="termsField">
                                <label
                                    class="group flex items-start gap-[12px] text-[12px] mb-1 font-semibold text-[#50525f] cursor-pointer">
                                    <div class="relative flex items-center justify-center shrink-0">
                                        <input v-model="acceptedTerms" data-vv-rules="required" type="checkbox"
                                            :checked="acceptedTerms" class="w-[18px] h-[18px] border-2 border-gray-300 rounded-sm bg-white
                                            checked:bg-[#0097ff] checked:border-[#0097ff]
                                            focus:outline-none
                                            transition-all duration-200 outline-none cursor-pointer
                                            appearance-none [-webkit-appearance:none] [-moz-appearance:none]"
                                            :class="{ 'border-red-500': errors.terms.show }">
                                        <!-- Ícone de check -->
                                        <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-0 transition-opacity duration-200 group-has-[:checked]:opacity-100"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12L10 17L19 8" stroke="white" stroke-width="3"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <span class="font-normal mt-[-2px] leading-[22px] text-xs flex-1">
                                        Ao publicar este evento, declaro estar de acordo com os
                                        <a target="_blank" href="https://www.piweto.it.ao/termos-de-uso"
                                            class="text-[#0097ff] hover:opacity-70 transition-colors duration-200"><b>Termos
                                                de Uso</b></a><span>,
                                            <a target="_blank" href="https://www.piweto.it.ao/termos-de-uso"
                                                class="text-[#0097ff] hover:opacity-70 transition-colors duration-200"><b>Diretrizes
                                                    de Comunidade</b></a>
                                            e
                                            <a target="_blank" aria-label="Regras de meia entrada"
                                                href="https://www.piweto.it.ao/termos-de-uso"
                                                class="text-[#0097ff] hover:opacity-70 transition-colors duration-200"><b>Regras
                                                    de meia-entrada</b></a></span>, bem
                                        como estar ciente da
                                        <a target="_blank" href="https://www.piweto.it.ao/politica-de-privacidade"
                                            class="text-[#0097ff] hover:opacity-70 transition-colors duration-200"><b>Política
                                                de Privacidade</b></a>
                                        e das obrigações legais aplicáveis<span>, incluindo regras de acessibilidade
                                            previstas na legislação angolana</span>.
                                    </span>
                                </label>
                                <!-- Mensagem de erro do checkbox -->
                                <small class="text-xs text-red-500 block mt-2" :class="{ danger: errors.terms.show }">
                                    <span v-if="errors.terms.show">
                                        {{ errors.terms.message }}
                                    </span>
                                </small>
                            </div>
                        </div>
                    </div>
                    <!--end terms form -->



                    <!--start status information group form -->
                    <div class="px-5 lg:px-0 lg:pb-2 pb-8">
                        <div class="row justify-space-between gap-1">
                            <div class="items-center flex gap-4 lg:gap-0 flex-col lg:flex-row">
                                <div class="flex items-center">
                                    <strong class="text-[14px] text-[#50525f]">Visibilidade do evento:</strong>

                                    <span 
                                        v-tippy="{
                                                content: publicText, maxWidth: 280, placement: 'top', theme: 'custom-card'
                                        }" 
                                        class="ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px"
                                            height="20px" viewBox="0 0 1024 1024">
                                            <path fill="#cbcbcf"
                                                d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592 0-42.944-14.08-76.736-42.24-101.376-28.16-25.344-65.472-37.312-111.232-37.312zm-12.672 406.208a54.272 54.272 0 0 0-38.72 14.784 49.408 49.408 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.848 54.848 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.968 51.968 0 0 0-15.488-38.016 55.936 55.936 0 0 0-39.424-14.784z" />
                                        </svg>
                                    </span>
                                </div>


                                <div class="flex ml-4 items-center gap-4">
                                    <label
                                        class="flex cursor-pointer text-xs items-center gap-2 font-normal text-[#50525f] reqility__label group"
                                        style="vertical-align: baseline;">
                                        <input type="radio" v-model="form.visibility" value="public" class="relative w-4 h-4 rounded-full border border-gray-400 
                               transition-all duration-200 ease-out 
                               checked:border-[#0097ff] checked:border-[5px]
                               hover:scale-105 
                               
                               outline-none
                               active:scale-95
                               cursor-pointer appearance-none">
                                        Público
                                    </label>
                                    <label
                                        class="flex cursor-pointer text-xs items-center gap-2 font-normal text-[#50525f] reqility__label group"
                                        style="vertical-align: baseline;">
                                        <input type="radio" v-model="form.visibility" value="private" class="relative w-4 h-4 rounded-full border border-gray-400 
                               transition-all duration-200 ease-out 
                               checked:border-[#0097ff] checked:border-[5px]
                               hover:scale-105 
                               
                               outline-none
                               active:scale-95
                               cursor-pointer appearance-none">
                                        Privado
                                    </label>
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
        <div class="fixed top-0 h-screen w-screen bg-[#FBFBFC]"></div>

        <!--footer-->
        <div
            class="fixed bottom-0 z-[888] border-t border-[#dde0e4] shadow-[0_-2px_10px_0_rgba(0,0,0,.05)] bg-white lg:h-[77px] w-full">
            <div class="lg:max-w-[1100px] p-4 lg:py-0 lg:px-6 h-full mx-auto flex-row justify-end flex items-center">
                <div class="flex flex-nowrap">
                    <button :disabled="loadingEvent || selectFileLoading" @click="router.back()"
                        class="p-[8px_16px] mr-4 transition-colors font-medium lg:font-semibold leading-5 rounded-lg text-sm disabled:pointer-events-none disabled:bg-[#ccc] disabled:border-[#ccc] disabled:text-white lg:text-base bg-transparent text-brand-info lg:leading-6">
                        Voltar
                    </button>
                    <button :disabled="loadingEvent || selectFileLoading" @click="createEvent('d')"
                        class="p-[8px_16px] mr-4 transition-colors font-medium lg:font-semibold leading-5 rounded-lg text-sm disabled:pointer-events-none disabled:bg-[#ccc] disabled:border-[#ccc] disabled:text-white lg:text-base bg-transparent border text-brand-info border-brand-info hover:bg-brand-info hover:text-white lg:leading-6">
                        Salvar rascunho
                    </button>
                    <button :disabled="loadingEvent || selectFileLoading" @click="createEvent('p')"
                        class="p-[8px_16px] transition-colors font-medium lg:font-semibold leading-5 rounded-lg text-sm disabled:pointer-events-none disabled:bg-[#ccc] disabled:border-[#ccc] disabled:text-white lg:text-base text-white bg-brand-primary border border-brand-primary hover:border-brand-primary-dark hover:bg-brand-primary-dark lg:leading-6">Publicar
                        evento</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
/* Personalizando a borda e fundo */
.multiselect {
    border: 1px solid #dfe0df !important;
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
    border: 1px solid #dfe0df !important;
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