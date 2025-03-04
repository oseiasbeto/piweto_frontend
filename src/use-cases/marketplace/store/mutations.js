import * as types from "./mutations-types"

export default {
    [types.SET_USER](state, payload) {
        state.user = payload
    },
    [types.SET_ACCESS_TOKEN](state, payload) {
        state.accessToken = payload
    },
    [types.SET_MODAL](state, payload) {
        state.modal = payload
    },
    [types.SET_TOAST](state, payload) {
        state.toast = payload
    },
    [types.SET_SIDEBAR](state, payload) {
        state.sidebar = payload
    },
    [types.RESET_TOAST](state) {
        state.toast = {
            show: false,
            type: "success",
            timeout: null,
            message: ""
        }
    },
    [types.SET_EVENT](state, payload) {
        state.event = payload
    },
    [types.SET_BATCHES](state, payload) {
        state.batches = {
            data: payload.data,
            metadata: payload.metadata
        }
    },
    [types.SET_CART](state, payload) {
        state.cart = payload
    },
    [types.SET_ORDER](state, payload) {
        state.order = payload
    }
}