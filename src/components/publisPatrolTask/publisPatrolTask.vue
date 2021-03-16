<template>
    <div class="publisPatrolTask">
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span class="cardTitle">基础信息</span>
            </div>
            <div class="cardItem">
                <label class="cardLabel">业态类型 <i class="mast">*</i></label>
                <el-select class="selectItem" v-if="createTask.info.businessType.length > 0" :filterable="createTask.info.businessType.length >7" v-model="savaTaskInfo.StoreTypeId" @change="getBasicOptionList" clearable :disabled="savaTaskInfo.TaskType ==1">
                    <el-option
                            v-for="item in createTask.info.businessType"
                            :key="item.LevelCode"
                            :label="item.Name"
                            :value="item.Id">
                    </el-option>
                </el-select>
                <el-select v-else class="selectItem" @change="getBasicOptionList" clearable　:filterable="createTask.info.businessType.length > 7">
                    <el-option
                            v-for="item in createTask.info.businessType"
                            :key="item.LevelCode"
                            :label="item.Name"
                            :value="item.Id">
                    </el-option>
                </el-select>
            </div>
            <div class="cardItem">
                <label class="cardLabel">任务类型 <i class="mast">*</i></label>
                <el-select class="selectItem" v-if="createTask.info.checkType.length > 0" :filterable="createTask.info.checkType.length > 7" v-model="TaskTypeId" clearable :disabled="savaTaskInfo.TaskType ==1">
                    <el-option
                            v-for="item in createTask.info.checkType"
                            :key="item.Text"
                            :label="item.Text"
                            :value="item.Id">
                    </el-option>
                </el-select>    
                <el-select class="selectItem" v-else clearable :filterable="createTask.info.checkType.length > 7">
                    <el-option
                            v-for="item in createTask.info.checkType"
                            :key="item.Text"
                            :label="item.Text"
                            :value="item.Id">
                    </el-option>
                </el-select>
            </div>
            <div class="cardItem">
                <label class="cardLabel">任务名称 <i class="mast">*</i></label>
                <el-input class="selectItem" type="text" v-model="savaTaskInfo.Name" maxlength="15" placeholder="最多输入15个字" :disabled="savaTaskInfo.TaskType ==1"></el-input>
                <!-- <span style="font-size:12px;margin-left:20px;">最多输入<i class="mast">15</i>个字！</span> -->
            </div>
            <div class="cardItem">
                <label class="cardLabel">任务说明:</label>
                <el-input class="selectItem" style="width:50%" rows="3" type="textarea" maxlength="500" v-model="savaTaskInfo.Explain" placeholder="最多输入500个字" :disabled="savaTaskInfo.TaskType ==1"></el-input>
                <!-- <span style="font-size:12px;margin-left:20px;">最多输入<i class="mast">500</i>个字！</span> -->
            </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-top: 10px">
            <div slot="header" class="clearfix">
                <span class="cardTitle">任务周期</span>
            </div>
            <div class="cardItem">
                <label class="cardLabel">时间选择 <i class="mast">*</i></label>
                <el-date-picker
                        @change="changeTime"
                        v-model="savaTaskInfo.StartTime"
                        type="date"
                        size="small"
                        :picker-options="pickerOptions0"
                        value-format="yyyy-MM-dd"
                        placeholder="开始日期">
                </el-date-picker>
                <span> - </span>
                <el-date-picker
                        v-model="savaTaskInfo.EndTime"
                        @change="changeTime"
                        type="date"
                        size="small"
                        :picker-options="pickerOptions1"
                        value-format="yyyy-MM-dd"
                        placeholder="结束日期">
                </el-date-picker>
                <span v-if="days!=0" style="margin-left:10px; color:#606266;">任务周期：<i class="mast">{{days}} </i>天</span>
            </div>
            <div class="cardItem" v-if="savaTaskInfo.TaskType !=1">
                <label class="cardLabel">
                    <el-radio v-model="savaTaskInfo.ByMethod" :label="1" @change="changeByMethod">频次</el-radio>
                </label>
                <el-input-number v-model="savaTaskInfo.Frequency" size="small" :min="1" :max="FrequencyMax" label="描述文字" :disabled="savaTaskInfo.ByMethod==1?false:true"></el-input-number>
                <el-select style="margin-left: 20px;width: 150px" class="selectItem" v-model="savaTaskInfo.FrequencyCompary" :disabled="savaTaskInfo.ByMethod==1?false:true" @change="FrequencyChange">
                    <el-option label="次/每天" :value="1"></el-option>
                    <el-option label="次/每周" :value="2"></el-option>
                    <el-option label="次/每月" :value="3"></el-option>
                    <el-option label="次/每季度" :value="4"></el-option>
                    <el-option label="次/每半年" :value="5"></el-option>
                    <el-option label="次/每年" :value="6"></el-option>
                </el-select>
            </div>
            <div class="cardItem" v-if="savaTaskInfo.TaskType !=1">
                <label class="cardLabel">
                    <el-radio v-model="savaTaskInfo.ByMethod" :label="2" @change="changeByMethod">次数</el-radio>
                </label>
                <el-input-number v-model="savaTaskInfo.Times" size="small" :min="1" :max="days" label="描述文字" :disabled="savaTaskInfo.ByMethod==1?true:false"></el-input-number>
                <span style="margin-left: 20px">次</span>
            </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-top: 10px">
            <div slot="header" class="clearfix">
                <span class="cardTitle">任务执行设置</span>
            </div>
            <div class="cardItem" v-if="savaTaskInfo.TaskType !=1">
                <label class="cardLabel">检查对象 <i class="mast">*</i></label>
                <!--<el-badge :value="checkValue" class="item"></el-badge>-->
                <el-input class="cardItemInput" v-model="checkValue" @click.native="showCheckObjDialogList"></el-input>
            </div>
            <div class="cardItem">
                <label class="cardLabel">检查内容 <i class="mast">*</i></label>
                <!--<el-badge :value="checkingLeng" class="item"></el-badge>-->
                <el-input class="cardItemInput" v-model="checkingLeng" @click.native="showCheckingContentDialog"></el-input>
            </div>
            <div class="cardItem" v-if="savaTaskInfo.TaskType !=1">
                <label class="cardLabel">检查人 <i class="mast">*</i></label>
                <p style="display:inline;" v-if="isShowButton != 0 && isShowButton != 1">
                    <span v-if="savaTaskInfo.CheckerType == 1">任务共享</span>
                    <span v-if="savaTaskInfo.CheckerType == 2">任务指定到人</span>
                    <span v-if="savaTaskInfo.CheckerType == 3">任务指定到特定部门</span>
                    <span v-if="savaTaskInfo.CheckerType == 4">任务指定到特定人</span>
                </p>     
                <el-select class="selectItem" v-if="isShowButton != 2 || isShowButton == 0" :filterable="rummagerData1.length > 7" v-model="createTask.info.rummagerValue2" @change="rummagerValueCheck">
                    <el-option
                            v-for="item in rummagerData1"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                &nbsp;&nbsp;&nbsp;
                <el-select class="selectItem" v-if="isShowButton != 2 || isShowButton == 0" :filterable="rummagerData2.length > 7" v-model="CheckerType" @change="changeRummagerValue2" clearable>
                    <el-option
                            v-for="item in rummagerData2"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <div v-if="isShowButton != 0 && isShowButton != 1">
                    <el-table
                    v-if="savaTaskInfo.CheckerType == 2"
                    :data="chakanData"
                    style="width:80%;margin-left:110px;"
                    border
                    fit
                    height="200px">
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column label="人员" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.Name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属区域" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.StoreAddress }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="负责门店" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="linkType" @click="showSelectStore(scope.row.checkStoreJson)">{{scope.row.checkStoreJson.length}}家</span>
                            <!-- <span v-else class="linkType" @click="settingStore(scope.$index)">设置</span>                       -->
                        </template>
                    </el-table-column>             
                </el-table>             
                </div>
                           
            </div>
         <div class="cardItem" v-if="isShowButton != 2 || isShowButton == 0">
            <label class="cardLabel"></label>
            <el-button type="text" class="link" @click="openSettingWg">如何设置网格分工？</el-button>
            <el-button type="text" class="link" @click="openSettingTd">如何设置特定部门或人？</el-button>
         </div>
        </el-card>
        <!--检查对象 start-->
        <el-dialog
                v-if="selectCheckingObject.checkObjDialogList"
                class="selectCheckingObject"
                title="检查对象"
                append-to-body
                :visible.sync="selectCheckingObject.checkObjDialogList"
                top='10vh'
                width="80%">
                <ChooseStore @storesResult="storesResult" @setRule="setRule" :rule="savaTaskInfo.PatrolTaskRuleOptionInfoList" :OperateId="savaTaskInfo.StoreTypeId" :ProcessType="0" :selectedStores="selectedStores" :isShowButtonStore="isShowButtonStore"></ChooseStore>
        </el-dialog>
        <!--检查对象 end-->  
        <!--检查内容 start-->
        <el-dialog
                title="检查内容"
                append-to-body
                :visible.sync="checkingContent.checkingContentDialog.show"
                top='10vh'
                width="80%">
         
                <el-table
                        width="100%"
                        center
                        border
                        height="500px"
                        :data="checkingContent.checkingContentData"
                        ref="checkingTable"
                        v-loading="checkingContent.Loading"
                        @selection-change="selecChecking">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>

                    <el-table-column :label="checkingContent.checkingContentTable.className" min-width="80px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.ClassificationIdName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.checkName" min-width="100px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.Text}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.explain" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.Remark}}</span>
                        </template>
                    </el-table-column>
                </el-table>
         
            <span slot="footer" class="dialog-footer" v-if="isShowButton == 0 || isShowButton ==1 || savaTaskInfo.TaskType ==1">
                    <el-button @click="checkingContent.checkingContentDialog.show = false">取消</el-button>
                    <el-button type="primary" style="margin-left: 20px" @click="saveChecking">确定</el-button>
            </span>
        </el-dialog>
        <!-- 检查内容 end-->
        <!--设置检查内容 start-->
        <el-dialog 
            title="设置检查项业务属性" 
            :visible.sync="isviewDetails"
            width="30%" 
            v-if="isviewDetails" 
            height="500"
            append-to-body>
            <div style="display: flex;">
                <p style="margin-right: 10px;width: 75px;text-align: center;">是否启用:</p>
                <el-radio v-model="IsValid" label="1">是</el-radio>
                <el-radio v-model="IsValid" label="0">否</el-radio>
            </div>
            <div style="display: flex;">
                <p style="margin-right: 10px;width: 75px;text-align: center;">默认通过项:</p>
                <div>
                    <div>
                        <el-radio v-model="DefaultOpt" label="0">否</el-radio>
                    </div>
                    <div>
                        <el-radio v-model="DefaultOpt" label="1">默认通过APP不显示</el-radio>
                    </div>
                    <div>
                        <el-radio v-model="DefaultOpt" label="2">默认通过APP显示(不可更改结果)</el-radio>
                    </div>
                </div>
            </div>
            <div style="text-align: center;margin-top: 10px;">
                <el-button @click="isviewDetails=false">取消</el-button>
                <el-button type="primary" style="margin-right: 20px;" @click="Preservation()">保存</el-button>
            </div>
        </el-dialog>
        <!--设置检查内容 end-->
    
        <!--任务指定到人-->
        <el-dialog
                title="任务指定到人"
                append-to-body
                :visible.sync="userDialog"
                top='10vh'
                highlight-current-row
                width="80%"
                :before-close="closeUserDialog">
            <el-button type="primary" @click="appendUser" style="margin-bottom:10px;">新增人员</el-button>
            <el-table
                    :data="checkUserJsonData"
                    border
                    fit
                    height="500px">
                <el-table-column type="index" width="40" align="center"></el-table-column>

                <el-table-column label="人员" min-width="150px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.UserName || scope.row.Name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所属区域" min-width="150px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.CommunityName || scope.row.StoreAddress}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="负责门店" min-width="150px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- <div v-if="scope.row.checkStoreJson">
                            <span  
                                v-for="item in scope.row.checkStoreJson"
                                :key="item.UserRealId">
                                {{item.UserName}}
                            </span>
                        </div> -->
                        <span class="linkType" v-if="scope.row.checkStoreJson && scope.row.checkStoreJson.length>0" @click="settingStore(scope.$index,1,scope.row.checkStoreJson)" v-text="scope.row.checkStoreJson.length+'门店'"></span>
                        <span v-else class="linkType" @click="settingStore(scope.$index,0,0)">设置</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150px">           
                    <template slot-scope="scope">
                        <el-button type="text" @click="removeUser(scope.row,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeUserDialog">取 消</el-button>
                <el-button type="primary" style="margin-left: 20px" @click="saveStoreFn">保 存</el-button>
            </span>
        </el-dialog>
        <!--人员-->
        <el-dialog
                v-if = "userContentDialog"
                title="添加人员"
                append-to-body
                :visible.sync="userContentDialog"
                top='10vh'
                width="50%"
                height="400px">
            <area-or-user @checkUserData="checkUserData" :defaultCheckuserId="defaultCheckuserId" ref="areaOrUser" v-if="userContentDialog"></area-or-user>
        </el-dialog>
        <!--已选门店列表-->
        <el-dialog
                title="已选门店"
                append-to-body
                :visible.sync="storeDialog"
                top='10vh'
                width="50%">
                <el-table
                    :data="hisStoreData"
                    border
                    fit
                    height="500px"
                    @selection-change="handleSelectionStore">
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="单位名称" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.StoreName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属区域" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.StoreAddress }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer" v-if="isShowButton == 0 || isShowButton ==1">
                    <el-button @click="storeDialog=false">取消</el-button>
                    <el-button type="primary" style="margin-left: 20px" @click="resetStoreDataFn">确定</el-button>
                </span>
        </el-dialog>
        <!--分配过的门店回显-->
        <el-dialog
                title="已选门店"
                append-to-body
                :visible.sync="allStoreDataDialog"
                top='10vh'
                v-if="allStoreDataDialog"
                width="50%">
                <el-table
                    :data="allStoreData"
                    border
                    fit
                    height="500px"
                    ref="allStoreDataTable"
                    @selection-change="handleSelectionStoreNew">
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="单位名称" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.StoreName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属区域" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.StoreAddress }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer" v-if="isShowButton == 0 || isShowButton ==1">
                    <el-button @click="storeDialog=false">取消</el-button>
                    <el-button type="primary" style="margin-left: 20px" @click="resetStoreDataFnNew">确定</el-button>
                </span>
        </el-dialog>
        <!--设置网格分工-->
        <el-dialog
                title="已选门店"
                append-to-body
                :visible.sync="settingWg"
                fullscreen="fullscreen"
                top="0"
                width="100%">
                <meshUserSetting></meshUserSetting>
        </el-dialog>
        <!--设置网格分工-->
        <el-dialog
                title="已选门店"
                append-to-body
                :visible.sync="settingTd"
                fullscreen="fullscreen"
                top="0"
                class="settingTd"
                width="100%">
                <task-per-setting></task-per-setting>
        </el-dialog>
        <span slot="footer" class="dialog-footer" style="margin-top:10px;text-align:center;width:100%;display:block;">
            <el-button v-if="isShowButton == 2 || isShowButton != 0" @click="cancel">取 消</el-button>
            <el-button v-if="isShowButton == 0" @click="savePublish" :disabled="isDisable">保存不发布</el-button>
            <el-button v-if="isShowButton == 0 || isShowButton ==1 " type="primary" style="margin-left: 20px" @click="publish" :disabled="isDisable">发 布</el-button>
            <el-button v-if="savaTaskInfo.TaskType == 1" type="primary" @click="saveTemporary">保 存</el-button>
        </span>
        <!-- <span slot="footer" v-if="!isShowButton" class="dialog-footer" style="margin-top:10px;text-align:center;width:100%;display:block;">
            <el-button @click="cancel">取消</el-button>
        </span> -->
    </div>
</template>
<script src="./publisPatrolTask.js"></script>
<style scoped type="text/scss" lang="scss">
     .el-radio {
            line-height: 44px;
        }

    .Picture{
        width: 50px;
        height:50px;
        display: block;
    }
    .cardLabel {
        text-align: center;
        vertical-align: middle;
        font-size: 14px;
        color: #606266;
        line-height: 34px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 110px;
        display: inline-block;
        font-weight: 400;
    }

    .cardTitle {
        font-size: 16px;
    }

    .selectItem {
        width: 250px;
    }

    .cardItem {
        margin-bottom: 10px;
        .cardItemInput {
            width: 200px;
        }
    }

    .mast {
        color: #F56C6C;
    }
    .link{
            text-decoration: underline;
    }
</style>
<style>
  .settingTd .el-dialog__body{
        height:calc(100vh - 50px);
    }
</style>


