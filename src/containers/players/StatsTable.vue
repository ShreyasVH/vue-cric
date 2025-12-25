<template>
  <v-table>
    <thead>
    <tr>
      <th
          style="text-align: left"
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
      <td
          v-for="column in columns[statsType]"
          :class="{ 'clickable': column.clickable }"
          v-on:click="() => handleValueClick(column.key, stat.id)"
      >
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
    },
    onValueClick: {
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

    handleValueClick: function (key, id) {
      this.onValueClick && this.onValueClick(key, id);
    }
  }
}
</script>

<style scoped>
.sortable {
  cursor: pointer;
}

.clickable {
  cursor: pointer;
  color: #42a5f5;
}
</style>