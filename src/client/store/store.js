/*
 * @Author: zhangzhenyang 
 * @Date: 2018-10-31 15:34:02 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: yyyy-11-dd 13:50:52
 */
import util from '../util.js';
const store = {
	state: {
        showDialog: true,
        urlType: 'danbooru',
        pageTotal: 0,
        currentPage: 1,

        imgMapTag: {},
        url: [],
        successUrl: [],
        errorUrl: [],
        fetchingList: [],
        parallelNum: 2,
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
		
	},
	// -------------------------------------------------------------------------------------------------------------
	actions: {
		// 初始化 网络请求
		init({state, commit, dispatch, getters}){
			let href = location.href;
            let origin = location.origin;
            let search = location.search;
            let queryString = util.getQueryString(search);

            if(origin.indexOf('danbooru') > -1 ) {
                state.urlType == 'danbooru';
            } else if(origin.indexOf('yande.re') > -1 ) {
                state.urlType == 'yande.re';
            }
            state.tags = queryString.tags;
        },
        startDown(){

        },
        // 将失败列表添加到待获取列表里
        addToList() {
            state.errorList.forEach((i)=>{
                list.splice(0,0,i);
            })
            state.errorList = [];
        },
        // 开始获取页面数据
        startFetchPageData({state,commit,dispatch}) {
            this.fetchPageCount();
            dispatch('fetchPageData', {pageNo: 1});
        },
        fetchPageCount({state, commit, dispatch, getters}) {
            let dom = $('<div>'+$('body').html()+'</div>');
            let pageTotal = 0;
            if(state.urlType == 'danbooru') {
                let numberedPage = dom.find('.numbered-page a');
                numberedPage.each((index, pItem)=>{
                    console.log(index, pItem);
                    console.log(pItem);
                    let p = parseInt($(pItem).html());
                    if(p > pageNo) {
                        pageTotal = p
                    }
                });

            } else if(state.urlType == 'yande.re') {

            }
            state.pageTotal = pageTotal;
        },
        fetchPageData({state, commit,dispatch}, {pageNo}) {
            state.list = [];
            state.fetchingList = [];
            state.errorList = [];
            state.imgMapTag = {};
            if(pageNo <= state.pageTotal) {
                state.currentPage = pageNo;
                window.fetchData && window.fetchData(url, 1000000, function(res) {
                    let text = res.res.replace(/\n/mig, ' ');
                    let bodyCotent = util.getBodyContent(text);
                    dispatch('fetchPageImageUrl', {content: bodyCotent}).then(()=>{
                        dispatch('fetchPageData', {pageNo: pageNo + 1});
                    })
                })
            }
        },
        fetchPageImageUrl({state}, {content}) {
            return new Promise((resolve, reject)=>{
                let dom = $('<div>'+content+'</div>');
                if(state.urlType == 'danboru') {
                    let articles = dom.find('#posts-container article');
                    let currentPageImage = [];
                    articles.each((index, a) => {
                        let dataFileUrl = $(a).attr('data-file-url');
                        if(dataFileUrl.indexOf('/') == 0) {
                            dataFileUrl = 'https://danbooru.me' + dataFileUrl;
                        }
                        state.imgMapTag[dataFileUrl] = pageNo +'-'+ index;
                        state.list.push(dataFileUrl);
            
                    })

                } else if(state.urlType == 'yande.re'){

                }
                resolve();
            })
        },
        fetchImageData({state}, {start} = {start: false}) {
            if(start) {
                for(let i =0; i < state.parallelNum; i ++) {
                    dispatch('fetchImageData');
                }
            } else {
                if(state.fetchingList.length < state.parallelNum) {
                    let url = state.list.splice(0, 1);
                    if(url && url[0]) {
                        url = url[0]
                        state.fetchingList.push(url);
                        
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
                                let blob = convertBase64ToBlob(res.res);
                                console.log('blob', blob);
                                let urlLink = URL.createObjectURL(blob);
                                urlMap[url] = urlLink;
                                // URL.revokeObjectURL(urlLink);
                                
                                // 添加下一个任务
                                dispatch('fetchImageData');

                                let fileName = url.split('/');
                                fileName = fileName[fileName.length - 1];
                                fileName = state.tags +'-'+ (state.imgMapTag[url] || '')+ fileName;
                                // url:为base64格式
                                // 下载图片
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
                    } else {
                        alert('获取完成');
                    }
                } else {
                    console.log('no f');
                }
            }
        }

	
	},
	modules: {
	}
}
export default store;