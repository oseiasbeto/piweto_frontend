<script setup>
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import { useCoupons } from "@/repositories/coupons-repository";
import moment from "moment";

const { getCoupons, loading: loadingCoupons } = useCoupons()

const store = useStore()

const event = computed(() => {
    return store.getters.event
})
const staff = computed(() => {
    return store.getters.staff
})

const coupons = computed(() => {
    return store.getters.coupons
})

const openModal = (name, data) => {
    store.dispatch("setModal", {
        show: true,
        name,
        data: data || {}
    })
}

onMounted(async () => {
    if (coupons.value.hasViewed) {
        loadingCoupons.value = false
    } else {
        await getCoupons({
            event: event.value._id,
            page: 1,
            limit: 10
        }).then((res) => {
            const data = res.data.coupons;
            const metadata = res.data.metadata;

            store.dispatch("setCoupons", {
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
            <button @click="openModal('coupon-form', { type: 'create' })">Adiconar cupom</button>
        </div>
        <div>
            <table class="w-full text-sm text-left border border-gray-100">
                <thead class="text-xs border-b border-gray-100 text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th class="px-4 py-3">
                            Nome do Cupom
                        </th>
                        <th class="px-4 py-3">
                            Desconto
                        </th>
                        <th class="px-4 py-3">
                            Limite de uso
                        </th>
                        <th class="px-4 py-3">
                            Casos de uso
                        </th>
                        <th class="px-4 py-3">
                            Valido ate
                        </th>
                        <th class="px-4 py-3">

                        </th>
                    </tr>
                </thead>
                <tbody v-if="!loadingCoupons">
                    <tr v-if="coupons.data.length" v-for="(coupon, index) in coupons.data" :key="coupons._id"
                        class=" bg-white border-b border-gray-100">

                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ coupon.name }}</p>
                        </td>

                        <td class="px-4 py-3 text-gray-500 text-nowrap">
                            {{ coupon.discount }}%
                        </td>

                        <td class="px-4 py-3 text-gray-500 text-nowrap">
                            {{ coupon.usePeopleCountType == 'no limit' ? 'Sem limites' : `${coupon.usePeopleCount} pessoa(s)` }}
                        </td>

                        <td class="px-4 py-3 text-gray-500 text-nowrap">
                            {{ coupon.usedPeopleCount + ' pessoa(s)' }}
                        </td>

                        <td class="px-4 py-3 text-gray-500 text-nowrap">
                            {{ moment(coupon.expiresAt).format("YYYY/MM/DD") }}
                        </td>

                        <td v-if="staff.role == 'manager'" class="px-4 py-3 flex items-center gap-2 text-gray-500">
                            <button>Editar</button>
                            <button>Excluir</button>
                        </td>
                    </tr>
                    <tr v-else>
                        Nenhum cupom cadastrado
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