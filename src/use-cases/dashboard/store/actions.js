import * as types from "./mutations-types"

export const setStaff = ({ commit }, payload) => {
    commit(types.SET_STAFF, payload)
}
export const setPartakers = ({ commit }, payload) => {
    commit(types.SET_PARTAKERS, payload)
}
export const setStaffs = ({ commit }, payload) => {
    commit(types.SET_STAFFS, payload)
}
export const setPayouts = ({ commit }, payload) => {
    commit(types.SET_PAYOUTS, payload)
}
export const addPayoutFromPayouts = ({ commit }, payload) => {
    commit(types.ADD_PAYOUT_FROM_PAYOUTS, payload)
}
export const setCoupons = ({ commit }, payload) => {
    commit(types.SET_COUPONS, payload)
}
export const resetStaffs = ({ commit }, payload) => {
    commit(types.RESET_STAFFS, payload)
}
export const toggleStatusCheckIn = ({ commit }, payload) => {
    commit(types.TOGGLE_STATUS_CHECKIN, payload)
}
export const resetCoupons = ({ commit }, payload) => {
    commit(types.RESET_COUPONS, payload)
}
export const removeStaffFromStaffs = ({ commit }, payload) => {
    commit(types.REMOVE_STAFF_FROM_STAFFS, payload)
}
export const addStaffFromStaffs = ({ commit }, payload) => {
    commit(types.ADD_STAFF_FROM_STAFFS, payload)
}
export const toggleIsViewMobile = ({ commit }) => {
    commit(types.TOGGLE_ISVIEWMOBILE)
}
export const closeIsViewMobile = ({ commit }) => {
    commit(types.CLOSE_ISVIEWMOBILE)
}
export const addCouponFromCoupons = ({ commit }, payload) => {
    commit(types.ADD_COUPON_FROM_COUPONS, payload)
}
export const updateStaffFromStaffs = ({ commit }, payload) => {
    commit(types.UPDATE_STAFF_FROM_STAFFS, payload)
}