/*
 * @Author: zhangzhenyang 
 * @Date: 2020-06-08 11:26:04 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2020-06-08 17:51:15
 */

import util from '../util.js';
import data from '../data.js';


const store = {
	state: {
        snackbar: {
            show: false,
            text: '',
            timeout:2000,
        },
        showDialog: true,
        urlType: 'danbooru',
        pageTotal: 0,
        currentPage: 1,
        tags: 'tags',

        imgMapTag: {},//{list1: 'tag1', list2: 'tag2', list3: 'tag3', list4: 'tag4'},
        imgMapThumbnail: {},
        list: ['https://imgs.aixifan.com/FobKgtlLYWR5EMmd2NKD3lU5raZK'], // data.list, // ['https://imgs.aixifan.com/FobKgtlLYWR5EMmd2NKD3lU5raZK', 'https://imgs.aixifan.com/FppAAoc87oY9Q34qmH0j0IOlF_W_'],// ['list1', 'list2', 'list3'],
        successList: [],//data.successList,
        errorList: [],// data.errorList,
        fetchingList: [],
        isfetching: false,
        parallelNum: 2,
        pageDataSuccess: false,
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		queryObj() {
			return util.getQueryString();
		},
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		setActiveIndex(state, {activeIndex}) {
			
        },
        showSnackbar(state,{text,timeout=2000}) {
			state.snackbar.text = text;
			state.snackbar.timeout = timeout;
			state.snackbar.show = true;
		},
		
	},
	// -------------------------------------------------------------------------------------------------------------
	actions: {
		// 初始化 网络请求
		init({state, commit, dispatch, getters}){
			let href = location.href;
            let origin = location.origin;
            let search = location.search;
            let queryString = util.getQueryString(search);
            // alert(origin);
            state.urlType = util.getUrlType();
            /* if(origin.indexOf('danbooru') > -1 ) {
                state.urlType = 'danbooru';
            } else if(origin.indexOf('yande.re') > -1 ) {
                state.urlType = 'yande.re';
            } */
            state.origin = origin;
            state.tags = queryString.tags;
            state.pathname = location.pathname;

          
            setTimeout(()=>{
                /* let u = 'https://yande.re/post?page=1&tags=dishwasher1910';
                window.fetchData && window.fetchData(u, 1000000, function(res) {
                    console.log(res);
                }) */
                // window.notify('basic', '', '获取完成', `user:${state.tags}`);
            }, 2000)
            document.body.addEventListener('drop', (e)=>{
                e.preventDefault();
                // console.log(e);
                let file = e.dataTransfer.files;
                console.log(file);
                if(file && file[0]) {
                    if(util.endWidth(file[0].name, '.json')) {
                        let fileReader = new FileReader();
                        fileReader.readAsText(file[0]);
                        fileReader.onload = ()=>{
                            let jsonText = fileReader.result;
                            console.log(jsonText);
                            try{
                                let json = JSON.parse(jsonText);
                                state.tags = json.tags;
                                state.list = [];
                                state.errorList = [];
                                state.successList = [];
                                state.fetchingList = [];
                                state.imgMapTag = {};

                                let toSetList = [];
                                let toSetMap = {};
                                json.list.forEach((item,index) => {
                                    let key = Object.keys(item)[0]
                                    //if(u.indexOf(key) > -1) {
                                        toSetList.push(key);
                                    //}
                                    toSetMap[key] = item[key];
                                })
                                state.list = toSetList;
                                state.imgMapTag = toSetMap;
                                console.log(toSetList);
                                console.log(toSetMap);
                            }catch(e){
                                console.error(e);
                            }
                        }
                    }
                }
            })
            document.body.addEventListener('dragover', (e)=>{
                e.preventDefault();
                // console.log(e);
            })
            // commit('showSnackbar', {text: '53333333333333333333333'})
        },
        startDown(){

        },
        // 将失败列表添加到待获取列表里
        addToList({state}) {
            state.errorList.forEach((i)=>{
                state.list.splice(0,0,i);
            })
            state.errorList = [];
        },
        // 开始获取页面数据
        startFetchPageData({state,commit,dispatch}) {
            console.log('startFetchPageData');
            dispatch('fetchPageCount');
            dispatch('fetchPageData', {pageNo: 1});
        },
        // 获取共有多少页
        fetchPageCount({state, commit, dispatch, getters}) {
            // alert(state.urlType);
            let dom = jQuery('<div>'+jQuery('body').html()+'</div>');
            let pageNo = 0;
            let pageTotal = 0;
            if(state.urlType == 'danbooru') {
                let numberedPage = dom.find('.numbered-page a');
                numberedPage.each((index, pItem)=>{
                    console.log(index, pItem);
                    console.log(pItem);
                    let p = parseInt(jQuery(pItem).html());
                    if(p > pageNo) {
                        pageTotal = p
                    }
                });

            } else if(state.urlType == 'yande.re') {
                let numberedPage = dom.find('#paginator a');
                // alert(numberedPage.length);
                pageTotal = 1;
                numberedPage.each((index, pItem)=>{
                    console.log(pItem);
                    let p = parseInt(jQuery(pItem).html());
                    if(p > pageNo) {
                        pageTotal = p
                    }
                });
            } else if(state.urlType == 'acfun') {
                pageTotal = 1;
            }
            
            state.pageTotal = pageTotal;
        },
        // 获取页面数据
        fetchPageData({state, commit,dispatch}, {pageNo}) {
            if(pageNo == 1) {
                state.list = [];
                state.fetchingList = [];
                state.errorList = [];
                state.imgMapTag = {};
                state.imgMapThumbnail = {};
                state.pageDataSuccess = false;
            }
            console.log([pageNo, state.pageTotal]);
            if(pageNo <= state.pageTotal) {
                state.currentPage = pageNo;
                if(state.urlType == 'acfun'){
                    dispatch('fetchPageImageUrl', {content: jQuery('body').html(), pageNo}).then(()=>{
                        dispatch('fetchPageData', {pageNo: pageNo + 1});
                    })
                } else {
                    let url = `${state.origin}${state.pathname}?page=${pageNo}&tags=${state.tags}`;
                    console.log('url', url);
                    window.fetchData && window.fetchData(url, 1000000, function(res) {
                        // console.log(res);
                        let text = res.res.replace(/\n/mig, ' ');
                        let bodyCotent = util.getBodyContent(text);
                        console.log('bodyCotent');
                        // console.log(bodyCotent);
                        dispatch('fetchPageImageUrl', {content: bodyCotent, pageNo}).then(()=>{
                            dispatch('fetchPageData', {pageNo: pageNo + 1});
                        })
                    })
                }
            } else {
                state.pageDataSuccess = true;
            }
        },
        // 通过html解析页面img
        fetchPageImageUrl({state}, {content, pageNo}) {
            console.log(/* fetchPageImageUrl */);
            return new Promise((resolve, reject)=>{
                let dom = jQuery('<div>'+content+'</div>');
               
                if(state.urlType == 'danboru') {
                    let articles = dom.find('#posts-container article');
                    let currentPageImage = [];
                    articles.each((index, a) => {
                        let dataFileUrl = jQuery(a).attr('data-file-url');
                        if(dataFileUrl.indexOf('/') == 0) {
                            dataFileUrl = 'https://danbooru.me' + dataFileUrl;
                        }
                        state.imgMapTag[dataFileUrl] = pageNo +'-'+ (index + 1);
                        state.imgMapThumbnail[dataFileUrl] = pageNo +'-'+ index;
                        state.list.push(dataFileUrl);
            
                    })

                } else if(state.urlType == 'yande.re'){
                    // alert(state.urlType);
                    let articles = dom.find('#post-list-posts .largeimg,.smallimg');
                    console.log('articles');
                    console.log(articles);
                    

                    articles.each((index, a)=>{
                        let dataFileUrl = jQuery(a).attr('href');
                        if(dataFileUrl.indexOf('/') == 0) {
                            dataFileUrl = 'https://danbooru.me' + dataFileUrl;
                        }
                        console.log(dataFileUrl);
                        state.list.push(dataFileUrl);
                        state.imgMapTag[dataFileUrl] = pageNo +'-'+ (index + 1);
                        state.imgMapThumbnail[dataFileUrl] = jQuery(a).prev().find('img').attr('src');
                    })
                } else if(state.urlType == 'acfun') {
                    let articles = dom.find('.article-content img').not('.ubb-emotion');
                    articles.each((index, a)=>{
                        let dataFileUrl = jQuery(a).attr('src');
                        state.list.push(dataFileUrl);
                        state.imgMapTag[dataFileUrl] = pageNo +'-'+ (index + 1);
                    })
                }
                resolve();
            })
        },
        // 获取图片数据
        fetchImageData({state, dispatch}, {start} = {start: false}) {
            if(!state.isfetching){
                return;
            }
            // alert('ddd');
            if(start) {
                for(let i =0; i < state.parallelNum; i ++) {
                    dispatch('fetchImageData');
                }
                util.notifyStatus('progress');
            } else {
                console.log('ddddd');
                if(state.fetchingList.length < state.parallelNum) {
                    if(state.list.length > 0) {
                        try{
                            console.log(state.list[0]);
                            let url = state.list.splice(0, 1);
                            url = url[0];
                            console.log('88888');
                            state.fetchingList.push(url);
                            console.log(window.httpRequest);
                            window.httpRequest && window.httpRequest(url, 'blob', (res)=>{
                                console.log(res);
                                if(res.res) {
                                    state.list = state.list.filter((i)=>{
                                        return i != url;
                                    })
                                    state.fetchingList = state.fetchingList.filter((i)=>{
                                        return i != url;
                                    })
                                    state.successList.push(url);
                                    // 添加下一个任务
                                    dispatch('fetchImageData');
    
                                    let fileName = url.split('/');
                                    fileName = fileName[fileName.length - 1];
                                    fileName = state.tags +'-'+ (state.imgMapTag[url] || '')+ fileName;
                                    if(fileName.indexOf('.') < 0){
                                        fileName += '.jpg';
                                    }
                                  
                                    // 下载图片
                                    console.log(state.imgMapTag[url]);
                                    window.sendDownload && window.sendDownload({url: res.res, fileName: fileName});
                                } else {
                                    // console.log('errorList', errorList);
                                    state.list = state.list.filter((i)=>{
                                        return i != url;
                                    })
                                    state.fetchingList = state.fetchingList.filter((i)=>{
                                        return i != url;
                                    })
                                    state.errorList.push(url);
                                    // 添加下一个任务
                                    dispatch('fetchImageData');
                                }
                            });
                        } catch(e){
                            console.warn(e);
                        } 
                    } else {
                        if(state.fetchingList.length == 0) {
                            // alert('获取完成');
                            util.notifyStatus('success');
                            window.notify('basic', '', '获取完成', `user:${state.tags}`);
                        }
                    }
                    if(state.list.length > 0) {
                        dispatch('fetchImageData');
                    }
                } else {
                    console.log('no f');
                }
            }
        },
        // 保存未获取成功的列表
        saveUnfetchList({state}){
            let distList = state.fetchingList.concat(state.list).concat(state.errorList);
            // console.log(distList);

            let toSaveList = [];
            distList.forEach((item)=>{
                let listItem = {};
                listItem[item] = state.imgMapTag[item] || '';
                toSaveList.push(listItem);
            })
            let toSaveJson = {
                href: location.href,
                tags: state.tags,
                list: toSaveList,
            }
            let blob = new Blob([JSON.stringify(toSaveJson)], {type : 'application/json'});
            /* console.log(toSaveList);
            console.log(blob); */
            let file = new FileReader();
            file.readAsDataURL(blob);
            file.onload = ()=>{
                console.log(file.result);
                window.sendDownload && window.sendDownload({url: file.result, fileName: `${state.tags || 'unknow'}.json`});
            }
        }
	
	},
	modules: {
	}
}
export default store;