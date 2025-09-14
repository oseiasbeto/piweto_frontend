<script setup>
import { toast } from "vue3-toastify"
import { useStore } from "vuex"
import { ref, computed, onMounted } from "vue"
import { useStaffs } from "@/repositories/staffs-repository"

// Estados reativos
const loading = ref(false)
const hasError = ref(false)
const store = useStore()

// Hooks para requisições HTTP
const { newStaff, loading: loadingNewStaff } = useStaffs()
const { updateRoleStaff, loading: loadingUpdateStaff } = useStaffs()

// Emissão de eventos
const emit = defineEmits(["onclose"])

// Computed properties
const event = computed(() => store.getters.event)
const modal = computed(() => store.getters.modal)

// Formulário e validação
const form = ref({
  phone: "",
  role: "manager"
})

const errors = ref({
  phone: {
    show: false,
    message: "",
    phoneError: null
  },
  role: {
    show: false,
    message: "",
    roleError: null
  }
})

// Validações para telefone angolano
const validatePhone = () => {
  // Formato de telefone angolano: +244 ou 244 seguido de 9 dígitos
  const regex = /^(\+244|244)?(9[1-9]\d{7})$/
  
  if (!form.value.phone) {
    setError('phone', "Este campo é obrigatório.")
  } else if (!regex.test(form.value.phone.replace(/\s/g, ''))) {
    setError('phone', "Digite um número de telefone válido.")
  } else if (errors.value.phone.phoneError === form.value.phone) {
    setError('phone', "Este telefone não é válido.")
  } else {
    clearError('phone')
  }
}

// Formatar telefone enquanto digita
const formatPhone = (event) => {
  let input = event.target.value.replace(/\D/g, '')
  
  if (input.startsWith('244')) {
    input = input.substring(3)
  }
  
  if (input.length > 0) {
    if (input.length <= 9) {
      form.value.phone = input.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
    } else {
      form.value.phone = input.substring(0, 9).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
    }
  } else {
    form.value.phone = ''
  }
  
  validatePhone()
}

const validateRole = () => {
  if (errors.value.role.roleError === form.value.role) {
    setError('role', "O cargo deve ser diferente do anterior.")
  } else {
    clearError('role')
  }
}

const setError = (field, message) => {
  errors.value[field] = {
    ...errors.value[field],
    show: true,
    message
  }
  hasError.value = true
}

const clearError = (field) => {
  errors.value[field] = {
    ...errors.value[field],
    show: false,
    message: ""
  }
  hasError.value = false
}

// Submissão do formulário
const submit = async () => {
  validatePhone()
  validateRole()

  if (hasError.value || loadingNewStaff.value || loadingUpdateStaff.value) return

  try {
    if (modal.value.data.type === 'create') {
      await handleCreateStaff()
    } else {
      await handleUpdateStaff()
    }
  } catch (err) {
    handleError(err)
  }
}

const handleCreateStaff = async () => {
  // Remover espaços do telefone antes de enviar
  const phoneNumber = form.value.phone.replace(/\s/g, '')
  
  const staff = await newStaff({
    eventId: event.value.id,
    phone: phoneNumber,
    role: form.value.role
  })
  
  store.dispatch("addStaffFromStaffs", staff)
  showSuccess("Colaborador adicionado!")
  close()
}

const handleUpdateStaff = async () => {
  const staff = modal.value.data.staff
  await updateRoleStaff({
    staffId: staff._id,
    memberId: staff.member._id,
    eventId: event.value._id,
    role: form.value.role
  })
  
  store.dispatch("updateStaffFromStaffs", {
    role: form.value.role,
    index: staff.index
  })
  showSuccess("Nível de acesso editado!")
  close()
}

const handleError = (err) => {
  if (err.response?.status === 400) {
    const message = err.response.data.message
    
    if (message.includes('This user is already a staff member.')) {
      setError('phone', "Este usuário já é um colaborador.")
    } else if (message.includes('Cannot found user with this phone.')) {
      setError('phone', "Não foi possível encontrar um usuário com este telefone.")
    } else {
      showError("Algo deu errado!")
      close()
    }
  } else {
    showError("Algo deu errado!")
    close()
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

const close = () => {
  emit("onclose")
}

// Inicialização
onMounted(() => {
  if (modal.value.data.staff !== undefined) {
    const staff = modal.value.data.staff
    hasError.value = false
    errors.value.role.roleError = staff.role

    form.value = {
      phone: staff.member.phone || '',
      role: staff.role
    }
  } else {
    hasError.value = true
  }
})
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">
      {{ modal.data.type === 'create' ? 'Adicionar Colaborador' : 'Editar Cargo' }}
    </h2>

    <!-- Campo de Telefone -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-700 mb-1" for="phone">
        Telefone <span class="text-red-500">*</span>
      </label>
      
      <input 
        :id="modal.data.type === 'create' ? 'phone-input' : 'phone-disabled'"
        :class="[
          'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition',
          errors.phone.show ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
          modal.data.type !== 'create' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        ]"
        :readonly="loading"
        :disabled="modal.data.type !== 'create'"
        :value="form.phone"
        @input="formatPhone($event)"
        type="text"
        autocomplete="off"
        placeholder="923 456 789"
        maxlength="11"
      >
    
      
      <p v-show="errors.phone.show" class="mt-1 text-sm text-red-600">
        {{ errors.phone.message }}
      </p>
    </div>

    <!-- Seleção de Cargo -->
    <div class="mb-6">
      <p class="block text-sm font-medium text-gray-700 mb-3">Cargo <span class="text-red-500">*</span></p>
      
      <div class="space-y-3">
        <label 
          v-for="role in [
            { value: 'manager', label: 'Gerente' },
            { value: 'checker', label: 'Coordenador de check-in' }
          ]" 
          :key="role.value"
          :class="[
            'flex items-center p-3 rounded-lg border cursor-pointer transition',
            form.role === role.value 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <input 
            type="radio" 
            :id="`role-${role.value}`"
            v-model="form.role" 
            :value="role.value"
            @change="validateRole"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-3 text-sm font-medium text-gray-700">{{ role.label }}</span>
        </label>
      </div>
      
      <p v-show="errors.role.show" class="mt-2 text-sm text-red-600">
        {{ errors.role.message }}
      </p>
    </div>

    <!-- Ações -->
    <div class="flex justify-end gap-3">
      <button
        @click="close"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Cancelar
      </button>
      
      <button
        v-if="modal.data.type === 'create'"
        @click="submit"
        :disabled="loadingNewStaff || form.phone == '' || loadingUpdateStaff || hasError"
        :class="[
          'px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
          loadingNewStaff || hasError || form.phone == ''
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        ]"
      >
        <span v-if="loadingNewStaff">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adicionando...
        </span>
        <span v-else>Adicionar</span>
      </button>
      
      <button
        v-else
        @click="submit"
        :disabled="loadingUpdateStaff || hasError"
        :class="[
          'px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
          loadingUpdateStaff || hasError
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        ]"
      >
        <span v-if="loadingUpdateStaff">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Salvando...
        </span>
        <span v-else>Salvar alterações</span>
      </button>
    </div>
  </div>
</template>