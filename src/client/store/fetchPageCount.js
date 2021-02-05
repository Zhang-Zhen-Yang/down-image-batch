import util from '../util.js';
export default ({state, commit, dispatch, getters})=>{
    // alert(state.urlType);
    let dom = jq('<div>'+jq('body').html()+'</div>');
    let pageNo = 0;
    let pageTotal = 0;
    if(state.urlType == 'danbooru') {
        let numberedPage = dom.find('.numbered-page a');
        numberedPage.each((index, pItem)=>{
            console.log(index, pItem);
            console.log(pItem);
            let p = parseInt(jq(pItem).html());
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
            let p = parseInt(jq(pItem).html());
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
    } else if (state.urlType == 'gbf') {
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
        pageTotal = /* 1; // */state.gbfList.length;
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
    }
    state.pageTotal = pageTotal;
}