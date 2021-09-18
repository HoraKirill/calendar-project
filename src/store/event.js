import { getDatabase, ref, set, push, onValue, update, child, get } from "firebase/database"

class Event {
    constructor(name, start, end, color, office = true, participantsList, id =null, timed, ownerId) {
        this.name = name
        this.start = start
        this.end = end
        this.color = color
        this.office = office
        this.participantsList = participantsList
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
            ev.participantsList = payload.participantsList
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

                const usersListRef = ref(db, 'users');
                const officeListRef = ref(db, 'office');
                const newEventsRef = push(ref(db, 'events'));
                const newUsersRef = push(usersListRef);
                await set(push(ref(db, 'events')), {
                    name:  payload.name.name,
                    start: String(payload.start),
                    end: String(payload.end),
                    color: payload.color,
                    office: payload.office.name,
                    participantsList: payload.participantsList,
                    timed: payload.timed,
                    ownerId: getters.user.id
                });
                const dbRef = ref(getDatabase());
                await get(child(dbRef, `users/` + payload.name.id)).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log('')
                        } else {
                        set(newUsersRef, {
                            name:  payload.name.name,
                            ownerId: getters.user.id
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
                await onValue(ref(db, 'participants'), (snapshot) => {
                    if (snapshot.val() === null) {
                        payload.participantsList.forEach((el) => {
                                set(push(ref(db, 'participants')), {
                                    name:  el.name,
                                    ownerId: getters.user.id
                                }).catch((error) => {
                                    console.error(error);
                                });
                        })
                    } else {
                    snapshot.forEach((childSnapshot) => {
                        console.log('childSnapshot ' + childSnapshot.val())
                        const childData = childSnapshot.val();
                        childData.id = childSnapshot.key
                        payload.participantsList.forEach((el) => {
                            console.log(el.id)
                            console.log(childData.id)
                            if (el.id !== childData.id) {
                                set(push(ref(db, 'participants')), {
                                    name:  el.name,
                                    ownerId: getters.user.id
                                }).catch((error) => {
                                    console.error(error);
                                });
                            }
                        })
                      });
                    }
                }, {
                    onlyOnce: true
                });
                await get(child(dbRef, `office/` + payload.office.id)).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log('')
                    } else {
                        set(push(officeListRef), {
                            name:  payload.office.name,
                            ownerId: getters.user.id
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
                const newEvent = new Event(payload.name.name, payload.start, payload.end, payload.color, payload.office.name, payload.participantsList, newEventsRef.key, getters.user.id)
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
                await onValue(ref(db, 'events'), (snapshot) => {
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
        async updateEvent({commit, getters}, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const updates = {};
                const db = getDatabase();
                const dbRef = ref(db)
                const usersListRef = ref(db, 'users');
                const newUsersRef = push(usersListRef);
                 updates['/events/' + payload.id] = {
                    name:  payload.name,
                    start: String(payload.start),
                    end: String(payload.end),
                    color: payload.color,
                    office: payload.office,
                    participantsList: payload.participantsList,
                    timed: payload.timed,
                    ownerId: payload.ownerId
                };
                await update(ref(db), updates)
                await get(child(dbRef, `users/` + payload.id)).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log(snapshot.val())
                    } else {
                        set(newUsersRef, {
                            name:  payload.name,
                            ownerId: getters.user.id
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
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