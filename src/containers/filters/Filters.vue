<template>
  <v-btn v-on:click="openFilters" color="primary" icon="mdi-filter-variant" class="ma-2" style="position: fixed; bottom: 16px; right: 16px;" />

  <v-dialog v-model="filterOpen" transition="fade-transition" fullscreen>
    <v-card>
      <v-toolbar color="primary">
        <v-btn
            icon="mdi-close"
            v-on:click="closeFilters"
        />

        <v-toolbar-items>
          <v-btn
              text="Apply"
              variant="text"
              v-on:click="applyFilters"
          >
            Apply
          </v-btn>

          <v-btn
              v-if="isAnyFilterSelected"
              variant="text"
              v-on:click="handleClearAllFilters"
          >
            Clear All
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-expansion-panels>
        <v-expansion-panel v-for="key in Object.keys(options)" :key="key" >
          <v-expansion-panel-title>
            <span>{{options[key].displayName}}</span>
            <span v-if="isFilterSelected(key)" class="appliedFilter" />
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-if="isRadioFilter(key)">
              <v-btn v-if="key !== 'type' && isFilterSelected(key)" variant="text" color="primary" class="clear-filter" v-on:click="(event) => handleClearFilter(key)">Clear</v-btn>
              <v-radio-group inline v-model="selected[key]">
                <v-radio v-for="option in getRadioOptions(key)" color="primary" :label="option.name" :value="option.id"></v-radio>
              </v-radio-group>
            </div>

            <div v-if="isCheckboxFilter(key)">
              <v-btn v-if="isFilterSelected(key)" variant="text" color="primary" class="clear-filter" v-on:click="(event) => handleClearFilter(key)">Clear</v-btn>
              <v-row>
                <v-col v-for="option in getCheckboxOptions(key)" cols="auto">
                  <v-checkbox
                      :label="option.name"
                      color="primary"
                      hide-details
                      :model-value="isCheckboxChecked(key, option.id)"
                      v-on:change="(event) => { handleEvent(Object.assign(event, { filterType: 'checkbox', optionId: option.id, filterKey: key })) }"
                  />
                </v-col>
              </v-row>

            </div>

            <div v-if="isRangeFilter(key)">
              <v-btn v-if="isFilterSelected(key)" variant="text" color="primary" class="clear-filter" v-on:click="(event) => handleClearFilter(key)">Clear</v-btn>
              <v-row>
                <v-col
                    cols="12"
                    sm="2"
                >
                  <v-text-field
                      label="From"
                      variant="outlined"
                      :model-value="(selected.hasOwnProperty(key) && selected[key].hasOwnProperty('from')) ? selected[key].from : ''"
                      v-on:change="(event) => { handleEvent(Object.assign(event, { filterType: 'range', rangeType: 'from', filterKey: key })) }"
                  />
                </v-col>

                <v-col
                    cols="12"
                    sm="2"
                >
                  <v-text-field
                      label="To"
                      variant="outlined"
                      :model-value="(selected.hasOwnProperty(key) && selected[key].hasOwnProperty('to')) ? selected[key].to : ''"
                      v-on:change="(event) => { handleEvent(Object.assign(event, { filterType: 'range', rangeType: 'to', filterKey: key })) }"
                  />
                </v-col>
              </v-row>


            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-dialog>
</template>

<script>
import { FILTER_TYPE } from '../../constants';
import { copyObject } from '../../utils';

export default {
  name: "Filters",
  data (props) {
    return {
      filterOpen: props.open
    }
  },
  props: {
    options: {
      type: Object
    },
    open: {
      type: Boolean
    },
    onFilterOpen: {
      type: Function
    },
    onFilterClose: {
      type: Function
    },
    selected: {
      type: Object
    },
    onFiltersApply: {
      type: Function
    },
    onEvent: {
      type: Function
    },
    clearFilter: {
      type: Function
    },
    clearAllFilters: {
      type: Function
    }
  },
  methods: {
    openFilters: function (event) {
      this.onFilterOpen && this.onFilterOpen(event);
    },

    closeFilters: function (event) {
      this.onFilterClose && this.onFilterClose(event);
    },

    isRadioFilter: function (key) {
      return this.options.hasOwnProperty(key) && this.options[key].type === FILTER_TYPE.RADIO;
    },

    getRadioOptions: function (key) {
      let options = [];

      if (this.options.hasOwnProperty(key)) {
        options = this.options[key].values
      }

      return options;
    },

    isCheckboxFilter: function (key) {
      return this.options.hasOwnProperty(key) && this.options[key].type === FILTER_TYPE.CHECKBOX;
    },

    getCheckboxOptions: function (key) {
      let options = [];

      if (this.options.hasOwnProperty(key)) {
        options = this.options[key].values
      }

      return options;
    },

    isCheckboxChecked: function (key, id) {
      return this.selected.hasOwnProperty(key) && this.selected[key].indexOf(id) !== -1;
    },

    isRangeFilter: function (key) {
      return this.options.hasOwnProperty(key) && this.options[key].type === FILTER_TYPE.RANGE;
    },

    isFilterSelected: function (key) {
      return this.selected.hasOwnProperty(key) && 0 !== this.selected[key].length
    },

    handleEvent: function (event) {
      this.onEvent && this.onEvent(event);
    },

    applyFilters: function (event) {
      this.onFiltersApply && this.onFiltersApply();
    },

    handleClearFilter: function (key) {
      this.clearFilter && this.clearFilter(key);
    },

    handleClearAllFilters: function () {
      this.clearAllFilters && this.clearAllFilters();
    }
  },
  computed: {
    isAnyFilterSelected () {
      return Object.keys(this.selected).filter(k => k !== 'type').length > 0
    }
  },
  watch: {
    open (newVal) {
      console.log(newVal);
      this.filterOpen = newVal;
    }
  }
}
</script>

<style scoped>
.appliedFilter {
  display: inline-block;
  border-radius: 50%;
  min-width: 0.625rem;
  min-height: 0.625rem;
  background-color: #27AE60;
  margin-left: 0.625rem;
}

.clear-filter {
  float: right;
}
</style>