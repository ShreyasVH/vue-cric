<template>
  <div
      ref="searchContainer"
      class="search-select"
  >
    <v-text-field
        v-model="search"
        label="Search"
        variant="outlined"
        hide-details
        autocomplete="off"
        @input="handleChange"
    />

    <v-menu
        v-model="open"
        :target="$refs.searchContainer"
        location="bottom start"
        :close-on-content-click="false"
        :width="300"
    >
      <v-list v-if="options.length" max-height="250">
        <v-list-item
            v-for="item in options"
            :key="item.id"
            :title="item.name"
            @click="event => handleSelect(event, item)"
        />
      </v-list>
    </v-menu>
  </div>
</template>


<script>
import { search } from '../../endpoints/players';


export default {
  name: "SearchSelect",
  data() {
    return {
      search: "",
      open: false,
      options: []
    };
  },
  props: {
    onSelect:{
      type: Function
    }
  },
  methods: {
    async handleChange() {
      this.open = this.search.length >= 2;

      const keyword = event.target.value;
      if (keyword.length >= 2) {
        this.options = await this.searchItems(keyword);
        this.open = true;
      }
      this.search = keyword;
    },

    handleSelect(event, item) {
      this.onSelect && this.onSelect(event, item);
      this.open = false;
      this.search = '';
      this.options = [];
    },

    async searchItems(value) {
      let options = [];
      const response = await search(value);
      const data = response.data.data;
      options = data.items;

      return options;
    }
  }
}
</script>

<style scoped>
.search-select {
  position: relative;
  width: 300px;
}

.search-dropdown {
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  z-index: 9999;
  max-height: 250px;
  overflow-y: auto;
}

</style>