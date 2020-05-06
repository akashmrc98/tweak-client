<template lang="pug">
.dialog
  v-dialog(v-model='dialog' max-width='400')
    template(v-slot:activator='{ on }')
    v-card.text-center(dark)
      v-system-bar(:color='color' class='title black--text') {{color}}
      v-card-text.text-center.subtitle-2.pa-2 {{message}}
      v-btn.ma-3.black--text(@click='action' :class='color') Close
</template>

<script>
export default {
  props: ["color", "message", "action", "dialog"]
};
</script>

<style scoped>
.dialog {
  margin-bottom: 15%;
}
</style>
