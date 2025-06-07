<script setup>
import { useEvents } from '@/repositories/events-repository';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify"

// Estados reativos
const { editEvent, loading } = useEvents()
const store = useStore()
loading.value = false

// Emissão de eventos
const emit = defineEmits(["onclose"])

// Dados do formulário
const form = ref({
  iban: "",
  bank_name: "BAI",
  account_holder: ""
})

// Computed properties
const event = computed(() => store.getters.event)
const modal = computed(() => store.getters.modal)

// Validação de erros
const errors = ref({
  iban: {
    show: false,
    message: '',
  },
  account_holder: {
    show: false,
    message: '',
  }
})

// Lista de bancos
const banks = [
  { value: "BAI", label: "BAI - Banco Angolano de Investimentos - AO060040" },
  { value: "BFA", label: "BFA - Banco de Fomento Angola - AO060006" },
  { value: "YETU", label: "YETU - Banco Yetu - AO060066" },
  { value: "BANC", label: "BANC - Banco Angolano de Negócios e Comércio - AO060053" },
  { value: "BMF", label: "BMF - Banco BAI Microfinanças - AO060048" },
  { value: "BIC", label: "BIC - Banco BIC - AO060051" },
  { value: "BCA", label: "BCA - Banco Comercial Angolano - AO060043" },
  { value: "BCH", label: "BCH - Banco Comercial do Huambo - AO060059" },
  { value: "BCI", label: "BCI - Banco de Comércio e Indústria - AO060005" },
  { value: "BDA", label: "BDA - Banco de Desenvolvimento Angola - AO060054" },
  { value: "BIR", label: "BIR - Banco de Investimento Rural - AO060067" },
  { value: "BNI", label: "BNI - Banco de Negócios Internacional - AO060052" },
  { value: "BPC", label: "BPC - Banco de Poupança e Crédito - AO060010" },
  { value: "BE", label: "BE - Banco Económico - AO060045" },
  { value: "KEVE", label: "KEVE - Banco Keve - AO060047" },
  { value: "BKI", label: "BKI - Banco Kwanza Investimento - AO060057" },
  { value: "BPG", label: "BPG - Banco Prestígio - AO060064" },
  { value: "BPA", label: "BPA - Banco Millennium Atlântico - AO060055" },
  { value: "BMAIS", label: "BMAIS - Banco Mais - AO060065" },
  { value: "BSOL", label: "BSOL - Banco Sol - AO060044" },
  { value: "BVB", label: "BVB - Banco Valor - AO060062" },
  { value: "FNB", label: "FNB - Finibanco Angola - AO060058" },
  { value: "SBA", label: "SBA - Standard Bank de Angola - AO060058" },
  { value: "VTB", label: "VTB - Banco VTB África - AO060056" },
  { value: "BCGA", label: "BCGA - Banco Caixa Geral de Angola - AO060004" },
  { value: "SCBA", label: "SCBA - Standard Chartered Bank de Angola - AO060063" },
  { value: "CCP", label: "CCP - AO060000" },
  { value: "USPM", label: "USPM - AO060417" },
  { value: "BCS", label: "BCS - AO060070" },
  { value: "PAGAMENTO", label: "PAGAMENTO - AO060420" }
]

// Validações
const validateIBAN = () => {
  const ibanRegex = /^AO\d+$/;
  if (!form.value.iban) {
    setError('iban', 'Certifique-se de inserir um IBAN válido.')
  } else if (!ibanRegex.test(form.value.iban)) {
    setError('iban', 'O formato correto é: "AO" seguido apenas de dígitos numéricos, sem espaços ou símbolos especiais.')
  } else {
    clearError('iban')
  }
}

const validateAccountHolder = () => {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  
  if (!form.value.account_holder) {
    setError('account_holder', 'O nome do titular é obrigatório.')
  } else if (form.value.account_holder.length < 2) {
    setError('account_holder', 'O nome do titular deve ter pelo menos 2 caracteres.')
  } else if (!nameRegex.test(form.value.account_holder)) {
    setError('account_holder', 'O nome do titular deve conter apenas letras e espaços, sem números ou símbolos.')
  } else {
    clearError('account_holder')
  }
}

const setError = (field, message) => {
  errors.value[field] = { show: true, message }
}

const clearError = (field) => {
  errors.value[field] = { show: false, message: '' }
}

// Submissão do formulário
const submitForm = async () => {
  validateIBAN()
  validateAccountHolder()

  if (errors.value.iban.show || errors.value.account_holder.show) return

  try {
    await editEvent({
      _id: event.value._id,
      iban: form.value.iban,
      bank_name: form.value.bank_name,
      account_holder: form.value.account_holder,
    })
    
    store.dispatch("updateEvent", {
      data_bank: {
        iban: form.value.iban,
        bank_name: form.value.bank_name,
        account_holder: form.value.account_holder
      }
    })
    
    showSuccess('Coordenadas bancárias adicionadas com sucesso!')
    closeModal()
  } catch (error) {
    console.error("Erro ao enviar os dados:", error)
    showError('Erro ao adicionar coordenadas bancárias.')
  }
}

const showSuccess = (message) => {
  toast(message, {
    theme: "colored",
    position: "top-right",
    autoClose: 2500,
    type: 'success'
  })
}

const showError = (message) => {
  toast(message, {
    theme: "colored",
    position: "top-right",
    autoClose: 2500,
    type: 'error'
  })
}

const closeModal = () => {
  emit("onclose")
}

// Inicialização
onMounted(() => {
  if (modal.value?.data?.data_bank) {
    form.value = { ...modal.value.data.data_bank }
  }
})
</script>

<template>
  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Dados Bancários</h2>
      <p class="text-sm text-gray-500 mt-1">Preencha as informações da conta bancária</p>
    </div>

    <!-- Campo IBAN -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        IBAN <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.iban"
        @input="validateIBAN"
        type="text"
        placeholder="Ex: AO06005100000011111177881"
        :class="[
          'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition',
          errors.iban.show 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]"
      >
      <p v-show="errors.iban.show" class="mt-1 text-sm text-red-600">
        {{ errors.iban.message }}
      </p>
    </div>

    <!-- Seleção de Banco -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Banco <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.bank_name"
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
      >
        <option v-for="bank in banks" :key="bank.value" :value="bank.value">
          {{ bank.label }}
        </option>
      </select>
    </div>

    <!-- Titular da Conta -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Titular da Conta <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.account_holder"
        @input="validateAccountHolder"
        type="text"
        placeholder="Ex: Jaime Augusto Oliveira"
        :class="[
          'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition',
          errors.account_holder.show 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]"
      >
      <p v-show="errors.account_holder.show" class="mt-1 text-sm text-red-600">
        {{ errors.account_holder.message }}
      </p>
    </div>

    <!-- Botões de Ação -->
    <div class="flex justify-end gap-3 pt-2">
      <button
        @click="closeModal"
        :disabled="loading"
        class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Cancelar
      </button>
      <button
        @click="submitForm"
        :disabled="loading"
        :class="[
          'px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        ]"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Salvando...
        </span>
        <span v-else>Salvar</span>
      </button>
    </div>
  </div>
</template>