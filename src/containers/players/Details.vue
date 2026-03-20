<template>
  <template v-if="loaded">

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
  </template>
</template>

<script>
import { getDetails as getPlayerDetails } from '../../endpoints/players';

export default {
  name: "Details",
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
    }
  }
}
</script>

<style scoped>

</style>