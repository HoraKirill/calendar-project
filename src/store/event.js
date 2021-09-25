import { getDatabase, ref, set, push, onValue, update, child, get } from "firebase/database"

export default {
    state: {
        eventList: [],
        _eventList: [],
        users: [],
        participants: [],
    },
    mutations: {
        set_Event (state, payload) {
            state._eventList.push(payload)
        },
        clear_EventsList(state) {
          state._eventList = []
        },
        setEventsList(state) {
          state.eventList = state._eventList
        },
        clearUsers(state) {
          state.users = []
        },
        clearParticipants(state) {
          state.participants = []
        },
        setUsers (state, payload) {
            state.users.push(payload)
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
        async newEvent({commit, getters}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const db = getDatabase();
                await set(push(ref(db, 'events')), {
                    name:  payload.name.name,
                    start: String(payload.start),
                    end: String(payload.end),
                    color: payload.color,
                    category: payload.category,
                    participantsSelect: payload.participantsSelect,
                    timed: payload.timed,
                    ownerId: getters.user.id
                })
                    .then(() => {
                       this.dispatch('fetchEvents')
                    })
             } catch (error) {
                commit( 'setError', error.message)
                commit('setLoading', false)
                throw error
             }
        },
        async newUsers({commit, getters}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const db = getDatabase();
                await get(child(ref(db), `users/` + payload.id)).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log('')
                    } else {
                        set(push(ref(db, 'users')), {
                            name:  payload.name,
                            ownerId: getters.user.id
                        })
                            .then(() => {
                            this.dispatch('fetchUsers')
                        })
                    }
                })
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },
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
        async fetchUsers({commit}) {
            commit('clearError')
            commit('setLoading', true)
            commit('clearUsers')
            try {
                const db = getDatabase();
                await onValue(ref(db, 'users'), (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        childData.id = childSnapshot.key
                        commit('setUsers', childData)
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
        async fetchEvents({commit}) {
            commit('clearError')
            commit('setLoading', true)
            commit('clear_EventsList')
            try {

                const db = getDatabase();
                await onValue(ref(db, 'events'), (snapshot) => {

                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        childData.start = new Date(childData.start)
                        childData.end = new Date(childData.end)
                        childData.id = childSnapshot.key
                        commit('set_Event', childData)
                    });
                    commit('setEventsList')
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
        async updateEvent({commit, getters}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const updates = {};
                const db = getDatabase();
                 updates['/events/' + payload.id] = {
                    name:  payload.name,
                    start: String(payload.start),
                    end: String(payload.end),
                    color: payload.color,
                    category: payload.category,
                    participantsSelect: payload.participantsSelect,
                    timed: payload.timed,
                    ownerId: getters.user.id

                 };
                await update(ref(db), updates)
                    .then(() => {
                        this.dispatch('fetchEvents')
                    })

                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },
        async updateUsers({commit}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const updates = {};
                const db = getDatabase();
                updates['/users/' + payload.id] = {
                    name:  payload.name,
                    ownerId: payload.ownerId
                };
                await update(ref(db), updates)
                    .then(() => {
                        this.dispatch('fetchUsers')
                    })

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
        async deleteEvent({commit}, id) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const updates = {};
                const db = getDatabase();
                updates['/events/' + id] = null
                await update(ref(db), updates)
                commit('deleteEntity', {id, selector: 'eventList'})
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },
        async deleteUsers({commit}, id) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const updates = {};
                const db = getDatabase();
                updates['/users/' + id] = null
                await update(ref(db), updates)
                commit('deleteEntity', {id, selector: 'users'})
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
        eventList(state) {
            return state.eventList
        },
        users(state) {
            return state.users
        },
        participants(state) {
            return state.participants
        },
    }
}