import axios from 'axios';
import config from './apiServerConfig';
import qs from 'qs';


export default function $axios(options,headerType) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            headers: {
                'Content-Type':'application/json; charset=utf-8'
              },
            timeout: 1000*60*10, // request timeout
            transformResponse: [function (data) {
            }],
        });

        // request 拦截器
        instance.interceptors.request.use(
            config => {
              // 根据请求方法，序列化传来的参数，根据后端需求是否序列化
                if (config.method == 'post') {
                    if (config.data.__proto__ == FormData.prototype
                        || config.url.endsWith('path')
                        || config.url.endsWith('mark')
                        || config.url.endsWith('patchs')
                    ) {} else {
                      if(config.headers["Content-Type"]=='application/x-www-form-urlencoded'){
                          config.data = qs.stringify(config.data)
                      }
                    }
                }
                return config
            },

            error => {
                // 请求错误时
                window.window.console.log('request:', error)
                // 1. 判断请求超时
                if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
                    window.console.log('timeout请求超时')
                }
                // 2. 需要重定向到错误页面
                const errorInfo = error.response
                window.console.log(errorInfo)
                return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
            }
        );

        // response 拦截器
        instance.interceptors.response.use(
            response => {
                let data;
                if (response.data == undefined) {
                    try{
                        data = JSON.parse(response.request.responseText)
                    }catch{
                        data = response.request.responseText
                    }
                } else {
                    data = response.data
                }
                // 根据返回的code值来做不同的处理
                switch (data.rc) {
                    case 1:
                        window.console.log(data.desc)
                        break;
                    case 0:
                        break;
                    default:
                }
                return data
            },
            err => {
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            err.message = '请求错误'
                            break

                        case 401:
                            err.message = '未授权，请登录'
                            break

                        case 403:
                            err.message = '拒绝访问'
                            break

                        case 404:
                            err.message = `请求地址出错: ${err.response.config.url}`
                            break

                        case 408:
                            err.message = '请求超时'
                            break

                        case 500:
                            err.message = '服务器内部错误'
                            break

                        case 501:
                            err.message = '服务未实现'
                            break

                        case 502:
                            err.message = '网关错误'
                            break

                        case 503:
                            err.message = '服务不可用'
                            break

                        case 504:
                            err.message = '网关超时'
                            break

                        case 505:
                            err.message = 'HTTP版本不受支持'
                            break

                        default:
                    }
                }
                window.console.error(err)
                return Promise.reject(err) // 返回接口返回的错误信息
            }
        )

        // 请求处理
        instance(options).then(res => {
            resolve(res)
            return false
        }).catch(error => {
            reject(error)
        })
    })
}
