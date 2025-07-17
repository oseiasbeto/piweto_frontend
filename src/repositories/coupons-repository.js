import api from "@/api";
import { ref } from 'vue';

export function useCoupons() {
    const loading = ref(false);
    const error = ref(false);

    const newCoupon = async (data) => {
        try {
            loading.value = true
            const response = await api.post(`/coupons/${data.eventId}`, {
                name: data.name,
                expiresAt: data.expiresAt,
                eventType: data.eventType,
                usePeopleCount: data.usePeopleCount,
                usePeopleCountType: data.usePeopleCountType,
                discount: data.discount
            })
            const coupon = response.data.newCoupon;
            return coupon
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const applyCoupon = async (data) => {
        try {
            loading.value = true
            const response = await api.post('/coupons/validate', {
                code: data.couponName
            })
            const coupon = response.data.coupon;
            return coupon
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const getCoupons = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/coupons", {
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
        newCoupon,
        getCoupons,
        applyCoupon
    }
}