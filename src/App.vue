<template>
  <v-layout>
    <AppBar />
    <Loader />
    <v-main>
      <div :data-theme="isDark ? 'dark' : 'light'" class="container">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</template>

<script>

import AppBar from './components/AppBar/AppBar.vue'
import Loader from './components/Loader/Loader.vue'
import { useTheme } from 'vuetify'
import { computed } from 'vue'

export default {
  name: 'App',
  setup() {
    const theme = useTheme()

    const isDark = computed(() => {
      return theme.global.current.value.dark
    })

    return {
      isDark
    }
  },
  components: {
    AppBar,
    Loader
  }
}

</script>

<style>
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