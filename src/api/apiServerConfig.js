let ripsBase='';
let HTTP='';
if(window.location.protocol.startsWith('https')){
    HTTP='https://';
}else{
    HTTP='http://';
}

if(process.env.NODE_ENV =='development'){//开发环境
    ripsBase = '/api';
}else if(process.env.NODE_ENV =='production'){//正式部署环境
    if(process.env.VUE_APP_TITLE === 'test'){
        ripsBase = HTTP+'testripx.iuoooo.com/api';
    }else{
        ripsBase = HTTP + 'ripx-ui.iuoooo.com/api';
    }

}
export default {
    method: 'get',
    // 基础url前缀
    // baseURL: storeBase,
    // 请求头信息
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    // 参数
    data: {},
    // 设置超时时间
    timeout: 1000*30,
    // 携带凭证
    // withCredentials: true,
    // 返回数据类型
    // responseType: 'json'
    ripsBase,
}
