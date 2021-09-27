import { getDatabase, ref, set, push, onValue, update } from "firebase/database"

export default {
    state: {
        eventList: [],
        _eventList: [],
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
    },
    getters: {
        eventList(state) {
            return state.eventList
        },
    }
}