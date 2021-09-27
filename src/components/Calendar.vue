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
            <v-col>
              <v-select
                  v-model="usersFilter"
                  class="pr-2"
                  :items="usersList"
                  item-text="name"
                  :menu-props="{ maxHeight: '400' }"
                  label="Преподователи"
                  multiple
                  prepend-icon="mdi-file-find-outline"
                  :full-width="true"
                  chips
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                  v-model="participantsFilter"
                  class="pr-5 "
                  :items="participantsList"
                  item-text="name"
                  :menu-props="{ maxHeight: '400' }"
                  label="Ученики"
                  multiple
                  append-icon="mdi-file-find-outline"
                  :full-width="true"
                  chips
              ></v-select>
            </v-col>
            <v-col>
              <v-menu
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
                  <v-list-item @click="changeType(categoryType.day)">
                    <v-list-item-title>День</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                      @click="changeType(categoryType.week)">
                    <v-list-item-title>Неделя</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="changeType(categoryType.month)">
                    <v-list-item-title>Месяц</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
              category-show-all
              :categories="categories"
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
              :category-days="categoryDays"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @mousedown:event="startDrag"
              @mousedown:time-category="startTime"
              @mousemove:time-category="mouseMove"
              @mouseup:time-category="endDrag"
              @mouseleave.native="cancelDrag"
          >
            <template v-slot:event="{ event, timed, eventSummary }">
              <div
                  class="v-event-draggable"
                  v-html="eventSummary()"
              ></div>
              <div
                  v-if="timed"
                  class="v-event-drag-bottom"
                  @mousedown.stop="extendBottom(event)"
              ></div>
            </template>
          </v-calendar>
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
                <v-btn
                    class="ma-2"
                    icon
                    @click="openModal"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn
                    class="ma-2"
                    icon
                    @click="deleteEvent"
                >
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>

              </v-toolbar>
              <v-card-text>
                <span v-for="user in selectedEvent.participantsSelect" :key="user.name">{{ user.name + ' ' }}</span>
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
          <eventModal
              :selectedEvent="selectedEvent"
          ></eventModal>
        </v-sheet>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import EventModal from "./EventModal";

export default {
  data() {
    return {
      categoryDays: 7,
      categories: ['Белый', 'Черный'],
      focus: '',
      type: 'category',
      typeToLabel: {
        month: 'Месяц',
        week: 'Неделя',
        day: 'День',
        category: 'Неделя'
      },
      categoryType: {
        month: 'month',
        week: 'week',
        day: 'day',
        category: 'category'
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
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
      },
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
      color: '#1565C0',
      backupStartTime: null,
      participantsList: this.$store.getters.participants,
      usersList: this.$store.getters.users,
      usersFilter: [],
      participantsFilter: []
    }
  },

  components: {
    eventModal: EventModal
  },

  mounted() {
    this.$refs.calendar.checkChange()
  },

  methods: {
    startDrag({event, timed}) {
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },
   async startTime(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start
        this.backupStartTime = this.dragEvent.start
        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        this.createEvent = {
          user: {
            name: `mar`,
          },
          color: this.color,
          start: new Date(this.createStart),
          end: new Date(this.createStart + 60 * 60 * 1000),
          timed: true,
          category: tms.category,
          participantsSelect: []
        }
        this.selectedEvent = this.createEvent
        await this.$store.dispatch('resetEventModal', true)
      }
    },
    extendBottom(event) {
      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start
        const end = this.dragEvent.end
        const duration = end - start
        const newStartTime = mouse - this.dragTime
        const newStart = this.roundTime(newStartTime)
        const newEnd = newStart + duration

        this.dragEvent.start = newStart
        this.dragEvent.end = newEnd
        this.dragEvent.category = tms.category
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false)

        const min = Math.min(mouseRounded, this.createStart)
        const max = Math.max(mouseRounded, this.createStart)

        this.createEvent.start = min
        this.createEvent.end = max
      }
    },
    endDrag() {
      if (this.dragEvent && this.dragTime !== null && this.dragEvent.start !== this.backupStartTime) {
        this.dragEvent.start = new Date(this.dragEvent.start)
        this.dragEvent.end = new Date(this.dragEvent.end)
        this.$store.dispatch('updateEvent', this.dragEvent)
      }
      if (this.extendOriginal && this.createEvent) {
        this.createEvent.start = new Date(this.createEvent.start)
        this.createEvent.end = new Date(this.createEvent.end)
        this.$store.dispatch('updateEvent', this.createEvent)
      }
      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null
      this.backupStartTime = null
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          const i = this.events.indexOf(this.createEvent)
          if (i !== -1) {
            this.events.splice(i, 1)
          }
        }
      }

      this.createEvent = null
      this.createStart = null
      this.dragTime = null
      this.dragEvent = null
    },
    roundTime(time, down = true) {
      const roundTo = 15 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    },
    toTime(tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
    changeType(type) {
      switch (type) {
        case this.categoryType.day:
          this.type = this.categoryType.category
          this.categoryDays = 1
          this.typeToLabel.category = 'День'
          break
        case this.categoryType.week:
          this.type = this.categoryType.category
          this.categoryDays = 7
          this.typeToLabel.category = 'Неделя'
          break
        case this.categoryType.month:
          this.type = this.categoryType.month
          break
      }
    },
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
      this.type = this.categoryType.category
      this.categoryDays = 1
      this.typeToLabel.category = 'День'
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
      this.selectedEvent = event
      const open = () => {
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
    deleteEvent() {
      this.$store.dispatch('deleteEvent', this.selectedEvent.id)
      this.selectedOpen = false
    },
    openModal() {
      this.$store.dispatch('resetEventModal', true)
    },
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    events() {
      let events = this.$store.getters.eventList
      if (this.usersFilter.length !== 0) {
      events = events
          .filter(user => this.usersFilter.includes(user.name))

      }
      if (this.participantsFilter.length !== 0) {
        events = events
            .filter(event => event.participantsSelect.find(participant =>this.participantsFilter.includes(participant.name)))
      }
      return events
    },
  }
}
</script>

<style  lang="scss">

.v-calendar .v-event-timed-container {
  margin-right: 0 !important;
}

.v-calendar-category .v-calendar-category__category {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }

  .scroll {
    overflow: no-display;
  }
}
</style>