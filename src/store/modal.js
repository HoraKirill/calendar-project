export default {
    state: {
        openEventModal:false,
    },
    mutations:{
        setEventModal(state, payload) {
            state.openEventModal = payload
        },

    },
    actions:{
        resetEventModal({commit}, payload) {
            commit('setEventModal', payload)
        },
    },
    getters:{
        openEventModal(state) {
            return state.openEventModal
        },

    }
}