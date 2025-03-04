<script setup>
import { useStore } from "vuex";
import { onMounted, computed, ref } from "vue";
import formatCount from "@/utils/formatCount";
import formatAmount from "@/utils/formatAmount";

const store = useStore()

const event = computed(() => {
    return store.getters.event
})
</script>

<template>
    <div>
        <div class="mb-2">
            <h1>Detalhes do evento</h1>
            <div>
                <p>Status</p>
                <h1>{{ event.status }}</h1>
            </div>
            <div>
                <p>Visualizacoes da pagina de vendas</p>
                <h1>{{ formatCount(event.views) }}</h1>
            </div>
            <div>
                <p>Visibilidade</p>
                <h1>{{ event.visibility == 'public' ? 'Publico' : 'Privado' }}</h1>
            </div>
            <div>
                <p>Compartilhar</p>
                <input type="text" :value="`https://ev.piweto.ao/evento/${event.slug}`" readonly>
                <button>Copiar</button>
            </div>
        </div>

        <div>
            <h1>Status</h1>
            <div>
                <p>Total de ingressos:</p>
                <h1>{{ formatCount(event.tickets_available_count) }}</h1>
            </div>
            <div>
                <p>Total de ingressos vendidos:</p>
                <h1>{{ formatCount(event.tickets_purchased_count) }}</h1>
            </div>

            <div>
                <p>Ingressos disponiveis:</p>
                <h1>{{ formatCount(event.tickets_available_count - event.tickets_purchased_count) }}</h1>
            </div>

            <div>
                <p>Ingressos checados:</p>
                <h1>{{ formatCount(event.tickets_checked_count) }}</h1>
            </div>

        </div>
    </div>
</template>