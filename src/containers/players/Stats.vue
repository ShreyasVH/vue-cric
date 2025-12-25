<template>
    <div v-if="loaded">
      <StatsTable
          :columns="columns"
          :selected-filters="selectedFilters"
          :stats="stats"
          :sort-map="sortMap"
          :handle-sort="handleSort"
          :on-value-click="handleValueClick"
      />

      <PaginationBox
          :page="page"
          :total-count="totalCount"
          :limit="limit"
          :go-to-page="goToPage"
      />

      <Filters
          :open="filterOpen"
          :options="filterOptions"
          :on-filter-open="showFilters"
          :on-filter-close="hideFilters"
          :selected="selectedFiltersTemp"
          :on-filters-apply="handleApplyFilters"
          :on-event="handleFilterEvent"
          :clear-filter="handleClearFilter"
          :clear-all-filters="handleClearAllFilters"
      />
    </div>
</template>

<script>
import Filters from '../filters/Filters.vue';
import { FILTER_TYPE } from '../../constants';
import { copyObject, showLoader, hideLoader } from "../../utils";

import { getStats } from '../../endpoints/players';
import { getAllTeams } from '../../endpoints/teams';
import { getAllStadiums } from '../../endpoints/stadiums';
import PaginationBox from './PaginationBox.vue';
import StatsTable from './StatsTable.vue';
export default {
  name: "Stats",
  data () {
    return {
      loaded: false,
      filterOpen: false,
      filterOptions: this.getDefaultFilterOptions(),
      stats: [],
      totalCount: 0,
      selectedFilters: {
        type: 'batting'
      },
      selectedFiltersTemp: {
        type: 'batting'
      },
      sortMap: {
        'runs': 'desc'
      },
      page: 1
    }
  },
  mounted() {
    Promise.all([
      this.updateData(1, this.sortMap),
      getAllTeams(),
      getAllStadiums()
    ]).then(([_, allTeams, allStadiums]) => {
      const updatedFilterOptions = copyObject(this.filterOptions);

      updatedFilterOptions['team'] = {
        displayName: 'Team',
        type: FILTER_TYPE.CHECKBOX,
        values: allTeams.map(team => ({
          id: JSON.stringify(team.id),
          name: team.name
        }))
      };

      updatedFilterOptions['opposingTeam'] = {
        displayName: 'Opposing Team',
        type: FILTER_TYPE.CHECKBOX,
        values: allTeams.map(team => ({
          id: JSON.stringify(team.id),
          name: team.name
        }))
      };

      updatedFilterOptions['stadium'] = {
        displayName: 'Stadium',
        type: FILTER_TYPE.CHECKBOX,
        values: allStadiums.map(stadium => ({
          id: JSON.stringify(stadium.id),
          name: stadium.name
        }))
      };

      this.filterOptions = updatedFilterOptions;
    });
  },
  components: {
    PaginationBox,
    Filters,
    StatsTable
  },
  computed: {
    limit () {
      return 10;
    },

    columns () {
      return {
        batting: [
          {
            displayKey: 'Name',
            key: 'name',
            sortable: false,
            clickable: true
          },
          {
            displayKey: 'Innings',
            key: 'innings',
            sortable: true
          },
          {
            displayKey: 'Runs',
            key: 'runs',
            sortable: true
          },
          {
            displayKey: 'Balls',
            key: 'balls',
            sortable: true
          },
          {
            displayKey: 'Not Outs',
            key: 'notOuts',
            sortable: true
          },
          {
            displayKey: 'Highest',
            key: 'highest',
            sortable: true
          },
          {
            displayKey: '4s',
            key: 'fours',
            sortable: true
          },
          {
            displayKey: '6s',
            key: 'sixes',
            sortable: true
          },
          {
            displayKey: '50s',
            key: 'fifties',
            sortable: true
          },
          {
            displayKey: '100s',
            key: 'hundreds',
            sortable: true
          }
        ],
        bowling: [
          {
            displayKey: 'Name',
            key: 'name',
            sortable: false,
            clickable: true
          },
          {
            displayKey: 'Innings',
            key: 'innings',
            sortable: true
          },
          {
            displayKey: 'Wickets',
            key: 'wickets',
            sortable: true
          },
          {
            displayKey: 'Runs',
            key: 'runs',
            sortable: true
          },
          {
            displayKey: 'Balls',
            key: 'balls',
            sortable: true
          },
          {
            displayKey: 'Maidens',
            key: 'maidens',
            sortable: true
          },
          {
            displayKey: 'fifers',
            key: 'fifers',
            sortable: true
          },
          {
            displayKey: 'Ten Wickets',
            key: 'tenWickets',
            sortable: true
          }
        ],
        fielding: [
          {
            displayKey: 'Name',
            key: 'name',
            sortable: false,
            clickable: true
          },
          {
            displayKey: 'Fielder Catches',
            key: 'fielderCatches',
            sortable: true
          },
          {
            displayKey: 'Keeper Catches',
            key: 'keeperCatches',
            sortable: true
          },
          {
            displayKey: 'Stumpings',
            key: 'stumpings',
            sortable: true
          },
          {
            displayKey: 'Run Outs',
            key: 'runOuts',
            sortable: true
          }
        ]
      };
    }

  },
  methods: {
    getDefaultFilterOptions () {
      return {
        type: {
          displayName: 'Type',
          type: FILTER_TYPE.RADIO,
          values: [
            {
              id: 'batting',
              name: 'Batting'
            },
            {
              id: 'bowling',
              name: 'Bowling'
            },
            {
              id: 'fielding',
              name: 'Fielding'
            }
          ]
        },
        gameType: {
          displayName: 'Game Type',
          type: FILTER_TYPE.CHECKBOX,
          values: [
            {
              id: '1',
              name: 'ODI'
            },
            {
              id: '2',
              name: 'TEST'
            },
            {
              id: '3',
              name: 'T20'
            }
          ]
        },
        teamType: {
          displayName: 'Team Type',
          type: FILTER_TYPE.CHECKBOX,
          values: [
            {
              id: '1',
              name: 'INTERNATIONAL'
            },
            {
              id: '2',
              name: 'DOMESTIC'
            },
            {
              id: '3',
              name: 'FRANCHISE'
            }
          ]
        },
        year: {
          displayName: 'Year',
          type: FILTER_TYPE.RANGE
        }
      }
    },

    updateData: function (selectedPage, sortMap) {
      showLoader();

      const payload = {
        type: 'batting',
        filters: {},
        rangeFilters: {},
        count: this.limit,
        offset: (selectedPage - 1) * this.limit,
        sortMap
      };

      const rangeFilterKeys = [
        'year'
      ];

      const allowedSortKeys = {
        'batting': [
          'runs',
          'innings',
          'balls',
          'notOuts',
          'highest',
          'fours',
          'sixes',
          'fifties',
          'hundreds'
        ],
        'bowling': [
          'wickets',
          'innings',
          'runs',
          'balls',
          'maidens',
          'fifers',
          'tenWickets'
        ],
        'fielding': [
          'fielderCatches',
          'keeperCatches',
          'stumpings',
          'runOuts'
        ]
      };

      for (const [key, values] of Object.entries(this.selectedFiltersTemp)) {
        if (key === 'type') {
          payload.type = values;
          if (!allowedSortKeys[payload.type].includes(Object.keys(sortMap)[0])) {
            sortMap = {
              [allowedSortKeys[payload.type][0]]: 'desc'
            };
            payload.sortMap = sortMap;
          }
        } else if (rangeFilterKeys.indexOf(key) !== -1) {
          payload.rangeFilters[key] = values;
        } else {
          payload.filters[key] = values;
        }
      }

      getStats(payload).then(statsResponse => {
        this.stats = statsResponse.data.data.stats;
        this.totalCount = statsResponse.data.data.count;
        this.selectedFilters = copyObject(this.selectedFiltersTemp);
        this.page = selectedPage;
        this.sortMap = sortMap;
        this.loaded = true;
        this.hideFilters();
        hideLoader();
      });
    },

    showFilters: function (event) {
      this.filterOpen = true;
      this.selectedFiltersTemp = copyObject(this.selectedFilters);
    },

    hideFilters: function (event) {
      this.filterOpen = false;
    },

    handleApplyFilters: function () {
      this.updateData(1, this.sortMap);
    },

    handleFilterEvent: function (event) {
      const target = event.target;
      let tempFilters = copyObject(this.selectedFiltersTemp);
      switch (event.filterType) {
        case FILTER_TYPE.CHECKBOX: {
          const key = event.filterKey;
          const id = event.optionId;
          const checked = target.checked;

          if (checked) {
            if (tempFilters.hasOwnProperty(key)) {
              tempFilters[key].push(id);
            } else {
              tempFilters[key] = [
                  id
              ];
            }
          } else {
            let index = tempFilters[key].indexOf(id);
            tempFilters[key].splice(index, 1);
          }
          if (tempFilters[key].length === 0) {
            delete tempFilters[key];
          }
          break;
        }
        case FILTER_TYPE.RADIO: {
          const key = event.filterKey;
          const id = event.optionId;

          tempFilters[key] = id;
          break;
        }
        case FILTER_TYPE.RANGE: {
          const key = event.filterKey;
          const type = event.rangeType;
          if (!tempFilters.hasOwnProperty(key)) {
            tempFilters[key] = {};
          }
          tempFilters[key][type] = target.value;
          break;
        }
      }
      this.selectedFiltersTemp = tempFilters;
    },

    handleClearFilter: function (key) {
      let tempFilters = copyObject(this.selectedFiltersTemp);

      delete tempFilters[key];

      this.selectedFiltersTemp = tempFilters;
    },

    handleClearAllFilters: function () {
      let tempFilters = copyObject(this.selectedFiltersTemp);

      for (const key of Object.keys(tempFilters)) {
        if (key !== 'type') {
          delete tempFilters[key];
        }
      }

      this.selectedFiltersTemp = tempFilters;
    },

    goToPage: function (page) {
      this.updateData(page, this.sortMap);
    },

    handleSort: function (key, type) {
      const columnConfig = this.columns[type].filter(column => key === column.key);
      if (columnConfig.length === 1 && columnConfig[0].sortable) {
        const order = ((this.sortMap.hasOwnProperty(key) && this.sortMap[key] === 'desc') ? 'asc' : 'desc');
        this.updateData(1, {
          [key]: order
        });
      }
    },

    handlePlayerClick: function (playerId) {
      console.log(playerId);
    },

    handleValueClick: function (key, id) {
      if (key === 'name') {
        this.handlePlayerClick(id);
      }
    }
  }
}
</script>

<style scoped>

</style>