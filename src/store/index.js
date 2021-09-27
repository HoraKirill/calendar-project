import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import event from './event'
import modal from './modal'
import usersTeacher from './usersTeacher'
import participants from './participants'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user, shared, event, modal, usersTeacher, participants
    }
})