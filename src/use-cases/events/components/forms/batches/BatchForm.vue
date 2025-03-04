<script setup>
//Importe os pacotes necessários.
import { toast } from "vue3-toastify"
import { useStore } from "vuex"
import { ref, computed, onMounted } from "vue"
import DatePicker from '@jobinsjp/vue3-datepicker';
import VueCleave from 'vue-cleave-component';
import moment from "moment";
import { useBatches } from "../../../../../repositories/batches-repository";
import Multiselect from 'vue-multiselect'

// Crie as referências globais deste componente.
const store = useStore()

const { newBatch, loading: loadingBatch } = useBatches()

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
    numeral: true, // Ativa o modo numérico
    numeralThousandsGroupStyle: '', // Usar ponto como separador de milhar
    delimiter: '', // Separador de milhar será o ponto
    numeralDecimalMark: '', // Sem ponto decimal, pois não queremos casas decimais
};

const cleaveConfigPurchaseMinMax = {
    numeral: true, // Ativa o modo numérico
    numeralThousandsGroupStyle: '', // Usar ponto como separador de milhar
    delimiter: '', // Separador de milhar será o ponto
    numeralDecimalMark: '', // Sem ponto decimal, pois não queremos casas decimais
};

const validatePrice = (e) => {
    if (!e.target.value || e.target.value == '') {
        errors.value.price.show = true
    } else {
        errors.value.price.show = false
    }
}
const validateQuantity = (e) => {
    if (!e.target.value || e.target.value == '') {
        errors.value.quantity.show = true
    } else {
        errors.value.quantity.show = false
    }
}
const validatePurchaseMin = (e) => {
    if (!e.target.value || e.target.value == '') {
        errors.value.quantity_for_purchase.min.show = true
    } else {
        errors.value.quantity_for_purchase.min.show = false
    }
}
const validatePurchaseMax = (e) => {
    if (!e.target.value || e.target.value == '') {
        errors.value.quantity_for_purchase.max.show = true
    } else {
        errors.value.quantity_for_purchase.max.show = false
    }
}
const validateStarts_atDate = (e) => {
    if (e.length) {
        errors.value.starts_at.date.show = true
    } else {
        errors.value.starts_at.date.show = false
    }
}

const validateStarts_atHm = (e) => {
    if (e.length) {
        errors.value.starts_at.hm.show = true
    } else {
        errors.value.starts_at.hm.show = false
    }
}

const validateEnds_atDate = (e) => {
    if (e.length) {
        errors.value.ends_at.date.show = true
    } else {
        errors.value.ends_at.date.show = false
    }
}

const validateEnds_atHm = (e) => {
    const _startAtTimeHm = form.value.starts_at.hm
    if (e.length) {
        errors.value.ends_at.hm = true
    } else if (moment(e).isBefore(_startAtTimeHm)) {
        hasError.value = true
        errors.value.ends_at.hm = {
            show: true,
            message: 'O horario de termino nao deve ser menor que de inicio.'
        }
    } else {
        errors.value.ends_at.hm.show = false
    }
}

// Define os eventos de emissão deste componente.
const emit = defineEmits(["onclose"])

const disabledStarts_atTime = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

const disabledEnds_atTime = computed(() => {
    const today = new Date(form.value.starts_at.date ?? new Date());
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

// Esta função computada tem como finalidade Retornar os dados do formulário do corrente evento.
const eventForm = computed(() => {
    return store.getters.eventForm
})

const batches = ref([])

const processBatches = () => {
    eventForm.value.batches.map((batch, index) => {
        return batches.value.push({
            name: batch.name,
            batchIndex: index
        })
    })
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

// Crie uma função com a finalidade de validar o formulário
const validateBatchForm = () => {
    if (form.value.name == '') {
        errors.value.name = {
            show: true,
            message: "Informe o tipo do ingresso"
        }
        const fieldToScroll = document.querySelector("#nameTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (form.value.quantity <= 0) {
        errors.value.quantity = {
            show: true,
            message: "Informe uma quantidade válida."
        }
        const fieldToScroll = document.querySelector("#quantityTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (form.value.type !== 'free' && form.value.price < 0) {
        errors.value.price = {
            show: true,
            message: "Informe um preco válida."
        }
        const fieldToScroll = document.querySelector("#priceTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (form.value.quantity_for_purchase.min <= 0) {
        errors.value.quantity_for_purchase.min = {
            show: true,
            message: "Informe uma quantidade mínima por venda válida."
        }
        const fieldToScroll = document.querySelector("#quantity_for_purchaseMinTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (form.value.quantity_for_purchase.max <= 0) {
        errors.value.quantity_for_purchase.max = {
            show: true,
            message: "Informe uma quantidade máxima por venda válida."
        }
        const fieldToScroll = document.querySelector("#quantity_for_purchaseMaxTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!form.value.period_sales.batch && !form.value.starts_at.date) {
        errors.value.starts_at.date = {
            show: true,
            message: "Informe uma data de inicio das vendas."
        }
        const fieldToScroll = document.querySelector("#starts_atDateTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!form.value.period_sales.batch && !form.value.starts_at.hm) {
        errors.value.starts_at.hm = {
            show: true,
            message: "Informe o horario de inicio das vendas."
        }
        const fieldToScroll = document.querySelector("#starts_atHmTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (moment(form.value.ends_at.hm).isBefore(form.value.starts_at.hm)) {
        hasError.value = true
        errors.value.ends_at.hm = {
            show: true,
            message: 'O horario de termino nao deve ser menor que de inicio.'
        }
    } else if (!form.value.period_sales.batch && !form.value.ends_at.date) {
        errors.value.ends_at.date = {
            show: true,
            message: "Informe uma data de término das vendas."
        }
        const fieldToScroll = document.querySelector("#ends_atDateTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else if (!form.value.period_sales.batch && !form.value.ends_at.hm) {
        errors.value.ends_at.hm = {
            show: true,
            message: "Informe o horario de término das vendas."
        }
        const fieldToScroll = document.querySelector("#ends_atHmTicketField")
        fieldToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
        hasError.value = true
    } else {
        hasError.value = false
    }
}

// Crie uma função com a finalidade de criar un novo lote.
const submit = async () => {
    validateBatchForm()
    if (!hasError.value) {
        loadingBatch.value = true
        const data = modal.value.data
        if (!data.requestAPI) {
            setTimeout(() => {
                if (modal.value.data.action == 'create') {
                    console.log(form.value)
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
                }).then(() => {
                    store.dispatch("addNewBatch", res.data.novoLote)
                    close()
                    toast("Ingresso criado com sucesso!", {
                        theme: "colored",
                        position: "bottom-center",
                        autoClose: 2500,
                        type: 'success'
                    })
                }).catch(() => {
                    close()
                    toast("Aconteceu um erro ao criar o ingresso.", {
                        theme: "colored",
                        position: "bottom-center",
                        autoClose: 2500,
                        type: 'error'
                    })
                })
            } else {
                console.log("Editar")
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
    } else {
        form.value = _batch
    }

    if (!eventForm.value.batches.length) return
    else {
        processBatches()
    }
})
</script>

<template>
    <div class="lg:w-[300px]">
        <div class="row">
            <div class="mb-2">
                <label class="flex items-center gap-[3px] text-[12px] mb-1">
                    Título do ingresso</label>
                <input
                    class="p-[10px] border w-full !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                    @input="form.name != '' ? errors.name.show = false : errors.name.show = true"
                    id="nameTicketField" v-model="form.name" type="text" placeholder="">
                <small :class="errors.name.show ? 'text-brand-danger block' : 'hidden text-gray-500'">{{
                    errors.name.message }}</small>
            </div>
            <div class="mb-2">
                <label class="flex items-center gap-[3px] text-[12px] mb-1">
                    Quantidade</label>
                <vue-cleave
                    class="p-[10px] border w-full !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                    @input="validateQuantity" id="quantityTicketField" v-model="form.quantity"
                    :options="cleaveConfigQuantity" placeholder="ex: 50" />
                <small :class="errors.quantity.show ? 'text-brand-danger' : 'hidden text-gray-500'">
                    {{
                        errors.quantity.message }}</small>
            </div>
            <div class="mb-2">
                <label class="flex items-center gap-[3px] text-[12px] mb-1">
                    Preço</label>
                <vue-cleave
                    class="p-[10px] border w-full !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                    @input="validatePrice" id="priceTicketField" v-if="form.type != 'free'" v-model="form.price"
                    :options="cleaveConfigPrice" placeholder="Digite o preço" />
                <input v-else type="number" placeholder="Kz" value="0" readonly>
                <small :class="errors.price.show ? 'text-brand-danger' : 'hidden text-gray-500'">
                    {{ errors.price.message
                    }}</small>
            </div>
        </div>
        <div class="col">
            <label class="flex items-center gap-[3px] text-[12px] mb-1">Periódo das vendas:</label>
            <div class="mb-2" style="flex-direction: row;">
                <label class="f-w-600">
                    <input v-model="form.period_sales.type" type="radio" value="forDate">
                    Por data
                </label>
                <label class="f-w-600">
                    <input type="radio" value="forBatch" disabled>
                    Por lote
                </label>
            </div>
        </div>
        <div class="row justify-space-between gap-1">
            <div class="col" v-if="form.period_sales.type !== 'forBatch'">
                <div class="row">
                    <label class="flex items-center gap-[3px] text-[12px] mb-1">Data de Início das Vendas</label>
                    <div id="starts_atDateTicketField" class="mb-2">
                        <date-picker @change="validateStarts_atDate" :disabled-date="disabledStarts_atTime"
                            :lang="langConfig" v-model:value="form.starts_at.date"></date-picker>
                    </div>
                    <small :class="errors.starts_at.date.show ? 'text-brand-danger' : 'hidden text-gray-500'">{{
                        errors.starts_at.date.message }}</small>
                    <div class="mb-2">
                        <label for="Starts_atHm" class="flex items-center gap-[3px] text-[12px] mb-1">
                            Hora de Início
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>

                        <div id="starts_atHmTicketField" class="w-full md:w-[210px]">
                            <date-picker @change="validateStarts_atHm" :clearable="false"
                                v-model:value="form.starts_at.hm" format="HH:mm" type="time"></date-picker>
                        </div>
                        <small :class="errors.starts_at.hm.show ? 'text-brand-danger' : 'hidden text-gray-500'">{{
                            errors.starts_at.hm.message }}</small>
                    </div>
                </div>
            </div>
            <div id="periodSalesBatchTicketField" v-else-if="eventForm.batches.length >= 1" class="col">
                <multiselect :allow-empty="false" placeholder="Selecione o lote" track-by="name" label="name"
                    v-model="form.period_sales.batch" :options="batches">
                </multiselect>
                <small :class="errors.period_sales.batch.show ? 'text-brand-danger' : 'hidden text-gray-500'">{{
                    errors.period_sales.batch.message }}</small>
            </div>
            <div class="col">
                <div class="row">
                    <div class="mb-2">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1">Data de Término das Vendas</label>
                        <div id="ends_atDateTicketField">
                            <date-picker @change="validateEnds_atDate" :disabled-date="disabledEnds_atTime"
                                :lang="langConfig" v-model:value="form.ends_at.date"></date-picker>
                        </div>
                        <small :class="errors.ends_at.date.show ? 'text-brand-danger' : 'hidden text-gray-500'">{{
                            errors.ends_at.date.message }}</small>
                    </div>
                    <div class="mb-2">
                        <label for="starts_atHm" class="flex items-center gap-[3px] text-[12px] mb-1">
                            Hora de Termino
                            <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span>
                        </label>

                        <div id="ends_atHmTicketField" class="w-full md:w-[210px]">
                            <date-picker @change="validateEnds_atHm" :clearable="false"
                                v-model:value="form.ends_at.hm" format="HH:mm" type="time"></date-picker>
                        </div>
                        <small :class="errors.ends_at.hm.show ? 'text-brand-danger' : 'hidden text-gray-500'">{{
                            errors.ends_at.hm.message }}</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="row">
                <div class="col mb-4">
                    <span class="f-w-600 mb-3">Quantidade permitida por compra</span>
                    <div class="flex gap-4 items-center">
                        <div class="mb-2">
                            <label class="flex items-center gap-[3px] text-[12px] mb-1">
                                Mínima</label>
                            <div id="quantity_for_purchaseMinTicketField">
                                <vue-cleave
                                    class="p-[10px] border w-full !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                    @input="validatePurchaseMin" v-model="form.quantity_for_purchase.min"
                                    :options="cleaveConfigPurchaseMinMax" placeholder="Ex: 1" />
                            </div>

                            <small
                                :class="errors.quantity_for_purchase.min.show ? 'text-brand-danger' : 'hidden text-gray-500'">{{
                                    errors.quantity_for_purchase.min.message }}</small>
                        </div>
                        <div class="mb-2">
                            <label class="flex items-center gap-[3px] text-[12px] mb-1">
                                Máxima</label>
                            <div id="quantity_for_purchaseMaxTicketField">
                                <vue-cleave
                                    class="p-[10px] border w-full !rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                                    @input="validatePurchaseMax" v-model="form.quantity_for_purchase.max"
                                    :options="cleaveConfigPurchaseMinMax" placeholder="Ex: 5" />
                            </div>
                            <small
                                :class="errors.quantity_for_purchase.max.show ? 'text-brand-danger' : 'hidden text-gray-500'">{{
                                    errors.quantity_for_purchase.max.message }}</small>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="mb-2">
                        <label class="flex items-center gap-[3px] text-[12px] mb-1">
                            Descrição do Ingresso (opcional):</label>
                        <textarea
                            class="p-[10px] resize-none border w-full !rounded-sm border-gray-300 text-[13px] focus:outline-none !text-gray-600  placeholder:text-gray-400"
                            maxlength="100" rows="2" v-model="form.description"
                            placeholder="Informações adicionais ao nome do ingresso. Ex.: Esse  ingresso dá direito a um copo">
                </textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <div class="row justify-space-between gap-1">
                <div class="col">
                    <strong style="position: relative; top: 1px; font-style: italic">Visibilidade do ingresso:</strong>
                    <div class="mb-2">
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
            </div>
        </div>
        <div class="flex justify-center items-center gap-1">
            <button class="bg-brand-info text-sm font-bold hover:opacity-80 text-white py-2 px-4 rounded-full"
                @click="submit" :disabile="loadingBatch">
                <span v-if="loadingBatch">Processando...</span>
                <span v-else>Criar ingresso</span>
            </button>
            <button class="bg-white text-sm font-bold hover:opacity-80 text-brand-info py-2 px-4 rounded-full"
                @click="close">Cancelar</button>
        </div>
    </div>
</template>