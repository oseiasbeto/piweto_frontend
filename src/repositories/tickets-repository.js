import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useTickets() {
    const tickets = ref([]);
    const metadata = ref({})
    const loading = ref(true);
    const loadingLoadMore = ref(false);
    const error = ref(false);
    const store = useStore()

    const getTickets = async (filter) => {
        try {
            const response = await api.get("/tickets", {
                params: filter
            })

            return response
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }


    const loadMore = async () => {

        if (loadingLoadMore.value || !metadata.value.totalPages || metadata.value.currentPage >= metadata.value.totalPages) {
            return; // Evita mais requisições se já estiver carregando ou se não houver mais páginas
        }

        loadingLoadMore.value = true;
        try {
            metadata.value.currentPage += 1; // Incrementa a página atual
            const filter = {
                page: metadata.value.currentPage,
                ...store.state.filters, // Supondo que o Vuex ou Pinia armazena outros filtros
            };

            // Fazendo a requisição para obter mais eventos
            const response = await api.get("/tickets", {
                params: filter
            });

            // Verifica se novos eventos foram retornados
            if (response.data.tickets.length > 0) {
                tickets.value.push(...response.data.tickets); // Anexa os novos eventos à lista existente
                metadata.value = response.data.metadata; // Atualiza os metadados com a nova resposta
            } else {
                // Se não houver novos eventos, define que não há mais eventos para carregar
                metadata.value.totalPages = metadata.value.currentPage;
            }
        } catch (err) {
            error.value = true;
            console.error("Erro ao carregar mais eventos:", err.message);
        } finally {
            loadingLoadMore.value = false;
        }
    }

    return {
        tickets,
        metadata,
        loading,
        loadingLoadMore,
        error,
        getTickets,
        loadMore
    }
}