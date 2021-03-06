import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import timeUtil from './assets/js/util.js'

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.timeUtil = timeUtil
Vue.use(preview)

// 设置baseurl
Vue.prototype.$axios = axios.create(
    {
        // baseURL: 'http://40.73.102.21/',
        publicPath: 'http://localhost:9080/',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        withCredentials: true, // 默认为false 不带cookie

    }
)

Vue.prototype.$axio = axios.create(
    {
        // baseURL: 'http://40.73.102.21/',
        publicPath: 'http://localhost:9080/',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        withCredentials: false, // 默认为false 不带cookie

    }
)

Vue.prototype.$axioBaidu = axios.create(
    {
        // baseURL: 'http://40.73.102.21/',
        baseURL: 'http://localhost:9080/',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        withCredentials: true, // 默认为false 不带cookie

    }
)

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')