import * as types from "./mutations-types"

export default {
    [types.SET_CART](state, payload) {
        state.cart = payload
    },
    [types.SET_ORDER](state, payload) {
        state.order = payload
    }
}