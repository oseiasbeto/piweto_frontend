import * as types from "./mutations-types"

export default {
    [types.SET_EVENT_FORM](state, payload) {
        state.eventForm = payload
    },
    [types.RESET_EVENT_FORM](state, payload) {
        state.eventForm = {
            name: "",
            file: null,
            category: "",
            description: "",
            showPreviewCover: true,
            status: "p",
            batches: [],
            starts_at: {
                date: null,
                hm: null
            },
            ends_at: {
                date: null,
                hm: null
            },
            address: {
                location: "",
                street: "",
                neighborhood: "",
                city: "",
                estate: "Angola",
                number: "",
                complement: ""
            },
            meeting: {
                url: null,
                plataform: "zoom"
            },
            showOnMap: false,
            visibility: 'public',
            nameclature: "ticket"
        }
    },
    [types.SET_MYEVENTS](state, payload) {
        state.myEvents.data = payload.data
        state.myEvents.metadata = payload.metadata
        state.myEvents.hasViewed = payload.hasViewed
    },
    [types.RESET_MYEVENTS](state) {
        state.myEvents.data = []
        state.myEvents.metadata = {}
        state.myEvents.hasViewed = false
    },
    [types.ADD_BATCHFROMBATCHES](state, payload) {
        state.eventForm.batches.push(payload)
    },
    [types.SET_BATCHFROMBATCHES](state, payload) {
        state.eventForm.batches = payload
    },
    [types.REMOVE_BATCH_FROM_BATCHES](state, index) {
        state.eventForm.batches.splice(index, 1)
    },
    [types.EDIT_BATCH_FROM_BATCHES](state, { data, index }) {
        state.eventForm.batches[index] = data
    }
}