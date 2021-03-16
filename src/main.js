import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import './plugins/element.js' //Element ui
import './plugins/video.js'
import '@/styles/index.scss' // global css
import api from './api/index'//引入接口调用api
import utils from './utils' //公共js方法
import './assets/directives.js';
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {VTable,VPagination} from 'vue-easytable'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video
// 注册到全局
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);
Vue.config.devtools = true;
Vue.prototype.$utils = utils;   //注册全局方法
/**
 *
 * @param msg 消息体
 * @param type 0 默认，1success 2warning -1error
 * @param fun
 */
Vue.prototype.message = function (msg, type, fun) {
    let type_ = '';
    switch (type) {
        case 0:
            type_ = '';
            break;
        case 1:
            type_ = 'success';
            break;
        case 2:
            type_ = 'warning';
            break;
        case -1:
            type_ = 'error';
            break;
    }
    this.$message(
        {
            showClose: true,
            message: msg,
            type: type_,
            duration: 1200,
            center: true,
            onClose() {
                if (fun) {
                    fun();
                }
            }
        }
    )
};
Vue.config.productionTip = false;
Vue.use(api);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
/**
 * input限制只能输入正整数
 * 用法<el-input type="number" v-enter-number></el-input>
 */
Vue.directive('enterNumber', {
    inserted: function (el) {
        el.addEventListener("keypress", function (e) {
            e = e || window.event;
            let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
            let re = /\d/;
            if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        });
    }
});
/**
 * input限制只能输入正数(包含小数)
 * 用法<el-input type="number" v-enter-number2></el-input>
 */
Vue.directive('enterNumber2', {
    inserted: function (el) {
        el.addEventListener("keypress", function (e) {
            e = e || window.event;
            let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
            let re = /\d/;
            if (charcode == 46) {
                if (el.value.includes('.')) {
                    e.preventDefault();
                }
                return;
            } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        });
    }
});

router.beforeEach((to, from, next) => {
    let toQuery = JSON.parse(JSON.stringify(to.query));
    if(toQuery.userId!=null){
        next();
    }else{
        let a = 1;
        if(a ==1){//精确治理
            toQuery.userId = 'c656d522-224a-41ac-9839-21bb718d4e43';
            toQuery.appId = '128b85de-0f43-4aac-bed9-33541f84eedb';
            toQuery.curChangeOrg = '5f913c9c-20c6-4183-8f43-1143c733db07';
            next({
                path: to.path,
                query: toQuery
            });
        }else if(a == 2){//T企业管理
            toQuery.userId = 'c656d522-224a-41ac-9839-21bb718d4e43';
            toQuery.appId = 'f5268875-4cce-4a9e-b9fb-9bd8052aa55c';
            toQuery.curChangeOrg = 'b7f12033-634a-4532-a92c-2fd9f362cff9';
            next({
                path: to.path,
                query: toQuery
            });
        }

    }

});

Vue.directive('title', {
    inserted: function (el, binding) {
        document.title = el.dataset.title
    }
});

const defaultTitle = '';
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title ? to.meta.title : defaultTitle
  }
  next()
});
