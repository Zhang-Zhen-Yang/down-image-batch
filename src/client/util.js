export default {
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
            /bilibili.com/,
            /www.acfun.cn\/a\//,
            /localhost/,
            /ichi\-up\.net\//,
            /bing\.ioliu\.cn/,
            /gbf\.huijiwiki\.com\/wiki/,
            /arknights\.huijiwiki\.com\/wiki/,
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
    getUrlType() {
        let list = [
            {match: /danbooru/, type: 'danbooru'},
            {match:/yande.re\/post/, type: 'yande.re'},
            {match:/yande.re\/pool/, type: 'yande.re.pool'},
            {match:/baidu.com/, type: 'baidu'},
            {match:/bilibili.com/, type: 'bilibili'}, // 未用
            {match:/www.acfun.cn\/a\//, type: 'acfun'},
            {match:/localhost/, type: 'localhost'},
            {match:/ichi\-up\.net\//, type: 'ichi-up'},
            {match:/bing\.ioliu\.cn/, type: 'bing'},
            {match:/gbf\.huijiwiki\.com\/wiki/, type: 'gbf'},// gbf维基
            {match:/arknights\.huijiwiki\.com\/wiki/, type: 'arknights'},// arknights维基
        ];
        let href = location.href;
        let urlType = '';
        list.forEach((item)=>{
            // console.log(href.match(item.match));
            if(href.match(item.match)) {
                urlType = item.type;
            }
        })
        return urlType;
    },
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
        console.log(distFileName);
        return distFileName;
    }

}