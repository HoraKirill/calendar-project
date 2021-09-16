<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            v-bind="attrs"
            v-on="on"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Редактирование события</span>
        </v-card-title>
        <v-card-text>
         <v-form v-model="valid" validation>
          <v-menu
              ref="menuStart"
              v-model="menuStart"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="editTimeStart"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="editTimeStart"
                  label="Начало занятия"
                  prepend-icon="mdi-clock-time-four-outline"
                  v-bind="attrs"
                  v-on="on"
                  :rules="rules"
              ></v-text-field>
            </template>
            <v-time-picker
                v-if="menuStart"
                format="24hr"
                v-model="editTimeStart"
                full-width
                @click:minute="$refs.menuStart.save(editTimeStart)"
            ></v-time-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-menu
              ref="menuEnd"
              v-model="menuEnd"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="editTimeEnd"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="editTimeEnd"
                  label="Завершение занятия"
                  prepend-icon="mdi-clock-time-eleven-outline"
                  v-bind="attrs"
                  v-on="on"
                  :rules="rules"
              ></v-text-field>
            </template>
            <v-time-picker
                v-if="menuEnd"
                format="24hr"
                v-model="editTimeEnd"
                full-width
                @click:minute="$refs.menuEnd.save(editTimeEnd)"
            ></v-time-picker>
          </v-menu>
          <v-menu
              ref="menuCalendar"
              v-model="menuCalendar"
              :close-on-content-click="true"
              :nudge-right="40"
              :return-value.sync="editPickerDate"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="editPickerDate"
                  label="Выберете дату"
                  prepend-icon="mdi-calendar-range"
                  v-bind="attrs"
                  v-on="on"
                  :rules="rules"
              ></v-text-field>
            </template>
            <v-date-picker
                v-if="menuCalendar"
                full-width
                @click:date="$refs.menuCalendar.save(editPickerDate)"
                v-model="editPickerDate"
            ></v-date-picker>
          </v-menu>
          <v-menu
              ref="menuColors"
              v-model="menuColors"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="editPickerColors"
                  label="Выберете цвет"
                  prepend-icon="mdi-invert-colors"
                  v-bind="attrs"
                  v-on="on"
                  :rules="rules"
              ></v-text-field>
            </template>
            <v-color-picker
                dot-size="5"
                swatches-max-height="100"
                v-if="menuColors"
                @click="$refs.menuColors.save(editPickerColors)"
                v-model="editPickerColors"
            ></v-color-picker>
          </v-menu>
          <v-text-field
              prepend-icon="mdi-account-circle-outline"
              label="Исполнитель"
              v-model="editName"
              :rules="rules"
          ></v-text-field>
          <v-text-field
              prepend-icon="mdi-numeric"
              label="Номер кабинета"
              v-model="editOffice"
              :rules="rules"
          ></v-text-field>
          <v-textarea
              v-model="editListParticipants"
              color="teal"
              :rules="rules"
          >
            <template v-slot:label>
              <div>
                Список участников
              </div>
            </template>
           </v-textarea>
         </v-form>
         </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="onClose"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="onSave"
              :disabled="!valid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    selectedEvent: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      dialog: false,
      editTimeStart: this.selectedEvent.start.toLocaleTimeString(),
      menuStart: false,
      editTimeEnd: this.selectedEvent.end.toLocaleTimeString(),
      menuEnd: false,
      editPickerDate: this.selectedEvent.start.toLocaleDateString('en-ca'),
      menuCalendar: false,
      editPickerColors: this.selectedEvent.color,
      menuColors: false,
      editName: this.selectedEvent.name,
      editOffice: this.selectedEvent.office,
      editListParticipants: this.selectedEvent.listParticipants,
      valid: false,
      rules: [
        value => !!value || 'Заполните',
      ],
    }
  },
  methods: {
    onSave () {
      const start = new Date(`${this.editPickerDate}T${this.editTimeStart}`)
      const end = new Date(`${this.editPickerDate}T${this.editTimeEnd}`)
      this.$store.dispatch('updateEvent', {
        name:  this.editName,
        start: start,
        end: end,
        color: this.editPickerColors,
        office: this.editOffice,
        listParticipants: this.editListParticipants,
        timed: this.selectedEvent.timed,
        ownerId: this.selectedEvent.ownerId,
        id: this.selectedEvent.id,
      })
      this.dialog = false
    },
    onClose () {
      this.editTimeStart = this.selectedEvent.start.toLocaleTimeString(),
      this.editTimeEnd = this.selectedEvent.end.toLocaleTimeString(),
      this.editPickerDate = this.selectedEvent.start.toLocaleDateString(),
      this.editPickerColors = this.selectedEvent.color,
      this.editName = this.selectedEvent.name,
      this.editOffice = this.selectedEvent.office,
      this.editListParticipants = this.selectedEvent.listParticipants,
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>