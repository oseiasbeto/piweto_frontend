import * as types from "./mutations-types"

export default {
    [types.SET_USER](state, payload) {
        state.user = payload
    },
    [types.UPDATE_USER](state, payload) {
        state.user = {
            ...(state.user || {}), // Garante que state.event nunca seja undefined
            ...payload       // Substitui apenas as propriedades presentes no payload
        };
    },
    [types.SET_ACCESS_TOKEN](state, payload) {
        state.accessToken = payload
    },
    [types.SET_TICKETS](state, payload) {
        state.tickets.data = payload.data
        state.tickets.metadata = payload.metadata
        state.tickets.hasViewed = payload.hasViewed
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