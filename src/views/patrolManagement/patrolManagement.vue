<template>
    <div class="main-container">
        <div class="pageLoading"></div>
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label-width="80px">
                    <el-select class="com-width" size="small" :filterable="OperateData.length > 7" placeholder="请选择业态类型" v-model="mainGridTable.param.StoreTypeId" @change="getBasicOptionList" clearable>
                        <el-option
                                v-for="item in OperateData"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-select class="com-width" size="small" :filterable="BasicData.length > 7" placeholder="请选择任务类型" v-model="mainGridTable.param.TaskTypeId" clearable>
                        <el-option
                                v-for="item in BasicData"
                                :key="item.Id"
                                :label="item.Text"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-select class="com-width" size="small" placeholder="请选择任务状态" v-model="mainGridTable.param.TaskStatus" clearable>
                        <el-option label="待发布" :value="0"></el-option>
                        <el-option label="待办" :value="1"></el-option>
                        <el-option label="进行中" :value="2"></el-option>
                        <el-option label="已完成" :value="3"></el-option>
                        <el-option label="未完成" :value="4"></el-option>
                    </el-select>
                </el-form-item>       
                <el-form-item label-width="80px">
                    <el-input class="com-width" size="small" placeholder="请选择任务名称" v-model="mainGridTable.param.Name" clearable></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-date-picker
                            value-format="yyyy-MM-dd"
                            class="com-width"
                            placeholder="请选择开始时间"
                            v-model="mainGridTable.param.StartTime"
                            type="date"
                            clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-date-picker
                            placeholder="请选择结束时间"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions1"
                            class="com-width"
                            v-model="mainGridTable.param.EndTime"
                            type="date"
                            clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-input clearable placeholder="请填写发布人" class="com-width" size="small" v-model="mainGridTable.param.Publisher"></el-input>
                </el-form-item>
              
                <!-- <el-form-item label="责任主体">
                    <el-input clearable placeholder class="com-width" size="small" v-model="mainGridTable.param.DutyBody" readonly></el-input>
                </el-form-item>
                <el-form-item label="责任人" label-width="80px">
                    <el-input clearable placeholder class="com-width" size="small" v-model="mainGridTable.param.Dutyer" readonly></el-input>
                </el-form-item> -->
                <el-form-item>
                     
                            
                    <!-- <el-button type="primary" style="margin-left: 10px" plain @click="selfTaskManageSubTaskFailEnd">异常结束</el-button> -->
                
                    <el-button type="primary" @click="gueryList">查 询</el-button>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" plain @click="openPublishSelfCheckTaskDialog">发布巡查任务</el-button>      
                    <!-- <el-button type="primary" plain @click="deleteTask">删除任务</el-button>  -->   
                </el-form-item>
            </el-form>
        </div>
        <el-table
                v-loading="mainGridTable.Loading"
                :data="mainGridTable.list"
                border
                height="200px"
                fit
                @selection-change="handleSelectionChange"
                highlight-current-row
                class="table">
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[0]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskStatusStr }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[1]" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.StoreTypeName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[2]" min-width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskTypeName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[3]" min-width="180px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="linkType" type="text" @click="showTaskInfo(scope.row)">{{ scope.row.Name }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[4]" min-width="180px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.Explain }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[5]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskCompletion }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[6]" min-width="90px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.TaskStatus==0" @click="openPatrolResults(scope.row)">{{ scope.row.TaskProgress }}</span>
                    <span class="linkType" v-else @click="openPatrolResults(scope.row)">{{ scope.row.TaskProgress }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[7]" min-width="90px" show-overflow-tooltip>
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
            <!-- <el-table-column :label="mainGridTable.tableHerder[10]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.cell[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[11]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.cell[0] }}</span>
                </template>
            </el-table-column> -->
            <el-table-column :label="mainGridTable.tableHerder[12]" min-width="100px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.TaskSubName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="mainGridTable.tableHerder[13]" min-width="110px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-text="scope.row.SubTime.split(' ')[0]"></span>
                </template>
            </el-table-column>
            <el-table-column  :label="mainGridTable.tableHerder[14]" min-width="100px" show-overflow-tooltip>
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
        <!--任务发布-->
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
                <publis-patrol-task :savaTaskInfo="savaTaskInfo" :isShowButton="isShowButton" @publish="publish"></publis-patrol-task>
            </div>
        </el-dialog>
        <!--任务结果-->
        <el-dialog
                class="patrol_taskresult_dialog"
                title="任务结果"
                :visible.sync="PatrolResults"
                width="100%"
                fullscreen
                top="5vh"
                v-if="PatrolResults">
            <div style="height: 100%" >
                <patrol-results :operateId="operateId"></patrol-results>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import publisPatrolTask from '@/components/publisPatrolTask/publisPatrolTask.vue';
    import Pagination from '@/components/Pagination';
    import PatrolResults from '@/views/PatrolResults/PatrolResults.vue';

    export default {
        components: {
            publisPatrolTask,
            Pagination,
            PatrolResults
        },
        data() {
            return {
                taskTitle:'发布任务',
                savaTaskInfo: {},//任务详情数据
                isShowButton:0,//是否显示发布保存
                selectTackId: [],
                OperateData: [],//业态类型
                BasicData: [],//业务类型
                publishSelfCheckTaskDialog: {
                    show: false
                },
                PatrolResults: false,
                operateId:'',//列表任务上的业态 added by xyt 2019 04 29 ；追加门店的业态 应该来源于此
                mainGridTable: { //主列表
                    Loading: true,
                    tableHerder: ['任务状态', '经营业态', '任务类型', '任务名称', '任务说明',
                        '任务完成度', '任务进度', '时间进度', '开始日期', '结束日期',
                        '责任主体', '责任人', '发布人', '发布日期','操作'],
                    list: null,
                    total: 0,
                    param: {
                        Name: "",
                        StoreTypeId: "",
                        TaskTypeId: "",
                        TaskStatus:"",
                        ProcessType: 0,
                        StartTime: "",
                        EndTime: "",
                        CheckNums: '',
                        Publisher: "",
                        DutyBody: "",
                        Dutyer: "",
                        PageNo: 1,
                        PageSize: 20
                    }
                },
                TaskResult: {

                },
                pickerOptions1: { //限制结束时间
                    disabledDate: (time) => {
                        if(this.mainGridTable.param.StartTime!='' || this.mainGridTable.param.StartTime != undefined){
                            let timeStr = new Date(this.mainGridTable.param.StartTime.replace(/-/g, '/'));
                            return time.getTime() < timeStr; 
                        }
                      
                    }
                }
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
                this.$api.QueryList(this.mainGridTable.param).then(res => {
                    if (res.IsSuccess) {
                        // res.Content.forEach(element => {
                        //     if (element.ProcessType == 0) {
                        //         element.ProcessTypeValue = '巡查';
                        //     } else if (element.ProcessType == 1) {
                        //         element.ProcessTypeValue = '自查';
                        //     } else if (element.ProcessType == 2) {
                        //         element.ProcessTypeValue = '双随机';
                        //     }
                        // });
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
                        this.mainGridTable.Loading = false;
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
                    "ProcessType": 0,
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
                            "ProcessType": 0,//自查1，巡查0
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
                    let checkId = [];
                    this.selectTackId.forEach((value, index) => {

                        if (value.TaskStatusStr == '进行中' || value.TaskStatusStr == '未完成' || value.TaskStatusStr == '已完成') {
                            arr.push(value.TaskStatusStr);
                        } else {
                            checkId.push(value.Id);
                        }
                    });
                    if (arr.length > 0) {
                        this.$alert('只能删除待办、待发布状态', '消息提示', {
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
            },
            deletePatrolTaskByIds(checkId) {

                this.$api.DeletePatrolTaskByIds({ids: checkId}).then(res => {
                    if (res.IsSuccess) {
                        let _this = this;
                        this.$message({
                            message: res.Message,
                            type: 'success',
                            duration: 1200,
                            center: true,
                            onClose(){
                                 _this.gueryList();
                            }
                        });
                        this.gueryList();
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
            /* 异常结束
             */
            // selfTaskManageSubTaskFailEnd(){
            //     if (this.selectTackId.length == 0) {
            //         this.$alert('请选择数据', '消息提示', {
            //             confirmButtonText: '确定',
            //             callback: action => {}
            //         });
            //         return false;
            //     } else {
            //         let arr = [];
            //         const checkId = [];
            //         this.selectTackId.forEach((value, index) => {
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
                this.$api.GetPatrolTaskDetail({taskId: row.Id,appId:this.$utils.getUrlKey("appId")}).then(res => {
                    if (res.IsSuccess) {
                        res.Content.StartTime = res.Content.StartTime.split(' ')[0];
                        res.Content.EndTime = res.Content.EndTime.split(' ')[0];
                        this.savaTaskInfo = res.Content;
                        this.publishSelfCheckTaskDialog.show = true;
                    }else {
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
                this.publishSelfCheckTaskDialog.show = true;
                this.isShowButton = 0;
                this.taskTitle = '发布任务';  
                this.savaTaskInfo = {
                    Frequency: 0,
                    FrequencyCompary: 1,
                    ByMethod: 1,
                    Times: 0,
                    Contents:[],
                    TaskTargets:[]
                };
                //新发布任务 数据清空
               // this.savaTaskInfo = {};

            },
            publish(flag) {
                if (flag) {
                    this.publishSelfCheckTaskDialog.show = false;
                    this.gueryList();
                }
            },
            /**
             * 任务结果
             */
            openPatrolResults(row) {
                this.$store.dispatch('addTaskInfo', row);
                this.PatrolResults = true;
                this.operateId = row.StoreTypeId;
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

</style>

<style type="text/scss" lang="scss">
    .patrol_taskresult_dialog{
        .el-dialog__body{
            height: calc(100vh - 50px);
        }
    }
</style>
