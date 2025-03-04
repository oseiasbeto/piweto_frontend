import * as types from "./mutations-types"

export const setCart = ({ commit }, payload) => {
    commit(types.SET_CART, payload)
}
export const setOrder = ({ commit }, payload) => {
    commit(types.SET_ORDER, payload)
}