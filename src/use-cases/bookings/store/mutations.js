import * as types from "./mutations-types"

export default {
    [types.SET_BOOKING](state, payload) {
        state.booking = payload
    }
}