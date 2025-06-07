<script setup>
import { onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useStaffs } from "@/repositories/staffs-repository";
import { toast } from "vue3-toastify"
import BtnSpinner from "../components/spinners/BtnSpinner.vue";
const { getStaffs, loading: loadingStaffs } = useStaffs()
const { deleteStaff, loading: loadingDelete } = useStaffs()

const store = useStore()

const _staff = computed(() => {
    return store.getters.staff
})

const event = computed(() => {
    return store.getters.event
})

const staffs = computed(() => {
    return store.getters.staffs
})

const statusBgColor = (status) => {
    switch (status) {
        case "p":
            return "bg-yellow-500"
        case "a":
            return "bg-green-500"
        case "r":
            return "bg-red-500"
        default:
            return 'bg-gray-300'
    }
}
const statusTxtColor = (status) => {
    switch (status) {
        case "p":
            return "text-yellow-500"
        case "a":
            return "text-green-500"
        case "r":
            return "text-red-500"
        default:
            return 'text-gray-300'
    }
}

const generateRoleLegend = (role) => {
    switch (role) {
        case "manager":
            return "Gerente"
        case "checker":
            return "Coordenador de check-in"
        case "pdv":
            return "PDV (Ponto de venda)"
    }
}

const generateStatusLegend = (status) => {
    switch (status) {
        case "p":
            return "Pendente"
        case "a":
            return "Aceito"
        case "r":
            return "Rejeitado"
    }
}

const _deleteStaff = async (staffId, memberId, index) => {
    await deleteStaff({
        eventId: event.value._id,
        memberId: memberId,
        staffId: staffId
    }).then(() => {
        toast("Colaborador excluido!", {
            theme: "colored",
            position: "top-right",
            autoClose: 2500,
            type: 'success'
        })
        store.dispatch("removeStaffFromStaffs", index)
    })
}

const openModal = (name, data) => {
    store.dispatch("setModal", {
        show: true,
        name,
        data: data || {}
    })
}

const fetchStaffs = async () => {
    await getStaffs({
        event: event.value._id,
        page: 1,
        limit: 10
    }).then((res) => {
        const data = res.data.staffs;
        const metadata = res.data.metadata;

        store.dispatch("setStaffs", {
            data,
            metadata,
            hasViewed: true
        })
    })
}

onMounted(async () => {
    if (event?.value?._id) {
        fetchStaffs()
    }
})
// Observa quando `event` muda e chama a função
watch(event, (newEvent) => {
    if (newEvent) {
        fetchStaffs();
    }
});
</script>

<template>
    <div>
        <div class="flex justify-end mb-2">
            <button v-if="_staff.role == 'manager'" @click="openModal('staff-form', { type: 'create' })"
                class="px-4 py-2 bg-brand-primary text-xs font-semibold text-white rounded-sm duration-200">
                Adicionar colaborador
            </button>
        </div>
        <div class="bg-white p-4 mb-5 relative overflow-x-auto inline-block w-full shadow-md rounded-md">
            <table class="w-full text-sm text-left border border-gray-100">
                <thead class="text-xs border-b border-gray-100 text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th class="px-4 py-3">
                            Status do convite
                        </th>
                        <th class="px-4 py-3">
                            Colaborador
                        </th>
                        <th class="px-4 py-3">
                            Nivel de Acesso
                        </th>
                        <th class="px-4 py-3">

                        </th>
                    </tr>
                </thead>
                <tbody v-if="!loadingStaffs">
                    <tr v-if="staffs.data.length" v-for="(staff, index) in staffs.data" :key="staff._id"
                        class=" bg-white border-b border-gray-100">

                        <td class="px-4 py-3" :class="statusTxtColor(staff.invite.status)">
                            <div class="flex items-center gap-2">
                                <div class="w-[12px] h-[12px] rounded-full" :class="statusBgColor(staff.invite.status)">
                                </div>
                                <p>{{ generateStatusLegend(staff.invite.status) }}</p>
                            </div>

                        </td>

                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ staff.member.full_name }}</p>
                        </td>

                        <td class="px-4 py-3 text-gray-500 text-nowrap">
                            {{ generateRoleLegend(staff.role) }}
                        </td>

                        <td v-if="_staff.role == 'manager' && _staff.member != staff.member._id && !staff.isCreator"
                            class="px-4 py-3 flex items-center gap-2 text-gray-500">
                            <button @click="openModal('staff-form', { staff: { ...staff, index }, type: 'edit' })"
                                v-if="staff.status == 'accepted'">Editar</button>
                            <button v-if="staff.status == 'pending'">Reenviar</button>
                            <button :disabled="loadingDelete"
                                @click="_deleteStaff(staff._id, staff.member._id, index)">Excluir</button>
                        </td>

                        <td class="px-4 py-3 flex items-center gap-2 text-gray-500"
                            v-if="_staff.member == staff.member._id">
                            <button>Desfazer</button>
                        </td>
                    </tr>
                    <tr v-else>
                        <td class="px-4 py-3 text-nowrap">Nenhum colaborador encotrado</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td class="p-4 mx-auto">
                            <BtnSpinner />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>