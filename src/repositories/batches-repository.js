import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useBatches() {
    const loading = ref(false);
    const error = ref(false);
    const store = useStore()

    const getBatches = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/batches", {
                params: filter
            })
            const batches = response.data.batches;
            const metadata = response.data.metadata;

            const data = batches.map(batch => {
                return {
                    ...batch,
                    quantitySelected: 0
                }
            })

            store.dispatch("setBatches", {
                data,
                metadata
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

    const newBatch = async (data) => {
        try {
            const response = await api.post(`/batches/${data.eventId}`, data.form)
            const newBatch = response.data.newBatch;
            return newBatch
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const editBatch = async (data) => {
        try {
            const response = await api.put(`/batches/${data.batchId}`, data.form)
            return response
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const deleteBatch = async (batchId) => {
        try {
            await api.delete(`/batches/${batchId}`)
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        getBatches,
        deleteBatch,
        editBatch,
        newBatch
    }
}