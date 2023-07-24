<template>
  <div v-if="loaded">
    <p class="text-h5 title">{{tour.name}}</p>

    <v-card class="tour-card" v-for="series in tour.seriesList">
      <v-card-text class="inline-block">
        {{series.gameType.name}}
      </v-card-text>

      <v-card-text class="inline-block float-right">
        {{this.formatDate(series.startTime)}}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { getById } from '../../endpoints/tours';
import { formatDateTimeString } from '../../utils';

export default {
  name: 'Details',
  data () {
    return {
      tour: {},
      loaded: false
    };
  },
  async mounted() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const tourId = urlSearchParams.get('id');
    const tourResponse = await getById(tourId);
    this.tour = tourResponse.data.data;
    this.loaded = true;
  },
  methods: {
    formatDate:  function (dateTimeString) {
      return formatDateTimeString(dateTimeString);
    },
  }
}
</script>

<style scoped>
.inline-block {
  display: inline-block;
}

.float-right {
  float: right;
}

.tour-card {
  margin-bottom: 1%;
}
</style>