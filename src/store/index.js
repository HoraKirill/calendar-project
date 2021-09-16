import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import event from './event'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user, shared, event
    }
})