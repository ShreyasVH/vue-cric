<template>
  <v-app-bar color="primary" absolute>
    <template v-slot:prepend>
      <v-app-bar-nav-icon />
    </template>
  </v-app-bar>

  <v-navigation-drawer
      temporary
  >
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "AppBar"
}
</script>

<style scoped>

</style>