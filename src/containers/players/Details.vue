<template>
  <template v-if="loaded">
    <h1>Player Details</h1>
    <v-row no-gutters style="text-align: center">
      <v-col v-for="gameType of Object.keys(details.battingStats)" xs="4">
        <v-card
            class="mx-auto"
            max-width="300"
            style="text-align: center"
        >
          <v-card-text>
            <p class="text-h4 font-weight-black">{{details.name}}</p>

            <p>{{gameType}}</p>

            <img src="https://res.cloudinary.com/dyoxubvbg/image/upload/v1577106216/artists/default_m.jpg" />

            <div class="text-medium-emphasis" style="text-align: left">
              <v-row no-gutters>
                <v-col md="6">
                  <p v-for="field of column1Fields">
                    <strong>{{field.displayName}}:</strong>
                    {{getWrappedValue(details, 'battingStats', gameType, field.key)}}
                  </p>

                  <p>
                    <strong>50/100:</strong>
                    {{getWrappedValue(details, 'battingStats', gameType, 'fifties')}}/{{getWrappedValue(details, 'battingStats', gameType, 'hundreds')}}
                  </p>
                </v-col>

                <v-col md="6">
                  <p v-for="field of column2Fields">
                    <strong>{{field.displayName}}:</strong>
                    {{getWrappedValue(details, field.statsType, gameType, field.key)}}
                  </p>

                  <p>
                    <strong>DOB:</strong>
                    {{getDateOfBirth(details.dateOfBirth)}}
                  </p>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <br />
    <hr />
    <br />

    <h2>Dismissal Stats</h2>

    <v-row no-gutters style="text-align: center">
      <v-col v-for="gameType of Object.keys(details.dismissalStats)" xs="4">
        <Doughnut
            :options="getChartOptions(gameType)"
            :data="formatDismissalStatsForRender(details.dismissalStats[gameType])"
            :chart-id="`dismissals_${gameType}`"
            :dataset-id-key="`label-${gameType}`"
            :width="400"
            :height="400"
        />
      </v-col>
    </v-row>
  </template>
</template>

<script>
import { getDetails as getPlayerDetails } from '../../endpoints/players';

import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
  name: "Details",
  components: {
    Doughnut
  },
  data () {
    return {
      loaded: false,
      details: {}
    };
  },
  async mounted() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlSearchParams.get('id'));

    const playerDetailsResponse = await getPlayerDetails(id);
    this.details = playerDetailsResponse.data.data;
    this.loaded = true;
  },
  computed: {
    column1Fields: function () {
      return [
        {
          key: 'innings',
          displayName: 'Innings'
        },
        {
          key: 'runs',
          displayName: 'Runs'
        },
        {
          key: 'balls',
          displayName: 'Balls'
        },
        {
          key: 'average',
          displayName: 'Average'
        },
        {
          key: 'strikeRate',
          displayName: 'Strike Rate'
        },
        {
          key: 'notOuts',
          displayName: 'Not Outs'
        },
        {
          key: 'highest',
          displayName: 'Highest'
        }
      ];
    },
    column2Fields: function () {
      return [
        {
          key: 'catches',
          displayName: 'Catches',
          statsType: 'fieldingStats'
        },
        {
          key: 'wickets',
          displayName: 'Wickets',
          statsType: 'bowlingStats'
        },
        {
          key: 'balls',
          displayName: 'Balls',
          statsType: 'bowlingStats'
        },
        {
          key: 'runs',
          displayName: 'Runs',
          statsType: 'bowlingStats'
        },
        {
          key: 'fifers',
          displayName: 'Fifers',
          statsType: 'bowlingStats'
        },
        {
          key: 'economy',
          displayName: 'Economy',
          statsType: 'bowlingStats'
        }
      ];
    }
  },
  methods: {
    getWrappedValue : function (details, statType, gameType, key) {
      let value = '-';

      if(details.hasOwnProperty(statType) && details[statType].hasOwnProperty(gameType) && details[statType][gameType].hasOwnProperty(key)) {
        value = this.formatValue(details[statType][gameType][key], key);
      }

      return value;
    },

    formatValue : function (value, field) {
      let formattedValue;

      switch (field) {
        case 'average':
        case 'strikeRate':
          formattedValue = value !== null ? value.toFixed(2) : '-';
          break;
        case 'economy':
          formattedValue = value !== null ? value.toFixed(2) : '-';
          break
        default:
          formattedValue = value;
      }

      return formattedValue;
    },

    getDateOfBirth: function (dateOfBirthString) {
      const dateOfBirth = new Date(dateOfBirthString);
      return ("0" + dateOfBirth.getDate()).slice(-2) + '/' + ("0" + (dateOfBirth.getMonth() + 1)).slice(-2) + '/' + dateOfBirth.getFullYear();
    },

    formatDismissalStatsForRender: function (stats) {
      const colorMap = {
        Bowled: {
          backgroundColor: '#a6cee3'
        },
        Caught: {
          backgroundColor: '#1f78b4'
        },
        LBW: {
          backgroundColor: '#b2df8a'
        },
        'Run Out': {
          backgroundColor: '#33a02c'
        },
        Stumped: {
          backgroundColor: '#fb9a99'
        },
        'Hit Twice': {
          backgroundColor: '#e31a1c'
        },
        'Hit Wicket': {
          backgroundColor: '#fdbf6f'
        },
        'Obstructing the Field': {
          backgroundColor: '#ff7f00'
        },
        'Timed Out': {
          backgroundColor: '#cab2d6'
        },
        'Handled the Ball': {
          backgroundColor: '#6a3d9a'
        }
      };

      let labels = [];
      let data = [];
      let backgroundColors = [];
      let hoverBackgroundColors = [];
      for (const [dismissal, count] of Object.entries(stats)) {
        labels.push(dismissal);
        data.push(count);
        backgroundColors.push(colorMap[dismissal].backgroundColor);
        hoverBackgroundColors.push(colorMap[dismissal].hoverBackgroundColor);
      }

      return (
          {
            labels,
            datasets: [
              {
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverBackgroundColors,
                data
              }
            ]
          }
      );
    },

    getChartOptions: function (gameType) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: this.getPlugins(gameType)
      };
    },

    getPlugins: function (gameType) {
      return {
        title: {
          display: true,
          text: gameType,
          font: {
            size: 18,
            weight: 'bold',
          }
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>