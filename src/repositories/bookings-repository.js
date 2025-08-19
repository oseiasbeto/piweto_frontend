import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useBookings() {
    const loading = ref(false);
    const error = ref(false);
    const store = useStore()

    const getOrderByIdAndPin = async ({id, pin}) => {
        try {
            loading.value = true
            const response = await api.post('/orders/reservation', {
                id: id,
                pin: pin
            })
            const order = response.data.order
            store.dispatch("setBooking", order)
        } catch (err) {
            error.value = true
            throw err
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        getOrderByIdAndPin
    }
}