import "./assets/main.css";
import AntDesign from "ant-design-vue";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(AntDesign);
app.use(router);

app.mount("#app");
