import { getDatabase, ref, set, push, onValue, update, child, get } from "firebase/database"

export default {
    state: {
        users: [],
    },
    mutations: {
        clearUsers(state) {
            state.users = []
        },
        setUsers (state, payload) {
            state.users.push(payload)
        },
        deleteEntity(state, payload) {
            const ev = state[payload.selector].findIndex(el => el.id === payload.id)
            state[payload.selector].splice(ev, 1)
        },
    },
    actions:{
        async newUser({commit, getters}, payload) {
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
        async updateUsers({commit}, payload) {
            commit('clearError')
            commit('setLoading', true)
            console.log(payload)
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
    },
    getters: {
        users(state) {
            return state.users
        },
    }
}