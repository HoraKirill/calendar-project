import { getDatabase, ref, set, push, onValue, update, child, get } from "firebase/database"

export default {
    state: {
        participants: [],
    },
    mutations: {
        clearParticipants(state) {
            state.participants = []
        },
        setParticipants (state, payload) {
            state.participants.push(payload)
        },
        deleteEntity(state, payload) {
            const ev = state[payload.selector].findIndex(el => el.id === payload.id)
            state[payload.selector].splice(ev, 1)
        },
    },
    actions:{
        async newParticipant({commit, getters}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const db = getDatabase();
                await get(child(ref(db), `participants/` + payload.id)).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log('')
                    } else {
                        set(push(ref(db, 'participants')), {
                            name:  payload.name,
                            ownerId: getters.user.id
                        })
                            .then(() => {
                                this.dispatch('fetchParticipants')
                            })
                    }
                })
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },
        async fetchParticipants({commit}) {
            commit('clearError')
            commit('setLoading', true)
            commit('clearParticipants')
            try {
                const db = getDatabase();
                await onValue(ref(db, 'participants'), (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        childData.id = childSnapshot.key
                        commit('setParticipants', childData)
                    });
                }, {
                    onlyOnce: true
                });
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },
        async updateParticipants({commit}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const updates = {};
                const db = getDatabase();
                updates['/participants/' + payload.id] = {
                    name:  payload.name,
                    ownerId: payload.ownerId
                };
                await update(ref(db), updates)
                    .then(() => {
                        this.dispatch('fetchParticipants')
                    })

                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },
        async deleteParticipants({commit}, id) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const updates = {};
                const db = getDatabase();
                updates['/participants/' + id] = null
                await update(ref(db), updates)
                commit('deleteEntity', {id, selector: 'participants'})
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },
    },
    getters: {
        participants(state) {
            return state.participants
        },
    }
}