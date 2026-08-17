<template>
  <v-app-bar color="primary" absolute>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    </template>

    <template v-slot:append>
      <SearchSelect :on-select="handlePlayerSelect" />

      &nbsp;&nbsp;

      <ThemeSelector />
    </template>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawerOpen"
      temporary
  >
    <v-list nav>
      <v-list-item prepend-icon="mdi-home" title="Home" value="item1" @click="() => navigateToLink('/')"></v-list-item>

      <v-list-item prepend-icon="mdi-chart-bar" title="Players Stats" value="item2" @click="() => navigateToLink('/players/stats')"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import SearchSelect from '../SearchSelect/SearchSelect.vue';
import ThemeSelector from '../ThemeSelector.vue';
import { useRouter } from 'vue-router';

export default {
  name: "AppBar",
  components: {
    SearchSelect,
    ThemeSelector
  },
  setup() {
    const router = useRouter()

    const navigateToLink = (path) => {
      router.push({
        path
      })
    }

    return {
      navigateToLink
    }
  },
  data () {
    return {
      drawerOpen: false
    }
  },
  methods: {
    handlePlayerSelect: function (event, item) {
      this.$router.push(`/players/details?id=${item.id}`);
    },

    toggleDrawer () {
      this.drawerOpen = !this.drawerOpen;
    }
  }
}
</script>

<style scoped>

</style>