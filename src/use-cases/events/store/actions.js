import * as types from "./mutations-types"

export const setEventForm = ({ commit }, payload) => {
    commit(types.SET_EVENT_FORM, payload)
}
export const resetEventForm = ({ commit }, payload) => {
    commit(types.RESET_EVENT_FORM, payload)
}
export const addBatchFromBatches = ({ commit }, payload) => {
    commit(types.ADD_BATCHFROMBATCHES, payload)
}
export const removeBatchFromBatches = ({ commit }, payload) => {
    commit(types.REMOVE_BATCH_FROM_BATCHES, payload)
}
export const editBatchFromBatches = ({ commit }, payload) => {
    commit(types.EDIT_BATCH_FROM_BATCHES, payload)
}
export const setMyEvents = ({ commit }, payload) => {
    commit(types.SET_MYEVENTS, payload)
}
export const resetMyEvents = ({ commit }) => {
    commit(types.RESET_MYEVENTS)
}