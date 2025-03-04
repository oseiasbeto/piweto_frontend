import api from "@/api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useStaffs() {
    const loading = ref(false);
    const error = ref(false);
    const store = useStore()

    const getStaffs = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/staffs", {
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

    const getStaffById = async (id) => {
        try {
            loading.value = true
            const response = await api.get(`/staffs/${id}`)

            return response
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const deleteStaff = async (data) => {
        try {
            loading.value = true
            const response = await api.delete(`/staffs/${data.staffId}/${data.eventId}/${data.memberId}`)
            return response
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const updateRoleStaff = async (data) => {
        try {
            loading.value = true
            const response = await api.put(`/staffs/${data.staffId}/${data.eventId}/${data.memberId}`, {
                role: data.role
            })
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const toggleStatus = async (data) => {
        try {
            console.log(data)
            loading.value = true
            await api.put(`/staffs/toggle-status-invite/${data.token}`, {
                status: data.status
            })
        } catch (err) {
            error.value = true
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const newStaff = async (data) => {
        try {
            loading.value = true
            const response = await api.post(`/staffs/${data.eventId}`, {
                email: data.email,
                role: data.role
            })
            const staff = response.data.newStaff;
            return staff
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
        getStaffs,
        getStaffById,
        newStaff,
        toggleStatus,
        updateRoleStaff,
        deleteStaff
    }
}