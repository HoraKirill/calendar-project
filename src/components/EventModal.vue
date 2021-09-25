<template>
  <v-row justify="center">
    <v-dialog
        v-model="open"
        max-width="600px"
        persistent
        :retain-focus="false"
    >
      <events
          :selectedEvent="selectedEvent"
      ></events>
    </v-dialog>
  </v-row>
</template>

<script>
import Events from "./Events";

export default {
  props: {
    selectedEvent: {
      type: Object,
      default() {}
    },
    createMode: {
      type: Boolean,
      default: false
    },
  },
  components: {
    events: Events
  },
  computed: {
    open(){
      return this.$store.getters.openEventModal
    }
  }
}
</script>

<style scoped>

</style>