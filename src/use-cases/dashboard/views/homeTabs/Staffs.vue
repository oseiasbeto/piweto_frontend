<script setup>
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { useStaffs } from "@/repositories/staffs-repository";
import { toast } from "vue3-toastify"
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
        case "pending":
            return "bg-yellow-500"
        case "accepted":
            return "bg-green-500"
        case "rejected":
            return "bg-red-500"
        default:
            return 'bg-gray-300'
    }
}
const statusTxtColor = (status) => {
    switch (status) {
        case "pending":
            return "text-yellow-500"
        case "accepted":
            return "text-green-500"
        case "rejected":
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
        case "pending":
            return "Pendente"
        case "accepted":
            return "Aceito"
        case "rejected":
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

onMounted(async () => {
    if (staffs.value.hasViewed) {
        loadingStaffs.value = false
    } else {
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
})
</script>

<template>
    <div>
        <div>
            <button v-if="_staff.role == 'manager'" @click="openModal('staff-form', {type: 'create'})">Adicionar colaborador</button>
        </div>
        <div>
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
                    <tr v-for="(staff, index) in staffs.data" :key="staff._id"
                        class=" bg-white border-b border-gray-100">
                        <td class="px-4 py-3" :class="statusTxtColor(staff.status)">
                            <div class="flex items-center gap-2">
                                <div class="w-[12px] h-[12px] rounded-full" :class="statusBgColor(staff.status)"></div>
                                <p>{{ generateStatusLegend(staff.status) }}</p>
                            </div>

                        </td>

                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ staff.member.fullName }}</p>
                        </td>

                        <td class="px-4 py-3 text-gray-500 text-nowrap">
                            {{ generateRoleLegend(staff.role) }}
                        </td>

                        <td v-if="_staff.role == 'manager' && _staff.member != staff.member._id && !staff.isCreator"
                            class="px-4 py-3 flex items-center gap-2 text-gray-500">
                            <button @click="openModal('staff-form', {staff: {...staff, index}, type: 'edit'})" v-if="staff.status == 'accepted'">Editar</button>
                            <button v-if="staff.status == 'pending'">Reenviar</button>
                            <button :disabled="loadingDelete"
                                @click="_deleteStaff(staff._id, staff.member._id, index)">Excluir</button>
                        </td>

                        <td class="px-4 py-3 flex items-center gap-2 text-gray-500"
                            v-if="_staff.member == staff.member._id">
                            <button>Desfazer</button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        Carregando...
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>