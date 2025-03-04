import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export function useCarts() {
    const loading = ref(false);
    const error = ref(false);
    const store = useStore()
    const router = useRouter()

    const newCart = async (data) => {
        try {
            loading.value = true
            const response = await api
                .post('/carts', {
                    eventId: data.event._id,
                    couponName: !data.coupon._id ? null : data.coupon.name,
                    batches: data.batchesSelected
                })
            const cart = response.data.newCart
            store.dispatch("setCart", cart)
            router.push(`/checkout/carrinho/${cart.id}`)
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const getCartById = async (id) => {
        try {
            const response = await api.get(`/carts/${id}`)
            const cart = response.data.cart
            store.dispatch("setCart", cart)
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
        newCart,
        getCartById
    }
}