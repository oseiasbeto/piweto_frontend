import * as types from "./mutations-types"

export const setBooking = ({ commit }, payload) => {
    commit(types.SET_BOOKING, payload)
}