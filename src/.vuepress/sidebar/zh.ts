import {sidebar} from "vuepress-theme-hope";

export const zhSidebar = sidebar({
    "/interview/mysql/": [
        {
            icon: "discover",
            collapsible: true,
            text: "数据库 - Mysql",
            link: "/interview/mysql/",
            children: [
                'mysql-basic',
                'mysql-index'
            ],
        },
    ],
    "/interview/java/": [
        {
            icon: "discover",
            collapsible: true,
            text: "Java 基础",
            link: "java-basic-oop/",
            children: [
                'java-basic-oop',
                'java-basic-exception',
                'java-basic-normal',
                'java-design'
            ],
        },
        {
            icon: "discover",
            collapsible: true,
            text: "Java 集合框架",
            prefix: "collection/",
            link: "collection/",
            children: [
                'java-list',
                'java-list-arraylist',
                'java-map',
                'java-map-hashmap',
                'java-set',
                'java-set-hashset'
            ],
        },
    ],

    "/experience/internet/": [
        {
            icon: "discover",
            collapsible: true,
            text: "网络相关",
            link: "/experience/internet/",
            children: [
                'certificate'
            ],
        },
    ],
    "/zh/": [
        "",
        {
            icon: "discover",
            text: "案例",
            prefix: "demo/",
            link: "demo/",
            children: "structure",
        },
        {
            text: "文档",
            icon: "note",
            prefix: "guide/",
            children: "structure",
        }
    ],
});
