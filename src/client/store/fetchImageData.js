import util from '../util.js';
export default ({state, commit, dispatch, getters},  {start} = {start: false})=>{
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
                    // 必应
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
                    }else if(state.urlType == 'shimo') {
                        fileName = state.tags +'/'+ state.imgMapTag[url]// + '.' + util.getExt(url);
                    }
                    console.log('fileName', fileName);
                    window.sendDownload && window.sendDownload({url: url, fileName: fileName,callback: (res)=>{
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
                            } else {
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

                    }});

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
}