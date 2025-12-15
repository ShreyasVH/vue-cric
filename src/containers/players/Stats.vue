<template>
    <div v-if="loaded">
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


      <div class="pagination-box">
        <div v-if="page > 2" class="pagination-button" v-on:click="() => goToPage(1)">
          {{'<<'}}
        </div>

        <div v-if="page > 1" class="pagination-button" v-on:click="() => goToPage(page - 1)">
          {{'<'}}
        </div>

        <div v-for="i in getPageRange" :class="{ 'pagination-button': true, active: i === page }" v-on:click="() => goToPage(i)">
          {{i}}
        </div>

        <div v-if="page < totalPages - 1" class="pagination-button" v-on:click="() => goToPage(page + 1)">
          {{'>'}}
        </div>

        <div v-if="page < totalPages - 2" class="pagination-button" v-on:click="() => goToPage(totalPages)">
          {{'>>'}}
        </div>
      </div>
    </div>

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
</template>

<script>
import Filters from '../filters/Filters.vue';
import { FILTER_TYPE } from '../../constants';
import { copyObject, showLoader, hideLoader } from "../../utils";

import { getStats } from '../../endpoints/players';
import { getAllTeams } from '../../endpoints/teams';
import { getAllStadiums } from '../../endpoints/stadiums';
export default {
  name: "Stats",
  data () {
    return {
      loaded: false,
      filterOptions: this.getDefaultFilterOptions(),
      filterOpen: false,
      selectedFilters: {
        type: 'batting'
      },
      selectedFiltersTemp: {
        type: 'batting'
      },
      stats: [],
      totalCount: 0,
      page: 1,
      sortMap: {
        'runs': 'desc'
      },
      columns: {
        batting: [
          {
            displayKey: 'Name',
            key: 'name',
            sortable: false
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
            sortable: false
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
            sortable: false
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
      }
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
    Filters
  },
  computed: {
    limit () {
      return 10;
    },

    totalPages () {
      return (((this.totalCount - (this.totalCount % this.limit)) / this.limit) + (((this.totalCount % this.limit) === 0) ? 0 : 1))
    },

    getPageRange () {
      let range = [];
      for (let i = Math.max(1, this.page - 2); i <= Math.min(this.totalPages, this.page + 2); i++) {
        range.push(i);
      }

      return range;
    },

    statsType () {
      return this.selectedFilters.type;
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
        },
        number: {
          displayName: 'Position',
          type: FILTER_TYPE.CHECKBOX,
          values: [...Array(11).keys()].map(i => ({ id: String(i + 1), name: String(i + 1) }))
        },
      }
    },

    showFilters: function (event) {
      this.filterOpen = true;
      // this.selectedFi  ltersTemp = copyObject(this.selectedFilters);
    },

    hideFilters: function (event) {
      this.filterOpen = false;
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

    handleSort: function (key, type) {
      const columnConfig = this.columns[type].filter(column => key === column.key);
      if (columnConfig.length === 1 && columnConfig[0].sortable) {
        const order = ((this.sortMap.hasOwnProperty(key) && this.sortMap[key] === 'desc') ? 'asc' : 'desc');
        this.updateData(1, {
          [key]: order
        });
      }
    },

    isSortActive: function (key) {
      return this.sortMap.hasOwnProperty(key);
    },

    getSortSymbol: function (key) {
      return (this.sortMap[key] === 'asc') ? '\u0020\u2191' : '\u0020\u2193';
    },

    goToPage: function (page) {
       this.updateData(page, this.sortMap);
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
    }
  }
}
</script>

<style scoped>
.sortable {
  cursor: pointer;
}

.pagination-box {
  text-align: center;
  margin-top: 2%;
}

.pagination-box .active {
  background-color: #303F9F;
  color: #FFFFFF;
  border: 1px solid #303F9F;
  border-radius: 10%;
}

.pagination-button {
  display: inline-block;
  padding: 1% 1.5%;
  cursor: pointer;
  font-weight: large;
  margin-left: 0.25%;
  margin-right: 0.25%;
  border-radius: 0;
}

.pagination-button:hover {
  background-color: #303F9F;
  color: #FFFFFF;
  border: 1px solid #303F9F;
  border-radius: 10%;
}
</style>