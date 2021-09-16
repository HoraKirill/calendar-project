<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Создать событие</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" validation>
              <v-menu
                  ref="menuStart"
                  v-model="menuStart"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="timeStart"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="timeStart"
                      label="Начало занятия"
                      prepend-icon="mdi-clock-time-four-outline"
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                    v-if="menuStart"
                    format="24hr"
                    v-model="timeStart"
                    full-width
                    @click:minute="$refs.menuStart.save(timeStart)"
                ></v-time-picker>
              </v-menu>
              <v-spacer></v-spacer>
              <v-menu
                  ref="menuEnd"
                  v-model="menuEnd"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="timeEnd"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="timeEnd"
                      label="Завершение занятия"
                      prepend-icon="mdi-clock-time-eleven-outline"
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                    v-if="menuEnd"
                    format="24hr"
                    v-model="timeEnd"
                    full-width
                    @click:minute="$refs.menuEnd.save(timeEnd)"
                ></v-time-picker>
              </v-menu>
              <v-menu
                  ref="menuCalendar"
                  v-model="menuCalendar"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  :return-value.sync="pickerDate"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="pickerDate"
                      label="Выберете дату"
                      prepend-icon="mdi-calendar-range"
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                  <v-date-picker
                      v-if="menuCalendar"
                      full-width
                      @click:date="$refs.menuCalendar.save(pickerDate)"
                      v-model="pickerDate"
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
                      v-model="pickerColors"
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
                    @click="$refs.menuColors.save(pickerColors)"
                    v-model="pickerColors"
                ></v-color-picker>
              </v-menu>
              <v-text-field
                  prepend-icon="mdi-account-circle-outline"
                  label="Исполнитель"
                  :rules="rules"
                  v-model="name"
              ></v-text-field>
              <v-text-field
                  prepend-icon="mdi-numeric"
                  label="Номер кабинета"
                  :rules="rules"
                  v-model="office"
              ></v-text-field>
              <v-textarea
                  v-model="listParticipants"
                  color="teal"
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
                color="primary"
                @click="eventWrite"
                :disabled="!valid"
            >Создать событие</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      pickerDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menuCalendar: false,
      pickerColors: '',
      menuColors: false,
      timeStart: null,
      menuStart: false,
      timeEnd: null,
      menuEnd: false,
      name: '',
      office: '',
      listParticipants: '',
      valid: false,
      rules: [
        value => !!value || 'Заполните',
      ],
    }
  },

  methods: {

    eventWrite () {
      if (this.$refs.form.validate()) {

      const start = new Date(`${this.pickerDate}T${this.timeStart}`)
      const end = new Date(`${this.pickerDate}T${this.timeEnd}`)

        const events =  {
          name: `${this.name}  ${this.office}`,
          office: this.office,
          start: start,
          end: end,
          color: this.pickerColors,
          listParticipants: this.listParticipants,
          timed: true
        }

      this.$store.dispatch('getEvent', events)
          .then(() => {
            this.$router.push('/calendar')
          })
          .catch(() => {})
       }
    }
  }
}
</script>
