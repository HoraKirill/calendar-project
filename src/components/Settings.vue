<template>
  <v-container fluid>
    <v-layout >
      <v-flex>
        <v-data-table
            :headers="headers"
            :items="users"
            class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Учитель</v-toolbar-title>
              <v-divider
                  class="mx-4"
                  inset
                  vertical
              ></v-divider>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item, type='users')"
            >
              mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItemUsers(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <v-data-table
            :headers="headers"
            :items="participants"
            class="elevation-1"
        >
          <template v-slot:top>

            <v-toolbar
                flat
            >
              <v-dialog
                  v-model="dialog"
                  max-width="500px"
              >
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Изменить</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                        >
                          <v-text-field
                              v-model="editedItem.name"
                              label="Имя"
                              full-width
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="editItemName"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-toolbar-title>Ученики</v-toolbar-title>
              <v-divider
                  class="mx-4"
                  inset
                  vertical
              ></v-divider>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item, type='participants')"
            >
              mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItemParticipants(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Имя',
          align: 'start',
          sortable: false,
          value: 'name',
        },

        {text: 'Действие', value: 'actions', sortable: false},

      ],
      dialog: false,
      editedItem: {},
      type: ''
    }

  },
  methods: {
    deleteItemUsers(item) {
      this.$store.dispatch('deleteUsers', item.id)
    },
    deleteItemParticipants(item) {
      this.$store.dispatch('deleteParticipants', item.id)
    },
    editItemName() {
      if ( this.type === 'participants'){
        this.$store.dispatch('updateParticipants', this.editedItem)
      } else {
        this.$store.dispatch('updateUsers', this.editedItem)
      }
      this.dialog = false
    },

    editItem (item) {
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
  },
  computed: {
    participants() {
      return this.$store.getters.participants
    },
    users() {
      return this.$store.getters.users
    },
  }
}
</script>

<style scoped>


</style>