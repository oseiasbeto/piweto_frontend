<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import formatAmount from "@/utils/formatAmount";

const store = useStore()
const event = computed(() => {
    return store.getters.event
})
</script>

<template>

    {{ event.orders_pending_cash }}
    <section >
        <div>
            <p>Montante pendente:</p>
            <h1>{{ formatAmount(event?.orders_pending_cash || 0) }}</h1>
        </div>

        <div>
            <p>Disponivel para o repasse:</p>
            <h1>{{ formatAmount(event?.balance || 0) }}</h1>
            <button>Solicitar o repasse</button>
        </div>
    </section>
</template>