<template lang="pug">
v-app
  v-card.body
    router-view
</template>

<script>
export default {};
</script>

<style>
.centerComponent {
  margin: 3%;
  width: 33%;
}

.unlink {
  text-decoration: none;
}
.body {
  height: 100%;
  background: rgb(131, 58, 180);
  background: linear-gradient(
    90deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 1) 50%,
    rgba(252, 176, 69, 1) 100%
  );
}
</style>
