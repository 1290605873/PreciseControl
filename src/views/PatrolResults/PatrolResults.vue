<template>
    <div class="PatrolResults main-container" style="padding: 0;">
        <div class="main-header">
            <el-form :inline="true" class="demo-form-inline">
                <regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
                <el-form-item label="">
                    <el-input clearable placeholder="请输入任务名称" v-model="searchValue.TaskName" class="com-width"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select clearable class="com-width" :filterable="Taskstatus.datas.length > 7" v-model="Taskstatus.code" placeholder="任务状态" @change="selectGet">
                        <el-option v-for="item in Taskstatus.datas" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input clearable placeholder="请输入门店名称" v-model="searchValue.shopName" class="com-width"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input clearable placeholder="请输入单位名称" v-model="searchValue.companyName" class="com-width"></el-input>
                </el-form-item>
                <!--                <el-form-item label="">
                    <el-input clearable placeholder="请输入责任主体" v-model="searchValue.Responsible" class="com-width"></el-input>
                </el-form-item> -->
                <el-form-item label="">
                    <el-select clearable class="com-width" :filterable="Inspectionresults.datas.length > 7" v-model="Inspectionresults.code" placeholder="巡查结果" @change="selectGet">
                        <el-option v-for="item in Inspectionresults.datas" :key="item.Id" :label="item.Text" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select clearable class="com-width" :filterable="Businessformat.datas.length > 7" v-model="Businessformat.code" placeholder="业态类型" @change="selectGet">
                        <el-option v-for="item in Businessformat.datas" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select clearable class="com-width" :filterable="Processingresult.datas.length > 7" v-model="Processingresult.code" placeholder="处理结果" @change="selectGet">
                        <el-option v-for="item in Processingresult.datas" :key="item.Id" :label="item.Text" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select clearable class="com-width" :filterable="Enforcementresult.datas.length > 7" v-model="Enforcementresult.code" placeholder="执法结果" @change="selectGet">
                        <el-option v-for="item in Enforcementresult.datas" :key="item.Id" :label="item.Text" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <!--                <el-form-item label="">
                    <el-input clearable placeholder="请输入责任人" v-model="searchValue.Dutyer" class="com-width"></el-input>
                </el-form-item>   -->
                <el-form-item label="">
                    <el-date-picker v-model="Startdate" type="date" class="com-width-time" placeholder="开始日期"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="Timechange()">
                    </el-date-picker>
                    <el-date-picker v-model="Enddate" type="date" class="com-width-time" placeholder="结束日期"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions1">
                    </el-date-picker>
                    <el-button type="primary" @click="query()">查询</el-button>
                </el-form-item>
            </el-form>
            <div style="margin-bottom: 10px;">
                <el-button type="primary" plain @click="Additionalstores()" v-show="taskInfo.TaskType == 0">追加门店</el-button>
                <el-button type="primary" plain @click="Canceltasks()" v-show="taskInfo.TaskType == 0">取消任务</el-button>
                <el-button type="primary" plain @click="Abnormaltermination()" v-show="taskInfo.TaskType == 0">异常结束</el-button>
                <el-button type="primary" plain @click="DerivedData()" v-show="taskInfo.TaskType == 0">导出数据</el-button>
            </div>
        </div>
        <el-dialog title="选择门店" :visible.sync="Choosingstore.isviewDetails" :close-on-click-modal="false" class="adjustment"
            width="80%" top='10vh' v-if="Choosingstore.isviewDetails" append-to-body>
            <ChooseStore @storesResult="storesResult" :OperateId="operateId"></ChooseStore>
        </el-dialog>
        <!-- <div class="main-content"> -->
        <el-table
                :data="list"
                v-loading="Loading"
                border
                highlight-current-row
                class="main-table"
                ref="table"
                height="400"
                id="table"
                :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
            <el-table-column type="index" align="" label="序号" show-overflow-tooltip width="50">
            </el-table-column>
            <el-table-column type="selection" align="" width="55" :selectable="selectable" :reserve-selection="true">
            </el-table-column>
            <el-table-column property="SubTaskStatus" align="" show-overflow-tooltip label="任务状态" width="80">
            </el-table-column>
            <el-table-column property="SubTeskType" label="任务类型" show-overflow-tooltip align="" width="100">
            </el-table-column>
            <el-table-column property="RetSubTaskName" label="任务名称" show-overflow-tooltip align="" width="120">
            </el-table-column>
            <el-table-column property="StoreName" label="门店名称" show-overflow-tooltip align="" width="120">
            </el-table-column>
            <el-table-column property="UnitName" label="单位名称" show-overflow-tooltip align="" width="120">
            </el-table-column>
            <el-table-column property="StoreType" show-overflow-tooltip label="业态类型" align="" width="100">
            </el-table-column>
            <el-table-column property="AreaOf" show-overflow-tooltip label="所属社区" align="" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.AreaOf ? scope.row.AreaOf : '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column property="StoreState" clearable label="门店状态" align="" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.StoreState">正常营业</span>
                    <span v-else>非正常营业</span>
                </template>
            </el-table-column>
            <el-table-column property="StartTime" show-overflow-tooltip label="开始日期" align="" width="110">
            </el-table-column>
            <el-table-column property="EndTime" show-overflow-tooltip label="结束日期" align="" width="110">
            </el-table-column>
            <el-table-column property="CheckTime" show-overflow-tooltip label="检查时间" align="" width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.CheckTime}}</span>
                </template>
            </el-table-column>
            <el-table-column property="Checker" label="巡查人" align="" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.Checker}}</span>
                </template>
            </el-table-column>
            <el-table-column property="CheckResult" show-overflow-tooltip label="检查结果" align="" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.CheckResult}}</span>
                </template>
            </el-table-column>
            <el-table-column property="HandleResult" show-overflow-tooltip label="处理结果" align="" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.HandleResult}}</span>
                </template>
            </el-table-column>
            <el-table-column property="ImplementTime" show-overflow-tooltip label="执法时间" align="" width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.ImplementTime}}</span>
                </template>
            </el-table-column>
            <el-table-column property="ImplementName" show-overflow-tooltip label="执法人" align="" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.ImplementName}}</span>
                </template>
            </el-table-column>
            <el-table-column property="ImplementResult" show-overflow-tooltip label="执法结果" align="" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.ImplementResult}}</span>
                </template>
            </el-table-column>
            <el-table-column property="ReformResult" show-overflow-tooltip label="整改结果" align="" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.ReformResult}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="" show-overflow-tooltip width="530">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain disabled v-show="taskInfo.TaskType == 0&&scope.row.TaskStatus!=2">不可督办</el-button>
                    <el-button type="primary" size="mini" plain @click="Supervise(scope.$index)" v-show="taskInfo.TaskType == 0&&scope.row.TaskStatus==2&&scope.row.IsSupervised==0">未督办</el-button>
                    <el-button type="primary" size="mini" plain @click="Supervise(scope.$index)" v-show="taskInfo.TaskType == 0&&scope.row.TaskStatus==2&&scope.row.IsSupervised==1"
                        disabled>已督办</el-button>
                    <el-button type="primary" size="mini" plain v-show="taskInfo.TaskType == 0 && scope.row.TaskStatus==4||scope.row.TaskStatus==3||scope.row.TaskStatus==5"
                        disabled>调整</el-button>
                    <el-button type="primary" size="mini" plain v-show="taskInfo.TaskType == 0 && scope.row.TaskStatus==1||scope.row.TaskStatus==2" @click="adjustmentview(scope.row.Id,scope.row.CommunityId)">
                        调整
                    </el-button>
                    <el-button v-if="scope.row.TaskStatus == 1 ||scope.row.TaskStatus == 2 ||scope.row.TaskStatus == 4"
                        disabled type="primary" size="mini" plain>
                        检查详情
                    </el-button>
                    <el-button v-else type="primary" size="mini" plain @click="inspectiondetails(scope.$index)">
                        检查详情
                    </el-button>
                    <el-button v-if="scope.row.TaskStatus == 1 ||scope.row.TaskStatus == 2 ||scope.row.TaskStatus == 4"
                        disabled type="primary" size="mini" plain>
                        执法详情
                    </el-button>
                    <el-button v-else type="primary" size="mini" plain @click="enforcementdetails(scope.$index)">
                        执法详情
                    </el-button>
                    <el-button type="primary" size="mini" plain @click="HistoryView(scope.$index)">
                        历史任务
                    </el-button>
                    <el-button type="primary" size="mini" plain v-show="taskInfo.TaskType == 0 &&scope.row.TaskStatus == 1"
                        @click="Canceltasks(scope.row.Id)">
                        取消任务
                    </el-button>
                    <el-button type="primary" size="mini" plain v-show="taskInfo.TaskType == 0 &&scope.row.TaskStatus != 1" disabled>
                        取消任务
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- </div>        -->
        <!--翻页-->
        <pagination v-show="total>=0" :total="total" :page.sync="searchValue.page" :limit.sync="searchValue.rows"
            @pagination="getSubTaskByQueryParam" class="main-bottom" />
        <el-dialog title="调整" :visible.sync="adjustment.isviewDetails" :close-on-click-modal="false" class="adjustment"
            width="30%" v-if="adjustment.isviewDetails" append-to-body>
            <div class="">
                <div style="display: flex;">
                    <p style="width: 80px;text-align: center;">巡查人:</p>
                    <el-input clearable class="cardItemInput" v-model="checkValuenum" @click.native="addUserDialog.show = true;"
                        style="width:200px;line-height: 44px;"></el-input>
                </div>
                <div style="display: flex;">
                    <p style="width: 80px;text-align: center;">开始日期:</p>
                    <el-date-picker v-model="adjustment.Startdate" type="date" class="com-width-time" placeholder="选择日期"
                        value-format="yyyy-MM-dd" style="line-height: 44px;width: 200px;" :picker-options="Timelimits"
                        >
                    </el-date-picker>
                </div>
                <div style="display: flex;">
                    <p style="width: 80px;text-align: center;">结束日期:</p>
                    <el-date-picker v-model="adjustment.Enddate" type="date" class="com-width-time" placeholder="选择日期"
                        value-format="yyyy-MM-dd" style="line-height: 44px;width: 200px;" :picker-options="Timelimite">
                    </el-date-picker>
                </div>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button @click="adjustment.isviewDetails=false">取消</el-button>
                    <el-button type="primary" style="margin-right: 20px;" @click="addAdjustment()">保存</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="添加人员" :visible.sync="addUserDialog.show" width="40%" top="10vh" append-to-body
            :close-on-click-modal="false">
            <div class="maxDiaglog">
                <set-user :defaultCheckuserId="defaultCheckuserId" @checkUserData="checkUserData" :AreaCode="AreaCode"></set-user>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveAddUsers">确定</el-button>
                    <el-button @click="addUserDialog.show = false">取消</el-button>
            </span> -->
        </el-dialog>
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
        <el-dialog class="HistoricalTask" title="历史任务" :visible.sync="HistoricalTask.isHistoryDetails" append-to-body
            :close-on-click-modal="false" width="80%" top='10vh' v-if="HistoricalTask.isHistoryDetails">
            <div class="maxDialog">
                <historical-task :Rowcontent="Rowcontent"></historical-task>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="HistoricalTask.isHistoryDetails = false">取 消</el-button>
                <el-button type="primary" @click="HistoricalTask.isHistoryDetails = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script src="@/views/PatrolResults/PatrolResults.js">
</script>

<style scoped lang="scss">
  .maxDiaglog{
    height: calc(90vh - 72px);
  }
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;
        padding: 0;

        .com-width {
            width: 170px;
        }

        .com-width-time {
            width: 170px;
            margin-right: 10px;
        }

        .el-form-item {
            margin-bottom: 5px;
        }
    }
</style>
<style lang="scss" scoped>
    .PatrolTasksDetails {
        height: 100%;

        .table,
        .maxDialog {
            p {
                margin: 0;
                padding: 0;
            }

            .header {
                text-align: center;
                height: 50px;
                line-height: 50px;
                background: #404040;
                color: #ffffff;
            }

            .content,
            .Rectificationdetails {
                border: 1px solid #ccc;

                ul {
                    padding-left: 0;
                    margin: 0;
                }

                li {
                    display: flex;
                    border-bottom: 1px solid #ccc;

                    div {
                        display: flex;
                        width: 50%
                    }

                    p {
                        margin: 0;
                        height: 40px;
                        line-height: 40px;
                        padding-left: 20px;
                    }

                    .left {
                        width: 100px;
                        text-align: center;
                        padding: 0;
                        border-right: 1px solid #ccc;
                    }
                }
            }

            .picture {
                border: 1px solid #ccc;

                ul {
                    padding-left: 0;
                    margin: 0;
                    display: flex;

                    li {
                        list-style: none;
                        width: 50%;
                        border: 1px solid #ccc;
                        // border-bottom: 1px solid #ccc;
                        margin: 5px;

                        p {
                            border-bottom: 1px solid #ccc;
                            line-height: 40px;
                            margin: 0;
                            padding-left: 10px;
                        }

                        img {
                            width: 200px;
                            height: 200px;
                            margin: 10px;
                        }
                    }
                }
            }

            .details {
                display: flex;
                border: 1px solid #ccc;
                margin-bottom: 5px;
                justify-content: space-between;

                p {
                    padding: 0 10px;
                    display: flex;
                    align-items: Center;
                }

                .chosebtn {
                    display: flex;
                    justify-content: center;
                    align-items: Center;
                }
            }

            .autograph {
                width: 49%;
                border: 1px solid #ccc;
                display: flex;
                align-items: Center;
                margin-bottom: 5px;

                div {
                    border-left: 1px solid #ccc;

                    img {
                        width: 100px;
                        height: 100px;
                    }
                }
            }

            .Enforcementinstructions {
                height: 100px;
                border: 1px solid #ccc;
                margin-bottom: 5px;
                padding: 10px;
            }

            .Rectificationdetails {}
        }

        .adjustment {
            p {
                width: 100px;
                text-align: center;
            }
        }
    }
</style>
