<template>
    <div class="selfCheckTaskResult main-container">
        <div>
            <el-form ref="form" class="demo-form-inline" :inline="true">
                <regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
                <el-form-item label="" label-width="80px">
                    <el-input class="searchInput" size="small" clearable v-model="Name" placeholder="任务名称"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-select class="searchSelect" size="small" :filterable="taskStatusList.length > 7" clearable
                               v-model="taskStatusValue" placeholder="任务状态">
                        <el-option v-for="item in taskStatusList" :key="item.value" :label="item.value"
                                   :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="80px" style="display: none">
                    <el-select class="searchSelect" size="small" :filterable="taskTypeList.length > 7" clearable
                               v-model="taskType" placeholder="任务类型" @change="changetaskType">
                        <el-option v-for="item in taskTypeList" :key="item.value" :label="item.Text"
                                   :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-input class="searchInput" size="small" clearable v-model="storeName"
                              placeholder="门店名称"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-input class="searchInput" size="small" clearable v-model="companyName"
                              placeholder="单位名称"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-select class="searchSelect" size="small" :filterable="operateStatusList.length > 7" clearable
                               v-model="operateStatus" placeholder="经营业态" @change="changeOperateStatus"
                               style="display: none">
                        <el-option v-for="item in operateStatusList" :key="item.Id" :label="item.Name" :value="item.Id">
                            {{item.Name}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-select class="searchInput" size="small" :filterable="selfCheckResultList.length > 7" clearable
                               v-model="selfCheckResultValue" placeholder="自查结果">
                        <el-option v-for="item in selfCheckResultList" :key="item.label" :label="item.value"
                                   :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-date-picker
                            class="searchInput"
                            v-model="topPageValue"
                            type="date"
                            placeholder="开始日期"
                            value-format="yyyy-MM-dd"
                            size="small"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-date-picker
                            class="searchInput"
                            v-model="endPageValue"
                            type="date"
                            placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="endPageValueLimit"
                            size="small">
                    </el-date-picker>
                    <el-button type='primary' @click="queryTask(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="buttons">
            <el-button type="primary" plain @click="addStore">追加门店</el-button>
            <el-button type="primary" plain @click="selfCheckCancel">取消</el-button>
            <el-button type="primary" plain @click="selfCheckSelfTaskFailEnd">异常结束</el-button>
            <el-button type="primary" plain @click="DerivedData">导出数据</el-button>
        </div>
        <el-dialog
                class="addStoreDialog"
                title="追加门店"
                :visible.sync="addStoreDialog.show"
                width="65%"
                top="10vh"
                :append-to-body="true"
                :close-on-click-modal="false"
                v-if="addStoreDialog.show">
            <div class="maxDialog" style="padding-bottom: 10px">
                <choose-store @storesResult="storesResult"
                              :OperateId="operateId"
                              :ProcessType="ProcessType"
                ></choose-store>
            </div>
        </el-dialog>
        <el-table
                :data="datas"
                border
                highlight-current-row
                :height="150"
                fit
                ref="grid"
                style="width: 100%;margin-top: 10px"
                @selection-change="changeFun">
            <el-table-column align="left" type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="40" align="left"></el-table-column>
            <el-table-column :label="column.taskStatus" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{scope.row.TaskStatusStr }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.taskType" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{scope.row.TaskTypeName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.taskName" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{scope.row.Name  }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.storeName" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{scope.row.StoreName  }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.status" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.StoreTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.communities" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.CommunityName}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.startTime" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{  /\d{4}-\d{1,2}-\d{1,2}/g.exec(scope.row.StartTime).join()}}</span>

                </template>
            </el-table-column>
            <el-table-column :label="column.endTime" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{ /\d{4}-\d{1,2}-\d{1,2}/g.exec(scope.row.EndTime).join()}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.selfCheckTime" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.SelfCheckTime}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column :label="column.selfCheckMan" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                                <span>{{ scope.row.SelfChecker}}</span>
                </template>
            </el-table-column> -->
            <el-table-column :label="column.selfCheckResult" show-overflow-tooltip align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.TaskStatus == 3">{{ scope.row.SelfCheckResult}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="left" show-overflow-tooltip width="500px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain ref="modify"
                               @click="modifyTask(scope.row.TaskStatus,scope.row.Id,scope.row.StoreId,scope.row.TaskId,)">
                        调整
                    </el-button>
                    <el-button size="mini" type="primary" plain ref="supervise"
                               @click="Supervise(scope.row.IsSupervised,scope.$index,scope.row.Id,scope.row.StoreId,scope.row.TaskId,scope.row.TaskStatus)"
                               :disabled="scope.row.Is">督办
                    </el-button>
                    <!-- 非进行中的置灰 -->
                    <el-button size="mini" type="primary" plain
                               @click="selfCheckSubTaskCancel(scope.row.Id,scope.row.TaskStatus)">取消
                    </el-button>

                    <el-button size="mini" type="primary" plain
                               @click="selfCheckHistoryEvent(scope.row.Name,scope.row.StoreId)">历史任务
                    </el-button>
                    <el-button size="mini" type="primary" plain
                               @click="selfCheckDetailDialog(scope.row.TaskStatus,scope.row.Name,scope.row.Id)">查看详情
                    </el-button>
                    <el-button size="mini" type="primary" ref="endButton" plain :disabled="scope.row.able"
                               @click="selfCheckSubTaskFailEnd(scope.row.Id,scope.row.TaskStatus)">异常结束
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 调整弹框 -->
        <el-dialog
                class="publishSelfCheckTaskDialog"
                title="调整"
                :visible.sync="modifyTaskDialog.show"
                width="300px"
                top="20vh"
                :append-to-body="true"
                :close-on-click-modal="false">
            <div class="minDialog">
                <div class="block">
                    <span class="demonstration">开始日期: </span>
                    <el-date-picker
                            v-model="startTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions0"
                            @change="Timechange()"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div class="block">
                    <span class="demonstration">结束日期: </span>
                    <el-date-picker
                            v-model="endTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions1"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="modifyTaskDialog.show = false">取消</el-button>
				<el-button type="primary" style="margin-left: 20px" @click="ClosemodifyTaskDialog">保存</el-button>
			</span>
        </el-dialog>
        <!-- 调整弹框 end-->

        <!-- 历史任务 -->
        <el-dialog
                class="selfCheckHistoryDialog"
                title="历史任务"
                :visible.sync="selfCheckHistoryDialog.show"
                width="60%"
                top="6vh"
                :append-to-body="true"
                :close-on-click-modal="false"
                v-if="selfCheckHistoryDialog.show"
        >
            <div class="maxHistoryDialog" style="padding-bottom: 10px">
                <self-check-history :StoreTypeId="operateStatus" :StoreId="storeId"></self-check-history>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="selfCheckHistoryDialog.show = false">取消</el-button>
				<el-button type="primary" style="margin-left: 20px"
                           @click="selfCheckHistoryDialog.show = false">保存</el-button>
			</span>
        </el-dialog>
        <!-- 历史任务 end -->

        <!-- 任务执行详情 -->
        <el-dialog
                class="selfDetailDialog"
                title="任务详情"
                :visible.sync="selfDetailDialog.show"
                width="60%"
                top="10vh"
                ref="selfDetailDialog"
                :append-to-body="true"
                :close-on-click-modal="false">
            <div class="maxDialog" style="padding-bottom: 10px;">
                <task-execution-detail v-if="selfDetailDialog.show" :taskName="taskNameSub" :taskId="taskIdSub"
                                       :TaskStatus="DetailTaskStatus"></task-execution-detail>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selfDetailDialog.show = false">取消</el-button>
                <el-button type="primary" style="margin-left:20px;" @click="selfDetailDialog.show = false">保存</el-button>
            </span>
        </el-dialog>
	
        <!-- 任务执行详情 end -->
        <pagination ref="pagination" v-show="pageNation.total"
                    :total="pageNation.total"
                    :page.sync="pageNation.pageNum"
                    :limit.sync="pageNation.countPerPage"
                    @pagination="onPageNation">
        </pagination>
    </div>
</template>
<script>
    import Regionalism from '@/components/Regionalism.vue';
    import Pagination from '../../components/Pagination';
    import selfCheckHistory from '../../components/selfCheckHistory/selfCheckHistory';
    import TaskExecutionDetail from '../../components/TaskExecutionDetail/TaskExecutionDetail';
    import ChooseStore from '../../components/ChooseStore/ChooseStore';

    export default {
        components: {
            Regionalism,
            Pagination,
            selfCheckHistory,
            TaskExecutionDetail,
            ChooseStore
        },
        props: {
            superTaskId: { //主任务id
                type: String,
                default: ""
            },
            superTaskStatu: { //主任务状态
                type: Number,
            },
            superStartTime: { //主任务开始时间
                type: String,
                default: ""
            },
            superEndTime: { //主任务结束时间
                type: String,
                default: ""
            },
            operateId: {//一级业态ID
                type: String,
                default: ''
            }
        },
        data() {
            return {
                areaDatas: '',
                datas: [],
				playerOptions: {},
				DetailsPage:true,
                column: {
                    taskStatus: '任务状态',
                    taskType: '任务类型',
                    taskName: '任务名称',
                    storeName: '单位名称',
                    status: '经营业态',
                    communities: '所属社区',
                    startTime: '开始日期',
                    endTime: '结束日期',
                    selfCheckTime: '自查时间',
                    selfCheckMan: '食品安全管理员',
                    selfCheckResult: '自查结果'

                },
                taskType: '',//任务类型
                taskTypeList: [],
                taskName: '',
                taskStatusValue: '',//任务状态
                Name: '',//任务名称
                storeName: '',
                companyName: '',
                operateStatus: '',//经营业态
                operateStatusList: [],
                taskStatusList: [////任务状态
                    {
                        label: 1,
                        value: '待办'
                    },
                    {
                        label: 2,
                        value: '进行中'
                    },
                    {
                        label: 3,
                        value: '已完成'
                    },
                    {
                        label: 4,
                        value: '未完成'
                    },
                    {
                        label: 5,
                        value: '异常结束'
                    },
                ],
                selfCheckResultValue: '',//自查结果
                selfCheckResultList: [//自查结果值
                    {
                        label: 1,
                        value: '合格'
                    },
                    {
                        label: 2,
                        value: '不合格'
                    },
                ],
                pageNation: {//分页
                    total: 0,
                    pageNum: 1,//页数
                    countPerPage: 20//每页数
                },
                topPageValue: '',//开始日期
                endPageValue: '',//结束日期
                endPageValueLimit: { //限制结束时间
                    disabledDate: (time) => {
                        let timeStr = new Date(this.topPageValue.replace(/-/g, '/'));
                        return time.getTime() < timeStr;
                    }
                },
                modifyTaskDialog: {// 调整
                    show: false
                },
                startTime: this.superStartTime,// 调整弹框的开始时间
                endTime: this.superEndTime,// 调整弹框的结束时间
                startTimeA: this.superStartTime,
                endTimeA: this.superEndTime,// 调整弹框的结束时间
                pickerOptions0: { //限制开始时间
                    disabledDate: (time) => {

                        if (this.startTimeA != '' && this.startTimeA) {
                            let timeStr = new Date(this.startTimeA).getTime();
                            let timeStrE = new Date(this.endTimeA).getTime();
                            return time.getTime() < timeStr - 8.64e7 || time.getTime() > timeStrE;
                        } else {
                            return ''
                        }
                    }
                },
                pickerOptions1: { //限制结束时间
                    disabledDate: (time) => {
                        if (this.endTimeA != '' && this.endTimeA && this.startTimeA != '' && this.startTimeA) {
                            let timeStr = new Date(this.endTimeA).getTime();
                            let timeStrS = new Date(this.startTimeA).getTime();
                            // timeStr
                            return time.getTime() > timeStr || time.getTime() < timeStrS - 8.64e7;
                        } else {
                            return ''
                        }
                    }
                },
                selfCheckHistoryDialog: {//历史任务
                    show: false
                },
                selfDetailDialog: {//任务执行详情
                    show: false
                },
                addStoreDialog: {//追加门店
                    show: false
                },
                forbidden: false, //督办禁用
                idsList: [],
                multipleSelection: [],
                taskNameSub: '',//任务名称（子组件任务执行详情)
                taskIdSub: '',//任务id(子组件任务执行详情)
                StoreData: [],//选择门店
                currentClickTaskId: '',//当前点击的任务id
                currentClickStoreId: '',//当前点击的门店id
                currentClickId: '',//当前点击的子任务id
                storeId: '',//门店id
                HistoryTaskName: '',//历史任务名称
                ProcessType: 1,//自查业务
                DetailTaskStatus: '',
            }
        },
        created: function () {
            this.getOperateStatus();
            this.getBasicOptionList();
        },
        methods: {
            /**
             * 获取省市区街道
             */
            // this.$emit('regionalismResult', this.area)
            regionalismResult(area) {
                this.areaDatas = area;
                return this.areaDatas
            },
            initRegion(area) {
                this.areaDatas = area;
                this.queryTask();
            },
            /**
             * 获取经营业态
             */
            getOperateStatus() {
                this.$api.GetOperateInfo(1).then(res => {
                    if (res) {
                        this.operateStatusList = res
                        // console.log(this.operateStatusList)
                    }
                }).catch(r => {
                });
            },
            /**
             * 任务类型
             */
            getBasicOptionList() {

                let dataInfo = {
                    "StoreTypeId": this.operateStatus,//业态类型
                    "TaskTypeId": "",
                    "ProcessType": 1,
                    "Type": 1,
                    "PreviousId": ""
                };
                this.$api.GetBasicOptionList(dataInfo).then(res => {
                    if (res.IsSuccess) {
                        this.taskTypeList = res.Content;
                    }
                });
            },
            changetaskType(val) {

            },
            changeOperateStatus(val) {
                this.getBasicOptionList();
            },
            /**
             * 翻页
             */
            onPageNation() {
                this.queryTask();
            },
            queryTask(page) {
                if (page) {
                    this.pageNation.pageNum = page;//点查询应该让分页从头开始，如果翻页了 否则可能查不到数据 edited by xyt 2019 12 11
                }
                let data = {
                    "Name": this.Name,
                    "taskId": this.superTaskId,//主任务id
                    "TaskStatus": this.taskStatusValue,
                    "TaskTypeId": this.taskType,
                    "StartTime": this.topPageValue,
                    "EndTime": this.endPageValue,
                    "Province": this.areaDatas.provience.code == null ? "" : this.areaDatas.provience.code.slice(2),
                    "City": this.areaDatas.city.code == null ? "" : this.areaDatas.city.code.slice(2),
                    "Area": this.areaDatas.town.code == null ? "" : this.areaDatas.town.code.slice(2),
                    "District": this.areaDatas.town.code == null ? "" : this.areaDatas.town.code.slice(2),
                    "Street": this.areaDatas.street.code == null ? "" : this.areaDatas.street.code,
                    "Community": this.areaDatas.community.code == null ? "" : this.areaDatas.community.code,
                    "StoreName": this.storeName,
                    "UnitName": this.companyName,
                    "StoreTypeSec": this.operateStatus,
                    "SelfCheckResult": this.selfCheckResultValue,
                    "PageNo": this.pageNation.pageNum,
                    "PageSize": this.pageNation.countPerPage
                }
                this.$api.SelfTaskQueryResult(data).then(res => {
                    if (res && res.Content != null && res.Content.length >= 0) {
                        for (let item of res.Content) {
                            if (item.TaskStatus == 2) {//进行中的可以督办
                                this.$set(item, 'Is', false);
                            } else {
                                this.$set(item, 'Is', true);
                            }
                        }
                        for (let item of res.Content) {
                            //item.able = false;
                            if (item.TaskStatus == 5 || item.TaskStatus == 3) {
                                this.$set(item, 'able', true);

                            } else {
                                this.$set(item, 'able', false);
                            }
                        }
                        this.datas = res.Content;
                        this.pageNation.total = res.Data;
                    } else {
                        this.datas = [];
                        this.pageNation.total = 0;
                    }
                }).catch(error => {
                })
            },
            /**
             * 追加门店
             */
            addStore() {
                if (this.superTaskStatu == 1 || this.superTaskStatu == 2) {
                    this.addStoreDialog.show = true;
                } else {
                    this.$alert('只有待办和进行中的任务允许追加', '消息提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                }
            },
            /**
             * 确定选择的门店
             */
            storesResult(data) {
                if (data == null) {
                    this.addStoreDialog.show = false;
                    return;
                }
                this.StoreData = data;
                let storeIds = [];
                for (let item of data) {
                    storeIds.push(item.Id);
                }
                let dataId = {
                    TaskId: this.superTaskId,  //主任务id
                    StoreIdList: storeIds,//追加的门店id

                };
                this.addStoreDialog.show = false;
                this.$api.AppendStore(dataId).then(res => {
                    if (res) {
                        this.queryTask();
                    }
                }).catch(r => {
                })
            },
            /**
             * 复选框状态改变
             */
            changeFun(val) {
                return this.multipleSelection = val;
            },
            //清除时间
            Timechange() {
                this.Enddate = ''
            },
            /**
             * 调整
             */
            modifyTask(val, id, strId, tasId) {
                this.currentClickId = id
                this.currentClickTaskId = tasId;
                this.currentClickStoreId = strId
                if (val == 1 || val == 2) {
                    this.modifyTaskDialog.show = true;

                } else {
                    this.$alert('只有进行中和待办的任务可以调整', '消息提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                }

            },
            /**
             * 历史任务
             */
            selfCheckHistoryEvent(Name, ids) {
                this.selfCheckHistoryDialog.show = true;
                this.storeId = ids;
                this.HistoryTaskName = Name
            },
            /**
             * 查看详情
             */
            selfCheckDetailDialog(TaskStatus, val, id) {
                this.selfDetailDialog.show = true;
                this.taskNameSub = val;
                this.taskIdSub = id;
                this.DetailTaskStatus = TaskStatus.toString();
            },
            /**
             * 保存关闭调整
             */
            ClosemodifyTaskDialog() {
                let data = {
                    TaskId: this.superTaskId, //主任务id
                    PatrolSubTaskId: this.currentClickId, //子任务id
                    StoreId: this.currentClickStoreId, //门店id
                    StartTime: this.startTime,//   开始时间
                    EndTime: this.endTime, //结束时间
                    ExecutorIdList: []
                }
                this.modifyTaskDialog.show = false;
                this.$api.UpdatePatrolSubTask(data).then(res => {
                    if (res) {
                        this.queryTask();
                    }
                }).catch(r => {
                })

            },
            /**
             * 取消子任务
             */
            selfCheckCancel() {
                let arr = this.multipleSelection;
                if (arr.length == 0) {
                    this.$alert('请选择数据', '消息提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                } else {
                    let temp = [];
                    arr.forEach((value, index) => {
                        temp.push(value.Id);
                        let data = {
                            ids: temp
                        };
                        if (value.TaskStatus == 1 || value.TaskStatus == 2) {
                            this.$confirm('确定要取消吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                for (var i = 0; i < this.datas.length; i++) {
                                    for (var k = 0; k < arr.length; k++) {
                                        if (arr[k].Id == this.datas[i].Id) {
                                            this.datas.splice(i, 1);
                                        }
                                    }
                                }
                                this.$api.SelfCheckSubTaskCancel(data).then(res => {
                                    if (res.Code == "1") {
                                        let _this = this;
                                        //this.message("取消任务成功", 1);
                                        this.$message({
                                            type: 'success',
                                            center: true,
                                            duration: 500,
                                            message: '取消任务成功',
                                        });
                                        this.queryTask();
                                    } else {
                                        this.$alert('取消失败', '消息提示', {
                                            confirmButtonText: '确定',
                                            callback: action => {

                                            }
                                        });
                                    }
                                }).catch(error => {
                                })
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    center: true,
                                    duration: 1200,
                                    message: '已取消删除'
                                });
                            });
                        } else {
                            this.$alert('只有进行中和待办的任务可以取消', '消息提示', {
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });
                        }
                    })
                }
            },
            /**
             * 取消单个子任务
             */
            selfCheckSubTaskCancel(id, TaskStatus) {
                if (TaskStatus == 1 || TaskStatus == 2) {
                    this.$confirm('确定要取消吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            "ids": [id]//
                        };
                        for (var i = 0; i < this.datas.length; i++) {
                            if (this.datas[i].Id == id) {
                                this.datas.splice(i, 1);
                            }
                        }
                        this.$api.SelfCheckSubTaskCancel(data).then(res => {
                            if (res.Message) {
                                let _this = this;
                                this.$message({
                                    message: '取消任务成功',
                                    type: 'success',
                                    duration: 1200,
                                    center: true,
                                    onClose() {
                                        _this.queryTask();
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
                        }).catch(error => {
                        })
                    }).catch(() => {
                        this.$message({
                            message: '取消删除',
                            type: 'info',
                            duration: 1200,
                            center: true
                        });
                    })
                } else {
                    this.$alert('只有进行中和待办的任务可以取消', '消息提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                }

            },
            /**
             * 单个子任务异常结束
             */
            selfCheckSubTaskFailEnd(id, status) {

                if (status != 5 || status != 3) {
                    this.$confirm('确定要异常结束吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.datas.forEach(item => {
                            if (item.Id == id) {
                                item.TaskStatus = 5;
                                this.$set(item, 'able', true);
                            }

                        });
                        let data = {
                            ids: [id],    //array
                            userid: this.$utils.getUrlKey("userId")
                        };
                        this.$api.SelfCheckSubTaskFailEnd(data).then(res => {
                            if (res.IsSuccess) {
                                this.message("设置异常结束成功", 1);
                                this.queryTask()
                            } else {
                                this.message("设置异常结束失败", -1);
                            }
                        }).catch(error => {
                        })

                    })

                }


            },
            //导出数据
            DerivedData() {
                let ids = [];
                if (this.multipleSelection.length > 0) {
                    for (let item of this.multipleSelection) {
                        ids.push(item.Id);
                    }
                }
                let data = {
                    "Name": this.Name,
                    "taskId": this.superTaskId,//主任务id
                    "TaskStatus": this.taskStatusValue,
                    "TaskTypeId": this.taskType,
                    "StartTime": this.topPageValue,
                    "EndTime": this.endPageValue,
                    "Province": this.areaDatas.provience.code == null ? "" : this.areaDatas.provience.code.slice(2),
                    "City": this.areaDatas.city.code == null ? "" : this.areaDatas.city.code.slice(2),
                    "Area": this.areaDatas.town.code == null ? "" : this.areaDatas.town.code.slice(2),
                    "District": this.areaDatas.town.code == null ? "" : this.areaDatas.town.code.slice(2),
                    "Street": this.areaDatas.street.code == null ? "" : this.areaDatas.street.code,
                    "Community": this.areaDatas.community.code == null ? "" : this.areaDatas.community.code,
                    "StoreName": this.storeName,
                    "UnitName": this.companyName,
                    "StoreTypeSec": this.operateStatus,
                    "SelfCheckResult": this.selfCheckResultValue,
                    "PageNo": this.pageNation.pageNum,
                    "PageSize": this.pageNation.countPerPage,
                    "ids": ids
                }
                this.$api.ExportQueryResult(data).then(
                    res => {
                        if (res && res.IsSuccess) {
                            window.location.href = res.Data;
                        } else {
                            this.message(res.Message, -1)
                        }
                    }
                )
            },
            /**
             * 子任务异常结束
             */
            selfCheckSelfTaskFailEnd() {

                let arr = this.multipleSelection;
                if (arr.length == 0) {
                    this.$alert('请选择数据', '消息提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].TaskStatus != 5 && arr[i].TaskStatus != 3) {
                            this.$confirm('确定要异常结束吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                for (var i = 0; i < arr.length; i++) {
                                    arr[i].TaskStatus = 5;
                                    this.idsList.push(arr[i].Id);
                                }
                                let data = {
                                    ids: this.idsList,//array
                                    userid: this.$utils.getUrlKey("userId")
                                };
                                this.$api.SelfCheckSubTaskFailEnd(data).then(res => {
                                    if (res.IsSuccess) {
                                        this.message("设置异常结束成功", 1);
                                        this.queryTask()
                                    } else {
                                        this.message("设置异常结束失败", -1);
                                    }
                                }).catch(error => {
                                })
                            })
                        } else {
                            this.$alert('已完成和异常结束的任务不能设置异常结束状态', '消息提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }
                    }
                }
            },
            /**
             * 督办
             */
            Supervise(val, index, ids, StoreId, TaskId, TaskStatus) {
                ;//判断任务状态，非进行中的，置灰。
                if (!this.datas[index].Is) {
                    this.datas.forEach(item => {
                        if (item.Id == ids) {
                            this.$set(item, 'Is', true);
                        }
                    });
                }
                let dataId = {};
                let appId = this.$utils.getUrlKey("appId");
                let userId = this.$utils.getUrlKey("userId");
                let orgId = this.$utils.getUrlKey('curChangeOrg');

                dataId.InputParamDTO = {
                    NoticeEventEnum: 30,
                    InspectionType: 1,
                    IsSubTask: 2,//edited by xyt 2019 05 09 改成2
                    FromUserId: userId,
                    AppId: appId,
                    StoreId: StoreId,//门店ID
                    TaskId: ids,//edited by xyt 2019 05 06 改成子任务Id
                };
                this.$api.InspectNotice(dataId).then(res => {
                    if (res.IsSuccess) {
                        this.message("督办成功", 1);
                    } else {
                        this.message("督办失败", -1);
                    }
                }).catch(() => {
                })
            }
        },
        filters: {
            newDate: function (date) {
                if (!date) return ''
                date = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date);
                return date.join();
            }
        }
    }
</script>
<style scoped type="text/scss" lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        .el-middle {
            padding-bottom: 10px;
        }
        padding-top: 0 !important;
    }

    .searchSelect {
        width: 160px;
        margin-right: 10px;
    }

    .searchInput {
        width: 160px;
        margin-right: 10px;
    }

    .operate {
        margin-top: 20px;
    }

    .button {
        width: 120px;
    }

    .topBlock {
        display: inline-block;
    }

    .minDialog {
        height: calc(40vh - 143px);
    }

    .block {
        padding: 5px 0;
    }

    .el-form-item {
        margin-bottom: 5px !important;
    }

    .block .el-date-editor.el-input {
        width: 64%
    }

    .maxHistoryDialog {
        height: calc(80vh - 83px);
        overflow-y: auto;
    }
</style>