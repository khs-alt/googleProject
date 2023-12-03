import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router"
//import axios from 'axios'
createApp(App).use(router).mount('#app');

// // Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// axios.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         if (error.response.status === 401) {
//             // 사용자를 로그인 페이지로 리디렉션
//             router.push(process.env.BASE_URL);
//         }
//         return Promise.reject(error);
//     }
// );