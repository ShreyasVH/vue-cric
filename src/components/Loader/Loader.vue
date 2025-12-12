<template>
  <v-dialog v-model="visible" width="100" transition="fade-transition" persistent>
    <v-card class="d-flex justify-center align-center" height="100" style="background-color: transparent; box-shadow: none;" v-on:click="hideLoader">
      <v-progress-circular indeterminate color="primary" size="48" />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Loader",
  data () {
    return {
      visible: false
    }
  },
  mounted() {
    const that = this
    window.addEventListener('show-loader', function(event) {
      that.setLoaderValue(true)
    });

    window.addEventListener('hide-loader', function(event) {
      that.setLoaderValue(false)
    });
  },
  methods: {
    showLoader: function (event) {
      event.preventDefault();

      const myEvent = new CustomEvent('show-loader', {});
      window.dispatchEvent(myEvent);
    },

    hideLoader: function (event) {
      event.preventDefault();

      const myEvent = new CustomEvent('hide-loader', {});
      window.dispatchEvent(myEvent);
    },

    setLoaderValue: function (value) {
      this.visible = value
    }
  }
}
</script>

<style scoped>

</style>