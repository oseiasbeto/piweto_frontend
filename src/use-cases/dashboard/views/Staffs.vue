<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useStaffs } from "@/repositories/staffs-repository";
import { toast } from "vue3-toastify"
import BtnSpinner from "../components/spinners/BtnSpinner.vue";
import DynamicSearch from "../components/dynamics/DynamicSearch.vue";
const { getStaffs, loading: loadingStaffs } = useStaffs()
const { deleteStaff, loading: loadingDelete } = useStaffs()
import Swal from 'sweetalert2';

const store = useStore()

const _staff = computed(() => {
    return store.getters.staff
})

const event = computed(() => {
    return store.getters.event
})
const user = computed(() => {
    return store.getters.currentUser
})

const staffs = computed(() => {
    return store.getters.staffs
})

const page = ref(1);
const limit = ref(10); // Valor inicial do limite
const status = ref(null);
const q = ref(null);

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

const _deleteStaff = async (staffId, member, index) => {

    const result = await Swal.fire({
        title: 'Remover Cargo?',
        html: `<p>Tem certeza que deseja remover o cargo de <strong>${member.full_name}</strong> deste evento?</p>
           <p class="text-muted">Esta ação não pode ser desfeita.</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, remover cargo!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            await deleteStaff({
                eventId: event.value._id,
                memberId: member._id,
                staffId: staffId
            }).then(() => {
                store.dispatch("removeStaffFromStaffs", index)
            }).catch((error) => {
                Swal.showValidationMessage(`Falha ao remover cargo!`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isConfirmed) {
        // Sucesso na remoção
        Swal.fire({
            title: 'Cargo Removido!',
            text: `O cargo de ${member.full_name} foi removido com sucesso.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        return true; // Retorna true indicando que foi removido
    }

}

const openModal = (name, data) => {
    store.dispatch("setModal", {
        show: true,
        name,
        data: data || {}
    })
}

const performSearch = () => {
    page.value = 1; // Reseta a página ao mudar o limite ou buscar
    fetchStaffs();
};

const fetchStaffs = async () => {
    await getStaffs({
        event: event.value._id,
        page: page.value,
        limit: limit.value,
        ...(status.value && {
            status: status.value
        }),
        q: q.value
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

const handlePrevPage = () => {
    if (staffs?.value?.metadata?.hasPrevPage) {
        page.value = staffs?.value?.metadata?.page - 1;
        fetchStaffs();
    }
};

const handleNextPage = () => {
    if (staffs.value?.metadata?.hasNextPage) {
        page.value = staffs?.value?.metadata?.page + 1;
        fetchStaffs();
    }
};

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
        <div class="bg-white p-4 mb-5 relative inline-block w-full shadow-md rounded-md">
            <div class="flex flex-col lg:flex-row items-center justify-between mb-4 gap-4">
                <div class="lg:max-w-80 w-full">
                    <DynamicSearch v-model:search="q" :loading="loadingStaffs" @update:search="performSearch" />
                </div>
                <div class="lg:w-auto w-full">
                    <button v-if="_staff.role == 'manager'" @click="openModal('staff-form', { type: 'create' })"
                        class="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md focus:outline-none w-full focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Novo colaborador(a)
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto">
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
                                    <div class="w-[12px] h-[12px] rounded-full"
                                        :class="statusBgColor(staff.invite.status)">
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

                            <td v-if="_staff.role == 'manager' && _staff.member != staff.member._id && !staff.member._id !== event?.created_by"
                                class="px-4 py-3 flex items-center gap-2 text-gray-500">
                                <button @click="openModal('staff-form', { staff: { ...staff, index }, type: 'edit' })"
                                    v-if="staff.status == 'accepted'">Editar</button>
                                <button v-if="staff.status == 'pending'">Reenviar</button>
                                <button
                                    class="border border-red-500 hover:bg-red-500 hover:text-white transition-colors text-red-500 py-2 px-3 text-xs font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                                    :disabled="loadingDelete" @click="_deleteStaff(staff._id, staff.member, index)">
                                    Remover
                                </button>
                            </td>

                            <td class="px-4 py-3 flex items-center gap-2 text-gray-500"
                                v-if="_staff.member == staff.member._id && event?.created_by?._id !== user._id">
                                <button
                                :disabled="staff.member._id === user._id"
                                    class="border border-red-500 hover:bg-red-500 hover:text-white transition-colors text-red-500 py-2 px-3 text-xs font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">Desfazer
                                </button>
                            </td>
                        </tr>
                        <tr v-else>
                            <td class="px-4 py-3 text-nowrap text-gray-500">Nenhum colaborador encotrado</td>
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

            <div class="w-full">
                <div class="flex flex-col sm:flex-row items-center justify-between py-4 px-4">
                    <!-- Informação de resultados -->
                    <div class="flex items-center gap-2 mb-4 sm:mb-0">
                        <p class="text-sm flex-1 text-gray-600">
                            Mostrando
                            <span class="font-medium">{{ staffs?.metadata?.page || 1 }}</span>
                            a
                            <span class="font-medium">{{ staffs?.metadata?.limit || 10 }}</span>
                            de
                            <span class="font-medium">{{ staffs?.metadata?.total || 0 }}</span>
                            resultados
                        </p>

                    </div>


                    <!-- Controles de paginação -->
                    <div class="flex items-center space-x-2">
                        <button @click="handlePrevPage" :disabled="!staffs?.metadata?.hasPrevPage"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="{ 'opacity-50 cursor-not-allowed': !staffs?.metadata?.hasPrevPage }">
                            Anterior
                        </button>
                        <select v-model="limit" @change="performSearch"
                            class="block w-auto px-[20px] py-2 text-sm font-medium shrink-0 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none">
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                        <button @click="handleNextPage" :disabled="!staffs?.metadata?.hasNextPage"
                            class="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="{ 'opacity-50 cursor-not-allowed': !staffs?.metadata?.hasNextPage }">
                            Próximo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>