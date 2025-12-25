<template>
  <v-table style="text-align: center;">
    <thead>
    <tr>
      <th
          v-for="column in columns[statsType]"
          :class="{ 'sortable': column.sortable }"
          v-on:click="(event) => handleSort(column.key, statsType)"
      >
        {{column.displayKey}}
        <span v-if="isSortActive(column.key)">
          {{getSortSymbol(column.key)}}
        </span>
      </th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="stat in stats">
      <td v-for="column in columns[statsType]">
        {{stat[column.key]}}
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  name: "StatsTable",
  props: {
    columns: {
      type: Object
    },
    selectedFilters: {
      type: Object
    },
    stats: {
      type: Object
    },
    sortMap: {
      type: Object
    },
    handleSort: {
      type: Function
    }
  },
  computed: {
    statsType () {
      return this.selectedFilters.type;
    }
  },
  methods: {
    isSortActive: function (key) {
      return this.sortMap.hasOwnProperty(key);
    },

    getSortSymbol: function (key) {
      return (this.sortMap[key] === 'asc') ? '\u0020\u2191' : '\u0020\u2193';
    },
  }
}
</script>

<style scoped>
.sortable {
  cursor: pointer;
}
</style>