
<template>
  <div >
    dogdflglf
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {

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
</style>
