import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export function usePayouts() {
    const loading = ref(false);
    const error = ref(false);

    const newPayout = async (data) => {
        try {
            loading.value = true
            const response = await api
                .post('/payouts', data)
            const payout = response.data.payout
            return payout
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const getPayouts = async (filter) => {
        try {
            const response = await api.get("/payouts", {
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

    return {
        loading,
        error,
        getPayouts,
        newPayout
    }
}