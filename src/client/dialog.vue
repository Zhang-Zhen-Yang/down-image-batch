
<template>
    <div class="download-dialog" v-show="showDialog">
      <div>
        <div class="e-dialog-diss" @click="hideDialog">&times;</div>
      </div>
      <!--内容区-->
      <div style="height: 420px;overflow:auto;box-sizing: border-box;padding:10px 0 10px 10px;width: 99%;">
        <h3>1.通过httpRequest 获取 图片</h3>
        <button class="btn" id="btn-fetch-data" @click="startFetchPageData">获取</button>
        <br>
        <div>
            过程：<span v-if="!pageDataSuccess">共{{pageTotal}}页 正在获取第{{currentPage}}页</span>
            <span v-if="pageDataSuccess">获取完成</span>
        </div>
        <br>
        <!-- 获取到的列表 -->
        <button :class="'btn ' + (isfetching ? 'btn-fetching' : 'btn-stoped')" id="fetImage" @click="fetchImageData">{{ isfetching ? '停止下载' : '开始下载'}}</button>
        <input id="parallel-num" type="number" min="1" v-model="parallelNum" style="margin-left: 50px;">

        <div>下载中的图片</div>
        <div id="fetching-list" class="list-block" >
          <taskitem v-for="item,index in fetchingList" :url="item"></taskitem>
        </div>
        <br>
       <!--  未获取 -->
        <div>未获取的图片<span id="fetch-list-length">{{ list.length }}</span></div> 
        <div id="fetched-list" class="list-block">
          <taskitem v-for="item,index in list" :url="item"></taskitem>
        </div>
        <br>

        <!-- 失败 -->
        <div>获取失败的图片 <span id="fetch-error-list-length">{{ errorList.length }}</span></div> <button class="btn" id="btn-add-to-unfetch" @click="addToList">添加到未获取列表</button>
        <div id="fetch-error-list" class="list-block">
          <taskitem v-for="item,index in errorList" :url="item"></taskitem>
        </div>
        <br>

        <!-- 成功 -->
        <div>获取完成的图片<span id="fetch-success-list-length">{{successList.length}}</span></div>
        <div id="fetch-success-list" class="list-block" style="max-height:500px;">
          <img class="success-thumbnial" v-for="item,index in successList" :src="imgMapThumbnail[item]">
        </div>
        <p>
            示例:https://danbooru.donmai.us/posts?page=1&tags=mossi
        </p>
      </div>
      <div style="height:50px;padding:10px 0 0 10px;border-top:1px solid #efefef;">
        <button class="btn" id="" @click="saveUnfetchList">保存</button>
      </div>
    </div>
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
    },
    parallelNum: {
      get() {
        return this.$store.state.parallelNum;
      },
      set(val) {
        this.$store.state.parallelNum = val;
      }
    },
    isfetching() {
      return this.$store.state.isfetching;
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
      if (this.isfetching) {
        this.$store.state.isfetching = false;
      } else {
        this.$store.state.isfetching = true;
        this.$store.dispatch('fetchImageData', {start: true});
      }
    },
    addToList(){
      this.$store.dispatch('addToList');
    },
    saveUnfetchList() {
      this.$store.dispatch('saveUnfetchList');
    }
  },
  created() {
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
    text-align: left;
    background-color:white;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    border-radius: 3px;
    z-index: 100;
  }
  .e-dialog-diss{
    float:right;
    cursor:pointer;
    font-size: 30px;
    margin: 0px 6px 0 0;
  }
  .e-dialog-diss:hover{
    color:red;
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
  .download-dialog button{
    border: none;
    outline: none;
    background-color: rgb(0, 122, 204);
    padding: 5px 10px;
    color: white;
    cursor: pointer;
  }
  .download-dialog input{
   line-height:2.2em;
   border: 1px solid #aaaaaa;
   height: 29px;
  }
  .download-dialog .btn-fetching{
    background-color: rgb(45,203,111);
  }
  .download-dialog .btn-stoped{
    background-color:#ffa000
  }


</style>
