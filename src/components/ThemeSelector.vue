<template>
  <v-switch
      color="secondary"
      :label="mode === 'dark' ? 'Dark mode' : 'Light mode'"
      @change="toggleMode"
      v-model="isDark"
      hide-details
  ></v-switch>
</template>

<script>
import { useTheme } from 'vuetify'

export default {
  name: "ThemeSelector",
  setup() {
    const theme = useTheme();

    return {
      theme
    }
  },
  data () {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      mode: prefersDark ? 'dark' : 'light'
    }
  },
  methods: {
    toggleMode () {
      const newMode = this.mode === 'dark' ? 'light' : 'dark';
      this.mode = newMode;
      this.theme.change(newMode);
    }
  },
  computed: {
    isDark () {
      return this.mode === 'dark';
    }
  }
}
</script>