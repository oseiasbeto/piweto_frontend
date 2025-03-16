<script setup>
import { useEvents } from '@/repositories/events-repository';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify"

const { editEvent, loading } = useEvents()
loading.value = false

const store = useStore()

// Define os eventos de emissão deste componente.
const emit = defineEmits(["onclose"])

const form = ref({
    iban: "",
    bank_name: "BAI",
    account_holder: ""
});

const event = computed(() => {
    return store.getters.event
})

const modal = computed(() => {
    return store.getters.modal
})

const errors = ref({
    iban: {
        show: false,
        message: '',
    },
    account_holder: {
        show: false,
        message: '',
    }
});

const validateIBAN = () => {
    const ibanRegex = /^AO\d+$/;
    if (!form.value.iban) {
        errors.value.iban = {
            show: true,
            message: 'Certifique-se de inserir um IBAN válido.',
        }
    } else if (!ibanRegex.test(form.value.iban)) {
        errors.value.iban = {
            show: true,
            message: 'O formato correto é: "AO" seguido apenas de dígitos numéricos, sem espaços ou símbolos especiais.',
        }
    } else {
        errors.value.iban = {
            show: false,
            message: '',
        }
    }
}

const validateAccountHolder = () => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // Permite letras (acentuadas ou não) e espaços

    if (!form.value.account_holder) {
        errors.value.account_holder = {
            show: true,
            message: 'O nome do titular é obrigatório.',
        };
    } else if (form.value.account_holder.length < 2) {
        errors.value.account_holder = {
            show: true,
            message: 'O nome do titular deve ter pelo menos 2 caracteres.',
        };
    } else if (!nameRegex.test(form.value.account_holder)) {
        errors.value.account_holder = {
            show: true,
            message: 'O nome do titular deve conter apenas letras e espaços, sem números ou símbolos.',
        };
    } else {
        errors.value.account_holder = {
            show: false,
            message: '',
        };
    }
};

const submitForm = async () => {
    validateIBAN();
    validateAccountHolder();

    if (errors.value.iban.show || errors.value.account_holder.show) return;

    console.log("Iniciando envio...");

    // Verifica se os valores não são undefined
    if (!form.value.iban || !form.value.bank_name || !form.value.account_holder) {
        console.error("Erro: Campos obrigatórios não preenchidos.");
        return;
    }

    try {
        await editEvent({
            _id: event?.value._id,
            iban: form.value.iban,
            bank_name: form.value.bank_name,
            account_holder: form.value.account_holder,
        }).then(() => {
            store.dispatch("updateEvent", {
                data_bank: {
                    iban: form.value.iban,
                    bank_name: form.value.bank_name,
                    account_holder: form.value.account_holder
                }
            })
            toast('Coordenadas bancárias adicionadas com sucesso!', {
                theme: "colored",
                position: "top-right",
                autoClose: 2500,
                type: 'success'
            })
        }).finally(() => {
            closeModal();
        })
            .catch(() => {
                toast('Erro ao adicionar coordenadas bancárias.', {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2500,
                    type: 'error'
                })
            })
        console.log("Envio concluído com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar os dados:", error);
    }
};

const closeModal = () => {
    emit("onclose")
};

onMounted(() => {
    if(modal?.value?.data?.data_bank) {
        const data_bank = modal?.value?.data?.data_bank
        form.value = data_bank
    } else return
})
</script>

<template>
    <div class="bg-white p-6 rounded-sm shadow-lg w-full lg:w-96">
        <h2 class="text-xl font-semibold mb-4">Dados Bancários</h2>
        <div>
            <!-- IBAN -->
            <label class="text-xs flex items-center gap-0.5 text-gray-500 mb-2 font-bold">IBAN <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span></label>
            <input @input="validateIBAN" type="text" v-model="form.iban"
                class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                placeholder="ex: AO06005100000011111177881" :class="{ '!border-brand-danger': errors.iban.show }">
            <p class="text-brand-danger leading-5 text-xs mt-1" v-show="errors.iban.show">
                {{ errors.iban.message }}
            </p>
            <!-- Bank Name -->
            <label class="flex items-center gap-0.5 mt-4 mb-2 text-xs text-gray-500 font-bold">Nome do Banco <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span></label>
            <select v-model="form.bank_name"
                class="w-full outline-none focus:border-brand-info text-sm border border-gray-300 rounded py-2 p-4"
                required>
                <option value="BAI">BAI - Banco Angolano de Investimentos - AO060040</option>
                <option value="BFA">BFA - Banco de Fomento Angola - AO060006</option>
                <option value="YETU">YETU - Banco Yetu - AO060066</option>
                <option value="BANC">BANC - Banco Angolano de Negócios e Comércio - AO060053</option>
                <option value="BMF">BMF - Banco BAI Microfinanças - AO060048</option>
                <option value="BIC">BIC - Banco BIC - AO060051</option>
                <option value="BCA">BCA - Banco Comercial Angolano - AO060043</option>
                <option value="BCH">BCH - Banco Comercial do Huambo - AO060059</option>
                <option value="BCI">BCI - Banco de Comércio e Indústria - AO060005</option>
                <option value="BDA">BDA - Banco de Desenvolvimento Angola - AO060054</option>
                <option value="BIR">BIR - Banco de Investimento Rural - AO060067</option>
                <option value="BNI">BNI - Banco de Negócios Internacional - AO060052</option>
                <option value="BPC">BPC - Banco de Poupança e Crédito - AO060010</option>
                <option value="BE">BE - Banco Económico - AO060045</option>
                <option value="KEVE">KEVE - Banco Keve - AO060047</option>
                <option value="BKI">BKI - Banco Kwanza Investimento - AO060057</option>
                <option value="BPG">BPG - Banco Prestígio - AO060064</option>
                <option value="BPA">BPA - Banco Millennium Atlântico - AO060055</option>
                <option value="BMAIS">BMAIS - Banco Mais - AO060065</option>
                <option value="BSOL">BSOL - Banco Sol - AO060044</option>
                <option value="BVB">BVB - Banco Valor - AO060062</option>
                <option value="FNB">FNB - Finibanco Angola - AO060058</option>
                <option value="SBA">SBA - Standard Bank de Angola - AO060058</option>
                <option value="VTB">VTB - Banco VTB África - AO060056</option>
                <option value="BCGA">BCGA - Banco Caixa Geral de Angola - AO060004</option>
                <option value="SCBA">SCBA - Standard Chartered Bank de Angola - AO060063</option>
                <option value="CCP">CCP - AO060000</option>
                <option value="USPM">USPM - AO060417</option>
                <option value="BCS">BCS - AO060070</option>
                <option value="PAGAMENTO">PAGAMENTO - AO060420</option>
            </select>

            <!-- Account Holder -->
            <label class="mt-4 flex items-center gap-0.5 mb-2 text-xs text-gray-500 font-bold">Titular da Conta <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span></label>
            <input @input="validateAccountHolder" placeholder="ex: Jaime Augusto Oliveira" type="text"
                v-model="form.account_holder"
                class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                :class="{ '!border-brand-danger': errors.account_holder.show }">

            <p class="text-brand-danger leading-5 text-xs mt-1" v-show="errors.account_holder.show">
                {{ errors.account_holder.message }}
            </p>

            <!-- Buttons -->
            <div class="flex justify-end mt-6">
                <button :disabled="loading" type="button" @click="closeModal"
                    class="bg-white text-sm font-bold hover:opacity-80 text-brand-info py-2 px-4 rounded-full">Cancelar</button>
                <button :disabled="loading" type="submit" @click="submitForm"
                    class="bg-brand-info disabled:bg-gray-300 disabled:text-gray-500 text-sm font-bold hover:opacity-80 text-white py-2 px-4 rounded-full">
                    {{ loading ? 'Salvando...' : 'Salvar' }}
                </button>
            </div>
        </div>
    </div>
</template>
