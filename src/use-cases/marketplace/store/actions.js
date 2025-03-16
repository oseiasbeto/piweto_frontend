import * as types from "./mutations-types"

export const setUser = ({ commit }, payload) => {
    commit(types.SET_USER, payload)
}
export const updateUser = ({ commit }, payload) => {
    commit(types.UPDATE_USER, payload)
}
export const setAccessToken = ({ commit }, payload) => {
    commit(types.SET_ACCESS_TOKEN, payload)
}
export const setSidebar = ({ commit }, payload) => {
    commit(types.SET_SIDEBAR, payload)
}
export const setTickets = ({ commit }, payload) => {
    commit(types.SET_TICKETS, payload)
}
export const setModal = ({ commit }, payload) => {
    commit(types.SET_MODAL, payload)
}
export const setToast = ({ commit }, payload) => {
    commit(types.SET_TOAST, payload)
}
export const resetToast = ({ commit }, payload) => {
    commit(types.RESET_TOAST, payload)
}
export const setBatches = ({ commit }, payload) => {
    commit(types.SET_BATCHES, payload)
}
export const setCart = ({ commit }, payload) => {
    commit(types.SET_CART, payload)
}
export const setOrder = ({ commit }, payload) => {
    commit(types.SET_ORDER, payload)
}