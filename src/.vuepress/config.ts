import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {searchProPlugin} from "vuepress-plugin-search-pro";

export default defineUserConfig({
    base: "/",

    locales: {
        "/": {
            lang: "zh-CN",
            title: "文档演示",
            description: "vuepress-theme-hope 的文档演示",
        }
    },
    theme,
    // Enable it with pwa
    // shouldPrefetch: false,
    plugins: [
    ],
});
