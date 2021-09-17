import { getDatabase, ref, set, push, onValue, update, child, get } from "firebase/database"

class Event {
    constructor(name, start, end, color, office = true, listParticipants, id =null, timed, ownerId) {
        this.name = name
        this.start = start
        this.end = end
        this.color = color
        this.office = office
        this.listParticipants = listParticipants
        this.id = id
        this.timed = timed
        this.ownerId = ownerId

    }
}

export default {
    state: {
        event: []
    },
    mutations: {
        setEvent (state, payload) {
            state.event.push(payload)
        },
        updateEvent (state, payload) {
            const ev = state.event.find(el => {
                return el.id = payload.id
            })
            ev.name = payload.name
            ev.start = payload.start
            ev.end = payload.end
            ev.color = payload.color
            ev.office = payload.office
            ev.listParticipants = payload.listParticipants
            ev.timed = payload.timed
            ev.ownerId = payload.ownerId
        },
        deleteEvent(state, id) {
            const ev = state.event.findIndex(el => el.id === id)
            state.event.splice(ev, 1)
        }
    },
    actions:{
        async newEvent({commit, getters}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const db = getDatabase();
                const postListRef = ref(db, 'events');
                const newEventsRef = push(postListRef);
                await set(newEventsRef, {
                    name:  payload.name,
                    start: String(payload.start),
                    end: String(payload.end),
                    color: payload.color,
                    office: payload.office,
                    listParticipants: payload.listParticipants,
                    timed: payload.timed,
                    ownerId: getters.user.id
                });
                const dbRef = ref(getDatabase());
                await get(child(dbRef, `users/${payload.name}`)).then(() => {
                        set(ref(db, 'users/' + payload.name + `/${newEventsRef.key}`), {
                            ownerId: getters.user.id
                        });
                }).catch((error) => {
                    console.error(error);
                });
                await get(child(dbRef, `office/`)).then(() => {
                    set(ref(db, 'office/' + payload.office), {
                        ownerId: getters.user.id
                    });
                }).catch((error) => {
                    console.error(error);
                });
                const newEvent = new Event(payload.name, payload.start, payload.end, payload.color, payload.office, payload.listParticipants, newEventsRef.key, getters.user.id)
                commit('setEvent', newEvent)
             } catch (error) {
                commit( 'setError', error.message)
                commit('setLoading', false)
                throw error
             }
        },
        async fetchEvents({commit}) {

            commit('clearError')
            commit('setLoading', true)
            try {
                const db = getDatabase();
                const dbRef = ref(db, 'events');
                await onValue(dbRef, (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        childData.start = new Date(childData.start)
                        childData.end = new Date(childData.end)
                        childData.id = childSnapshot.key
                        commit('setEvent', childData)
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
        async updateEvent({commit}, payload) {
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
                    office: payload.office,
                    listParticipants: payload.listParticipants,
                    timed: payload.timed,
                    ownerId: payload.ownerId
                };
                await update(ref(db), updates)
                commit('updateEvent', payload)
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
                commit('deleteEvent', id)
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        }
    },
    getters: {
        event(state) {
            return state.event
        },
    }
}