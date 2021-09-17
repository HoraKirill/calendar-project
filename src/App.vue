<template>
  <v-app>
    <v-navigation-drawer
        app
        temporary
        v-model="drawer"
    >
      <v-list flat>
        <v-subheader>Меню</v-subheader>
        <v-list-item-group
            v-model="selectedItem"
            color="primary"
        >
          <v-list-item
              v-for="(link, i) in links"
              :key="i"
              :to="link.url"
          >
            <v-list-item-icon>
              <v-icon v-text="link.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="link.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              v-if="isUserLoggedIn"
              @click="onLogout"
          >
            <v-list-item-icon>
              <v-icon >mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Выйти</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        app
        dark
        color="primary"
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" custom v-slot="{ navigate }" class="pointer">
          <span @click="navigate"
                @keypress.enter="navigate"
                role="link"

          >Мой календарь</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
          text
          v-for="(link, i) in links" :key="i"
          :to="link.url"
      >
        <v-icon left>{{ link.icon }}</v-icon>
        {{ link.title }}
      </v-btn>
        <v-btn
            text
            @click="onLogout"
            v-if="isUserLoggedIn"
        >
          <v-icon left>mdi-exit-to-app</v-icon>
          Выйти
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>

        <router-view></router-view>

    </v-main>

    <template v-if="error">
      <v-snackbar
        color="error"
        @input="closeError"
        :timeout="3000"
        :value="true"
    >
      {{ error }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="dark"
            text
            v-bind="attrs"
            @click="closeError"
        >
          Close
        </v-btn>
      </template>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
export default {
  data () {
      return {
        drawer: false,
        selectedItem: 1,
      }
  },
  computed: {
    error() {
      return this.$store.getters.error
    },
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn
    },
    links() {
      if (this.isUserLoggedIn) {
        return [
          {title: 'Создать событие', icon: 'mdi-calendar-plus', url: '/events'}
        ]
      }
      return [
        {title: 'Войти', icon: 'mdi-lock', url: '/login'},
        {title: 'Регистрация', icon: 'mdi-account-multiple-plus', url: '/registration'}
      ]
    }
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    onLogout() {
      this.$store.dispatch('logoutUser')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer
}

</style>
