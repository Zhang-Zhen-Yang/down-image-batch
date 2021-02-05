import util from '../util.js';
export default ({state, commit, dispatch, getters}, {pageNo})=>{
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
            dispatch('fetchPageImageUrl', {content: jq('body').html(), pageNo}).then(()=>{
                dispatch('fetchPageData', {pageNo: pageNo + 1});
            })
        } else if(state.urlType == 'yande.re.pool') {
            let url = jq('body').find('#post-list-posts li').eq(pageNo - 1).find('a').attr('href');
            let thumbnail = jq('body').find('#post-list-posts li').eq(pageNo - 1).find('img').attr('src');
            window.fetchData && window.fetchData('https://yande.re'+url, 1000000, function(res) {
                let bodyCotent = util.getBodyContent(res.res);
                let imageUrl =  jq('<div>'+bodyCotent+'</div>').find('.highres-show').attr('href');
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
                let dom =  jq('<div>'+bodyCotent+'</div>').find('.card ');
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
                img = img.replace('t.404', 'i.404').replace('t.', '.');
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
        }else{
            let url = `${state.origin}${state.pathname}?page=${pageNo}&tags=${state.tags}`;
            console.log('url', url);
            window.fetchData && window.fetchData(url, 1000000, function(res) {
                // console.log(res);
                let text = res.res.replace(/\n/mig, ' ');
                let bodyCotent = util.getBodyContent(text);
                console.log('bodyCotent');
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
}