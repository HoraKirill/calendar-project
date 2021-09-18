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
                      :weekdays="weekdays"
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
              <v-row>
                <v-col>
              <v-text-field
                  prepend-icon="mdi-numeric"
                  label="Исполнитель"
                  :rules="rules"
                  v-model="name.name"
              ></v-text-field>
                </v-col>
                <v-col>
              <v-dialog
                  v-model="dialog"
                  scrollable
                  max-width="300px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                  >
                    Выбрать исполнителя
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>Иcполнители</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px;">
                    <v-radio-group
                        v-model="name"
                        column
                    >
                      <v-radio
                          v-for="user in usersExecutor" :key="user.name"
                          :label="user.name"
                          :value="user"
                      ></v-radio>
                    </v-radio-group>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false, name = ''"
                    >
                      Назад
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false"
                    >
                      Сохранить
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                 <v-text-field
                  prepend-icon="mdi-numeric"
                  label="Номер кабинета"
                  :rules="rules"
                  v-model="office.name"
                  ></v-text-field>
                </v-col>
                  <v-col>
                    <v-dialog
                        v-model="dialog1"
                        scrollable
                        max-width="300px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                        >
                          Выбрать кабинет
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>Кабинет</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text style="height: 300px;">
                          <v-radio-group
                              v-model="office"
                              column
                          >
                            <v-radio
                                v-for="office in officeList" :key="office.name"
                                :label="office.name"
                                :value="office"
                            ></v-radio>
                          </v-radio-group>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn
                              color="blue darken-1"
                              text
                              @click="dialog1 = false, office = ''"
                          >
                            Назад
                          </v-btn>
                          <v-btn
                              color="blue darken-1"
                              text
                              @click="dialog1 = false"
                          >
                            Сохранить
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                      v-model="participantsSelect"
                      :items="participantsList"
                      item-text="name"
                      :menu-props="{ maxHeight: '400' }"
                      label="Участники"
                      multiple
                      hint="Выберете участников"
                      persistent-hint
                      return-object
                  ></v-select>
                </v-col>
                <v-col>
                      <v-btn
                          color="primary"
                          dark
                          @click="dialog3 =true"
                      >
                        Добавить участника
                      </v-btn>
                  <v-dialog
                      v-model="dialog3"
                      max-width="500px"
                  >
                    <v-card>
                      <v-card-title>
                        <v-text-field
                            label="Участник"
                            v-model="participants.name"
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
                            @click="newParticipants"
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
import {getDatabase, ref, child, get} from "firebase/database";

export default {
  data () {
    return {
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      pickerDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menuCalendar: false,
      pickerColors: '',
      menuColors: false,
      timeStart: null,
      menuStart: false,
      timeEnd: null,
      menuEnd: false,
      name: {},
      office: {},
      officeList:[],
      participantsList: [],
      participants: {},
      participantsSelect: [],
      valid: false,
      rules: [
        value => !!value || 'Заполните',
      ],
      dialog2: false,
      dialog3: false,
      dialog1: false,
      dialog: false,
      usersExecutor: [],
    }
  },

  mounted() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          childData.id = childSnapshot.key
          this.usersExecutor.push(childData);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
    get(child(dbRef, `participants/`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          console.log(childSnapshot.val())
          const childData = childSnapshot.val();
          childData.id = childSnapshot.key
          this.participantsList.push(childData);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
    get(child(dbRef, `office/`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          childData.id = childSnapshot.key
          this.officeList.push(childData);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  },

  methods: {
    eventWrite () {
      if (this.$refs.form.validate()) {

      const start = new Date(`${this.pickerDate}T${this.timeStart}`)
      const end = new Date(`${this.pickerDate}T${this.timeEnd}`)

        const events =  {
          name: this.name,
          office: this.office,
          start: start,
          end: end,
          color: this.pickerColors,
          participantsList: this.participantsSelect,
          timed: true
        }

      this.$store.dispatch('newEvent', events)
          .then(() => {
            this.$router.push('/')
          })
          .catch(() => {})
       }
    },
    newParticipants () {
      this.participantsList.push({...this.participants})
      this.participants.name = ''
      this.dialog3 = false
    }
  }
}
</script>
