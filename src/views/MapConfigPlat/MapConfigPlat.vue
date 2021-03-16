<template>
    <div class="mapConfigPlat ">
        <el-tabs v-model="currentView">
            <!-- <el-tab-pane label="数据规则定义" name="SubjectStateChange"></el-tab-pane> -->
            <el-tab-pane label="地图名称配置" name="MapNameConfiguration"></el-tab-pane>
            <el-tab-pane label="地图主体配置" name="MapMain"></el-tab-pane>
            <el-tab-pane label="地图分类配置" name="MapClass"></el-tab-pane>
            <el-tab-pane label="特殊事件配置" name="SpecialEvent"></el-tab-pane>
        </el-tabs>
        <div>
            <MapNameConfiguration :is="currentView" keep-alive/>
        </div>
    </div>
</template>

<script>
    export default {
        components:{
            MapNameConfiguration: resolve => {
                require(['../MapNameConfiguration/MapNameConfiguration.vue'], resolve)
            },
            MapClass: resolve => {
                require(['../MapClass/MapClass.vue'], resolve)
            },
            // SubjectStateChange: resolve => {
            //     require(['../SubjectStateChange/SubjectStateChange.vue'], resolve)
            // },
            MapMain: resolve => {
                require(['../MapMain/MapMain.vue'], resolve)
            },
            SpecialEvent: resolve => {
                require(['../SpecialEvent/SpecialEvent.vue'], resolve)
            },
        },
        data() {
            return {
                MapNameConfiguration:"MapNameConfiguration",
                MapClass:"MapClass",
                // SubjectStateChange:"SubjectStateChange",
                MapMain:"MapMain",
                SpecialEvent:"SpecialEvent",
                currentView: 'MapNameConfiguration', //默认选中子组件
                isviewDetails: true,
            };
        },
        methods: {

        }
    };
</script>


<style type="text/scss" lang="scss" scoped>
    .mapConfigPlat {
        padding:0;
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        .el-middle {
            padding-bottom: 10px;
        }

    }
</style>
<style lang="scss" type="text/scss">
   
</style>
