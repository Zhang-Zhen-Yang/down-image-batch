import util from '../util.js';
export default ({state, commit, dispatch, getters})=>{
    let href = location.href;
    let origin = location.origin;
    let search = location.search;
    let queryString = util.getQueryString(search);
    // alert(origin);
    state.urlType = util.getUrlType();
    state.origin = origin;
    state.tags = queryString.tags;
    state.pathname = location.pathname;

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
    // 
    document.body.addEventListener('dragover', (e)=>{
        e.preventDefault();
        // console.log(e);
    })
    jq('.javascript-hide').removeClass('javascript-hide').css({outline: '1px solid red'})
    // commit('showSnackbar', {text: '533333'})
}