<template>
  <v-app-bar color="primary" absolute>
    <template v-slot:prepend>
      <v-app-bar-nav-icon />
    </template>

    <template v-slot:append>
      <SearchSelect :on-select="handlePlayerSelect" />
    </template>
  </v-app-bar>

  <v-navigation-drawer
      temporary
  >
  </v-navigation-drawer>
</template>

<script>
import SearchSelect from '../SearchSelect/SearchSelect.vue';

export default {
  name: "AppBar",
  components: {
    SearchSelect
  },
  methods: {
    handlePlayerSelect: function (event, item) {
      console.log(item);
      this.$router.push(`/players/details?id=${item.id}`);
    }
  }
}
</script>

<style scoped>

</style>