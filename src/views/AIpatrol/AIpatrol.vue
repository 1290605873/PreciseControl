<template>
    <div class="AIpatrol main-container">
        <el-form inline>
            <regionalism v-on:regionalismResult='regionalismResult' v-on:initRegion='initRegion'></regionalism>
            <el-form-item>
                <el-input v-model="storeName" clearable placeholder="被巡察单位"></el-input>
            </el-form-item>
            <el-form-item label-width="80px">
                <el-date-picker value-format="yyyy-MM-dd" class="com-width" placeholder="请选择开始时间" v-model="StartTime"
                    type="date" @change="startTimeChange" clearable>
                </el-date-picker>
            </el-form-item>
            <el-form-item label-width="80px">
                <el-date-picker placeholder="请选择结束时间" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" class="com-width"
                    v-model="EndTime" type="date" clearable>
                </el-date-picker>
                <el-button style="margin-left: 15px" type="primary" @click="queryList">查 询</el-button>
                <el-button style="margin-left: 15px" type="primary" @click="exportData">导 出</el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-tabs v-model="taskTabs.code" @tab-click="taskTabsClick">
                <el-tab-pane v-for="taskItem in taskTabs.datas" :key="taskItem.Id" :label="taskItem.Text" :name="taskItem.Id"></el-tab-pane>
            </el-tabs>
        </div>
        <el-container>
            <el-main class="right">
                <el-table
                        v-if="taskTabs.code==0"
                        :data="tableGrid"
                        v-loading="electronicTable_loading"
                        border
                        highlight-current-row
                        class="main-table"
                        ref="table"
                        id="table"
                        height="100%"
                        @selection-change="">
                    <el-table-column show-overflow-tooltip type="index" align="" label="序号" width="50">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip property="Text" label="被巡查单位" align="" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.StoreName"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="巡查时间" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.InspectDate"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="巡查地址" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.InspectAddr"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="所属街道" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.StreetValue"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="巡查人员" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.InspectUserName"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="巡查结果" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.InspectResultValue"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="处理方式" width="">
                        <template slot-scope="scope">
                            <!--<span v-text="getHandType(scope.row.HandleType)"></span>-->
                            <span v-show="scope.row.HandleType ==-1" type="text" v-text="scope.row.HandleTypeValue"></span>
                            <span v-show="scope.row.HandleType ==0" type="text" v-text="scope.row.HandleTypeValue"></span>
                            <span :class="{linkType:scope.row.HandleStatus==2}" v-show="scope.row.HandleType ==1" v-text="scope.row.HandleTypeValue" type="text" @click="openReformDialog(scope.row.Id,scope.row.HandleStatus)"></span>
                            <span :class="{linkType:scope.row.HandleStatus==2}" v-show="scope.row.HandleType ==2" v-text="scope.row.HandleTypeValue" type="text" @click="getInspectEnforceTaskDetail(scope.row)"></span>
                            <span  v-show="scope.row.HandleType ==3" v-text="scope.row.HandleTypeValue" type="text" ></span>
                            <span  v-show="scope.row.HandleType ==4" v-text="scope.row.HandleTypeValue" type="text" ></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="处理结果" width="">
                        <template slot-scope="scope">
                            <span v-if="scope.row.HandleType ==-1||scope.row.HandleType==0">- -</span>
                            <span v-else v-text="scope.row.HandleStatusValue"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="操作" width="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="openElecDialog(scope.row.EleId)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-if="taskTabs.code==0" v-show="pageNation.total>0" :total="pageNation.total" :page.sync="pageNation.pageNum"
                    :limit.sync="pageNation.countPerPage" @pagination="getElectronicRecord" class="main-bottom" id="main-bottom"></pagination>
                <el-table
                        v-if="taskTabs.code==1"
                        :data="tableGrid_refrom"
                        border
                        highlight-current-row
                        v-loading="reformTable_loading"
                        class="main-table"
                        ref="table"
                        id="table"
                        height="100%"
                        @selection-change="">
                    <el-table-column show-overflow-tooltip type="index" align="" label="序号" width="50">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip property="Text" label="整改单位" align="" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.StoreName"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="整改时间" width="">
                        <template slot-scope="scope">
                            <span v-text="scope.row.ReformStartTime"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="整改状态" width="">
                        <template slot-scope="scope">
                            <span v-text="getReformStatus(scope.row.ReformState)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="" label="操作" width="">
                        <template slot-scope="scope">
                            <el-button size="mini" :disabled="scope.row.ReformState!=2&&scope.row.ReformState!=4" type="primary"
                                @click="openReformDialog(scope.row.Id,scope.row.ReformState)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-if="taskTabs.code==1" v-show="pageNation_refrom.total>0" :total="pageNation_refrom.total"
                    :page.sync="pageNation_refrom.pageNum" :limit.sync="pageNation_refrom.countPerPage" class="main-bottom"
                    @pagination="onReformPageNation" id="main-bottom_"></pagination>
            </el-main>
          <!--  <el-dialog :title="title" v-if="centerDialogVisible" :visible.sync="centerDialogVisible" width="30%"
                :close-on-click-modal="false">
                <span style="display: flex;">
                    <label for="" style="width: 50px;line-height: 32px;">名称:</label>
                    <el-input clearable v-model="businessName" placeholder="最多可输入20个汉字" @input.native="changeCode"
                        maxlength="20"></el-input>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="Preservation()">确 定</el-button>
                </span>
            </el-dialog> -->
            <el-dialog title="整改详情" top="10vh" v-if="reformDetailDialog.show" :visible.sync="reformDetailDialog.show"
                width="70%" :close-on-click-modal="false">
                <div class="maxDialog">
                    <div v-for="itemm in  reformDetailDialog.OptionList">
                        <h2 v-text="itemm.InspectOptionName"></h2>
                        <el-form :inline="true">
                            <el-form-item v-for="item in itemm.ViolationPics" style="text-align: center">
                                <img :src="item" style="width: 300px;height:240px;border-radius: 4px">
                                <p style="padding: 0;margin: 0">违规图片</p>
                            </el-form-item>
                        </el-form>
                        <el-form :inline="true">
                            <el-form-item v-for="item in getReformPics(itemm.ReformPics)" style="text-align: center">
                                <img :src="item" style="width: 300px;height:240px;border-radius: 4px">
                                <p style="padding: 0;margin: 0">整改图片</p>
                            </el-form-item>
                        </el-form>
                    </div>
                    <hr v-if="reformDetailDialog.OptionList.length>0">
                    <el-form label-position="left">
                        <el-form-item label="备注" label-width="110px">
                            <span v-text="reformDetailDialog.desc"></span>
                        </el-form-item>
                        <el-form-item label="审核时间" label-width="110px">
                            <span v-text="reformDetailDialog.reformTime"></span>
                        </el-form-item>
                        <el-form-item label="整改截止时间" label-width="110px">
                            <span v-text="reformDetailDialog.endTime"></span>
                        </el-form-item>
                        <el-form-item label="审核人员" label-width="110px">
                            <span v-text="reformDetailDialog.reformer"></span>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="reformDetailDialog.show = false">关闭</el-button>
                </span>
            </el-dialog>
            <el-dialog title="巡查任务详情" top="10vh" v-if="partrolDetailsDialog.show" :visible.sync="partrolDetailsDialog.show"
                width="70%" calss="PatrolTasksDetails" :close-on-click-modal="false">
                <div class="maxDialog">
                    <patrol-details :Rowcontentdetails="Rowcontentdetails"></patrol-details>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="partrolDetailsDialog.show = false">关闭</el-button>
                </span>
            </el-dialog>
            <el-dialog title="AI巡查详情" top="10vh" v-if="electronicInspectDialog.show" :visible.sync="electronicInspectDialog.show"
                width="70%" calss="PatrolTasksDetails" :close-on-click-modal="false">
                <div class="maxDialog">
                    <el-form inline>
                        <el-form-item v-for="item in electronicInspectDialog.pics" style="text-align: center">
                            <img :src="item.url" style="width: 300px;height:240px;border-radius: 4px">
                            <p style="padding: 0;margin: 0" v-text="item.name"></p>
                        </el-form-item>
                        <el-form-item v-for="ite in electronicInspectDialog.videos">
                            <div style="width: 300px;height: 240px">
                                <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
                                    :options="ite.playerOptions">
                                </video-player>
                            </div>

                        </el-form-item>
                    </el-form>
                    <el-form>
                        <el-form-item label="检查日期" label-width="110px">
                            <span v-text="electronicInspectDialog.InspectDate"></span>
                        </el-form-item>
                        <el-form-item label="被查单位" label-width="110px">
                            <span v-text="electronicInspectDialog.StoreName"></span>
                        </el-form-item>
                        <el-form-item label="单位地址" label-width="110px">
                            <span v-text="electronicInspectDialog.StoreAds"></span>
                        </el-form-item>
                        <el-form-item label="检察人员" label-width="110px">
                            <span v-text="electronicInspectDialog.InspectUser"></span>
                        </el-form-item>
                        <el-form-item label="检查结果" label-width="110px">
                            <span v-text="electronicInspectDialog.CheckResult"></span>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="electronicInspectDialog.show = false">关闭</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="导出"
                v-if="exportViews"
                :visible.sync="exportViews"
                :close-on-click-modal="false"
                width="25%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item label-width="80px" label="门店名称">
                        <el-input class="com-width" v-model="ruleForm.exportstoreName" clearable placeholder="请输入门店名称" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label-width="80px" label="开始时间" prop="exportStartTime">
                        <el-date-picker value-format="yyyy-MM-dd" class="com-width" placeholder="请选择开始时间" v-model="ruleForm.exportStartTime" :picker-options="pickerOptions0"
                                        type="date" @change="exportstartTimeChange" clearable>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="80px" label="结束时间" prop="exportEndTime">
                        <el-date-picker placeholder="请选择结束时间" value-format="yyyy-MM-dd" :disabled="!ruleForm.exportStartTime" :picker-options="exportpickerOptions" class="com-width"
                                        v-model="ruleForm.exportEndTime" type="date" clearable>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="80px" label="违规项">
                        <el-select
                                v-model="ruleForm.EditingConditions"
                                class="com-width"
                                placeholder="全部违规项"
                                @change="choseEditingList($event)"
                                style="line-height: 44px;margin-right: 20px;"
                                :filterable="EditingList.length > 7">
                            <el-option
                                    v-for="item in EditingList"
                                    :key="item.ViolationOptionCode"
                                    :label="item.ViolationOptionName"
                                    :value="item.ViolationOptionCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button style="margin-left: 15px" type="primary" @click="exportBtn('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">导 出</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script src='@/views/AIpatrol/AIpatrol.js'>
</script>

<style scoped="scoped" lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding-top: 10px;

        .com-width {
            width: 170px;
        }

        .com-width-time {
            width: 170px;
            margin-right: 10px;
        }
        .right {
            width: 100%;
            height: calc(100vh - 112px);
            @include box(box);
            @include box-orient(vertical);
        }

    }
    .el-main{
        padding:0;
    }
    .regionallism{
        // margin-left:-20px;
    }
</style>
<style>
    
</style>
