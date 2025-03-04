export const accessToken = (state) => {
    return state.accessToken
}
export const currentUser = (state) => {
    return state.user
}
export const modal = (state) => {
    return state.modal
}
export const toast = (state) => {
    return state.toast
}
export const currentLocation = (state) => {
    return state.location
}
export const sidebar = (state) => {
    return state.sidebar
}
export const hasLogged = (state) => {
    if (!state.accessToken) return false
    else return true
}
export const event = (state) => {
    return state.event
}
export const batches = (state) => {
    return state.batches
}
export const cart = (state) => {
    return state.cart
}
export const order = (state) => {
    return state.order
}