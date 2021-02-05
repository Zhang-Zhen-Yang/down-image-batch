import util from '../util.js';
export default ({state, commit, dispatch, getters})=>{
    console.log('fetchPageImageUrl');
    return new Promise((resolve, reject)=>{
        let dom = jq('<div>'+content+'</div>');
        
        if(state.urlType == 'danbooru') {
            let articles = dom.find('#posts-container article');
            let currentPageImage = [];
            articles.each((index, a) => {
                let dataFileUrl = jq(a).attr('data-file-url');
                if(dataFileUrl.indexOf('/') == 0) {
                    dataFileUrl = 'https://danbooru.me' + dataFileUrl;
                }
                state.imgMapTag[dataFileUrl] = pageNo +'-'+ (index + 1) + '-';
                state.imgMapThumbnail[dataFileUrl] = jq(a).find('img').attr('src');
                state.list.push(dataFileUrl);
            })

        } else if(state.urlType == 'yande.re'){
            // alert(state.urlType);
            let articles = dom.find('#post-list-posts .largeimg,.smallimg');
            console.log('articles');
            console.log(articles);
            articles.each((index, a)=>{
                let dataFileUrl = jq(a).attr('href');
                if(dataFileUrl.indexOf('/') == 0) {
                    dataFileUrl = 'https://danbooru.me' + dataFileUrl;
                }
                console.log(dataFileUrl);
                state.list.push(dataFileUrl);
                state.imgMapTag[dataFileUrl] = pageNo +'-'+ (index + 1);
                state.imgMapThumbnail[dataFileUrl] = jq(a).prev().find('img').attr('src');
            })
        } else if(state.urlType == 'acfun') {
            let articles = dom.find('.article-content img').not('.ubb-emotion');
            articles.each((index, a)=>{
                let dataFileUrl = jq(a).attr('src');
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
            var card9 = jq('.card-9 .img-content');
            let pointer = jq('.user-name .c-pointer').html();
            if(slider.length > 0) {
                console.log(1);
                slider.find('img').each((index, item)=>{
                    let src = jq(item).attr('src');
                    src = src.split('@')[0];
                    src = 'https:' + src;
                    console.log(src);
                    state.list.push(src);
                    state.imgMapTag[src] = `${pointer}-${index}`;
                })
            } else {
                card9.each((index, item)=>{
                    let $item = jq(item);
                    let src = $item.css('background-image');
                    src = src.split('"')[1];
                    src = src.split('@')[0];
                    state.list.push(src);
                    state.imgMapTag[src] = `${pointer}-${index}`;
                })
            }

            console.log(state.list);
        } else if(state.urlType == 'ichi-up') {
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
}