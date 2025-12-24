<template>
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
</template>

<script>
export default {
  name: "PaginationBox",
  props: {
    page: {
      type: Number
    },
    totalCount: {
      type: Number
    },
    limit: {
      type: Number
    },
    goToPage: {
      type: Function
    }
  },
  computed: {
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
  }
}
</script>

<style scoped>
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