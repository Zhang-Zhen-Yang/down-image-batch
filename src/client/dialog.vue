
<template>
    <div class="download-dialog" v-show="showDialog">
      <div style="height: 30px;">
        <div class="e-dialog-diss" @click="hideDialog">&times;</div>
      </div>
      <!--内容区-->
      <div style="height: 320px;overflow:auto;box-sizing: border-box;padding:10px 0 10px 10px;width: 99%;">
        <h3>1.通过httpRequest 获取 图片</h3>
        <input id="pddurl" type="text" placeholder="请输入danbooru链接" value="https://danbooru.donmai.us/posts?page=1&tags=ameyame">
        <button class="btn" id="btn-fetch-data" @click="startFetchPageData">获取</button>
        <br>
        <div>
            过程：<span v-if="!pageDataSuccess">共{{pageTotal}}页 正在获取第{{currentPage}}页</span>
            <span v-if="pageDataSuccess">获取完成</span>
        </div>
        <br>
        <div>
            <button class="btn" id="btn-save-storage">保存未获取列表</button>
            <button class="btn"  id="btn-get-storage">获取未获取列表</button>
        </div>
        <br>
        <!-- 获取到的列表 -->
        <button class="btn" id="fetImage" @click="fetchImageData">获取以下图片</button> <input id="parallel-num" type="number" min="1" value="1">
        <div id="fetching-list" class="list-block" >
          {{ fetchingList.join('\n') }}
        </div>
        <br>
        <div>未获取的图片</div> <span id="fetch-list-length">{{ list.length }}</span>
        <div id="fetched-list" class="list-block">
          {{ list.join('\n') }}
        </div>
        <div>
        <br>
        <div>获取失败的图片</div> <span id="fetch-error-list-length">{{ errorList.length }}</span> <button class="btn" id="btn-add-to-unfetch" @click="addToList">添加到未获取列表</button>
        <div id="fetch-error-list" class="list-block">
          {{ errorList.join('\n') }}
        </div>
        <br>
        <div>获取完成的图片</div><span id="fetch-success-list-length">{{successList.length}}</span>
        <div id="fetch-success-list" class="list-block" style="max-height:500px;">
          <!-- {{ successList.join('\n') }} -->
          <img class="success-thumbnial" v-for="item,index in successList" :src="imgMapThumbnail[item]" >

        </div>
            <p>
                示例:https://danbooru.donmai.us/posts?page=1&tags=mossi
            </p>
        </div>
      </div>
      <!-- <div style="height:50px;box-sizing: border-box;padding: 10px 0 0 10px;">
        <button class="e-start-fetch" @click="startFetchPageData">开始获取</button>
      </div> -->
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
    },
    list() {
      return this.$store.state.list;
    },
    errorList() {
      return this.$store.state.errorList;
    },
    successList() {
      return this.$store.state.successList;
    },
    fetchingList() {
      return this.$store.state.fetchingList;
    },
    pageDataSuccess () {
      return this.$store.state.pageDataSuccess;
    },
    imgMapThumbnail() {
      return this.$store.state.imgMapThumbnail;
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
   
  },
  watch:{
    
  }
}
</script>
<style>
  .download-dialog{
    width: 780px;
    height: 500px;
    background-color:white;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    border-radius: 3px;
    z-index: 100;
  }
  .e-dialog-diss{
    float:right;
    cursor:pointer;
    color:red;
    font-size: 30px;
    margin: 0px 6px 0 0;
  }
  .download-dialog div,.download-dialog span,.download-dialog h3 {
    color:rgba(0,0,0,0.9);
  }
  .list-block{
    min-height: 20px;
    max-height: 100px;
    overflow: auto;
    border: 1px solid #eee;
    word-break: keep-all;
  }
  .success-thumbnial{
    width: 100px;
    height: 100px;
    border: 1px solid #efefef;
    object-fit: contain;
    object-position: center;
    margin: 10px;
  }
</style>
