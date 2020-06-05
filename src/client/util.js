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
    }

}