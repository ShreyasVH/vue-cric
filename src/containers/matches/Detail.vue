<template>
  <div v-if="loaded">
    <div>
      <strong>
        Series:
        &nbsp;
      </strong>

      <span class="series-link" @click="this.handleSeriesClick(match.series.id)">
        {{match.series.name + ' - ' + match.series.gameType.name}}
      </span>
    </div>

    <div>
      <strong>
        Teams:
        &nbsp;
      </strong>

      <v-chip v-for="team in teams" variant="outlined" color="secondary" style="margin-right: 1%;">
        {{team.name}}
      </v-chip>
    </div>

    <div>
      <strong>
        Toss:
        &nbsp;
      </strong>

      {{tossMarkup}}
    </div>

    <div>
      <strong>
        Result:
        &nbsp;
      </strong>

      {{resultMarkup}}
    </div>

    <div>
      <strong>
        Stadium:
        &nbsp;
      </strong>

      {{match.stadium.name + ', ' + match.stadium.country.name}}
    </div>

    <div>
      <strong>
        Start Time:
        &nbsp;
      </strong>

      {{matchStartTime}}
    </div>

    <div class="row">
      <div class="bordered-container">
        <div class="container">
          <h2 style="font-weight: normal">
            Playing Squads
          </h2>

          <div v-for="team in teams">
            <span>
              {{team.name}}
            </span>

            <div>
              <v-chip v-for="player in match.players[team.id]" variant="outlined" :color="this.getPlayerChipColor(team.id)" style="margin: 0.5%;">
                {{this.getPlayerLabel(player)}}
              </v-chip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <strong>
        Man of the Match:
        &nbsp;
      </strong>

      <v-chip v-for="motm in match.manOfTheMatchList" class="man-of-the-match" variant="outlined" @click="this.handlePlayerClick(motm.id)">
        {{motm.name}}
      </v-chip>
    </div>

    <div class="row">
      <strong>
        Scorecards:
        &nbsp;
      </strong>
      <div class="bordered-container">
        <div class="container">
          <div v-for="innings in [1, 2, 3, 4]">
            <div class="innings bordered-container" v-if="innings <= totalInningsCount">
              <div class="container">
                <div>
                  <h3 style="text-align: center">
                    {{this.getInningsTitle(innings, match.series.gameType.name)}}
                  </h3>

                  <v-table style="text-align: center;">
                    <thead>
                      <th v-for="columnName in ['Batsman', 'Dismissal', 'Runs', 'Balls', '4s', '6s']">
                        {{columnName}}
                      </th>
                    </thead>
                    <tbody>
                      <tr v-for="score in match.battingScores.filter(s => s.innings === innings)">
                        <td>
                          <span class="link" @click="this.handlePlayerClick(score.player.id)">
                            {{score.player.name}}
                          </span>
                        </td>
                        <td>
                          <span v-if="score.dismissalMode">
                            <span v-if="score.dismissalMode.name === 'Bowled'">
                              b&nbsp;
                              <span class="link" @click="this.handlePlayerClick(score.bowler.id)">
                                {{score.bowler.name}}
                              </span>
                            </span>

                            <span v-if="score.dismissalMode.name === 'Run Out'">
                              run out&nbsp;
                              <span v-for="(fielder, index) in score.fielders">
                                <span v-if="index > 0">
                                  &nbsp;/&nbsp;
                                </span>
                                <span class="link" @click="this.handlePlayerClick(fielder.id)">
                                  {{fielder.name}}
                                </span>
                              </span>
                            </span>

                            <span v-if="score.dismissalMode.name === 'Caught'">
                              <span v-if="score.fielders[0].id === score.bowler.id">
                                c & b&nbsp;
                                <span class="link" @click="this.handlePlayerClick(score.bowler.id)">
                                    {{score.bowler.name}}
                                </span>
                              </span>
                              <span v-else>
                                c&nbsp;
                                <span class="link" @click="this.handlePlayerClick(score.fielders[0].id)">
                                    {{score.fielders[0].name}}
                                </span>
                                &nbsp;b&nbsp;
                                <span class="link" @click="this.handlePlayerClick(score.bowler.id)">
                                    {{score.bowler.name}}
                                </span>
                              </span>
                            </span>

                            <span v-if="score.dismissalMode.name === 'Stumped'">
                              st&nbsp;
                              <span class="link" @click="this.handlePlayerClick(score.fielders[0].id)">
                                  {{score.fielders[0].name}}
                              </span>
                              &nbsp;b&nbsp;
                              <span class="link" @click="this.handlePlayerClick(score.bowler.id)">
                                  {{score.bowler.name}}
                              </span>
                            </span>

                            <span v-if="score.dismissalMode.name === 'LBW'">
                              lbw&nbsp;
                              <span class="link" @click="this.handlePlayerClick(score.bowler.id)">
                                  {{score.bowler.name}}
                              </span>
                            </span>

                            <span v-if="score.dismissalMode.name === 'Hit Wicket'">
                              Hit Wicket b&nbsp;
                              <span class="link" @click="this.handlePlayerClick(score.bowler.id)">
                                  {{score.bowler.name}}
                              </span>
                            </span>

                            <span v-if="['Retired Hurt', 'Hit Twice', 'Obstructing the Field', 'Timed Out', 'Handled the Ball'].includes(score.dismissalMode.name)">
                                {{score.dismissalMode.name}}
                            </span>
                          </span>
                          <span v-else>
                            Not Out
                          </span>
                        </td>
                        <td>
                          {{score.runs}}
                        </td>
                        <td>
                          {{score.balls}}
                        </td>
                        <td>
                          {{score.fours}}
                        </td>
                        <td>
                          {{score.sixes}}
                        </td>
                      </tr>
                      <tr>
                        <td v-for="i in [1, 2, 3, 4, 5]" />
                        <td>
                          {{this.getExtrasText(innings)}}
                        </td>
                      </tr>
                      <tr>
                        <td v-for="i in [1, 2, 3, 4, 5]" />
                        <td>
                          {{this.getTotalText(innings)}}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                  <v-table style="text-align: center;">
                    <thead>
                    <th v-for="columnName in ['Bowler', 'Overs', 'Maidens', 'Runs', 'Wickets']">
                      {{columnName}}
                    </th>
                    </thead>
                    <tbody>
                      <tr v-for="figure in match.bowlingFigures.filter(f => f.innings === innings)">
                        <td>
                          <span class="link" @click="this.handlePlayerClick(figure.player.id)">
                            {{figure.player.name}}
                          </span>
                        </td>
                        <td>
                          <span>
                            {{this.getOverDetails(figure.balls)}}
                          </span>
                        </td>
                        <td>
                          <span>
                            {{figure.maidens}}
                          </span>
                        </td>
                        <td>
                          <span>
                            {{figure.runs}}
                          </span>
                        </td>
                        <td>
                          <span>
                            {{figure.wickets}}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMatch } from "../../endpoints/matches";

export default {
  name: "Details",
  data () {
    return {
      match: {},
      loaded: false
    };
  },
  async mounted() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const matchId = urlSearchParams.get('id');
    const matchResponse = await getMatch(matchId);
    this.match = matchResponse.data.data;
    this.loaded = true;
  },
  methods: {
    handleSeriesClick: function (seriesId) {
      this.$router.push('/series/detail?id=' + seriesId);
    },
    handlePlayerClick: function (playerId) {
      console.log(playerId);
    },
    getWinMargin: function (winMargin, winMarginType) {
      let margin = winMarginType.toLowerCase();

      if (winMargin > 1) {
        margin += 's';
      }

      return margin;
    },
    getPlayerChipColor: function (teamId) {
      return ((this.match.team1.id === teamId) ? 'success' : 'error');
    },
    getPlayerLabel: function (currentPlayer) {
      let text = currentPlayer.name;

      let roles = [];

      let isCaptain = false;
      for (const player of this.match.captains) {
        if (currentPlayer.id === player.id) {
          isCaptain = true;
          break;
        }
      }

      if (isCaptain) {
        roles.push('c');
      }

      let isWicketKeeper = false;
      for (const player of this.match.wicketKeepers) {
        if (currentPlayer.id === player.id) {
          isWicketKeeper = true;
          break;
        }
      }

      if (isWicketKeeper) {
        roles.push('wk');
      }

      if (roles.length > 0) {
        text += ' ( ' + roles.join(' & ') + ' ) ';
      }

      return text;
    },
    getInningsTitle: function (innings, gameType) {
      const teamName = this.getPlayerTeam(this.match.battingScores.filter(score => score.innings === innings)[0].player.id).name;
      return teamName + ' Innings' + ((gameType === 'Test') ? ' ' + (Math.round(innings / 2)) : '');
    },
    getPlayerTeam: function (playerId) {
      const teamMap = {
        [this.match.team1.id]: this.match.team1,
        [this.match.team2.id]: this.match.team2
      };

      let team = {};

      for (const [teamId, players] of Object.entries(this.match.players)) {
        const playerIds = players.map(player => player.id);
        if (playerIds.includes(playerId)) {
          team = teamMap[teamId];
          break;
        }
      }

      return team;
    },
    getOverDetails: function (balls) {
      return (Math.floor(balls / 6) + '.' + (balls % 6));
    },
    getTotalText: function (innings) {
      let runs = 0;
      let wickets = 0;
      let balls = 0;

      for (const battingScore of this.match.battingScores) {
        if (innings === battingScore.innings) {
          runs += battingScore.runs;

          if (battingScore.dismissalMode) {
            wickets++;
          }
        }
      }

      for (const extra of this.match.extras) {
        if (innings === extra.innings) {
          runs += extra.runs;
        }
      }

      for (const bowlingFigure of this.match.bowlingFigures) {
        if (innings === bowlingFigure.innings) {
          balls += bowlingFigure.balls;
        }
      }

      return (runs + ' - ' + wickets + ' ( ' +  this.getOverDetails(balls) + ' ) ');
    },
    getExtrasText: function (innings) {
      let total = 0;
      let extras = {
        b: 0,
        lb: 0,
        w: 0,
        nb: 0,
        p: 0
      };

      for (const extra of this.match.extras) {
        if (innings === extra.innings) {
          let typeString = '';
          let type = extra.type.name;
          let typeParts = type.split(' ');
          for (const part of typeParts) {
            typeString += part.toLowerCase()[0];
          }

          extras[typeString] = extra.runs;
          total += extra.runs;
        }
      }

      let typeArray = [];
      for (let type in extras) {
        let runs = extras[type];
        typeArray.push(type + " " + runs);
      }

      return total + '(' + typeArray.join(', ') + ')';
    }
  },
  computed: {
    teams: function () {
      return [
          this.match.team1,
          this.match.team2
        ];
    },
    tossMarkup: function () {
      let markup = 'NA';

      if (this.match.tossWinner) {
        markup = this.match.tossWinner.name + ' won the toss and chose to ' + ((this.match.tossWinner.id === this.match.batFirst.id) ? 'bat' : 'bowl');
      }
      return markup;
    },
    resultMarkup: function () {
      let result = '';

      if (this.match.winner) {
        result += this.match.winner.name + " won";

        if (this.match.winMarginType) {
          result += " by " + this.match.winMargin + " " + this.getWinMargin(this.match.winMargin, this.match.winMarginType.name);
        }

        if ('Super Over' === this.match.resultType.name) {
          result += ' (Super Over)';
        }
      } else {
        if (this.match.resultType.name === 'Tie') {
          result = 'Match Tied';
        } else if(this.match.resultType.name === 'Draw') {
          result = 'Match Drawn';
        } else if(this.match.resultType.name === 'Washed Out') {
          result = 'Match Washed Out';
        }
      }
      return result;
    },
    matchStartTime: function () {
      let date = new Date(this.match.startTime);
      let options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      return date.toLocaleDateString('en-GB', options);
    },
    totalInningsCount: function () {
      let totalInnings = 0;

      for (const score of this.match.battingScores) {
        if (score.innings > totalInnings) {
          totalInnings = score.innings;
        }
      }

      return totalInnings;
    }
  }
}
</script>

<style>
.series-link {
  color: blue;
  cursor: pointer;
}

.man-of-the-match {
  background-color: #E0AA3E !important;
  border-color: #E0AA3E !important;
  color: white !important;
}
</style>