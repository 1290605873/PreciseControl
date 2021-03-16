<template>
    <div class="mapConfigPlat ">
        <el-tabs v-model="currentView">
            <el-tab-pane label="数据源规则" name="DataSourceRule"></el-tab-pane>
            <el-tab-pane label="筛选模板设置" name="FilterTemplateSettings"></el-tab-pane>
        </el-tabs>
        <div>
            <MapNameConfiguration :is="currentView" keep-alive/>
        </div>
    </div>
</template>

<script>
    export default {
        components:{
            DataSourceRule: resolve => {
                require(['../DataSourceRule/DataSourceRule.vue'], resolve)
            },
            FilterTemplateSettings: resolve => {
                require(['../FilterTemplateSettings/FilterTemplateSettings.vue'], resolve)
            },
        },
        data() {
            return {
                DataSourceRule:"DataSourceRule",
                FilterTemplateSettings:"FilterTemplateSettings",
                currentView: 'DataSourceRule', //默认选中子组件
                isviewDetails: true,
            };
        },
        methods: {

        }
    };
</script>


<style type="text/scss" lang="scss" scoped>
    .mapConfigPlat {
        padding-top: 14px;
        padding-left:20px;
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
		padding: 0;
        .el-middle {
            padding-bottom: 10px;
        }

    }
</style>
<style lang="scss" type="text/scss">
   
</style>
