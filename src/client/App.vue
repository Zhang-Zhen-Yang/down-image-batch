
<template>
  <div>
    <div class="download-btn" style="" title="下载" @click="showDialog">&darr;</div>
    <download-dialog></download-dialog>
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
  },
  watch:{
    
  }
}
</script>

<style>
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
