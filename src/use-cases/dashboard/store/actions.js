import * as types from "./mutations-types"

export const setStaff = ({ commit }, payload) => {
    commit(types.SET_STAFF, payload)
}
export const setTickets = ({ commit }, payload) => {
    commit(types.SET_TICKETS, payload)
}
export const setStaffs = ({ commit }, payload) => {
    commit(types.SET_STAFFS, payload)
}
export const setCoupons = ({ commit }, payload) => {
    commit(types.SET_COUPONS, payload)
}
export const resetStaffs = ({ commit }, payload) => {
    commit(types.RESET_STAFFS, payload)
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
export const addCouponFromCoupons = ({ commit }, payload) => {
    commit(types.ADD_COUPON_FROM_COUPONS, payload)
}
export const updateStaffFromStaffs = ({ commit }, payload) => {
    commit(types.UPDATE_STAFF_FROM_STAFFS, payload)
}