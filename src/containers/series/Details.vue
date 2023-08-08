<template>
  <div v-if="loaded">
    <p class="text-h5 title">
      {{series.name + ' - ' + series.gameType.name}}
    </p>

    <v-card class="tour-card" v-for="(match, index) in series.matches">
      <v-row no-gutters>
        <v-col md="4">
          <v-card-text class="inline-block no-padding-bottom">
            {{(index + 1) + '. ' + match.team1.name + ' v/s ' + match.team2.name}}
          </v-card-text>

          <v-card-text class="no-padding-top">
            {{renderWinner(match)}}
          </v-card-text>
        </v-col>

        <v-col md="4">
          <v-card-text class="text-align-center">
            {{renderStadiumDetails(match.stadium)}}
          </v-card-text>
        </v-col>

        <v-col md="4">
          <v-card-text class="inline-block float-right">
            {{this.formatDate(match.startTime)}}
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { getById } from '../../endpoints/series';
import { formatDateTimeString } from '../../utils';

export default {
  name: 'Details',
  data () {
    return {
      series: {},
      loaded: false
    };
  },
  async mounted() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const seriesId = urlSearchParams.get('id');
    const seriesResponse = await getById(seriesId);
    this.series = seriesResponse.data.data;
    this.loaded = true;
  },
  methods: {
    formatDate:  function (dateTimeString) {
      return formatDateTimeString(dateTimeString);
    },

    renderWinner: function (match) {
      let result = '';

      if (match.winner) {
        result += match.winner.name + " won";

        if (match.winMarginType) {
          result += " by " + match.winMargin + " " + this.getWinMargin(match.winMargin, match.winMarginType.name);
        }

        if ('Super Over' === match.resultType.name) {
          result += ' (Super Over)';
        }
      } else {
        if (match.resultType.name === 'Tie') {
          result = 'Match Tied';
        } else if(match.resultType.name === 'Draw') {
          result = 'Match Drawn';
        } else if(match.resultType.name === 'Washed Out') {
          result = 'Match Washed Out';
        }
      }

      return result;
    },

    getWinMargin: function (winMargin, winMarginType) {
      let margin = winMarginType.toLowerCase();

      if (winMargin > 1) {
        margin += 's';
      }

      return margin;
    },

    renderStadiumDetails: function (stadium) {
      return stadium.name + ', ' + stadium.country.name;
    }
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

.text-align-center {
  text-align: center;
}

.no-padding-top {
  padding-top: 0;
}

.no-padding-bottom {
  padding-bottom: 0;
}

</style>