/*
 * @Author: zhangzhenyang 
 * @Date: 2020-06-08 11:26:04 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2020-06-30 10:20:11
 */

import util from '../util.js';
import data from '../data.js';
import html2canvas from 'html2canvas';
import { arch } from 'os';

const store = {
	state: {
        containsPixiv: true,
        snackbar: {
            show: false,
            text: '',
            timeout:2000,
        },
        showDialog: false,
        urlType: 'danbooru',
        pageTotal: 0,
        currentPage: 1,
        tags: 'tags',
        useDir: true,

        imgMapTag: {},//{list1: 'tag1', list2: 'tag2', list3: 'tag3', list4: 'tag4'},
        imgMapThumbnail: {},
        imgMapPixivImg: {},
        list: data.list, // ['https://imgs.aixifan.com/FobKgtlLYWR5EMmd2NKD3lU5raZK', 'https://imgs.aixifan.com/FppAAoc87oY9Q34qmH0j0IOlF_W_'],// ['list1', 'list2', 'list3'],
        successList: [],//data.successList,
        errorList: [],// data.errorList,
        fetchingList: [],
        isfetching: false,
        parallelNum: 1, // localStorage.getItem('parallelNum'),
        pageDataSuccess: false,
        gbfList: [],
        gbfImgList: [],
        arknightsList: [],
        arknightsImgList: [],

        ichiUpItems: [],

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
                    } else if(util.endWidth(file[0].name, '.txt')) {
                        let fileReader = new FileReader();
                        fileReader.readAsText(file[0]);
                        fileReader.onload = ()=>{
                            let jsonText = fileReader.result;
                            console.log(jsonText);
                            try{
                                // let json = JSON.parse(jsonText);
                                state.tags = 'artist';
                                state.list = [];
                                state.errorList = [];
                                state.successList = [];
                                state.fetchingList = [];
                                state.imgMapTag = {};

                                let toSetList = [];
                                let toSetMap = {};
                                let list = jsonText.split('\r\n');
                                list.forEach((item,index) => {
                                    let key = item
                                    //if(u.indexOf(key) > -1) {
                                        toSetList.push(key);
                                    //}
                                    toSetMap[key] = 'artist' + index;
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
            // 
            document.body.addEventListener('dragover', (e)=>{
                e.preventDefault();
                // console.log(e);
            })
            jq('.javascript-hide').removeClass('javascript-hide').css({outline: '1px solid red'})
            // commit('showSnackbar', {text: '533333'})
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
            state.containsPixiv = true;
            console.log('startFetchPageData');
            dispatch('fetchPageCount');
            dispatch('fetchPageData', {pageNo: 1});
        },
        startFetchPageDataWithNoPixiv({state,commit,dispatch}) {
            
            state.containsPixiv = false;
            console.log('startFetchPageData');
            dispatch('fetchPageCount');
            dispatch('fetchPageData', {pageNo: 1});
        },
        // 获取共有多少页
        fetchPageCount({state, commit, dispatch, getters}) {
            let dom = jQuery('<div>'+jQuery('body').html()+'</div>');
            let pageNo = 0;
            let pageTotal = 1;
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
                if(location.href.indexOf('pools') > -1) {
                    let p = jq('#description p');
                    let dtextLink = jq('#description .dtext-link').eq(0);
                    state.tags = (p.length > 0 ? p.text() : dtextLink.text() );
                    
                }

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
            } else if(state.urlType == 'bing') {
                pageTotal = 130;
                state.tags = 'bing';
            } else if (state.urlType == 'acfun') {
                pageTotal = 1;
            } else if(state.urlType == 'yande.re.pool'){
                pageTotal = jq('body').find('#post-list-posts li').length;
                let title = jq('body').find('h4').html();;
                let splitTitle = title.split(' ');
                title = splitTitle[splitTitle.length - 1];
                state.tags = title;
                // console.log(state.tags);
            }else if (state.urlType == 'gbf') {
                state.gbfList = [];
                state.gbfImgList = [];
                let mw = jq('.mw-headline');
                mw.each((index, item)=>{
                    let attr= jq(item).html();
                    console.log(jq(item));
                    let list = jq(item).parent().next().find('.flex-item.char-box');

                    list.each((cIndex, cItem)=>{
                        let msg = jq(cItem).find('a').eq(1);
                        let name = msg.html();
                        let href= 'https://gbf.huijiwiki.com' + msg.attr('href');
                        state.gbfList.push({
                            attr,
                            name,
                            href,
                            cIndex,
                        })
                    })

                }) 
                pageTotal = /* 1; //  */state.gbfList.length;
                let splitTitle = document.title.split('/');
                state.tags = splitTitle[splitTitle.length - 1];
            } else if(state.urlType == 'arknights') {
                // https://arknights.huijiwiki.com/wiki/%E6%A8%A1%E6%9D%BF:NavboxChar
                state.arknightsList = [];
                state.arknightsImgList = [];
                console.log('arknights');
                let list = jq('.char-portrait');
                list.each((index, item)=>{
                    let nameNode = jq(item).find('.name');
                    let name  = nameNode.html();
                    let link = 'https://arknights.huijiwiki.com' + nameNode.parent().attr('href');
                    console.log(link);
                    state.arknightsList.push({
                        name,
                        index,
                        href: link
                    })
                    /* if(['Lancet-2', 'Castle-3'].indexOf(name) < 0) {
                        state.arknightsList.push({
                            name,
                            index,
                            href: link
                        })
                    } */
                })
                pageTotal = state.arknightsList.length;
                let splitTitle = document.title.split('/');
                state.tags = splitTitle[splitTitle.length - 1];
            } else if(state.urlType == 'bilibili') {
                pageTotal = 1;
                let pointer = jq('.user-name .c-pointer').html();
                state.tags = pointer;
            } else if(state.urlType == 'ichi-up') {

            } else if(state.urlType == 'bilibiliSpace') { // biblibilib图片空间
                let c= jq('#page-dynamic .card').not('li');
                console.log('c count', c.length);
                pageTotal = c.length;
                let pointer = jq('#h-name').html();
                state.tags = pointer;
            } else if(state.urlType == 'ichi-up') {
                state.ichiUpItems = [];
                pageTotal = 33;
            } else if(state.urlType == 'hpoi') {
                pageTotal = 1;
                state.tags = document.title.split('|')[0].trim();
            } else if(state.urlType == 'hobby') {
                pageTotal = 1;
                state.tags = document.title.trim();
            } else if(state.urlType == 'nyahentai') {
                pageTotal = 1;
                state.tags = util.checkName(jq('#info-block #info h2').html());
                console.log(state.tags);
            } else if(state.urlType == 'shimo') {
                pageTotal = 1;
                state.tags = document.title;
                console.log(state.tags);
            } else if(state.urlType == 'weibo') {
                pageTotal = 1;
                state.tags = document.title;
                console.log(state.tags);
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
                } else if(state.urlType == 'yande.re.pool') {
                    let url = jQuery('body').find('#post-list-posts li').eq(pageNo - 1).find('a').attr('href');
                    let thumbnail = jQuery('body').find('#post-list-posts li').eq(pageNo - 1).find('img').attr('src');
                    window.fetchData && window.fetchData('https://yande.re'+url, 1000000, function(res) {
                        let bodyCotent = util.getBodyContent(res.res);
                        let imageUrl =  jQuery('<div>'+bodyCotent+'</div>').find('.highres-show').attr('href');
                        // console.log(imageUrl);
                        state.list.push(imageUrl);
                        state.imgMapTag[imageUrl] = pageNo;
                        state.imgMapThumbnail[imageUrl] = thumbnail;
                        dispatch('fetchPageData', {pageNo: pageNo + 1});
                    });
                    // console.log(url);
                }else if(state.urlType == 'bing') {
                    let url = `https://bing.ioliu.cn/?p=${pageNo}`
                    window.fetchData && window.fetchData(url, 1000000, function(res) {
                        let bodyCotent = util.getBodyContent(res.res);
                        let dom =  jQuery('<div>'+bodyCotent+'</div>').find('.card ');
                        dom.each((index, item)=>{
                            let currentItem = jq(item);
                            let href = currentItem.find('a').attr('href');
                            href = ' http://h1.ioliu.cn' + href.split('?')[0].replace('photo', 'bing') + '_1920x1080.jpg?imageslim';   // http://h1.ioliu.cn/bing/MarleyBeach_ZH-CN0404372814_1920x1080.jpg?imageslim
                            let title = currentItem.find('h3').html();
    
                           
                            state.list.push(href);
                            state.imgMapTag[href] = pageNo +'-'+(index + 1)+ '-' + title.replace(/\\\:\*\?\"\<\>\|/mig, '-');
                            // state.imgMapThumbnail[imageUrl] = thumbnail;
                        })
                        dispatch('fetchPageData', {pageNo: pageNo + 1});
                    });
                } else if(state.urlType == 'gbf') {
                    console.log('====================', state.gbfList);
                    let item = state.gbfList[pageNo - 1];
                    console.log(item);
                    window.fetchData && window.fetchData(item.href, 1000000, function(res) {
                        let text = res.res.replace(/\n/mig, ' ');
                        let bodyCotent = util.getBodyContent(text);
                        console.log('bodyCotent');
                        dispatch('fetchPageImageUrl', {content: bodyCotent, pageNo}).then(()=>{
                            dispatch('fetchPageData', {pageNo: pageNo + 1});
                        })
                    })
                } else if(state.urlType == 'arknights') {
                    let item = state.arknightsList[pageNo - 1];
                    console.log(item);
                    console.log(item.name);
                    console.log(item.href);
                    console.log(window.fetchData);
                    window.fetchData && window.fetchData(item.href, 1000000, function(res) {
                        let text = res.res.replace(/\n/mig, ' ');
                        let bodyCotent = util.getBodyContent(text);
                        console.log('bodyCotent');
                        dispatch('fetchPageImageUrl', {content: bodyCotent, pageNo}).then(()=>{
                            dispatch('fetchPageData', {pageNo: pageNo + 1});
                        })
                    })
                } else if(state.urlType == 'bilibili') {
                    dispatch('fetchPageImageUrl', {content: '', pageNo}).then(()=>{
                        dispatch('fetchPageData', {pageNo: pageNo + 1});
                    })
                } else if (state.urlType == 'bilibiliSpace') {
                    let url = jq('#page-dynamic .card').not('li').eq(pageNo - 1);
                    let did = url.attr('data-did');
                    let dynamicLink = `https://t.bilibili.com/${did}?tab=2`;
                    window.accessTask && window.accessTask(dynamicLink, function(res) {
                        // console.log(res.html);
                        let text = res.html.replace(/\n/mig, ' ');
                        dispatch('fetchPageImageUrl', {content: text, pageNo}).then(()=>{
                            setTimeout(()=>{
                                dispatch('fetchPageData', {pageNo: pageNo + 1});
                            }, 500)
                        }) 
                    })
                    
                } else if(state.urlType == 'ichi-up') {
                    let url = `https://ichi-up.net/categories/%E6%8F%8F%E3%81%8D%E6%96%B9?page=${pageNo}`;
                    window.fetchData && window.fetchData(url, 1000000, function(res) {
                        let text = res.res.replace(/\n/mig, ' ');
                        let bodyCotent = util.getBodyContent(text);
                        console.log('bodyCotent');
                        // console.log(bodyCotent);
                        dispatch('fetchPageImageUrl', {content: bodyCotent, pageNo}).then(()=>{
                            dispatch('fetchPageData', {pageNo: pageNo + 1});
                        })
                    })
                } else if(state.urlType == 'hpoi') {

                    jq('.av-masonry-container.light-gallery a').each((index, item)=>{
                        let img = (jq(item).attr('href'));
                        state.list.push(img);
                        state.imgMapTag[img] = index + 1;
                    })
                } else if(state.urlType == 'hobby') {
                    jq('#imgAll img').not('.TopThumbImg,.hoverImg').each((index, item)=>{
                        let img = 'https://www.1999.co.jp'+ (jq(item).attr('src'));
                        state.list.push(img);
                        state.imgMapTag[img] = index + 1;
                    })
                } else if(state.urlType == 'nyahentai') {


                    /* https://search.pstatic.net/common?src=https://mt.404cdn.com/galleries/1557596/1t.jpg
                    https://search.pstatic.net/common?src=https://mi.404cdn.com/galleries/1557596/1.jpg */


                    jq('.container .thumb-container img.lazyloaded').each((index, item)=>{
                        let img = (jq(item).attr('src'));
                        console.log('img', img);
                        img = img.replace('t.404', 'i.404').replace('t.', '.');
                        img = img.replace('t1', 'i0').replace('t.', '.');
                        state.list.push(img);
                        state.imgMapTag[img] = index + 1;
                    })
                } else if(state.urlType == 'shimo') {
                    jq('#editor img').each((index ,item)=>{
                        let img = jq(item).attr('src').replace('!thumbnail', '');
                        let l = img.split('/');
                        let tag = l[l.length - 1];
                        console.log(l)
                        console.log(tag, img);
                        state.imgMapTag[img] = tag;
                        if(index == 0) {
                        }
                        state.list.push(img);
                    })
                }else if(state.urlType == 'weibo') {
                    dispatch('fetchPageImageUrl', {content: '', pageNo}).then(()=>{
                        dispatch('fetchPageData', {pageNo: pageNo + 1});
                    })


                    
                } else {
                    let url
                    if(state.pathname.indexOf('pools') > -1 ) {
                        url = `${state.origin}${state.pathname}?page=${pageNo}`;
                    } else {
                        url = `${state.origin}${state.pathname}?page=${pageNo}&tags=${state.tags}`;
                    }
                    
                   

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
                if(state.urlType == 'ichi-up'){
                    dispatch('saveIchiUpData');
                }
                state.pageDataSuccess = true;
            }
        },
        // 通过html解析页面img
        fetchPageImageUrl({state,dispatch}, {content, pageNo}) {
            console.log('fetchPageImageUrl');
            return new Promise((resolve, reject)=>{
                let dom = jQuery('<div>'+content+'</div>');
               
                if(state.urlType == 'danbooru') {
                    // alert('ddd');
                    let articles = location.href.indexOf('pools') > -1 ? dom.find('#c-pools article') : dom.find('#posts-container article');
                    let currentPageImage = [];
                    articles.each((index, a) => {
                        let article = jQuery(a);
                        let dataSource = article.attr('data-source') || '';
                        let dataFileUrl = jQuery(a).attr('data-file-url');
                        if(dataFileUrl.indexOf('/') == 0) {
                            dataFileUrl = 'https://danbooru.me' + dataFileUrl;
                        }
                        if(!state.containsPixiv && dataSource.indexOf('pximg') > -1) {
                            console.log('dataSource', dataSource);
                        } else {
                            state.imgMapTag[dataFileUrl] = pageNo +'-'+ (index + 1) + '-';
                            if(location.href.indexOf('pools') > -1) {
                                state.imgMapTag[dataFileUrl] = state.list.length + 1;
                            }
                            state.imgMapThumbnail[dataFileUrl] = jQuery(a).find('img').attr('src');
                            if(dataSource.indexOf('pximg') > -1) {
                                state.imgMapPixivImg[dataFileUrl] = dataSource;
                            }
                            state.list.push(dataFileUrl);
                        }
            
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
                } else if(state.urlType == 'weibo') {
                    jq('.photo_cont .ph_ar_box').each((index, item)=>{
                        let i = jQuery(item);
                        let actionData = i.attr('action-data');
                        console.log(index);
                        let qs = util.getQueryString(decodeURIComponent(actionData));
                        console.log(qs);
                        // let url = `https://photo.weibo.com/${qs.uid}/wbphotos/large/mid/${qs.mid}/pid/${qs.pid}`;
                        let url = `https://wx3.sinaimg.cn/large/${qs.pid}.jpg`;

                        state.list.push(url);
                        state.imgMapTag[url] = qs.mid+'.jpg';
                
                    })
                }else if(state.urlType == 'acfun') {
                    let articles = dom.find('.article-content img').not('.ubb-emotion');
                    articles.each((index, a)=>{
                        let dataFileUrl = jQuery(a).attr('src');
                        state.list.push(dataFileUrl);
                        state.imgMapTag[dataFileUrl] = pageNo +'-'+ (index + 1);
                    })
                } else if(state.urlType == 'gbf') {
                    let charStatus = dom.find('.gbf-infopage-left .filter-div--button');
                    let imgs = dom.find('.gbf-infopage-left .character-zoom img');
                    let pItem = state.gbfList[pageNo - 1];
                    charStatus.each((index,item)=>{
                        let img = imgs.eq(index).attr('src');
                        let attr = pItem.attr;
                        let name = pItem.name;
                        let cIndex = pItem.cIndex;
                        let status = jq(item).html();
                        state.gbfImgList.push({
                            status,
                            src: img,
                            attr,
                            name,
                            cIndex,
                       })
                       state.list.push(img);
                       state.imgMapTag[img] = `${attr}-${cIndex + 1}-${name}-${status}`;
                    })
                    console.log(state.gbfImgList);
                } else if(state.urlType == 'arknights') {
                    let pItem = state.arknightsList[pageNo - 1];
                    let info = dom.find('.infopanel-item').eq(0);
                    let status = info.find('ul a');
                    let name = pItem.name;
                    let charIndex = pItem.index;

                    let imgs = info.find('.tab-content img');
                    console.log(status);
                    console.log(imgs);
                    status.each((index, item)=>{
                        let img = imgs.eq(index).attr('src');
                        state.arknightsImgList.push({
                            src: img,
                            name,
                            cIndex: index,
                        })
                        let status = jq(item).html();
                        console.log(jq(item).html());
                        state.list.push(img);
                        state.imgMapTag[img] = `${charIndex + 1}-${name}-${status}`;
                    })
                    console.log(state.arknightsImgList);
                    console.log(state.imgMapTag);
                } else if(state.urlType == 'bilibili') {
                    var slider = jq('.boost-slider');
                    var card9 = jq('.zoom-list .card .img-content');
                    let pointer = jq('.user-name .c-pointer').html();
                    let time = jq('.time.tc-slate span').eq(0).text();
                    let content = jq('.content-full').text().slice(0, 30);
                    content = content.replace(/(\/)|(\\)|(\:)|(\*)|(\?)|(\")|(\<)|(\>)|(\|)|(\~)/mig, '-');
                    if(slider.length > 0) {
                        console.log(1);
                        slider.find('img').each((index, item)=>{
                            let src = jq(item).attr('src');
                            src = src.split('@')[0];
                            src = 'https:' + src;
                            console.log(src);
                            state.list.push(src);
                            state.imgMapTag[src] = `${time} ${content}/${index}`;
                        })
                    } else {
                        card9.each((index, item)=>{
                            let $item = jq(item);
                            let src = $item.css('background-image');
                            src = src.split('"')[1];
                            src = src.split('@')[0];
                            if(src.indexOf('//') == 0) {
                             src = 'https:'+ src;
                            }
                            state.list.push(src);
                            state.imgMapTag[src] = `${time} ${content}/${index}`;
                        })
                    }

                    console.log(state.list);
                }  else if(state.urlType == 'bilibiliSpace') {
                    var slider = dom.find('.boost-slider');
                    var card9 = dom.find('.zoom-list .card .img-content');
                    let pointer = dom.find('.user-name .c-pointer').html();
                    let time = dom.find('.time.tc-slate span').eq(0).text();
                    let content = dom.find('.content-full').text().slice(0, 30);
                    content = content.replace(/(\/)|(\\)|(\:)|(\*)|(\?)|(\")|(\<)|(\>)|(\|)|(\~)/mig, '-');
                    if(slider.length > 0) {
                        console.log(1);
                        slider.find('img').each((index, item)=>{
                            let src = jq(item).attr('src');
                            src = src.split('@')[0];
                            src = 'https:' + src;
                            console.log(src);
                            state.list.push(src);
                            state.imgMapTag[src] = `${time} ${content}/${index}`;
                        })
                    } else {
                        card9.each((index, item)=>{
                            let $item = jq(item);
                            let src = $item.css('background-image');
                            src = src.split('"')[1];
                            src = src.split('@')[0];
                            if(src.indexOf('//') == 0) {
                             src = 'https:'+ src;
                            }
                            state.list.push(src);
                            state.imgMapTag[src] = `${time} ${content}/${index}`;
                        })
                    }

                    console.log(state.list);
                    console.log(state.imgMapTag);
                }  else if(state.urlType == 'ichi-up') {
                    let postItems = dom.find('.l-contents .post-item');
                    postItems.each((index, item)=>{
                        let $item = jq(item);
                        let link = $item.find('.block-link').attr('data-href');
                        let poster  = $item.find('.eye-catch img').attr('data-original');
                        let catetory = $item.find('.post-text .category a').html();
                        let tags = $item.find('.post-text span.tag a');
                        let title = $item.find('.post-title').html();
                        let date = $item.find('.post-date .date').html();
                        let imgR = link;
                        let tagsList = [];
                        tags.each((index, item)=>{
                            tagsList.push(jq(item).html())
                        })
                        state.list.push(poster);
                        /* if(state.imgMapTag[poster]) {
                            console.warn('时间重复', date);
                            imgR = state.imgMapTag[poster] = date.replace('/', '-')+'-'+ parseInt(Math.random() * 1000);
                        } else {
                            imgR = state.imgMapTag[poster] = date.replace('/', '-');

                        } */

                        imgR = state.imgMapTag[poster] = imgR.replace(/^\//,'').replace('/', '-') + '.'+util.getExt(poster);
                        state.ichiUpItems.push({
                            link,
                            poster,
                            catetory,
                            title,
                            tagsList,
                            date,
                            imgR,
                            pageNo: pageNo
                        })
                    })
                    console.log(state.ichiUpItems);
                    console.log(state.imgMapTag);
                    
                } else if(state.urlType == 'shimo') {

                }
                resolve();
            })
        },
        // 获取图片数据
        fetchImageData({state, dispatch}, {start} = {start: false}) {
            
            if(!state.isfetching){
                return;
            }
            if(start) {
                for(let i =0; i < state.parallelNum; i ++) {
                    dispatch('fetchImageData');
                }
                util.notifyStatus('progress');
                
            } else {
                if(state.fetchingList.length < state.parallelNum) {
                    if(state.list.length > 0) {
                        try{
                            console.log(state.list[0]);
                            let url = state.list.splice(0, 1);
                            url = url[0];
                            state.fetchingList.push(url);
                            console.log(window.httpRequest);

                            //

                            let fileName = url.split('/');
                                    fileName = fileName[fileName.length - 1];
                                    fileName = state.tags +'-'+ (state.imgMapTag[url] || '')+ '.' + util.getExt(fileName);
                                    if(fileName.indexOf('.') < 0){
                                        fileName += '.jpg';
                                    }
                                    if(fileName.indexOf(' ') > -1) {
                                        let splitFileName = fileName.split(' ');
                                        fileName = splitFileName[splitFileName.length - 1];
                                    }

                                  
                                    // 下载图片
                                    console.log(state.imgMapTag[url]);
                                    let pximg = state.imgMapPixivImg[url];
                                    if(state.urlType == 'danbooru' && location.href.indexOf('pools') > -1) {
                                        let t  = util.checkName(state.tags);
                                        fileName = t + '/' +(state.imgMapTag[url] || '')+ '.' + util.getExt(fileName);
                                        console.log('f1', fileName);
                                        
                                        console.log('f2', fileName);
                                    } if(state.urlType == 'bing') {
                                        fileName = state.imgMapTag[url] + '.'+util.getExt(fileName);
                                        fileName = fileName.replace('?imageslim', '')
                                        fileName = fileName.replace(/\//mig, ' ')
                                    } else if(state.urlType == 'gbf') {
                                        fileName = state.imgMapTag[url] + '.' + util.getExt(url);
                                    } else if(state.urlType == 'arknights') {
                                        fileName = state.imgMapTag[url] + '.' + util.getExt(url);
                                    }else if(state.urlType == 'bilibili') {
                                        fileName = state.imgMapTag[url] + '.' + util.getExt(url);
                                    }else if(state.urlType == 'bilibiliSpace') {
                                        fileName = state.imgMapTag[url] + '.' + util.getExt(url);
                                    } else if(state.urlType == 'ichi-up') {
                                        fileName = state.imgMapTag[url];
                                    } else if(state.urlType == 'hpoi') {
                                        fileName = state.tags.replace('er.','er') +'/'+ state.imgMapTag[url] + '.' + util.getExt(url);
                                    }else if(state.urlType == 'hobby') {
                                        fileName = state.tags +'/'+ state.imgMapTag[url] + '.' + util.getExt(url);
                                    } else if(state.urlType == 'nyahentai') {
                                        fileName = state.tags +'/'+ state.imgMapTag[url] + '.' + util.getExt(url);
                                    }else if(state.urlType == 'shimo') {
                                        fileName = state.tags +'/'+ state.imgMapTag[url]// + '.' + util.getExt(url);
                                    } /* else if(state.urlType == 'yande.re') {
                                        let f = url.split('/');
                                        fileName = state.tags +'-'+ f[f.length - 1];
                                    } */else if(state.urlType == 'weibo') {
                                        fileName = state.imgMapTag[url];
                                    } else if(state.urlType == 'danbooru' || state.urlType == 'yande.re') {
                                        fileName = (state.useDir ? (state.tags +'/') : '' ) + fileName
                                    }
                                    /* fileName = util.checkName(fileName)
                                   console.log('fileName', fileName);
                                    return;  */
                                    console.log('fileName', fileName);
                                    fileName = util.checkName(fileName);
                                    // alert(state.urlType);
                                    if(state.urlType == 'yande.re.pool') {
                                        fileName = state.tags +'/'+fileName
                                    }
                                    dispatch('downloadImage', {url, fileName, pximg});





                            

                           /*  window.httpRequest && window.httpRequest(url, 'blob', (res)=>{

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
                                    if(state.urlType == 'bing'){
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000)
                                    }else  if(state.urlType == 'gbf') {
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000);
                                    } else if(state.urlType == 'arknights') {
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000);
                                    } else if(state.urlType == 'ichi-up') {
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000);
                                    } else {
                                        dispatch('fetchImageData');
                                    }
    
                                    let fileName = url.split('/');
                                    fileName = fileName[fileName.length - 1];
                                    fileName = state.tags +'-'+ (state.imgMapTag[url] || '')+ '.' + util.getExt(fileName);
                                    if(fileName.indexOf('.') < 0){
                                        fileName += '.jpg';
                                    }
                                    if(fileName.indexOf(' ') > -1) {
                                        let splitFileName = fileName.split(' ');
                                        fileName = splitFileName[splitFileName.length - 1];
                                    }
                                  
                                    // 下载图片
                                    console.log(state.imgMapTag[url]);
                                    if(state.urlType == 'bing') {
                                        fileName = state.imgMapTag[url] + '.'+util.getExt(fileName);
                                        fileName = fileName.replace('?imageslim', '')
                                        fileName = fileName.replace(/\//mig, ' ')
                                    } else if(state.urlType == 'gbf') {
                                        fileName = state.imgMapTag[url] + '.' + util.getExt(url);
                                    } else if(state.urlType == 'arknights') {
                                        fileName = state.imgMapTag[url] + '.' + util.getExt(url);
                                    }else if(state.urlType == 'bilibili') {
                                        fileName = state.imgMapTag[url] + '.' + util.getExt(url);
                                    } else if(state.urlType == 'ichi-up') {
                                        fileName = state.imgMapTag[url];
                                    } else if(state.urlType == 'hpoi') {
                                        fileName = state.tags +'/'+ state.imgMapTag[url] + '.' + util.getExt(url);
                                    }else if(state.urlType == 'hobby') {
                                        fileName = state.tags +'/'+ state.imgMapTag[url] + '.' + util.getExt(url);
                                    } else if(state.urlType == 'nyahentai') {
                                        fileName = state.tags +'/'+ state.imgMapTag[url] + '.' + util.getExt(url);
                                    }
                                    console.log('fileName', fileName);
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
                                    if(state.urlType == 'yade.re.pool') {
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 2000)
                                    } else if(state.urlType == 'bing'){
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000)
                                    } else if(state.urlType == 'gbf') {
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000)
                                    }else if(state.urlType == 'arknights') {
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000)
                                    }else if(state.urlType == 'ichi-up') {
                                        setTimeout(()=>{
                                            dispatch('fetchImageData');
                                        }, 1000)
                                    }else {
                                        dispatch('fetchImageData');
                                    }
                                }
                            }); */


                            
                        } catch(e){
                            console.warn(e);
                        } 
                    } else {
                        if(state.fetchingList.length == 0) {
                            // alert('获取完成');
                            util.notifyStatus('success');
                            window.notify('basic', '', '获取完成', `user:${state.tags}`);
                            state.isfetching = false;
                            if(state.urlType == 'shimo') {
                                dispatch('downloadShimo')
                            }
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
        downloadImage({state, dispatch}, {url, fileName,pximg}) {
            console.warn(['====================', url, fileName, pximg]);
            let c = function(res) {
                if(res.success) {
                    state.list = state.list.filter((i)=>{
                        return i != url;
                    })
                    state.fetchingList = state.fetchingList.filter((i)=>{
                        return i != url;
                    })
                    state.successList.push(url);
                    // 添加下一个任务
                    if(state.urlType == 'bing'){
                        setTimeout(()=>{
                            dispatch('fetchImageData');
                        }, 1000)
                    }else  if(state.urlType == 'gbf') {
                        setTimeout(()=>{
                            dispatch('fetchImageData');
                        }, 1000);
                    } else if(state.urlType == 'arknights') {
                        setTimeout(()=>{
                            dispatch('fetchImageData');
                        }, 1000);
                    } else if(state.urlType == 'ichi-up') {
                        setTimeout(()=>{
                            dispatch('fetchImageData');
                        }, 1000);
                    } else if(state.urlType == 'weibo') {
                        setTimeout(()=>{
                            dispatch('fetchImageData');
                        }, 1100);
                    }else if(state.urlType == 'bilibiliSpace') {
                        setTimeout(()=>{
                            dispatch('fetchImageData');
                        }, 1100);
                    }  else{
                        dispatch('fetchImageData');
                    }
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
                        if(state.urlType == 'yade.re.pool') {
                            setTimeout(()=>{
                                dispatch('fetchImageData');
                            }, 2000)
                        } else if(state.urlType == 'danbooru.pool') {
                            setTimeout(()=>{
                                dispatch('fetchImageData');
                            }, 2000)
                        } else if(state.urlType == 'bing'){
                            setTimeout(()=>{
                                dispatch('fetchImageData');
                            }, 1000)
                        } else if(state.urlType == 'gbf') {
                            setTimeout(()=>{
                                dispatch('fetchImageData');
                            }, 1000)
                        }else if(state.urlType == 'arknights') {
                            setTimeout(()=>{
                                dispatch('fetchImageData');
                            }, 1000)
                        } else if(state.urlType == 'bilibiliSpace') {
                            setTimeout(()=>{
                                dispatch('fetchImageData');
                            }, 1100);
                        } else if(state.urlType == 'ichi-up') {
                            setTimeout(()=>{
                                dispatch('fetchImageData');
                            }, 1000)
                        }else {
                            dispatch('fetchImageData');
                        }
                }
            }


            if(pximg) {
                window.sendDownload && window.sendDownload({
                    url: pximg,
                    fileName: fileName,
                    callback: (res) => {
                        if(res.success){
                            c(res);
                        } else {
                            window.sendDownload && window.sendDownload({
                                url: url,
                                fileName: fileName,
                                callback: (r) => {
                                    c(r);
                                }
                            });
                        }
                    }
                });
            } else {
                window.sendDownload && window.sendDownload({
                    url: url,
                    fileName: fileName,
                    callback: (res) => {
                        c(res);
                    }
                });
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
                let webFrom = '';
                switch (state.urlType) {
                    case 'danbooru':
                        webFrom = 'danbooru'
                        break;
                    case 'yande.re':
                        webFrom = 'yandere'
                        break;
                    default:
                        break;
                }
                window.sendDownload && window.sendDownload({url: file.result, fileName: `${state.tags || 'unknow'}.${webFrom || '.' }json`});
            }
        },
        saveIchiUpData({state,}) {
            let list = []
            state.ichiUpItems.forEach((item,index)=>{
                list.push( `
                {
                    link:  '${item.link}',
                    poster: '${item.poster}',
                    catetory: '${item.catetory}',
                    title: '${item.title}',
                    tagsList: ${JSON.stringify(item.tagsList)},
                    date: '${item.date}',
                    imgR: '${item.imgR}',
                    pageNo: '${item.pageNo}'
                }
                `)
            });
            let listStr = `let list = [${list.join(',')}]`;
            console.log(listStr);

            let blob = new Blob([listStr], {type : 'text/javascript'});
            let file = new FileReader();
            file.readAsDataURL(blob);
            file.onload = ()=>{
                window.sendDownload && window.sendDownload({url: file.result, fileName: 'ichi-up.js'});
            }
        },
        openIchiUpTab() {
            let links = jq('body').find('.l-contents .post-item .block-link');
            console.log(links.length);
            links.each((index, item)=>{
                let href = jq(item).attr('data-href');
                console.log(href);
                href = 'https://ichi-up.net' + href;
                setTimeout(()=>{
                    console.log(href);
                    window.openTab&&window.openTab(href);
                }, index * 1000)
            })
        },
        // 下载石案文档文章
        downloadShimo({state}) {
            let content = jq('#editor')[0].outerHTML;
            let copyContent = jq(content);
            copyContent.find('img').each((index, item)=>{
                let $item = jq(item);
                let src = $item.attr('src').replace('!thumbnail', '');

                let dir = state.tags +'/';
                let l = src.split('/')
                let tag = l[l.length - 1]
                jq(item).attr({src: dir + tag});
            })
            // copyContent.append(jq('.new-doc-directory'));
            let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>${util.getTitle()}</title>
                <link href="./shimo.css" media="all" rel="stylesheet">
                <link href="../shimo.css" media="all" rel="stylesheet">
                <style>
                </style>
            </head>
            <body>
                ${
                    copyContent[0].outerHTML
                }
                <script src="../shimo.js"></script>
                <script src="./shimo.js"></script>
            </body>
            </html>  
            `;
            let blob = new Blob([html], {type : 'text/html'});
            let file = new FileReader();
            file.readAsDataURL(blob);
            file.onload = ()=>{
                window.sendDownload && window.sendDownload({url: file.result, fileName: this.state.tags + '.html', callback: ()=>{
                    
                }});
            }

        },
        // ichi-up获取页面教程截图
        saveScreenshot({dispatch}){

            jq('.adsbygoogle,ins').remove();
            let article = jq('article.single-post');
            if(location.href.indexOf('categories') > -1) {
                article = jq('.l-contents');
            }

            let newDom;
            if(jq('.article-copied').length > 0) {
                newDom = jq('.article-copied');
            } else {
                newDom = jq('<div class="article-copied" style="position:fixed;left:0px;top:0;background-color:white;width:624px">'+article.html()+'</div>');
                console.log(1);
                newDom.find('.single-post-banner,.post-footer').remove();// .post-inner-link,
                console.log(2);
                setTimeout(()=>{
                    // dispatch('saveIchiUpHtml');
                    dispatch('saveScreenshot');
                }, 200);
                jq('body').prepend(newDom);
                
            }
            console.log('3');
            setTimeout(()=>{
                document.documentElement.scrollTop = 0;
                document.documentElement.scrollLeft = 0;

                html2canvas(newDom[0]).then(function(canvas) {
                    let dataUrl = canvas.toDataURL();
    
                    let checkFun = ()=>{
                      
                        if(window.sendDownload) {

                            dispatch('saveIchiUpHtml');
                            // return;
                            // 下载截图
                            // window.sendDownload({url: dataUrl, fileName: util.getSaveName(newDom)+'.png'});

                            util.notifyStatus('success');
                        } else {
                            setTimeout(()=>{
                                console.log('timeout');
                                checkFun();
                            }, 500);
                        }
                    } 
                    checkFun();
                }, function(e){
                    alert('error');
                    console.error('===============================');
                    console.error(e);
                });
            }, 1000);
        },
        saveIchiUpHtml(){
            // 生成html页面
            let newDom = jq('.article-copied');
            let newDom2 = jq('<div class="article-copied" style="margin:0 auto;background-color:white;border:0px solid red;width:624px">'+newDom.html()+'</div>');
            let newDom2Imgs = newDom2.find('img');
            let newDomImgs = newDom.find('img');
            
            let imgs = [];
            //
            newDomImgs.each((index, item)=>{
                let currentImage = jq(item);
                console.log(currentImage);
                let imgW = currentImage.width();
                let imgH = currentImage.height();
                let imgL = currentImage.position().left;
                let imgT = currentImage.position().top;
                let origin = currentImage.attr('data-original')
                imgs.push(origin || currentImage.attr('src'));
                // newDom2Imgs.eq(index).replaceWith(`<div class="bg-sprit" style="display:inline-block;width:${imgW}px;height:${imgH}px;background-position:${-imgL}px ${-imgT}px;"></div>`)
            })
            console.log('imgs===================================================');
            console.log(imgs);
            let imgPromises = imgs.map((imgUrl)=>{
                let requestImgUrl = (imgUrl.indexOf('//') == 0 /* || imgUrl.indexOf('//station') == 0  */)?  ('https:'+imgUrl) : imgUrl;
                return new Promise((resolve, reject)=>{
                    window.httpRequest && window.httpRequest(requestImgUrl, 'blob', (res)=>{
                        console.log(res);
                        if(res.res) {
                            resolve(res.res);
                        }
                    });
                })
            })
            // 所有图片加载完成
            Promise.all(imgPromises).then((res)=>{
                console.log(res);
                res.forEach((url,index)=>{
                    newDom2Imgs.eq(index).attr({
                        src: url,
                    })
                })
                let bgName = util.getSaveName(newDom)+'.png';
                let domW = newDom.width();
                let domH = newDom.height();
                let totalHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>${util.getTitle()}</title>
                    <link href="./application.css" media="all" rel="stylesheet">
                    <link href="../application.css" media="all" rel="stylesheet">
                    <style>
                        .bg-sprit{
                            background-image:url("./${bgName}");
                            background-size:${domW}px ${domH}px;
                        }
                    </style>
                </head>
                <body>
                    ${
                        newDom2[0].outerHTML
                    }
                    <script src="../application.js"></script>
                    <script src="./application.js"></script>
                </body>
                </html>
                `;
                let blob = new Blob([totalHtml], {type : 'text/html'});
                let file = new FileReader();
                file.readAsDataURL(blob);
                file.onload = ()=>{
                    // 下截html
                    let fn = util.getSaveName(newDom).replace(/[\\\:\*\?\"\<\>\|]/mig, '-')+'.html';
                    window.sendDownload && window.sendDownload({url: file.result, fileName: fn});
                    console.warn('filename-----------------------', fn);
                    newDom2.css({
                        position:'fixed',
                        left:'-1000px',
                        top: 0,
                    })
                    jq('body').append(newDom2);
                    document.documentElement.scrollTop = 0;
                    document.documentElement.scrollLeft = 0;
                    
                    html2canvas(newDom2[0]).then(function(canvas) {
                        let dataUrl = canvas.toDataURL();
                        let name = util.getSaveName(newDom2).replace(/[\\\:\*\?\"\<\>\|]/mig, '-')+'.png';
                        console.warn('name==========================',name);
                        util.notifyStatus('success');
                        window.sendDownload({url: dataUrl, fileName: name});
                    })

                }
            })
        }
	
	},
	modules: {
	}
}
export default store;

// git fetch --all && git reset --hard origin/master && git pull


// console.log(distList);

/* var toSaveList = [];
var state = window.project.$store.state
var distList = state.fetchingList.concat(state.list).concat(state.errorList);
distList.forEach((item)=>{
    let listItem = {};
    listItem[item] = state.imgMapTag[item] || '';
    toSaveList.push(listItem);
})
var toSaveJson = {
    href: location.href,
    tags: state.tags,
    list: toSaveList,
}
var blob = new Blob([JSON.stringify(toSaveJson)], {type : 'application/json'});

var file = new FileReader();
file.readAsDataURL(blob);
file.onload = ()=>{
    console.log(file.result);
    window.sendDownload && window.sendDownload({url: file.result, fileName: `${state.tags || 'unknow'}.json`});
} */


/*

var name = '2019.06.04-特徴を押さえて描こう！ 鳥の描き方講座 ~スズメ編~ —— いちあっぷ.json';
var blob = new Blob(['abc'], {type : 'application/json'});
var file = new FileReader();
file.readAsDataURL(blob);
file.onload = ()=>{
    console.log(file.result);
    window.sendDownload && window.sendDownload({url: file.result, fileName: name});
}

*/