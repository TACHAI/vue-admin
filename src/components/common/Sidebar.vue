<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-people',
                        index: '0',
                        title: '用户管理',
                        subs:[
                            {
                                index: 'user',
                                title: '用户信息管理',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-rank',
                        index: '1',
                        title: '统计报表',
                        subs:[
                            {
                                index: 'report',
                                title: '统计报表',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-news',
                        index: '5',
                        title: '问题管理',
                        subs:[
                            {
                                index: 'unQuestion',
                                title: '未处理问题管理',
                            },
                            {
                                index: 'unQuestion',
                                title: '已处理问题管理',
                            },
                            {
                                index: 'unQuestion',
                                title: '未处理不满意问题',
                            },
                            {
                                index: 'unQuestion',
                                title: '已处理不满意问题管理',
                            },
                            {
                                index: 'unQuestion',
                                title: '消息记录',
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-qrcode',
                        index: '2',
                        title: '知识库后台管理',
                        subs:[
                            {
                                index: 'report',
                                title: '知识库管理',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-hot',
                        index: '4',
                        title: '热门问答管理',
                        subs:[
                            {
                                index: 'report',
                                title: '热门问答管理',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '6',
                        title: '历史操作',
                        subs:[
                            {
                                index: 'optionLog',
                                title: '历史操作',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-file',
                        index: '7',
                        title: '微信资源管理',
                        subs:[
                            {
                                index: 'report',
                                title: '微信图片资源',
                            },
                            {
                                index: 'report',
                                title: '连接管理',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'table',
                        title: '基础表格'
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'tabs',
                        title: 'tab选项卡'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-emoji',
                        index: 'icon',
                        title: '自定义图标'
                    },
                    {
                        icon: 'el-icon-lx-favor',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表',
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
