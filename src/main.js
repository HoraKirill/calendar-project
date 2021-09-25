import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged  } from 'firebase/auth'

import 'vuetify/dist/vuetify.min.css'


//Vue.use(vuetify)

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyDhhhf5Ku5-soRhDppknOu5MDUAOvFPafI",
  authDomain: "calendar-project-2021.firebaseapp.com",
  projectId: "calendar-project-2021",
  storageBucket: "calendar-project-2021.appspot.com",
  messagingSenderId: "342980536278",
  appId: "1:342980536278:web:4038d7b9569a94c852a677"
}

const firebaseApp = initializeApp(firebaseConfig);

new Vue({
  vuetify,
  router,
  store,
  firebaseApp,
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    });
    this.$store.dispatch('fetchEvents')
    this.$store.dispatch('fetchUsers')
    this.$store.dispatch('fetchParticipants')
  },
  render: h => h(App)
}).$mount('#app')


