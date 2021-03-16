<template>
    <div class="main-container">
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label-width="80px">
                    <el-select placeholder="请选择业态类型" :filterable="OperateData.length > 7" clearable class="com-width" size="small" v-model="mainGridTable.param.StoreTypeId" @change="getBasicOptionList">
                        <el-option
                                v-for="item in OperateData"
                                :key="item.LevelCode"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-select placeholder="请选择任务类型" :filterable="BasicData.length > 7" clearable class="com-width" size="small" v-model="mainGridTable.param.TaskTypeId">
                        <el-option
                                v-for="item in BasicData"
                                :key="item.Text"
                                :label="item.Text"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="80px">
                   <el-select class="com-width" size="small" placeholder="请选择任务状态" v-model="mainGridTable.param.SelfTaskStatus" clearable>
                        <el-option label="待发布" :value="0"></el-option>
                        <el-option label="待办" :value="1"></el-option>
                        <el-option label="进行中" :value="2"></el-option>
                        <el-option label="已完成" :value="3"></el-option>
                        <el-option label="未完成" :value="4"></el-option>
                    </el-select>
                </el-form-item>
              
                <el-form-item label-width="80px">
                    <el-input placeholder="请输入任务名称" clearable class="com-width" size="small" v-model="mainGridTable.param.Name"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-date-picker
                            class="com-width"
                            v-model="mainGridTable.param.StartTime"
                            type="date"
                            clearable
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item abel-width="80px">
                    <el-date-picker
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions1"
                            class="com-width"
                            v-model="mainGridTable.param.EndTime"
                            type="date"
                            clearable
                            placeholder="请选择结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-input clearable placeholder="请输入发布人" class="com-width" size="small" v-model="mainGridTable.param.Publisher"></el-input>
                    <el-button type="primary" style="margin-left: 10px" @click="gueryList">查 询</el-button>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" plain @click="openPublishSelfCheckTaskDialog">发布自查任务</el-button>
                    <!-- <el-button type="primary" plain @click="deleteTask">取消任务</el-button> -->
                    <!-- <el-button type="primary" style="margin-left: 10px" plain @click="selfTaskManageSubTaskFailEnd">异常结束</el-button> -->
                    
                 </el-form-item>
            </el-form>
            <!--<div class="el-middle">-->
            <!---->
            <!--</div>-->
        </div>
        <el-table
                v-loading="mainGridTable.Loading"
                :data="mainGridTable.list"
                border
                height="200px"
                fit
                :reserve-selection="isSelection"
                highlight-current-row
                @selection-change="handleSelectionChange"
                class="table">
            <el-table-column align="center" type="index" width="40"></el-table-column>
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[0]" min-width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskStatusStr }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[1]" min-width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.StoreTypeName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[2]" min-width="90px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskTypeName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[3]"  min-width="200px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="linkType" @click="showTaskInfo(scope.row)" v-text="scope.row.Name"></span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[4]" min-width="180px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.Explain }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[5]" min-width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskCompletion }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[6]" min-width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.TaskStatus==0">{{ scope.row.TaskProgress }}</span>
                    <span v-else class="linkType" @click="openSelfResultsDialog(scope.row.Id,scope.row.TaskStatus,scope.row.StartTime.split(' ')[0],scope.row.EndTime.split(' ')[0],scope.row.StoreTypeId)">{{ scope.row.TaskProgress }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[7]" min-width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskTimeProgress }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[8]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.StartTime.split(' ')[0]"></span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[9]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.EndTime.split(' ')[0]"></span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[10]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskSubName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[11]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.SubTime.split(' ')[0]"></span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[12]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="primary" plain @click="delTask(scope.row.TaskStatusStr,scope.row.Id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination ref="pagination" v-show="mainGridTable.total"
                    :total="mainGridTable.total"
                    :page.sync="mainGridTable.param.PageNo"
                    :limit.sync="mainGridTable.param.PageSize"
                    @pagination="gueryList"></pagination>
        <!--自查任务结果-->
        <el-dialog
                class="selfTaskResultDialog"
                title="自查任务结果"
                :visible.sync="selfTaskResultDialog.show"
                :fullscreen="true"
                top="5vh"
                v-if="selfTaskResultDialog.show"
                :close-on-click-modal="false">
            <div style="height: 100%">
                <self-check-task-result :superTaskId="superTaskId" :operateId="operateId" :superTaskStatu="superTaskStatu" :superStartTime="superStartTime" :superEndTime="superEndTime"></self-check-task-result>
            </div>
        </el-dialog>
        <el-dialog
                class="publishSelfCheckTaskDialog"
                :title="taskTitle"
                :visible.sync="publishSelfCheckTaskDialog.show"
                width="65%"
                top="5vh"
                v-if="publishSelfCheckTaskDialog.show"
                @close="publishClose"
                :close-on-click-modal="false">
            <div class="spaDialog">
                <publish-self-check-task :savaTaskInfo="savaTaskInfo" @PublishSelf="PublishSelf" :isShowButton="isShowButton"></publish-self-check-task>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import PublishSelfCheckTask from '@/components/publisSelfCheckTask/publisSelfCheckTask.vue';
    import Pagination from '@/components/Pagination';
    import SelfCheckTaskResult from '@/views/SelfCheckTaskResult/SelfCheckTaskResult.vue';

    export default {
        components: {
            PublishSelfCheckTask,
            Pagination,
            SelfCheckTaskResult
        },
        data() {
            return {
                taskTitle:'发布任务',
                savaTaskInfo: {},//巡查任务Id
                isShowButton:0,
                selectTackId: [],
                OperateData: [],//业态类型
                BasicData: [],//业务类型
                publishSelfCheckTaskDialog: {
                    show: false
                },
                selfTaskResultDialog:{//自查任务结果
                    show: false
                },
                superTaskId:'',//任务id(自查任务结果页用)
                operateId:'',//列表上的单条记录的一级业态Id added by xyt 2019 04 29
                superTaskStatu:'',//任务状态(自查任务结果页用)
                superStartTime:'',//任务开始时间(自查任务结果页用)
                superEndTime:'',//任务结束时间(自查任务结果页用)
                mainGridTable: { //主列表
                    Loading: true,
                    tableHerder: ['任务状态', '经营业态', '任务类型',
                        '任务名称', '任务说明', '完成度', '任务进度',
                        '时间进度', '开始日期', '结束日期',
                        '发布人', '发布日期','操作'],
                    list: null,
                    total: 0,
                    param: {
                        "ProcessType": 1,
                        "StoreTypeId": "",
                        "TaskTypeId": "",   
                        "SelfTaskStatus": '',
                        "SelfTaskName": "",
                        "StartTime": "",
                        "EndTime": "",
                        "Publisher": "",
                        "PageNo": 1,
                        "PageSize": 20
                    }
                },
                pickerOptions1: { //限制结束时间
                    disabledDate: (time) => {
                        let timeStr = new Date(this.mainGridTable.param.StartTime.replace(/-/g, '/'));
                        return time.getTime() < timeStr;
                    }
                },
                isSelection:true,

            }
        },
        created() {
            this.getOperateInfo();
            this.gueryList();
        },
        methods: {
            /**
             * 查询数据
             */
            gueryList() {
                this.$api.QuerySelfManageList(this.mainGridTable.param).then(res => {
                    if (res.IsSuccess) {
                        this.mainGridTable.Loading = false;
                        if(res.Content == null){
                            this.$message({
                                message: '无查询数据',
                                type: 'info',
                                center:true,
                                duration: 1200,
                            });
                            this.mainGridTable.list = [];
                            return;
                        }
                        this.mainGridTable.list = res.Content;
                        this.mainGridTable.total = res.Data;
                    } else {
                        this.$message({
                            message: res.Message,
                            type: 'info',
                            duration: 1200,
                        });
                    }
                    
                }).catch(r=>{
                    this.mainGridTable.Loading = false;
                });
            },
            /**
             * 业态类型
             */
            getOperateInfo() {
                this.$api.GetOperateInfo(1).then(res => {
                    this.OperateData = res;
                    this.getBasicOptionList();

                });
            },
            /**
             * 任务类型
             */
            getBasicOptionList() {
                this.mainGridTable.param.TaskTypeId = '';
                let dataInfo = {
                    "StoreTypeId": this.mainGridTable.param.StoreTypeId,
                    "TaskTypeId": "",
                    "ProcessType": 1,
                    "Type": 1,
                    "PreviousId": ""
                };
                this.$api.GetBasicOptionList(dataInfo).then(res => {
                    if (res.IsSuccess) {
                        this.BasicData = res.Content;
                    }
                });
            },
            /**
             * 删除任务
             */
            handleSelectionChange(selection) {
                this.selectTackId = selection;
            },
            /**
             * 删除任务
             */
            delTask(TaskStatusStr,Id){
                /*if(TaskStatusStr == '进行中' || TaskStatusStr == '未完成' || TaskStatusStr == '已完成'){
                    this.$alert('只能删除待办、待发布状态', '消息提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: action => {
                        }
                    });
                }else{*/
                   this.$confirm('删除当前任务，将会清除掉所有关于这个任务的所有记录，请谨慎删除', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            "TaskId": Id,
                            "ProcessType": 1,//自查1，巡查0
                            "ClientType": 2//客户端类型
                        }
                        this.$api.DeleteTaskData(data).then(res=>{
                            if(res && res.IsSuccess){
                                let _this = this;
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    duration: 1200,
                                    center: true,
                                    onClose(){
                                        _this.gueryList();
                                    }
                                });
                                this.gueryList();
                            }else{
                                this.$message({
                                    message: res.Message,
                                    type: 'error',
                                    duration: 1200,
                                    center: true
                                });
                            }
                        }).catch(error=>{

                        })
                        
                    }) 
                //}
                
                
            },
            /*deleteTask() {
                if (this.selectTackId.length == 0) {
                    this.$alert('请先选择任务', '消息提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                    return false;
                } else {
                    let arr = [];
                    const checkId = [];
                    this.selectTackId.forEach((value, index) => {
                        if (value.TaskStatusStr == '进行中' || value.TaskStatusStr == '未完成' || value.TaskStatusStr == '已完成') {
                            arr.push(value.TaskStatusStr);
                        } else {
                            checkId.push(value.Id);
                        }
                    });
                    if (arr.length > 0) {
                        this.$alert('只能取消待办、待发布状态', '消息提示', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            callback: action => {
                            }
                        });
                    } else {
                        this.$confirm('删除当前任务，将会清除掉所有关于这个任务的所有记录，请谨慎删除', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            
                            this.deletePatrolTaskByIds(checkId);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                center: true,
                                duration: 1200,
                                message: '已取消删除'
                            });          
                        });
                       
                    }
                }
            },*/
            /*deletePatrolTaskByIds(checkId) {
                this.$api.SelfTaskCancel({ids: checkId}).then(res => {
                    if (res.IsSuccess) {
                        let _this = this;
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1200,
                            center: true,
                            onClose(){
                                _this.gueryList();
                            }
                        });
                    } else {
                        this.$message({
                            message: res.Message,
                            type: 'error',
                            duration: 1200,
                            center: true
                        });
                    }
                });
            },*/
            /**
             * 异常结束
             */
            // selfTaskManageSubTaskFailEnd(){
            //     if (this.selectTackId.length == 0) {
            //         this.$alert('请选择数据', '消息提示', {
            //             confirmButtonText: '确定',
            //             callback: action => {

            //             }
            //         });
            //         return false;
            //     } else {
            //         let arr = [];
            //         const checkId = [];
            //         this.selectTackId.forEach((value, index) => {
            //             ;
            //             if (value.TaskStatusStr == '已完成' || value.TaskStatusStr == '异常结束' || value.TaskStatusStr == '待发布') {
            //                 arr.push(value.TaskStatusStr);
            //             } else {
            //                 checkId.push(value.Id);
            //             }
            //         });
            //         if (arr.length > 0) {
            //             this.$alert('只能结束待办、进行中、未完成状态', '消息提示', {
            //                 confirmButtonText: '确定',
            //                 type: 'warning',
            //                 callback: action => {
            //                 }
            //             });
            //         } else {
            //             this.$confirm('确定要异常结束吗？', '提示', {
            //                 confirmButtonText: '确定',
            //                 cancelButtonText: '取消',
            //                 type: 'warning'
            //             }).then(() => {
            //                 this.$api.SelfTaskCancel({ids: checkId}).then(res => {
            //                     let _this = this;
            //                     if (res.IsSuccess) {
            //                         this.$message({
            //                             message: res.Message,
            //                             type: 'scuess',
            //                             duration: 1200,
            //                             center: true,
            //                             onClose(){
            //                                 _this.gueryList();
            //                             }
            //                         });
            //                     } else {
            //                         this.$message({
            //                             message: res.Message,
            //                             type: 'error',
            //                             duration: 1200,
            //                             center: true
            //                         });
            //                     }
            //                 });
                            
            //             }).catch(() => {
            //                 this.$message({
            //                     type: 'info',
            //                     center: true,
            //                     message: '已取消删除'
            //                 });          
            //             });
                       
            //         }

            //     }
            // },
            /**
             * 显示任务详情
             */
            showTaskInfo(row) {
               
                if(row.TaskStatus == 0){
                    this.isShowButton = 1;
                    this.taskTitle = '发布任务';  
                } else if (row.TaskStatus == 1) {
                    this.isShowButton = 2;  
                    this.taskTitle = '任务详情';          
                } else {
                    this.taskTitle = '任务详情';
                    this.isShowButton = 2;
                }
              
                this.$api.GetSelfTaskDetail({selfTaskId: row.Id,appId:this.$utils.getUrlKey("appId")}).then(res => {
                    if (res.IsSuccess) {
                        res.Content.StartTime = res.Content.StartTime.split(' ')[0];
                        res.Content.EndTime = res.Content.EndTime.split(' ')[0];
                        this.savaTaskInfo = res.Content;    
                        this.publishSelfCheckTaskDialog.show = true;
                    } else {
                        this.$message({
                            message: res.Message,
                            type: 'info',

                            duration: 1200,
                            center: true,
                        });
                    }
                   
                });
            },
            /**
             *
             */
            openPublishSelfCheckTaskDialog() {
                this.isShowButton = true;
                this.isShowButton = 0;
                this.taskTitle = '发布任务';  
                this.publishSelfCheckTaskDialog.show = true;
                this.savaTaskInfo = {
                    Frequency: 0,
                    ByMethod: 3,
                    Times: 0,
                    IsOpen:0,
                    FrequencyCompary:2,
                    DayNum:'',
                };
            },
            /**
             * 发布完成
             */
            PublishSelf(flag) {

                if (flag) {
                    this.publishSelfCheckTaskDialog.show = false;
                    localStorage.removeItem('findStoreBytype'+this.$utils.getUrlKey('userId'));
                    this.gueryList();
                }
            },
            replaceDate(str) {
                if (str.indexOf('T') != -1) {

                    return str.substr(0, str.indexOf('T'));
                }
            },
            openSelfResultsDialog(val,status,startTime,endTime,operateId) {
                this.selfTaskResultDialog.show = true;
                this.superTaskId = val;
                this.superTaskStatu = status;
                this.superStartTime = startTime;
                this.superEndTime = endTime;
                this.operateId = operateId;
            },
            publishClose(){
                localStorage.removeItem('findStoreBytype'+this.$utils.getUrlKey('userId'));
            }

        }
    }
</script>
<style scoped type="text/scss" lang='scss'>
    .main-container {
        padding-top: 14px;
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        .el-middle {

            padding-bottom: 10px;
        }

    }

    .el-form--inline .el-form-item {
        margin-bottom: 10px;
    }
    .selfTaskResultDialog .el-dialog{
        height:100% !important;
    }

</style>

<style type="text/scss" lang="scss">
    .selfTaskResultDialog{
        .el-dialog__body{
            height: calc(100vh - 50px);
        }
    }
</style>
