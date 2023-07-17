<template>
  <v-layout>
    <AppBar />
    <v-main>
      <div class="container">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</template>

<script>

import AppBar from './components/AppBar/AppBar.vue'

export default {
  name: 'App',
  components: {
    AppBar
  }
}

</script>

<style>
.container {
  padding: 2%;
}
</style>