<template>
    <div>
        <div class="table main-container ">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="">
                    <el-select clearable class="com-width" :filterable="HistoricalsearchValue.datas.length > 7" v-model="HistoricalsearchValue.code" placeholder="任务类型">
                        <el-option v-for="item in HistoricalsearchValue.datas" :key="item.Id" :label="item.Text" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input clearable placeholder="任务名称" v-model="HistoricalsearchValue.TaskName" class="com-width"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select clearable class="com-width" :filterable="Inspectionresults.datas.length > 7" v-model="Inspectionresults.code" placeholder="任务状态">
                        <el-option v-for="item in Inspectionresults.datas" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input clearable placeholder="检查人员" v-model="HistoricalsearchValue.companyName" class="com-width"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="HistoricalsearchValue.StartTime" type="date" class="com-width-time"
                        placeholder="开始日期" value-format="yyyy-MM-dd" :picker-options="Timelimits" @change="Timechange1()">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="HistoricalsearchValue.EndTime" type="date" class="com-width-time"
                        placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="Timelimite">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Historyquery()">查询</el-button>
                </el-form-item>
            </el-form>
            <div style="margin-bottom: 10px;display: flex;">
                <div style="display: flex;margin-right: 20px;">
                    <p style="margin-right: 10px;">门店名称: </p>
                    <p>{{storeName}}</p>
                </div>
                <div style="display: flex;">
                    <p style="margin-right: 10px;">历史任务数量: </p>
                    <p>{{historicalNumber}}</p>
                </div>
            </div>
            <el-table :data="Historylist" v-loading="Loading" border class="main-table" ref="table" id="table" style="width: 100%;">
                <el-table-column type="index" align="center" label="序号" show-overflow-tooltip width="50">
                </el-table-column>
                <el-table-column property="TaskTypeName" label="任务类型" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column property="Name" label="任务名称" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column property="TaskStatus" show-overflow-tooltip label="任务状态" align="center">
                    <template slot-scope="scope">
                        <!--                        <span v-if="scope.row.TaskStatus == 1">待办</span>
                        <span v-if="scope.row.TaskStatus == 2">进行中</span> -->
                        <span v-if="scope.row.TaskStatus == 3">已完成</span>
                        <span v-if="scope.row.TaskStatus == 4">未完成</span>
                        <span v-if="scope.row.TaskStatus == 5">异常结束</span>
                    </template>
                </el-table-column>
                <el-table-column property="Checker" show-overflow-tooltip label="检查人员" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.Checker ? scope.row.Checker : '无'}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="StartTime" show-overflow-tooltip label="开始日期" align="center">
                </el-table-column>
                <el-table-column property="EndTime" show-overflow-tooltip label="结束日期" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" show-overflow-tooltip width="230">
                    <template slot-scope="scope">
                        <el-button type="text" @click="inspectiondetails(scope.$index)">
                            查看检查详情
                        </el-button>
                        <el-button type="text" @click="enforcementdetails(scope.$index)">
                            查看执法详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- </div>        -->
            <!--翻页-->
            <Pagination v-show="Historytotal>=0" :total="Historytotal" :page.sync="HistoricalsearchValue.PageNo"
                :limit.sync="HistoricalsearchValue.PageSize" @pagination="HistoryView" class="main-bottom" />
            <el-dialog title="巡查任务详情" :visible.sync="Patroldetails.isviewDetails" :close-on-click-modal="false" class="PatrolTasksDetails"
                width="80%" top='10vh' v-if="Patroldetails.isviewDetails" append-to-body>
                <div class="maxDialog">
                    <patrol-details :Rowcontentdetails="Rowcontentdetails"></patrol-details>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="Patroldetails.isviewDetails = false">取 消</el-button>
                    <el-button type="primary" @click="Patroldetails.isviewDetails = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog class="lawEnforcementTasksDetails" title="执法任务详情" :visible.sync="lawEnforcementTasksDetails.islawEnforcementDetails"
                :close-on-click-modal="false" width="80%" top='10vh' v-if="lawEnforcementTasksDetails.islawEnforcementDetails"
                append-to-body>
                <div class="maxDialog">
                    <enforcement-details :Rowcontentdetails="Rowcontentdetails"></enforcement-details>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="lawEnforcementTasksDetails.islawEnforcementDetails = false">取 消</el-button>
                    <el-button type="primary" @click="lawEnforcementTasksDetails.islawEnforcementDetails = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import PatrolDetails from '@/components/PatrolDetails.vue';
    import EnforcementDetails from '@/components/EnforcementDetails.vue';
    export default {
        components: {
            Pagination,
            PatrolDetails,
            EnforcementDetails,
        },
        name: "HistoricalTask",
        data() {
            return {
                searchValue: {
                    TaskName: "", //任务名称
                    Taskstatus: "", //任务状态
                    licenNum: "",
                    shopName: "", //门店名称
                    companyName: "", //单位名称
                    rows: 20,
                    page: 1
                },
                storeName: "",
                Historytotal: 0, //数据条数
                Historylist: [],
                HistoricalsearchValue: { //历史任务搜索条件
                    code: "",
                    TaskName: "",
                    datas: [],
                    CheckResult: "",
                    Checker: "",
                    StartTime: "",
                    EndTime: "",
                    PageNo: 1,
                    PageSize: 20
                },
                Timelimits: { //限制开始时间
                    disabledDate: (time) => {
                        if (this.HistoricalsearchValue.EndTime != '' && this.HistoricalsearchValue.EndTime) {
                            let timeStr = new Date(this.HistoricalsearchValue.EndTime.replace(/-/g, '/'));
                            return time.getTime() > timeStr;
                        } else {
                            return ''
                        }
                    }
                },
                Timelimite: { //限制结束时间
                    disabledDate: (time) => {
                        if (this.HistoricalsearchValue.StartTime != '' && this.HistoricalsearchValue.StartTime) {
                            let timeStr = new Date(this.HistoricalsearchValue.StartTime.replace(/-/g, '/'));
                            return time.getTime() < timeStr;
                        } else {
                            return ''
                        }
                    }
                },
                Inspectionresults: { //巡查结果
                    datas: [
                        // {value:'',label:'全部'},
                        //                         {value:1,label:'待办'},
                        //                         {value:2,label:'进行中'},
                        {
                            value: 3,
                            label: '已完成'
                        },
                        {
                            value: 4,
                            label: '未完成'
                        },
                        {
                            value: 5,
                            label: '异常结束'
                        },
                    ],
                    code: '',
                    name: ''
                },
                Patroldetails: { //巡查任务详情
                    isviewDetails: false,
                },
                lawEnforcementTasksDetails: { //执法任务详情
                    islawEnforcementDetails: false,
                },
                Rowcontentdetails: "",
                historicalNumber: "", //历史任务数量
                completed: 0, //完成数量
                Loading:false,
            }
        },
        props: {
            Rowcontent: "",
        },
        created: function() {
            this.HistoryView()
            // console.log(this.$store.state.TaskInfo);    //主任务带过来的数据
            // console.log(this.Rowcontent);               //子任务带过来的数据#if
            console.log(this.Rowcontent)
        },
        methods: {
            //历史任务
            HistoryView() {
                this.storeName = this.Rowcontent.StoreName;
                let data = {
                    "StoreTypeId": this.Rowcontent.StoreTypeId,
                    "ProcessType": 0,
                    "Type": 1,
                }
                this.$api.GetBasicOptionList(data).then(
                    res => {
                        this.HistoricalsearchValue.datas = res.Content;
                    }
                )
                this.Loading = true;
                let datas = {
                    "StoreId": this.Rowcontent.StoreId,
                    "StoreName": this.Rowcontent.StoreName,
                    "TaskTypeId": this.HistoricalsearchValue.code,
                    "TaskName": this.HistoricalsearchValue.TaskName,
                    "TaskStatus": this.Inspectionresults.code,
                    "Checker": this.HistoricalsearchValue.companyName,
                    "StartTime": this.HistoricalsearchValue.StartTime,
                    "EndTime": this.HistoricalsearchValue.EndTime,
                    "PageNo": this.HistoricalsearchValue.PageNo,
                    "PageSize": this.HistoricalsearchValue.PageSize
                }
                this.$api.GetHistoryTasks(datas).then(
                    res => {
                        if (res.IsSuccess) {
                            this.Historytotal = res.Data;
                            this.historicalNumber = res.Detail;
                            this.Loading = false;
                            this.$refs.table.bodyWrapper.scrollTop =0;
                            if (res.Content.length > 0) {
                                this.Historylist = res.Content;
                            }
                        } else {
                            this.Historylist = [];
                            this.Historytotal = 0;
                            this.Loading = false;
                        }
                    }
                )
            },
            Historyquery() {
                this.HistoricalsearchValue.PageNo = 1;
                this.HistoryView();
            },
            //获取巡查结果
            getBasicOptionListInspection() {
                let data = {
                    "StoreTypeId": this.Rowcontent.StoreTypeId, //业态id
                    "TaskTypeId": this.$store.state.TaskInfo.TaskTypeId, //任务类型ID
                    "ProcessType": 0,
                    "Type": 2,
                }
                this.$api.GetBasicOptionList(data).then(
                    res => {
                        if (res.IsSuccess) {
                            this.Inspectionresults.datas = res.Content;
                        }
                    }
                )
            },
            Timechange1() {
                this.HistoricalsearchValue.EndTime = ''
            },
            inspectiondetails(rows) {
                this.Patroldetails.isviewDetails = true;
                console.log(this.Historylist[rows])
                this.Rowcontentdetails = this.Historylist[rows];
            },
            enforcementdetails(rows) {
                this.lawEnforcementTasksDetails.islawEnforcementDetails = true;
                this.Rowcontentdetails = this.Historylist[rows];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;
        padding: 0;

        .com-width {
            width: 150px;
        }

        .com-width-time {
            width: 140px
        }

        .el-form-item {
            margin-bottom: 5px;
        }
    }
</style>
