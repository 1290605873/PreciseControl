<template>
    <div class="checkItemLibrary">
        <el-tabs style="height:100%" type="border-card" ref="topTabs" id="topTabs" @tab-click="topTabsClick" v-model="topTabs.code">
            <el-tab-pane v-for="tabitem in topTabs.datas" :key="tabitem.Id" :label="tabitem.Name" :name="tabitem.Id"></el-tab-pane>
            <div>
                <div>
                    <el-tabs v-model="taskTabs.code" @tab-click="taskTabsClick">
                        <el-tab-pane v-for="taskItem in taskTabs.datas" :key="taskItem.Id" :label="taskItem.Text" :name="taskItem.Id"></el-tab-pane>
                    </el-tabs>
                </div>
                <el-container>
                    <el-main class="right">
                        <!-- <div class="tableheaderbac">
                            <span class="tableOper">
                            </span>
                        </div> -->  
                <div class="addbutton" style="margin-bottom: 10px;">
                                <el-button class="btn" type="primary" plain @click="centerDialogVisible = true;businessName = '';IsDefault = true;topTabs.Id = '';title = '添加';">添加</el-button>
                    <!-- <el-button type="primary" plain @click="addview">添加</el-button> -->
                </div>                                             
                        <el-table
                                :data="tableGrid"
                                border
                                highlight-current-row
                                class="main-table"
                                ref="table"
                                id="table"
                                height="100%"
                                @selection-change="">
                            <el-table-column type="index" align="" label="序号" width="50">
                            </el-table-column>
                            <el-table-column property="Text" label="标题" align="" width="">
                            </el-table-column>
                            <el-table-column property="IsDefault" label="是否默认值" align="" width="">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.IsDefault">是</span>
                                    <span v-if="!scope.row.IsDefault">否</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="" label="操作" width="">
                                <!-- <template slot="header"   slot-scope="scope">
                                    <div style="text-align: right !important;width: 100%">
                                        <el-button plain class="" type="primary" @click="centerDialogVisible = true;businessName = '';IsDefault = true;topTabs.Id = '';">添加</el-button>
                                    </div>
                                </template>   -->                             
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="modifyEById(scope.$index)">
                                        修改
                                    </el-button>
                                    <el-button size="mini" type="danger" @click="DelEByIds(scope.$index)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="pageNation.total>0" :total="pageNation.total" :page.sync="pageNation.pageNum"
                            :limit.sync="pageNation.countPerPage" class="main-bottom" id="main-bottom" />
                    </el-main>
                    <el-dialog :title="title" :visible.sync="centerDialogVisible" :close-on-click-modal="false" width="25%">
                        <span style="display: flex;margin-bottom: 10px;">
                            <label for="" style="width: 80px;line-height: 32px;text-align: right;margin-right: 5px;">名称:</label>
                            <el-input clearable v-model="businessName" style="width: 200px;" @input.native="changeCode" maxlength="20" placeholder="最多可输入20个汉字"></el-input>
                        </span>
                        <span style="display: flex;">
                            <label for="" style="width: 80px;line-height: 32px;text-align: right;margin-right: 5px;">是否默认值:</label>
                            <!-- <el-input v-model="IsDefault"></el-input> -->
                            <el-radio v-model="IsDefault" :label="true" style="line-height: 32px;">是</el-radio>
                            <el-radio v-model="IsDefault" :label="false" style="line-height: 32px;">否</el-radio>
                        </span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="centerDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="Preservation()">确 定</el-button>
                        </span>
                    </el-dialog>
                </el-container>
            </div>
        </el-tabs>


    </div>
</template>
<script>
    import Pagination from "@/components/Pagination";
export default {
    components: {
        Pagination,
    },
    data() {
        return {
            topTabs: {//顶部业态
                //业态
                datas: [],
                code: "", //当前业态值
                Id:""
            },
            taskTabs: {//业态下的任务
                code: "0", //当前值
                datas: [
                    {
                        Id: "0",
                        Text: "巡查执法",
                    },
                    {
                        Id: "1",
                        Text: "自改自查",
                    },
                ],
                currentCode:'0'//当前所在
            }, 
            tableGrid: [],  
            pageNation: {//分页
                total: 0,
                pageNum: 1,//页数
                countPerPage: 100//每页数
            },
            businessName:'',//名称
            IsDefault:true,//是否默认值
            centerDialogVisible:false,
            title:'添加',
        }
    },
    created: function(){
      this.getOperateInfo();
      
    },
    methods: {
        topTabsClick(tab) {
            console.log(tab.name)
            this.topTabs.code = tab.name;
            this.getBasicOptionList();
        },
        getOperateInfo() {//获取一级业态
                this.$api.GetOperateInfo(1).then(res => {
                    if (res) {
                        this.topTabs.datas = res;
                        if (res.length > 0) {
                            this.topTabs.code = res[0].Id;
                            this.getBasicOptionList();
                        }
                    }
                }).catch(r => {
                });
        },
        taskTabsClick(tab){
            this.taskTabs.code = tab.name;
            this.getBasicOptionList();
        },
        Preservation(){
            if(this.businessName){
                let data = {
                    "Id":this.topTabs.Id,
                    "StoreTypeId":this.topTabs.code,
                    "ProcessType":Number(this.taskTabs.code),
                    "Type":7,
                    "Text":this.businessName,
                    "IsDefault":this.IsDefault
                }
                this.$api.SaveBasicOption(data).then(
                    res => {
                        if(res.IsSuccess){
                            this.tableGrid = [];
                            this.getBasicOptionList();
                            this.centerDialogVisible = false;
                            this.message("操作成功",1)
                        }else{
                            this.message(res.Message,-1)
                        }
                    }
                )
            }else{
                this.message("名称不可为空",2)
            }
        },
//         //获取二级任务
//         getTaskTyp() {
//             // console.log(this.operationlist.code)
//             let data = {
//                 "StoreTypeId":"91025d9d-733a-42fa-a8ae-93cddea3fc02",
//                 "TaskTypeId":"08ae6494-07d3-41c4-a172-82da5f6556cc",
//                 "ProcessType":0,
//                 "Type":1,
//                 // "PreviousId":"",
//             }            
//             this.$api.GetBasicOptionList(data).then(
//                 res => {
//                     this.taskTabs.datas = res.Content;
//                     this.taskTabs.Name = res.Content[0].Text;
//                     this.taskTabs.code = res.Content[0].Id;
//                     console.log(this.taskTabs.Name);
//                     // this.getchecklist();
//                 }
//             )
//         },     
        getBasicOptionList() {
            let data = {
                "StoreTypeId":this.topTabs.code,
                // "TaskTypeId":"08ae6494-07d3-41c4-a172-82da5f6556cc",
                "ProcessType":this.taskTabs.code,
                "Type":7,
            }
            this.$api.GetBasicOptionList(data).then(
                res => {
                    this.tableGrid = res.Content;
                }
            )
        },
        DelEByIds(rows) {
            let data = {
                "Id":this.tableGrid[rows].Id
            }
                this.$confirm('删除后影响已经配置的业务，确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.DelBasicOption(data).then(res => {
                        if(res.IsSuccess){
                            this.message(res.Message==null||res.Message==''?'删除成功':res.Message,1)
                            this.getBasicOptionList();
                        }else{
                            this.message(res.Message==null||res.Message==''?'删除失败':res.Message,-1)
                        }
                    }).catch(error => {
                    });
                }).catch(() => {
                });                     
        },
        modifyEById(rows){
            this.title = '修改';
            this.centerDialogVisible = true;
            this.businessName = this.tableGrid[rows].Text;
            this.IsDefault = this.tableGrid[rows].IsDefault;
            this.topTabs.Id = this.tableGrid[rows].Id;
        },
        changeCode() {  
          this.$nextTick(() => {
            if(this.businessName !== ''){
              this.businessName = this.businessName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g,'')
            }
          })
        },
    }
}
</script>
<style type="text/scss" lang="scss" scoped>
    .checkItemLibrary {
        height: 100%;
        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color: $defaultColor;
        }

        .left {
            height: calc(100vh - 124px);
            position: relative;
            overflow: hidden;
        }
        .right {
            width: 100%;
            height: calc(100vh - 124px);
            @include box(box);
            @include box-orient(vertical);
        }
//         .btn {
//             background-color: rgb(236, 245, 255);
//             border-radius: 4px;
//             border: 1px solid rgb(179, 216, 255);
//             color: rgb(64, 158, 255);
//             cursor: pointer;
//             display: inline-block;
//             font-size: 14px;
//             font-weight: 500;
//             height: 34px;
//             line-height: 14px;
//             margin-bottom: 0px;
//             margin-left: 10px;
//             margin-right: 10px;
//             margin-top: 0px;
//             padding-bottom: 9px;
//             padding-left: 20px;
//             padding-right: 20px;
//             padding-top: 9px;
//             text-align: center;
//             white-space: nowrap;
//             width: 126px;
//         }
        .pre-lable {
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 14px;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            width: 82px;
        }
        .tableheaderbac {
            padding: 10px 10px;

        }

        .tableOper {
            float: right;
        }

        .middleVertical {
            height: 40px;
            line-height: 40px;
            display: inline-block;
        }
        .el-main {
            padding: 0 20px
        }
    }
</style>
<style lang="scss" type="text/scss">
    .checkItemLibrary {
        .el-aside {
            text-align: center;
            border: 1px solid $defaultColor;
        }
        .el-table thead{
            color: #666666;
        }
    }

</style>
