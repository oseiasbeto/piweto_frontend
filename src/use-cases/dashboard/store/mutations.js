import * as types from "./mutations-types"

export default {
    [types.SET_STAFF](state, payload) {
        state.staff = payload
    },
    [types.SET_PARTAKERS](state, payload) {
        state.partakers.data = payload.data
        state.partakers.metadata = payload.metadata
        state.partakers.hasViewed = payload.hasViewed
    },
    [types.SET_STAFFS](state, payload) {
        state.staffs.data = payload.data
        state.staffs.metadata = payload.metadata
        state.staffs.hasViewed = payload.hasViewed
    },
    [types.SET_PAYOUTS](state, payload) {
        state.payouts.data = payload.payouts
        state.payouts.metadata = payload.metadata
    },
    [types.ADD_PAYOUT_FROM_PAYOUTS](state, payout) {
        state.payouts.data = [
            payout,
            ...state.payouts.data
        ]
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
    [types.TOGGLE_ISVIEWMOBILE](state) {
        state.isViewMobile = !state.isViewMobile
    },
    [types.CLOSE_ISVIEWMOBILE](state) {
        state.isViewMobile = false
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