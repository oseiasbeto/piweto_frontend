<script setup>
//Importe os pacotes necessários.
import { toast } from "vue3-toastify"
import { useStore } from "vuex"
import { ref, computed, onMounted, watch } from "vue"
import DatePicker from '@jobinsjp/vue3-datepicker';
import VueCleave from 'vue-cleave-component';
import moment from "moment";
import formatAmount from "@/utils/formatAmount";
import { useBatches } from "../../../../../repositories/batches-repository";
import { useRoute } from "vue-router";

// Crie as referências globais deste componente.
const store = useStore()
const route = useRoute()

const { newBatch, loading: loadingBatch } = useBatches()
const { editBatch, loading: loadingEditBatch } = useBatches()

// Esta função computada tem como finalidade Retornar os dados do formulário do corrente lote.
const form = ref({
    name: "",
    quantity: 0,
    quantity_for_purchase: {
        max: 5,
        min: 1
    },
    price: 0,
    type: 'premium',
    available_tickets: "all",
    visibility: "public",
    period_sales: {
        type: "forDate",
        batch: null
    },
    starts_at: {
        date: null,
        hm: null
    },
    ends_at: {
        date: null,
        hm: null
    },
    description: ""
})

const hasError = ref(false)

// Contadores de caracteres
const nameCharsLeft = ref(45)
const descriptionCharsLeft = ref(100)

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

const cleaveConfigPrice = ref({
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
    numeralDecimalMark: ",",
    delimiter: "."
})

const cleaveConfigQuantity = {
    numeral: true,
    numeralThousandsGroupStyle: '',
    delimiter: '',
    numeralDecimalMark: '',
}

const cleaveConfigPurchaseMinMax = {
    numeral: true,
    numeralThousandsGroupStyle: '',
    delimiter: '',
    numeralDecimalMark: '',
}

function calcularValorComTaxa(valor) {
    const taxa = 0.05;
    const valorComTaxa = valor * (1 - taxa);
    return parseFloat(valorComTaxa.toFixed(2));
}

// Funções de validação em tempo real
const validateName = () => {
    if (!form.value.name || form.value.name.trim() === '') {
        errors.value.name = {
            show: true,
            message: "Informe o tipo do ingresso"
        }
        return false
    } else {
        errors.value.name = {
            show: false,
            message: ""
        }
        return true
    }
}

const validateQuantityField = () => {
    if (!form.value.quantity || form.value.quantity <= 0) {
        errors.value.quantity = {
            show: true,
            message: "Informe uma quantidade válida."
        }
        return false
    } else {
        errors.value.quantity = {
            show: false,
            message: ""
        }
        return true
    }
}

const validatePriceField = () => {
    if (!form.value.price || form.value.price <= 0) {
        errors.value.price = {
            show: true,
            message: "Informe um preço válido."
        }
        return false
    } else {
        errors.value.price = {
            show: false,
            message: ""
        }
        return true
    }
}

const validatePurchaseMinField = () => {
    if (!form.value.quantity_for_purchase.min || form.value.quantity_for_purchase.min <= 0) {
        errors.value.quantity_for_purchase.min = {
            show: true,
            message: "Campo Obrigatório."
        }
        return false
    } else {
        errors.value.quantity_for_purchase.min = {
            show: false,
            message: ""
        }
        return true
    }
}

const validatePurchaseMaxField = () => {
    if (!form.value.quantity_for_purchase.max || form.value.quantity_for_purchase.max <= 0) {
        errors.value.quantity_for_purchase.max = {
            show: true,
            message: "Campo Obrigatório."
        }
        return false
    } else {
        errors.value.quantity_for_purchase.max = {
            show: false,
            message: ""
        }
        return true
    }
}

// Funções de validação para datas e horários
const validateStarts_atDate = (value) => {
    if (!value || value.length === 0) {
        errors.value.starts_at.date = {
            show: true,
            message: "Informe uma data de início das vendas."
        }
        return false
    } else {
        errors.value.starts_at.date = {
            show: false,
            message: ""
        }
        // Valida se a data não é anterior a hoje
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            errors.value.starts_at.date = {
                show: true,
                message: "A data de início das vendas não pode ser anterior à data atual."
            }
            return false
        }
        return true
    }
}

const validateStarts_atHm = (value) => {
    if (!value || value.length === 0) {
        errors.value.starts_at.hm = {
            show: true,
            message: "Informe um horário de início das vendas."
        }
        return false
    } else {
        errors.value.starts_at.hm = {
            show: false,
            message: ""
        }
        return true
    }
}

const validateEnds_atDate = (value) => {
    if (!value || value.length === 0) {
        errors.value.ends_at.date = {
            show: true,
            message: "Informe uma data de término das vendas."
        }
        return false
    } else {
        errors.value.ends_at.date = {
            show: false,
            message: ""
        }

        // Valida se a data de término não é anterior à data de início
        if (form.value.starts_at.date && value < form.value.starts_at.date) {
            errors.value.ends_at.date = {
                show: true,
                message: "A data de término das vendas não pode ser anterior à data de início."
            }
            return false
        }
        return true
    }
}

const validateEnds_atHm = (value) => {
    if (!value || value.length === 0) {
        errors.value.ends_at.hm = {
            show: true,
            message: "Informe um horário de término das vendas."
        }
        return false
    }

    // Verifica se temos data e horário de início
    if (!form.value.starts_at.date || !form.value.starts_at.hm) {
        errors.value.ends_at.hm = {
            show: false,
            message: ""
        }
        return true
    }

    // Verifica se é o mesmo dia
    const isSameDay = form.value.starts_at.date.toDateString() === form.value.ends_at.date?.toDateString();

    if (isSameDay) {
        const startTime = new Date(form.value.starts_at.hm);
        const endTime = new Date(value);

        if (endTime <= startTime) {
            errors.value.ends_at.hm = {
                show: true,
                message: 'O horário de término não pode ser menor ou igual ao horário de início.'
            }
            return false
        }
    }

    errors.value.ends_at.hm = {
        show: false,
        message: ""
    }
    return true
}

// Define os eventos de emissão deste componente.
const emit = defineEmits(["onclose"])

// Função para desabilitar datas passadas no início das vendas
const disabledStarts_atDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
}

// Função para desabilitar horas passadas no dia atual
const disabledStarts_atTime = (date) => {
    if (!date) return false;

    const now = new Date();
    const selectedDate = new Date(date);

    // Se for hoje, desabilita horários já passados (com margem de 5 minutos)
    if (selectedDate.toDateString() === now.toDateString()) {
        const nowPlus5Min = new Date(now.getTime() + 5 * 60000);
        return selectedDate < nowPlus5Min;
    }

    return false;
}

// Função para desabilitar datas anteriores à data de início
const disabledEnds_atDate = (date) => {
    if (!form.value.starts_at?.date) return false;

    const startDate = new Date(form.value.starts_at.date);
    startDate.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < startDate;
}

// Função para desabilitar horários no término das vendas
const disabledEnds_atTime = (date) => {
    if (!date) return false;

    if (!form.value.starts_at?.date || !form.value.starts_at?.hm) return false;

    const isSameDay = form.value.starts_at.date.toDateString() === form.value.ends_at.date?.toDateString();

    if (isSameDay) {
        const startTime = new Date(form.value.starts_at.hm);
        const endTime = new Date(date);
        return endTime <= startTime;
    }

    return false;
}

// Função para lidar com mudança na data de início
const handleStartsDateChange = () => {
    if (form.value.ends_at.date && form.value.starts_at.date &&
        form.value.ends_at.date < form.value.starts_at.date) {
        form.value.ends_at.date = null;
        form.value.ends_at.hm = null;
        errors.value.ends_at.date = {
            show: false,
            message: ""
        }
        errors.value.ends_at.hm = {
            show: false,
            message: ""
        }
    }
    validateEnds_atDate(form.value.ends_at.date)
}

// Função para lidar com mudança no horário de início
const handleStartsTimeChange = () => {
    if (form.value.starts_at.date && form.value.ends_at.date &&
        form.value.starts_at.date.toDateString() === form.value.ends_at.date.toDateString() &&
        form.value.ends_at.hm && form.value.starts_at.hm) {

        const startTime = new Date(form.value.starts_at.hm);
        const endTime = new Date(form.value.ends_at.hm);

        if (endTime <= startTime) {
            form.value.ends_at.hm = null;
            errors.value.ends_at.hm = {
                show: true,
                message: 'O horário de término deve ser posterior ao horário de início. Selecione um novo horário.'
            }

            setTimeout(() => {
                if (errors.value.ends_at.hm.message === 'O horário de término deve ser posterior ao horário de início. Selecione um novo horário.') {
                    errors.value.ends_at.hm = {
                        show: false,
                        message: ""
                    }
                }
            }, 3000);
        }
    }
    validateEnds_atHm(form.value.ends_at.hm)
}

// Função para inicializar as datas padrão
// Função para inicializar as datas padrão
const initializeDates = () => {
    const now = new Date();
    // Arredonda para o próximo minuto e adiciona 5 minutos
    now.setMinutes(now.getMinutes() + 2);
    now.setSeconds(0, 0);

    form.value.starts_at.date = new Date(now);
    form.value.starts_at.hm = new Date(now);

    // Adiciona 5 minutos ao horário de início
    const startTimeWithExtra = new Date(now);
    startTimeWithExtra.setMinutes(startTimeWithExtra.getMinutes() + 5);
    form.value.starts_at.hm = new Date(startTimeWithExtra);

    // Data de término 5 dias após
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 5);
    form.value.ends_at.date = new Date(endDate);
    form.value.ends_at.hm = new Date(endDate);
}

// Esta função computada tem como finalidade Retornar os dados do formulário do corrente evento.
const eventForm = computed(() => {
    return store.getters.eventForm
})

const batches = ref([])

const processBatches = () => {
    if (eventForm.value.batches && eventForm.value.batches.length) {
        eventForm.value.batches.map((batch, index) => {
            return batches.value.push({
                name: batch.name,
                batchIndex: index
            })
        })
    }
}

// Esta função computada tem como finalidade Retornar os dados da caixa de diálogo aberta.
const modal = computed(() => {
    return store.getters.modal
})

const errors = ref({
    name: {
        show: false,
        message: ""
    },
    price: {
        show: false,
        message: ""
    },
    quantity: {
        show: false,
        message: ""
    },
    quantity_for_purchase: {
        min: {
            show: false,
            message: ""
        },
        max: {
            show: false,
            message: ""
        }
    },
    periodSales: {
        batch: {
            show: false,
            message: ""
        }
    },
    starts_at: {
        date: {
            show: false,
            message: ""
        },
        hm: {
            show: false,
            message: ""
        }
    },
    ends_at: {
        date: {
            show: false,
            message: ""
        },
        hm: {
            show: false,
            message: ""
        }
    }
})

// Watchers para validação em tempo real
watch(() => form.value.name, () => {
    validateName()
    nameCharsLeft.value = 45 - (form.value.name?.length || 0)
})

watch(() => form.value.quantity, () => validateQuantityField())
watch(() => form.value.price, () => validatePriceField())
watch(() => form.value.quantity_for_purchase.min, () => validatePurchaseMinField())
watch(() => form.value.quantity_for_purchase.max, () => validatePurchaseMaxField())
watch(() => form.value.description, () => {
    descriptionCharsLeft.value = 100 - (form.value.description?.length || 0)
})

// Crie uma função com a finalidade de validar o formulário
const validateBatchForm = () => {
    hasError.value = false

    const isNameValid = validateName()
    const isQuantityValid = validateQuantityField()
    const isPriceValid = validatePriceField()
    const isMinValid = validatePurchaseMinField()
    const isMaxValid = validatePurchaseMaxField()
    const isStartsDateValid = validateStarts_atDate(form.value.starts_at.date)
    const isStartsHmValid = validateStarts_atHm(form.value.starts_at.hm)
    const isEndsDateValid = validateEnds_atDate(form.value.ends_at.date)
    const isEndsHmValid = validateEnds_atHm(form.value.ends_at.hm)

    if (!isNameValid) {
        const fieldToScroll = document.querySelector("#nameTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isQuantityValid) {
        const fieldToScroll = document.querySelector("#quantityTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isPriceValid) {
        const fieldToScroll = document.querySelector("#priceTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isMinValid) {
        const fieldToScroll = document.querySelector("#quantity_for_purchaseMinTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isMaxValid) {
        const fieldToScroll = document.querySelector("#quantity_for_purchaseMaxTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isStartsDateValid) {
        const fieldToScroll = document.querySelector("#starts_atDateTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isStartsHmValid) {
        const fieldToScroll = document.querySelector("#starts_atHmTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isEndsDateValid) {
        const fieldToScroll = document.querySelector("#ends_atDateTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!isEndsHmValid) {
        const fieldToScroll = document.querySelector("#ends_atHmTicketField")
        fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (form.value.starts_at.date && form.value.ends_at.date) {
        const startDate = new Date(form.value.starts_at.date);
        const startTime = new Date(form.value.starts_at.hm);
        const endDate = new Date(form.value.ends_at.date);
        const endTime = new Date(form.value.ends_at.hm);

        const startDateTime = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startTime.getHours(),
            startTime.getMinutes()
        );

        const endDateTime = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            endTime.getHours(),
            endTime.getMinutes()
        );

        if (endDateTime <= startDateTime) {
            errors.value.ends_at.hm = {
                show: true,
                message: 'A data e hora de término deve ser posterior à data e hora de início.'
            }
            const fieldToScroll = document.querySelector("#ends_atHmTicketField")
            fieldToScroll?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            hasError.value = true
        }
    }
}

// Crie uma função com a finalidade de criar um novo lote.
const submit = async () => {
    validateBatchForm()
    if (!hasError.value) {
        loadingBatch.value = true
        const data = modal.value.data

        if (!data.requestApi) {
            setTimeout(() => {
                if (modal.value.data.action == 'create') {
                    store.dispatch('addBatchFromBatches', form.value)
                    close()
                    toast("Ingresso criado com sucesso!", {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2500,
                        type: 'success'
                    })
                } else {
                    const index = modal.value.data.index
                    store.dispatch('editBatchFromBatches', {
                        data: form.value,
                        index
                    })
                    close()
                    toast("Ingresso editado com sucesso!", {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2500,
                        type: 'success'
                    })
                }
                loadingBatch.value = false
            }, 550)
        } else {
            if (modal.value.data.action == 'create') {
                await newBatch({
                    eventId: route.params.id,
                    form: form.value
                }).then((newBatch) => {
                    store.dispatch('addBatchFromBatches', newBatch)
                    close()
                    toast("Ingresso criado com sucesso!", {
                        theme: "colored",
                        position: "bottom-center",
                        autoClose: 2500,
                        type: 'success'
                    })
                }).catch((err) => {
                    close()
                    toast("Aconteceu um erro ao criar o ingresso.", {
                        theme: "colored",
                        position: "bottom-center",
                        autoClose: 2500,
                        type: 'error'
                    })
                })
            } else {
                await editBatch({
                    batchId: modal.value.data.batch._id,
                    form: form.value
                }).then(() => {
                    close()
                    toast("Ingresso editado com sucesso!", {
                        theme: "colored",
                        position: "bottom-center",
                        autoClose: 2500,
                        type: 'success'
                    })
                }).catch(() => {
                    close()
                    toast("Aconteceu um erro ao editar o ingresso.", {
                        theme: "colored",
                        position: "bottom-center",
                        autoClose: 2500,
                        type: 'error'
                    })
                })
            }
        }

    } else return
}

// Esta função tem como finalidade emitir um evento de fecho da caixa de diálogo aberta ou cancelar a edição do lote.
const close = () => {
    emit("onclose")
}

onMounted(() => {
    const _batch = modal.value.data.batch

    if (!_batch) {
        const _type = modal.value.data.type
        form.value.type = _type
        // Inicializa as datas padrão apenas quando for criação
        initializeDates()
    } else {
        if (_batch.starts_at?.date) {
            _batch.starts_at.date = new Date(_batch.starts_at.date)
        }
        if (_batch.ends_at?.date) {
            _batch.ends_at.date = new Date(_batch.ends_at.date)
        }
        if (_batch.starts_at?.hm) {
            _batch.starts_at.hm = new Date(_batch.starts_at.hm)
        }
        if (_batch.ends_at?.hm) {
            _batch.ends_at.hm = new Date(_batch.ends_at.hm)
        }
        form.value = _batch
    }

    if (eventForm.value.batches && eventForm.value.batches.length) {
        processBatches()
    }

    nameCharsLeft.value = 45 - (form.value.name?.length || 0)
    descriptionCharsLeft.value = 100 - (form.value.description?.length || 0)
})
</script>

<template>
    <div
        class="w-full md:w-[700px] text-[#50525f] lg:w-[1000px] h-[calc(100vh-50px)] lg:h-[600px] bg-white shadow-[0_3px_9px_rgba(0,0,0,.5)] rounded-[8px] overflow-y-auto scrollbar-hide">
        <div class="p-[20px_30px] relative text-center">
            <div class="text-[28px] font-light">
                {{ modal?.data?.action == 'edit' ? 'Editar ingresso' : 'Criar Ingresso' }}
                <strong class="font-bold">{{ 'pago' }}</strong>
            </div>

            <button class="absolute text-center top-0 right-0 p-[20px]" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="-0.5 0 25 25" fill="none">
                    <path d="M3 21.32L21 3.32001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M3 3.32001L21 21.32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>
        </div>

        <div class="w-full p-4 lg:p-[20px_50px] pb-[20px] lg:pb-[50px]">
            <div class="flex mb-8 lg:flex-row flex-col gap-4 lg:gap-6 items-start">
                <div class="mb-2 lg:mb-0 w-full lg:flex-1">
                    <label class="flex font-semibold items-center gap-1 mb-0.5 text-[12px]">
                        Título do ingresso
                        <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        <span v-tippy="{
                            content: 'Este é o título do ingresso que será exibido na página de venda, junto ao preço.',
                            maxWidth: 280,
                            placement: 'top',
                            theme: 'custom-card'
                        }">
                            <svg class="ml-0.5" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px"
                                viewBox="0 0 1024 1024">
                                <path fill="#cbcbcf"
                                    d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592 0-42.944-14.08-76.736-42.24-101.376-28.16-25.344-65.472-37.312-111.232-37.312zm-12.672 406.208a54.272 54.272 0 0 0-38.72 14.784 49.408 49.408 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.848 54.848 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.968 51.968 0 0 0-15.488-38.016 55.936 55.936 0 0 0-39.424-14.784z" />
                            </svg>
                        </span>
                    </label>
                    <input :maxlength="45" placeholder="Ingresso único, Meia-Entrada, VIP, etc."
                        class="p-2 border w-full rounded-sm h-[40px] text-[13px] focus:outline-none text-gray-600 placeholder:text-gray-400"
                        :class="errors.name.show ? 'border-brand-danger border-red-500' : 'border-gray-300'"
                        id="nameTicketField" v-model="form.name" type="text">
                    <div class="flex justify-between items-center min-h-[20px]">
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.name.show ? 'text-brand-danger block' : 'invisible'">
                            {{ errors.name.message || 'placeholder' }}
                        </p>
                        <p class="text-xs text-[#a8a9af] mt-1">{{ nameCharsLeft }} caracteres restantes</p>
                    </div>
                </div>

                <div class="mb-2 lg:mb-0 w-full lg:w-1/5">
                    <label class="flex font-semibold items-center gap-1 text-[12px] mb-0.5">Quantidade
                        <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                    </label>
                    <vue-cleave
                        class="p-2 border w-full rounded-sm h-[40px] text-[13px] focus:outline-none text-gray-600 placeholder:text-gray-400"
                        :class="errors.quantity.show ? 'border-brand-danger border-red-500' : 'border-gray-300'"
                        id="quantityTicketField" v-model="form.quantity" :options="cleaveConfigQuantity"
                        placeholder="ex: 50" />
                    <div class="min-h-[20px]">
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.quantity.show ? 'text-brand-danger' : 'invisible'">
                            {{ errors.quantity.message || 'placeholder' }}
                        </p>
                    </div>
                </div>

                <div class="mb-2 lg:mb-0 flex lg:flex-row flex-col items-start w-full lg:flex-1">
                    <div class="w-full lg:w-auto">
                        <label class="flex font-semibold items-center gap-1 text-[12px] mb-0.5">Preço
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <vue-cleave
                            class="p-2 border w-full rounded-sm h-[40px] text-[13px] focus:outline-none text-gray-600 placeholder:text-gray-400"
                            :class="errors.price.show ? 'border-brand-danger border-red-500' : 'border-gray-300'"
                            id="priceTicketField" v-model="form.price" :options="cleaveConfigPrice"
                            placeholder="Digite o preço" />
                        <div class="min-h-[20px]">
                            <p v-show="errors.price?.show" class="text-xs leading-[15px] mt-1 text-brand-danger">
                                {{ errors.price.message }}
                            </p>
                        </div>
                    </div>

                    <div class="pt-[22px] w-full lg:w-auto lg:ml-5">
                        <p
                            class="text-[13px] flex items-center lg:items-start flex-row lg:flex-col leading-7 text-[#50525f]">
                            <span class="font-semibold">Valor a receber:</span>
                            <span class="text-[#2ac8bc] text-sm ml-1">{{ formatAmount(calcularValorComTaxa(form.price))
                                }}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="mb-2 lg:mb-5">
                <span class="flex font-semibold items-center gap-1 text-sm lg:text-base mb-1">
                    Quando o ingresso será vendido <span
                        class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                </span>

                <div class="flex py-4 gap-8 items-center">
                    <label
                        class="flex w-auto cursor-pointer text-xs items-center gap-2 font-normal text-[#50525f] reqility__label group">
                        <input type="radio" checked value="for_date" class="relative w-4 h-4 rounded-full border border-gray-400 
                               transition-all duration-200 ease-out 
                               checked:border-[#0097ff] checked:border-[5px]
                               hover:scale-105 outline-none active:scale-95 cursor-pointer appearance-none">
                        Por data
                    </label>

                    <label
                        class="flex opacity-80 w-auto cursor-default text-xs items-center gap-2 font-normal text-[#50525f] reqility__label group">
                        <input type="radio" disabled value="for_date" class="relative w-4 h-4 rounded-full border border-gray-400 
                               transition-all duration-200 ease-out 
                               checked:border-[#0097ff] checked:border-[5px]
                               disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-200
                               outline-none cursor-pointer appearance-none">
                        <span class="opacity-80">Por lote</span>
                    </label>
                </div>
            </div>

            <div class="mb-4 lg:mb-10 flex flex-col w-full lg:w-10/12 lg:justify-between items-center lg:flex-row">
                <div class="flex w-full lg:w-auto flex-col lg:flex-row items-center gap-5">
                    <div class="w-full lg:w-auto" id="starts_atDateTicketField">
                        <label class="flex items-center font-semibold gap-1 text-[12px] mb-0.5">
                            Data de Início das Vendas
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <date-picker type="date" :clearable="false" :append-to-body="true"
                            :disabled-date="disabledStarts_atDate" :lang="langConfig" format="DD/MM/YYYY"
                            :popup-style="{ zIndex: 10000 }" v-model:value="form.starts_at.date"
                            :class="errors.starts_at.date.show ? 'border-red-500' : ''" @update:model-value="(val) => {
                                validateStarts_atDate(val);
                                handleStartsDateChange();
                            }">
                        </date-picker>
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.starts_at.date.show ? 'text-brand-danger' : 'hidden'">
                            {{ errors.starts_at.date.message }}
                        </p>
                    </div>

                    <div class="w-full lg:w-4/12" id="starts_atHmTicketField">
                        <label class="flex items-center font-semibold gap-1 text-[12px] mb-0.5">
                            Horário de Início
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <date-picker type="time" :clearable="false" :append-to-body="true"
                            :disabled-time="disabledStarts_atTime" format="HH:mm" v-model:value="form.starts_at.hm"
                            :popup-style="{ zIndex: 10000 }" @update:model-value="(val) => {
                                validateStarts_atHm(val);
                                handleStartsTimeChange();
                            }">
                        </date-picker>
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.starts_at.hm.show ? 'text-brand-danger' : 'hidden'">
                            {{ errors.starts_at.hm.message }}
                        </p>
                    </div>
                </div>

                <div class="flex w-full lg:w-auto flex-col lg:flex-row items-center gap-5">
                    <div class="w-full lg:w-auto" id="ends_atDateTicketField">
                        <label class="flex items-center font-semibold gap-1 text-[12px] mb-0.5">
                            Data de Término das Vendas
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <date-picker type="date" :clearable="false" :append-to-body="true"
                            :disabled-date="disabledEnds_atDate" :lang="langConfig" format="DD/MM/YYYY"
                            v-model:value="form.ends_at.date" @update:model-value="validateEnds_atDate"
                            :popup-style="{ zIndex: 10000 }">
                        </date-picker>
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.ends_at.date.show ? 'text-brand-danger' : 'hidden'">
                            {{ errors.ends_at.date.message }}
                        </p>
                    </div>

                    <div class="w-full lg:w-2/5" id="ends_atHmTicketField">
                        <label class="flex items-center font-semibold gap-1 text-[12px] mb-0.5">
                            Horário de Término
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <date-picker type="time" :clearable="false" :append-to-body="true"
                            :disabled-time="disabledEnds_atTime" format="HH:mm" v-model:value="form.ends_at.hm"
                            @update:model-value="validateEnds_atHm" :popup-style="{ zIndex: 10000 }">
                        </date-picker>
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.ends_at.hm.show ? 'text-brand-danger' : 'hidden'">
                            {{ errors.ends_at.hm.message }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mb-4 lg:mb-10 w-full lg:w-5/12">
                <label class="flex items-center font-semibold text-sm lg:text-base gap-1 text-[12px] mb-0.5">
                    Quantidade permitida por compra
                    <span v-tippy="{
                        content: 'As quantidades mínima e máxima definem quantos ingressos um comprador pode adquirir por transação.',
                        maxWidth: 280,
                        placement: 'top',
                        theme: 'custom-card'
                    }">
                        <svg class="ml-0.5" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px"
                            viewBox="0 0 1024 1024">
                            <path fill="#cbcbcf"
                                d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592 0-42.944-14.08-76.736-42.24-101.376-28.16-25.344-65.472-37.312-111.232-37.312zm-12.672 406.208a54.272 54.272 0 0 0-38.72 14.784 49.408 49.408 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.848 54.848 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.968 51.968 0 0 0-15.488-38.016 55.936 55.936 0 0 0-39.424-14.784z" />
                        </svg>
                    </span>
                </label>
                <div class="grid mt-4 grid-cols-2 gap-4">
                    <div>
                        <label class="flex font-semibold items-center gap-1 mb-0.5 text-[12px]">
                            Mínima
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <vue-cleave
                            class="p-2 border w-full rounded-sm h-[40px] text-[13px] focus:outline-none text-gray-600 placeholder:text-gray-400"
                            :class="errors.quantity_for_purchase.min.show ? 'border-brand-danger border-red-500' : 'border-gray-300'"
                            id="quantity_for_purchaseMinTicketField" v-model="form.quantity_for_purchase.min"
                            :options="cleaveConfigPurchaseMinMax" placeholder="" />
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.quantity_for_purchase.min.show ? 'text-brand-danger' : 'hidden'">
                            {{ errors.quantity_for_purchase.min.message }}
                        </p>
                    </div>

                    <div>
                        <label class="flex font-semibold items-center gap-1 mb-0.5 text-[12px]">
                            Máxima
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>
                        <vue-cleave
                            class="p-2 border w-full rounded-sm h-[40px] text-[13px] focus:outline-none text-gray-600 placeholder:text-gray-400"
                            :class="errors.quantity_for_purchase.max.show ? 'border-brand-danger border-red-500' : 'border-gray-300'"
                            id="quantity_for_purchaseMaxTicketField" v-model="form.quantity_for_purchase.max"
                            :options="cleaveConfigPurchaseMinMax" placeholder="" />
                        <p class="text-xs mt-1 leading-[15px]"
                            :class="errors.quantity_for_purchase.max.show ? 'text-brand-danger' : 'hidden'">
                            {{ errors.quantity_for_purchase.max.message }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-5/12 mb-4">
                <label class="flex font-semibold mb-4 items-center gap-1 text-sm lg:text-base">Descrição do Ingresso
                    (opcional)</label>
                <textarea
                    class="p-2 resize-none border w-full rounded-sm border-gray-300 text-[13px] focus:outline-none text-gray-600 placeholder:text-gray-400"
                    maxlength="100" rows="2" v-model="form.description"
                    placeholder="Informações adicionais ao nome do ingresso. Ex.: Esse ingresso dá direito a um copo"></textarea>
                <div class="flex text-xs text-[#a8a9af] justify-end mt-1">
                    <p>{{ descriptionCharsLeft }} caracteres restantes</p>
                </div>
            </div>
        </div>

        <!-- Footer Fixed -->
        <div class="sticky lg:px-[50px] bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-[8px]">
            <div class="flex justify-between items-center gap-4 flex-wrap">
                <div class="flex gap-4 flex-items items-start">
                    <span class="block font-semibold text-[#50525f] italic text-xs mb-2">Visibilidade do
                        ingresso:</span>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 text-xs cursor-pointer">
                            <input type="radio" v-model="form.visibility" value="public" class="relative w-4 h-4 rounded-full border border-gray-400 
                                       transition-all duration-200 ease-out 
                                       checked:border-[#0097ff] checked:border-[5px]
                                       hover:scale-105 outline-none active:scale-95 cursor-pointer appearance-none">
                            Público
                        </label>
                        <label class="flex items-center gap-2 text-xs cursor-pointer">
                            <input type="radio" v-model="form.visibility" value="private" class="relative w-4 h-4 rounded-full border border-gray-400 
                                       transition-all duration-200 ease-out 
                                       checked:border-[#0097ff] checked:border-[5px]
                                       hover:scale-105 outline-none active:scale-95 cursor-pointer appearance-none">
                            Privado
                        </label>
                    </div>

                </div>

                <div class="flex w-full justify-center lg:justify-start lg:w-auto gap-2">
                    <button
                        class="bg-white text-sm font-semibold uppercase hover:opacity-80 text-brand-info py-2 px-6 rounded-full hover:bg-[#f1f1f1]"
                        @click="close">Cancelar</button>
                    <button
                        class="bg-[#ff9023] text-sm font-semibold uppercase hover:opacity-80 text-white py-2 px-6 rounded-full"
                        @click="submit" :disabled="loadingBatch || loadingEditBatch">
                        <span v-if="loadingBatch || loadingEditBatch">Processando...</span>
                        <span v-else>
                            {{ modal?.data?.action == 'edit' ? 'Editar ingresso' : 'Criar Ingresso' }}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Garantir que o popup do DatePicker tenha z-index maior que o modal */
:deep(.mx-datepicker-popup) {
    z-index: 10000 !important;
}

/* Estilizar mensagens de erro */
.text-brand-danger {
    color: #ff4f4f;
}

.border-brand-danger {
    border-color: #ff4f4f;
}

/* Estilizar o botão de informação */
.bg-brand-info {
    background-color: #0097ff;
}

.text-brand-info {
    color: #0097ff;
}

/* Esconder scrollbar */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>