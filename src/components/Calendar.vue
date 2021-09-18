<template>
  <div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
              flat
          >
            <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
            >
              Сегодня
            </v-btn>
            <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu
                bottom
                right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>День</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Неделя</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Месяц</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
              :weekdays="weekdays"
              :weekday-format="myDayFormat"
              :month-format="myMonthFormat"
              :interval-format="intervalFormat"
              :first-interval=8
              :interval-minutes=60
              :interval-count=13
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
          ></v-calendar>
          <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
          >
            <v-card
                color="grey lighten-4"
                min-width="350px"
                flat
            >
              <v-toolbar
                  :color="selectedEvent.color"
                  dark
              >
                <editModal :selectedEvent="selectedEvent"></editModal>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu
                    bottom
                    offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="ma-2"
                        v-bind="attrs"
                        v-on="on"
                        icon
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-btn
                          text
                          small
                          color="secondary"
                          @click="deleteEvent"
                      >Удалить
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar>
              <v-card-text>
                <span v-html="'Кабинет ' + selectedEvent.office"></span>
              </v-card-text>
              <v-card-text>
                <span v-for="user in selectedEvent.participantsList" :key="user.name">{{ user.name + ' '}}</span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                    text
                    color="secondary"
                    @click="selectedOpen = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import EditModal from "./EditModal";

export default {
  data() {
    return {
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Месяц',
        week: 'Неделя',
        day: 'День',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      weekdaysLabels: {1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 0: 'Вс'},
      monthsLabels: {
        1: 'Январь',
        2: 'Февраль',
        3: 'Март',
        4: 'Апрель',
        5: 'Май',
        6: 'Июнь',
        7: 'Июль',
        8: 'Август',
        9: 'Сентябрь',
        10: 'Октябрь',
        11: 'Ноябрь',
        12: 'Декабрь',
      }
    }
  },

  components: {
    editModal: EditModal
  },

  mounted() {
    this.$refs.calendar.checkChange()
  },

  methods: {
    myDayFormat(d) {
      return this.weekdaysLabels[d.weekday]
    },
    myMonthFormat(m) {
      return this.monthsLabels[m.month]
    },
    intervalFormat(locale) {
      return locale.time;
    },
    viewDay({date}) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({nativeEvent, event}) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange() {
      this.events = this.$store.getters.event
    },
    deleteEvent() {
      this.$store.dispatch('deleteEvent', this.selectedEvent.id)
    },
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    }
  }
}
</script>

<style scoped>

</style>