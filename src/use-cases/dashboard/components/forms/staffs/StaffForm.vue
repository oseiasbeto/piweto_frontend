<script setup>
//Importe os pacotes necessários.
import { toast } from "vue3-toastify"
import { useStore } from "vuex"
import { ref, computed, onMounted } from "vue"
import { useStaffs } from "@/repositories/staffs-repository";

// Crie as referências globais deste componente.
const loading = ref(false)
const hasError = ref(false)
const store = useStore()

// Estas hooks tem como finalidade fazer requesicoes HTTPS
const { newStaff, loading: loadingNewStaff } = useStaffs()
const { updateRoleStaff, loading: loadingUpdateStaff } = useStaffs()

// Define os eventos de emissão deste componente.
const emit = defineEmits(["onclose"])

// Esta função computada tem como finalidade Retornar os dados do corrente evento.
const event = computed(() => {
    return store.getters.event
})

// Esta função computada tem como finalidade Retornar os dados do formulário do corrente lote.
const form = ref({
    email: "",
    role: "manager"
})

// Esta função computada tem como finalidade Retornar os dados da caixa de diálogo aberta.
const modal = computed(() => {
    return store.getters.modal
})

// Referencia de erros
const errors = ref({
    email: {
        show: false,
        message: "",
        emailError: null
    },
    role: {
        show: false,
        message: "",
        roleError: null
    }
})

// Esta função tem como finalidade validar o campo e-mail
const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (form.value.email == "") {
        errors.value.email = {
            show: true,
            message: "Este campo é obrigatório.",
            emailError: errors.value.email.emailError
        }
        hasError.value = true
    } else if (!regex.test(form.value.email)) {
        errors.value.email = {
            show: true,
            message: "Por favor, digite um e-mail válido.",
            emailError: errors.value.email.emailError
        }
        hasError.value = true
    } else if (errors.value.email.emailError == form.value.email) {
        errors.value.email = {
            show: true,
            message: "Este e-mail nao e valido.",
            emailError: errors.value.email.emailError
        }
        hasError.value = true
    } else {
        errors.value.email = {
            show: false,
            message: "",
            emailError: errors.value.email.emailError
        }
        hasError.value = false
    }
}

// Esta função tem como finalidade validar o campo cargo
const validateRole = () => {
    if (errors.value.role.roleError == form.value.role) {
        errors.value.role = {
            show: true,
            message: "O cargo deve ser diferente do anterior.",
            roleError: errors.value.role.roleError
        }
        hasError.value = true
    } else {
        errors.value.role = {
            show: false,
            message: "",
            roleError: errors.value.role.roleError
        }
        hasError.value = false
    }
}

// Esta função tem como finalidade submeter a requesicao
const submit = async () => {
    validateEmail()
    validateRole()

    // Isto deve privar o usuario caso haja um erro ou se ha algo em processamento.
    if (!hasError.value && !loadingNewStaff.value || loadingUpdateStaff.value) {

        // Caso a propriedade da caixa de dialogo type == 'create' entao crie um novo colaboradr
        if (modal.value.data.type == 'create') {
            await newStaff({
                eventId: event.value.id,
                email: form.value.email,
                role: form.value.role
            }).then((staff) => {
                store.dispatch("addStaffFromStaffs", staff)
                close()
                toast("Colaborador adicionado!", {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2500,
                    type: 'success'
                })
            }).catch(err => {
                if (err.response.status == 400) {
                    hasError.value = true
                    const message = err.response.data.message

                    if (message == 'ups! nao existe nenhum usuario activo com este email em nosso servidor.') {
                        errors.value.email = {
                            show: true,
                            message: "Nao existe nenhum usuario activo com este e-mail.",
                            emailError: form.value.email
                        }
                    } else if (message == 'opa! este usuario e um colaborador deste evento.') {
                        errors.value.email = {
                            show: true,
                            message: "Este usuario ja colabora neste evento.",
                            emailError: form.value.email
                        }
                    } else {
                        close()
                        toast("Algo deu errado!", {
                            theme: "colored",
                            position: "top-right",
                            autoClose: 2500,
                            type: 'error'
                        })
                    }
                }
            })
        }
        // Caso for diferente que 'create' entao edite o colaborador.
        else {
            const staff = modal.value.data.staff
            await updateRoleStaff({
                staffId: staff._id,
                memberId: staff.member._id,
                eventId: event.value._id,
                role: form.value.role
            }).then(() => {
                store.dispatch("updateStaffFromStaffs", {
                    role: form.value.role,
                    index: staff.index
                })
                close()
                toast("Nivel de acesso editado!", {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2500,
                    type: 'success'
                })
            }).catch(err => {
                console.log(err)
                if (err.response.status == 400) {
                    close()
                    toast("Algo deu errado!", {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2500,
                        type: 'error'
                    })
                }
            })
        }
    } else return
}

// Esta função tem como finalidade emitir um evento de fecho da caixa de diálogo aberta ou cancela.
const close = () => {
    emit("onclose")
}

onMounted(() => {
    if (modal.value.data.staff !== undefined) {
        const staff = modal.value.data.staff
        hasError.value = false
        errors.value.role.roleError = staff.role

        form.value = {
            email: staff.member.email,
            role: staff.role
        }
    } else {
        hasError.value = true
    }
})
</script>

<template>
    <div class="bg-white p-5 shadow-xl rounded-sm max-w-96">
        <!--start email field area-->
        <div v-if="modal.data.type == 'create'" class="flex flex-col mb-2">
            <label class="text-xs w-min cursor-pointer flex gap-0.5 mb-2" for="email">
                <p class="whitespace-nowrap">E-mail</p>
                <span class="text-brand-danger">*</span>
            </label>

            <input autocomplete="off" :readonly="loading" @input="validateEmail" type="text" id="email"
                v-model="form.email" :class="{ '!border-brand-danger': errors.email.show }
                    ">

            <span class="text-brand-danger text-xs mt-1" v-show="errors.email.show">
                {{ errors.email.message }}
            </span>
        </div>
        <div v-else class="flex flex-col mb-2">
            <label class="text-xs w-min cursor-pointer flex gap-0.5 mb-2" for="email">
                <p class="whitespace-nowrap">E-mail</p>
                <span class="text-brand-danger">*</span>
            </label>

            <input disabled type="text" id="email" :value="form.email">

            <span class="text-brand-danger text-xs mt-1" v-show="errors.email.show">

            </span>
        </div>
        <!--end email field area-->

        <!--start roles field area-->
        <div>
            <div class="flex flex-col">
                <label class="text-xs w-min cursor-pointer flex gap-0.5 mb-2" for="role-manager">
                    <input v-model="form.role" value="manager" @change="validateRole" id="role-manager" type="radio">
                    <p class="whitespace-nowrap">Gerente</p>
                </label>
            </div>

            <div class="flex flex-col">
                <label class="text-xs w-min cursor-pointer flex gap-0.5 mb-2" for="role-checker">
                    <input v-model="form.role" value="checker" @change="validateRole" id="role-checker" type="radio">
                    <p class="whitespace-nowrap">Coordenador de check-in</p>
                </label>

                <span class="text-brand-danger text-xs my-1" v-show="errors.role.show">
                    {{ errors.role.message }}
                </span>
            </div>

            <div class="flex flex-col">
                <label class="text-xs w-min cursor-pointer flex gap-0.5 mb-2" for="role-pdv">
                    <input v-model="form.role" value="pdv" @change="validateRole" id="role-pdv" type="radio">
                    <p class="whitespace-nowrap">PDV (Ponto de vendas)</p>
                </label>
            </div>


        </div>
        <!--end roles field area-->
        <div class="flex gap-2 items-center">
            <button @click="close">Cancelar</button>

            <button v-if="modal.data.type == 'create'" :disabled="loadingNewStaff || loadingUpdateStaff || hasError"
                @click="submit">
                {{ loadingNewStaff ? 'Carregando...' : 'Enviar convite' }}
            </button>

            <button v-else :disabled="loadingUpdateStaff || hasError" @click="submit">
                {{ loadingUpdateStaff ? 'Carregando...' : 'Editar' }}
            </button>
        </div>
    </div>
</template>