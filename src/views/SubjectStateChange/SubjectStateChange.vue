<template>
    <div class="main-container SubjectStateChange">
            <div style="margin-bottom:12px;">
                <el-form :inline="true">
                    <el-select v-model="conditionValue" placeholder="请选择数据来源" :filterable="conditionList.length > 7" clearable>
                        <el-option v-for="item in conditionList" :key="item.Id" :value="item.Id" :label="item.Name"></el-option>
                    </el-select>
                    <el-button @click="QueryList" type="primary" class="queryBtn">
                        查询
                    </el-button>
                </el-form>
            </div>
            <div>
                <el-table
                        highlight-current-row
                        v-loading="loading"
                        style="width: 100%"
                        border
                        :data="tableList"
                        class="SubjectStateChangeTable">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column property="FieldName" label="条件" min-width="150px" show-overflow-tooltip></el-table-column>
                    <el-table-column property="Remark" label="定义" min-width="150px" show-overflow-tooltip></el-table-column>
                    <el-table-column property="MapDataName" label="数据来源" min-width="150px" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>


    </div>
</template>
<script>
    export default {
        component:{

        },
        data(){
            return {


                params:{
                    "MapDataType":'',
                    "PageNo": 1,
                    "PageSize": 20
                },
                tableList:[
                    {
                        condition:"任务完成累计次数",
                        definition:"子任务完成情况",
                        dataCome:"任务数据"
                    },
                    {
                        condition:"任务完成率",
                        definition:"已完成/预计完成",
                        dataCome:"任务数据"
                    },
                    {
                        condition:"无",
                        definition:"无",
                        dataCome:"任务数据"
                    }
                ],
                conditionList:[

                ],
                conditionValue:'',
                loading:true

            }
        },
        created(){
            this.QueryList();
            this.GetMapDataNames();
        },
        methods:{
            /*
            ** 列表查询
             */
            QueryList(){
                this.params.MapDataType = this.conditionValue;
                this.$api.GetMapStatusList(this.params).then(res =>{
                    this.loading = false;
                    if(res && res.Content && res.Content.length>0){
                        this.tableList = res.Content;
                    }
                }).catch(error =>{

                })
            },
            /*
            ** 数据源
             */
            GetMapDataNames(){
                let data = {
                    'mapType':-1
                }
                this.$api.GetMapDataNames(data).then(res =>{
                    if(res && res.IsSuccess){
                        this.conditionList = res.Content;
                    }
                }).catch(error =>{

                })
            }


        }
    }
</script>


<style type="text/scss" lang="scss" scoped>
    .SubjectStateChange {
		padding: 0;
        @include box(box);
        @include box-orient(vertical);
        .queryBtn{
            margin-left:10px;
        }
    }
    .el-select{
        width:200px;
    }
    .SubjectStateChangeTable{
        height:calc(100vh - 209px)!important;
        overflow:auto;
    }
</style>

