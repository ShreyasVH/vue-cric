<template>
  <v-app-bar color="primary" absolute>
    <template v-slot:prepend>
      <v-app-bar-nav-icon />
    </template>

    <template v-slot:append>
      <SearchSelect :on-select="handlePlayerSelect" />

      &nbsp;&nbsp;

      <ThemeSelector />
    </template>
  </v-app-bar>

  <v-navigation-drawer
      temporary
  >
  </v-navigation-drawer>
</template>

<script>
import SearchSelect from '../SearchSelect/SearchSelect.vue';
import ThemeSelector from '../ThemeSelector.vue';

export default {
  name: "AppBar",
  components: {
    SearchSelect,
    ThemeSelector
  },
  methods: {
    handlePlayerSelect: function (event, item) {
      this.$router.push(`/players/details?id=${item.id}`);
    }
  }
}
</script>

<style scoped>

</style>