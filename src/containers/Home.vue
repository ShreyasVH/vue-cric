<template>
  <div>
    <v-row>
      <v-col cols="6">
        <p class="text-h5 title">Tours for {{year}}:</p>
        <div>
          <v-card class="tour-card" v-for="tour of tours">
            <v-card-text class="inline-block">
              {{tour.name}}
            </v-card-text>

            <v-card-text class="inline-block float-right">
              {{this.formatDate(tour.startTime)}}
            </v-card-text>
          </v-card>

          <Waypoint @change="handleScroll" />
        </div>
      </v-col>

      <v-col cols="6">
        <p class="text-h5 title">Years:</p>

        <div class="year-container">
          <v-btn
              class="year-button"
              variant="outlined"
              v-for="year of years"
              color="secondary"
              @click="this.handleYearClick(year)"
          >
            {{year}}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import { formatDateTimeString } from '../utils';
import { getAllYears, getToursForYear } from '../endpoints/tours';

import { Waypoint } from 'vue-waypoint';

export default {
  name: 'Home',
  components: {
    Waypoint
  },
  data () {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const year = urlSearchParams.get('year') ?? (new Date()).getFullYear();
    return {
      year: year,
      years: [],
      tours: [],
      page: 1,
      totalPages: 1,
      pageSize: 25
    };
  },
  methods: {
    formatDate:  function (dateTimeString) {
      return formatDateTimeString(dateTimeString);
    },

    handleYearClick: function (year) {
      this.$router.push('/browse?year=' + year)
    },

    handleScroll: function (wayPointState) {
      if (this.tours.length > 0 && this.page < this.totalPages && wayPointState.going === 'IN' && wayPointState.direction === 'UP') {
        this.page = this.page + 1;
      }
    },

    handleDataUpdate: function (toursResponse, page) {
      const toursData = toursResponse.data.data;
      let finalTours = [];
      if (page === 1) {
        const totalCount = toursData.totalCount;
        this.totalPages = Math.ceil(totalCount / this.pageSize);
        finalTours = toursData.items;
      } else {
        finalTours = this.tours.concat(toursData.items);
      }

      this.tours = finalTours;
    }
  },
  async mounted() {
    const yearsResponse = await getAllYears();
    this.years = yearsResponse.data.data;

    const toursResponse = await getToursForYear(this.year, this.page, this.pageSize);
    this.handleDataUpdate(toursResponse, this.page);

  },
  watch: {
    async '$route.query.year' (newVal) {
      const toursResponse = await getToursForYear(newVal, 1, this.pageSize);
      this.year = newVal;
      this.handleDataUpdate(toursResponse, 1);
    },

    async page (newVal) {
      const toursResponse = await getToursForYear(this.year, newVal, this.pageSize);
      this.handleDataUpdate(toursResponse, newVal);
    }
  }
}

</script>

<style>
.title {
  text-align: center;
}

.year-button {
  margin-left: 1%;
  margin-right: 1%;
}

.year-container {
  justify-content: center;
  text-align: center;
}

.tour-card {
  margin-bottom: 1%;
}

.inline-block {
  display: inline-block;
}

.float-right {
  float: right;
}
</style>