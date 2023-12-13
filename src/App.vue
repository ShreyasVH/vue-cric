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
body {
  background-color: #f3f6f9;
}

.container {
  padding: 2%;
}

.bordered-container {
  margin: 0.25%;
  width: 99.5%;
  border: 1px solid gray;
  border-radius: 5px;
}

.row {
  width: 100%;
  margin-top: 1%;
  margin-bottom: 1%;
}

.link {
  color: #42a5f5;
  cursor: pointer;
}
</style>