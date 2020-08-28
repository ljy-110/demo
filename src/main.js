// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";
// 导入全局样式表
import "./assets/css/global.css";
import "element-ui/lib/theme-chalk/index.css";
import less from "less";
import './utils/flexible'
import { Button,Form,FormItem,Input,Message,Table,TableColumn,Dialog} from "element-ui";
Vue.use(Button).use(Form).use(FormItem).use(Input).use(Table).use(TableColumn).use(Dialog);
Vue.use(less);

// 全局导入使用 弹框提示组件
Vue.prototype.$message = Message;

// 配置请求的根路径
axios.defaults.baseURL = "http://192.168.101.141:8080/";
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  axios,
  components: { App },
  template: "<App/>"
});
