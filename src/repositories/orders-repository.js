import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useOrders() {
    const loading = ref(false);
    const error = ref(false);
    const store = useStore()

    const newOrder = async (payload) => {
        try {
            loading.value = true

            const response = await api.post(`/orders/${payload.eventId}`, {
                cart: payload.cart,
                payment_method: payload.paymentMethod,
                full_name: payload.data.fullName,
                email: payload.data.email,
                phone: payload.data.phone
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

    const getOrderById = async (id) => {
        try {
            loading.value = true
            const response = await api.get(`/orders/${id}`)
            const order = response.data.order
            store.dispatch("setOrder", order)
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
        newOrder,
        getOrderById
    }
}