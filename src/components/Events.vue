<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{ this.selectedEvent ? 'Изменить событие' : 'Создать событие' }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="form" validation>
        <v-menu
            ref="menuStart"
            v-model="menuStart"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="event.start"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="event.start"
                label="Начало занятия"
                prepend-icon="mdi-clock-time-four-outline"
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
              v-if="menuStart"
              format="24hr"
              v-model="event.start"
              full-width
              @click:minute="$refs.menuStart.save(event.start)"
          ></v-time-picker>
        </v-menu>
        <v-spacer></v-spacer>
        <v-menu
            ref="menuEnd"
            v-model="menuEnd"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="event.end"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="event.end"
                label="Завершение занятия"
                prepend-icon="mdi-clock-time-eleven-outline"
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
              v-if="menuEnd"
              format="24hr"
              v-model="event.end"
              full-width
              @click:minute="$refs.menuEnd.save(event.end)"
          ></v-time-picker>
        </v-menu>
        <v-menu
            ref="menuCalendar"
            v-model="menuCalendar"
            :close-on-content-click="true"
            :nudge-right="40"
            :return-value.sync="event.pickerDate"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="event.pickerDate"
                label="Выберете дату"
                prepend-icon="mdi-calendar-range"
                v-bind="attrs"
                v-on="on"

            ></v-text-field>
          </template>
          <v-date-picker
              :weekdays="weekdays"
              v-if="menuCalendar"
              full-width
              @click:date="$refs.menuCalendar.save(event.pickerDate)"
              v-model="event.pickerDate"
              locale="ru"
              first-day-of-week="1"
          ></v-date-picker>
        </v-menu>
        <v-row>
          <v-col>
            <v-select
                v-model="event.color"
                :items="pickerColorsItem"
                :menu-props="{ maxHeight: '400' }"
                item-text="color"
                label="Цвет"
                hint="Выберете цвет"
                persistent-hint
                prepend-icon="mdi-invert-colors"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                v-model="event.category"
                :items="categoryList"
                :menu-props="{ maxHeight: '400' }"
                label="Кабинет"
                hint="Выберете кабинет"
                persistent-hint
                prepend-icon="mdi-door-open"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                v-model="event.user"
                :items="usersExecutor"
                :menu-props="{ maxHeight: '400' }"
                label="Учитель"
                item-text="name"
                hint="Учитель"
                prepend-icon="mdi-account-tie"
                return-object
                :rules="rules"
            ></v-select>
          </v-col>
          <v-col>
            <v-btn
                color="primary"
                dark
                @click="dialog1 =true"
            >
              Добавить учителя
            </v-btn>
            <v-dialog
                v-model="dialog1"
                max-width="500px"
            >
              <v-card>
                <v-card-title>
                  <v-text-field
                      label="Учителя"
                      v-model="event.user.name"
                  ></v-text-field>
                </v-card-title>
                <v-card-actions>
                  <v-btn
                      color="primary"
                      text
                      @click="dialog1 = false"
                  >
                    назад
                  </v-btn>
                  <v-btn
                      color="primary"
                      text
                      @click="newUserName"
                  >
                    Добавить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
                v-model="event.participantsSelect"
                :items="participantsList"
                item-text="name"
                :menu-props="{ maxHeight: '400' }"
                label="Ученики"
                chips
                multiple
                hint="Выберете учеников"
                persistent-hint
                return-object
                prepend-icon="mdi-account-multiple-plus"
            ></v-select>
          </v-col>
          <v-col>
            <v-btn
                color="primary"
                dark
                @click="dialog3 =true"
            >
              Добавить ученика
            </v-btn>
            <v-dialog
                v-model="dialog3"
                max-width="500px"
            >
              <v-card>
                <v-card-title>
                  <v-text-field
                      label="Ученик"
                      v-model="participant.name"
                  ></v-text-field>
                </v-card-title>
                <v-card-actions>
                  <v-btn
                      color="primary"
                      text
                      @click="dialog3 = false"
                  >
                    назад
                  </v-btn>
                  <v-btn
                      color="primary"
                      text
                      @click="newParticipantName"
                  >
                    Добавить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          @click="closedModal"
      >отмена
      </v-btn>
      <v-btn
          color="primary"
          @click="eventWrite"
          :disabled="!valid"
      >{{ this.selectedEvent ? 'Изменить' : 'Создать событие' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>


export default {
  props: {
    selectedEvent: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      event: {
        user: {
          name: ''
        },
        category: '',
        start: null,
        end: null,
        color: '',
        participantsSelect: [],
        timed: true,
        pickerDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      },
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      menuCalendar: false,
      pickerColorsItem: [{color: 'синий', value: '#1565C0'}, {color: 'бирюза', value: '#26A69A'}, {
        color: 'лайм',
        value: '#D4E157'
      }, {color: 'зеленый', value: '#43A047'}],
      menuStart: false,
      menuEnd: false,
      categoryList: ["Белый", "Черный"],
      participant: {},
      valid: false,
      rules: [
        value => !!value || 'Заполните',
      ],
      dialog3: false,
      dialog1: false,

    }
  },

  mounted() {
    if (this.selectedEvent) {
      this.event = {
        ...this.selectedEvent,
        user: {
          name: this.selectedEvent.name
        },
        start: new Date(this.selectedEvent.start).toLocaleTimeString(),
        end: new Date(this.selectedEvent.end).toLocaleTimeString(),
        pickerDate: new Date(this.selectedEvent.start).toLocaleDateString('en-ca')
      }
    }
  },

  watch: {
    selectedEvent: function (newVal) {
      if (newVal ) {
        this.event = {
          ...newVal,
          user: {
            name: newVal.name
          },
          start: new Date(newVal.start).toLocaleTimeString(),
          end: new Date(newVal.end).toLocaleTimeString(),
          pickerDate: new Date(newVal.start).toLocaleDateString('en-ca')
        }
      }
    }

  },
  methods: {
    eventWrite() {

      if (this.$refs.form.validate()) {
        const start = new Date(`${this.event.pickerDate}T${this.event.start}`)
        const end = new Date(`${this.event.pickerDate}T${this.event.end}`)
        const events = {
          name: this.event.user.name,
          category: this.event.category,
          start: start,
          end: end,
          color: this.event.color,
          participantsSelect: this.event.participantsSelect,
          timed: true
        }
        if (this.selectedEvent.id !== undefined) {
          events.id = this.selectedEvent.id
           this.$store.dispatch('updateEvent', events)
           this.$store.dispatch('resetEventModal', false)
        } else {
           this.$store.dispatch('newEvent', events)
           this.$store.dispatch('resetEventModal', false)
        }
      }
    },
    newParticipantName() {
      this.$store.dispatch('newParticipant', this.participant)
      this.dialog3 = false
    },
     newUserName() {
      this.$store.dispatch('newUser', this.event.user)
      this.dialog1 = false
    },
    closedModal() {
      this.$store.dispatch('resetEventModal', false)
    }
  },
  computed: {
    usersExecutor() {
      return this.$store.getters.users
    },
    participantsList() {
      return this.$store.getters.participants
    },


  }

}
</script>
