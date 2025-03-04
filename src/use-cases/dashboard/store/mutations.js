import * as types from "./mutations-types"

export default {
    [types.SET_STAFF](state, payload) {
        state.staff = payload
    },
    [types.SET_TICKETS](state, payload) {
        state.tickets.data = payload.data
        state.tickets.metadata = payload.metadata
        state.tickets.hasViewed = payload.hasViewed
    },
    [types.SET_STAFFS](state, payload) {
        state.staffs.data = payload.data
        state.staffs.metadata = payload.metadata
        state.staffs.hasViewed = payload.hasViewed
    },
    [types.SET_COUPONS](state, payload) {
        state.coupons.data = payload.data
        state.coupons.metadata = payload.metadata
        state.coupons.hasViewed = payload.hasViewed
    },
    [types.RESET_STAFFS](state, payload) {
        state.staffs.data = []
        state.staffs.metadata = {}
        state.staffs.hasViewed = false
    },
    [types.RESET_COUPONS](state, payload) {
        state.coupons.data = []
        state.coupons.metadata = {}
        state.coupons.hasViewed = false
    },
    [types.REMOVE_STAFF_FROM_STAFFS](state, index) {
        state.staffs.data.splice(index, 1)
    },
    [types.ADD_STAFF_FROM_STAFFS](state, staff) {
        state.staffs.data = [
            staff,
            ...state.staffs.data
        ]
    },
    [types.ADD_COUPON_FROM_COUPONS](state, coupon) {
        state.coupons.data = [
            coupon,
            ...state.coupons.data
        ]
    },
    [types.UPDATE_STAFF_FROM_STAFFS](state, payload) {
        state.staffs.data[payload.index].role = payload.role
    }
}