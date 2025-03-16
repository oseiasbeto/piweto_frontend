import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useEvents() {
    const events = ref([]);
    const metadata = ref({})
    const loading = ref(true);
    const loadingLoadMore = ref(false);
    const error = ref(false);
    const store = useStore()

    const getEvents = async (filter) => {
        try {
            const response = await api.get("/events", {
                params: filter
            })
            events.value = response.data.events;
            metadata.value = response.data.metadata;
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
            const response = await api.get("/events", {
                params: filter
            });

            // Verifica se novos eventos foram retornados
            if (response.data.events.length > 0) {
                events.value.push(...response.data.events); // Anexa os novos eventos à lista existente
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

    const getEvent = async (slug) => {
        try {
            const response = await api.get("/events/" + slug)
            const event = response.data.event
            store.dispatch("setEvent", event)
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const getEventById = async (id) => {
        try {
            const response = await api.get("/events/preview/" + id)
            const event = response.data.event
            return event
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const deleteEvent = async (eventId) => {
        try {
            await api.delete(`/events/${eventId}`)
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const newEvent = async (data) => {
        try {
            loading.value = true
            const response = await api.post("/events", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            const newEvent = response.data.event

            store.dispatch("setEvent", newEvent)
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const editEvent = async (data) => {
        try {
            loading.value = true
            const response = await api.put('/events', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    return {
        events,
        metadata,
        loading,
        loadingLoadMore,
        error,
        getEvents,
        getEvent,
        getEventById,
        loadMore,
        newEvent,
        editEvent,
        deleteEvent
    }
}