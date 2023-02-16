import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";
import { createRootElement } from "@/createRootElement";

const rootNode = createRootElement();
document.body.appendChild(rootNode);
createApp(App).mount("#app");
