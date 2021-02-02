
<template>
  <div id="host-e-view">
    <div class="download-btn" style="" title="下载" @click="showDialog">&darr;</div>
    <download-dialog></download-dialog>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script>
import dialog from './dialog.vue';
export default {
  name: 'app',
  components: {
    downloadDialog: dialog,
  },
  data () {
    return {
    }
  },
  computed:{
    snackbar(){
      return this.$store.state.snackbar;
    },
  },
  methods: {
    dragover(ev) {
      ev.preventDefault();
    },
    drop(ev) {
      ev.preventDefault();
    },
    showDialog() {
      this.$store.state.showDialog = true;
    }
  },
  created() {
    this.$store.dispatch('init');
  },
  mounted(){
    // alert('dddd');
  },
  watch:{
    snackbar:{
      handler(e){
        if(e.show){
          this.$refs.snackbar.show(this.snackbar.text, this.snackbar.timeout);
          this.$store.state.snackbar.show=false;
        }
      },
      deep: true,
    }
  }
}
</script>

<style>
  #host-e-view{
    position: absolute;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
    position: absolute;
    z-index: 100000;
  }
  .download-btn {
    width: 30px;
    height: 35px;
    line-height: 35px;
    color: white;
    border-radius: 3px 0 0 3px;
    background-color:rgb(0,122,204);
    position: fixed;
    right: 0;
    top: 200px;
    cursor: pointer;
    text-align: center;
  }



</style>
