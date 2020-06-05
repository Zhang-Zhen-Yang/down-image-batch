
<template>
    <div class="download-dialog" v-show="showDialog">
      <div style="height: 30px;">
        <div class="e-dialog-diss" @click="hideDialog">&times;</div>
      </div>
      <!--内容区-->
      <div style="height: 320px;overflow:auto;box-sizing: border-box;padding:10px 0 10px 10px;">
        <h3>1.通过httpRequest 获取 图片</h3>
        <input id="pddurl" type="text" placeholder="请输入danbooru链接" value="https://danbooru.donmai.us/posts?page=1&tags=ameyame">
        <button class="btn" id="btn-fetch-data">获取</button>
        <br>
        <div>
            过程：<span id="progress">共{{pageTotal}}页 正在获取第{{currentPage}}页</span>
        </div>
        <br>
        <div>
            <button class="btn" id="btn-save-storage">保存未获取列表</button>
            <button class="btn"  id="btn-get-storage">获取未获取列表</button>
        </div>
        <br>
        <!-- 获取到的列表 -->
        <button class="btn" id="fetImage">获取以下图片</button> <input id="parallel-num" type="number" min="1" value="1">
        <div id="fetching-list" class="list-block" @click="fetchImageData">

        </div>
        <br>
        <div>未获取的图片</div> <span id="fetch-list-length"></span>
        <div id="fetched-list" class="list-block"></div>

        <div>
        <br>
        <div>获取失败的图片</div> <span id="fetch-error-list-length"></span> <button class="btn" id="btn-add-to-unfetch" @click="addToList">添加到未获取列表</button>
        <div id="fetch-error-list" class="list-block">

        </div>
        <br>
        <div>获取完成的图片</div><span id="fetch-success-list-length"></span>
        <div id="fetch-success-list" class="list-block">

        </div>
            <p>
                示例:https://danbooru.donmai.us/posts?page=1&tags=mossi
            </p>
        </div>
      </div>
      <div style="height:50px;box-sizing: border-box;padding: 10px 0 0 10px;">
        <button class="e-start-fetch" onTap="startFetchPageData">开始获取</button>
      </div>
    <div>
</template>

<script>

export default {
  name: 'dialog',
  components: {

  },
  data () {
    return {
    }
  },
  computed:{
    showDialog() {
      return this.$store.state.showDialog;
    },
    currentPage() {
      return this.$store.state.currentPage;
    },
    pageTotal() {
      return this.$store.state.pageTotal;
    }
  },
  methods: {
    hideDialog() {
      this.$store.state.showDialog = false;
    },
    startFetchPageData() {
      this.$store.dispatch('startFetchPageData');
    },
    fetchImageData() {
      this.$store.dispatch('fetchImageData', {start: true})
    },
    addToList(){
      this.$store.dispatch('addToList');
    }
  },
  created() {
    this.$store.dispatch('init');
  },
  mounted(){
    console.log('-----------------------', this.$store);
  },
  watch:{
    
  }
}
</script>
<style>
  .download-dialog{
    width: 600px;
    height: 400px;
    background-color:white;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    z-index: 100;
  }
  .e-dialog-diss{
    float:right;
    cursor:pointer;
    color:red;
    font-size: 30px;
    margin: 0px 6px 0 0;
  }
</style>
