 let util = {
    // 获取链接的查询字符
    getQueryString(url) {
        let result = {};
        let href = window.location.toString();
        let queryString;
        if(url) {
            queryString = url.split('?')[1];
        } else {
            queryString = href.split('?')[1];
        }

        if(queryString) {
            let queryStringList = queryString.split('&');
            if(queryStringList) {
                queryStringList.forEach((item) => {
                    let queryPairing = item.split('=');
                    result[queryPairing[0]] = queryPairing[1];
                });
            }
        }
        return result;
    },
    // 将base64转成blob
    convertBase64ToBlob(base64, type) {
        var base64Arr = base64.split(',');
        var imgtype = '';
        var base64String = '';
        if(base64Arr.length > 1){
            //如果是图片base64，去掉头信息
            base64String = base64Arr[1];
            imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':')+1,base64Arr[0].indexOf(';'));
        }
        // 将base64解码
        var bytes = atob(base64String);
        //var bytes = base64;
        var bytesCode = new ArrayBuffer(bytes.length);
        // 转换为类型化数组
        var byteArray = new Uint8Array(bytesCode);
        
        // 将base64转换为ascii码
        for (var i = 0; i < bytes.length; i++) {
            byteArray[i] = bytes.charCodeAt(i);
        }
        if(type == 'byteArray') {
            return byteArray;
        }
        // 生成Blob对象（文件对象）
        return new Blob( [bytesCode] , {type : imgtype});
    },
    // 获取html页面body的内容
    getBodyContent(text) {
        let bodyStart = (text.indexOf('<body'));
        console.log(text.indexOf('>', bodyStart));
        let bodyEnd = (text.indexOf('</body'));
        let bodyContent = text.slice(text.indexOf('>', bodyStart) + 1, bodyEnd);
        console.log(bodyContent);
        return bodyContent;
    },
    // 是否显示界面
    shouldInjectDom() {
        let href = location.href;
        let list = [
        //    /baidu.com/,
            /danbooru/,
            /yande.re\/post/,
            /yande.re\/pool/,
            /space\.bilibili\.com/,
            /space\.bilibili\/[0-1]+?\/album/,
            /www.acfun.cn\/a\//,
            /localhost/,
            /ichi\-up\.net\//,
            /bing\.ioliu\.cn/,
            /gbf\.huijiwiki\.com\/wiki/,
            /arknights\.huijiwiki\.com\/wiki/,
            /t\.bilibili\.com/,
            /www\.hpoi\.net\/hobby/,
            /www\.hpoi\.cn\/album/,
            /www\.hpoi\.net\/album/,
            /www\.1999\.co\.jp\/eng\/image/,
            /www\.1999\.co\.jp\/image/,
            /(nyahentai\.co\/g)|(nyahentai\.club)|(ja\.cathentai)|(hentai.com)/,
            /shimo\.im\/docs/,
            /weibo\.com/,
            /www\.baidu\.com/,
            /dmzj\.com/,
            /kanguoman\.net/, // https://www.kanguoman.net/gf/maoxianmanyoudao/1946223.html
        ]
        let should = false;
        list.forEach((item)=>{
            // console.log(href.match(item));
            if(href.match(item)) {
                should = true;
            }
        })
        return should;
        /* if(href.indexOf('danbooru') > -1 || href.indexOf('yande.re') > -1|| href.indexOf('baidu.com') > -1 || href.indexOf('bilibili.com') > -1) {
            return true;
        }
        return false; */
    },
    // 链接标识
    getUrlType() {
        let list = [
            {match: /danbooru\.donmai\.us\/posts/, type: 'danbooru'},
            {match: /danbooru\.donmai\.us\/pools/, type: 'danbooru'},
            {match:/yande.re\/post/, type: 'yande.re'},
            {match:/yande.re\/pool/, type: 'yande.re.pool'},
            {match:/baidu.com/, type: 'baidu'},
            {match:/www.acfun.cn\/a\//, type: 'acfun'},
            {match:/localhost/, type: 'localhost'},
            {match:/ichi\-up\.net\//, type: 'ichi-up'},
            {match:/bing\.ioliu\.cn/, type: 'bing'},
            {match:/gbf\.huijiwiki\.com\/wiki/, type: 'gbf'},// gbf维基
            {match:/arknights\.huijiwiki\.com\/wiki/, type: 'arknights'},// arknights维基
            {match: /t\.bilibili\.com/, type: 'bilibili'},// bilibili空动态
            {match:/space\.bilibili.com/, type: 'bilibiliSpace'}, // 未用
            {match:/space\.bilibili\.com\/[0-9]+?\/album/, type: 'bilibiliAlbum'}, 
            
            {match: /www\.hpoi\.net\/hobby/, type: 'hpoi'},// hpoi手办
            {match: /www\.hpoi\.cn\/album/, type: 'hpoi'},// hpoi手办
            {match: /www\.hpoi\.net\/album/, type: 'hpoi'},// hpoi手办
            {match: /www\.1999\.co\.jp\/eng\/image/, type: 'hobby'},// hpoi手办
            {match: /www\.1999\.co\.jp\/image/, type: 'hobby'},// hpoi手办
            {match: /(nyahentai\.co\/g)|(nyahentai\.club)|(ja\.cathentai)|(hentai.com)/, type: 'nyahentai'},// nyahentai
            {match: /shimo\.im\/docs/, type: 'shimo'},//
            {match: /weibo\.com/, type: 'weibo'},// 
            {match: /www\.baidu\.com/, type: 'baidu'},// nyahentai
            {match: /dmzj\.com/, type: 'dmzj'},// nyahentai
            {match:/kanguoman\.net/,type: 'kgm'}, // https://www.kanguoman.net/gf/maoxianmanyoudao/1946223.html
        ];
        let href = location.href;
        let urlType = '';
        list.forEach((item)=>{
            console.log(href)
            console.log(href.match(item.match));
            if(href.match(item.match)) {
                urlType = item.type;
            }
        })
        return urlType;
    },
    // 更改网页title
    notifyStatus(status) {
        let title = document.title;
        title = title.replace(/^(↓|√)/, '');
        if(status == 'progress') {
            document.title = '↓' + title;
        } else if(status == 'success') {
            document.title = '√' + title;
        }
    },
    endWidth(text, v) {
        if(  text && v && (text.indexOf(v) + v.length)==text.length) {
            return true;
        }
        return false;
    },
    // 获取后缀名
    getExt(name) {
        let nameList = name.split('.');
        return nameList[nameList.length -1] || ''
    },

    getTitle() {
        return document.title.replace(/^(↓|√)/, '');
    },
    getSaveName(newDom){
        let distFileName = document.title.replace(/^(↓|√)/, '');//  + '.png';
        let date = location.pathname.split('/');
        date = newDom.find('.date').html();

        console.log(distFileName);
        distFileName = date+'-' + distFileName.replace(/\|/mig, '——');// 去除特殊字符
        distFileName = util.checkName(distFileName);
        console.log(distFileName);
        return distFileName;
    },
    // 将特殊符号改成其他
    checkName(str) {
        return str.replace(/(\\)|(\:)|(\*)|(\?)|(\")|(\<)|(\>)|(\|)|(\~)/mig, '-');
    },
    // 下载图片
    openDownloadDialog: function(url, saveName) {
        if(typeof url == 'object' && url instanceof Blob)
        {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if(window.MouseEvent) event = new MouseEvent('click');
        else
        {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    },

}

export default util;