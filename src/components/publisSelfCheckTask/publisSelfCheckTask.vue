<template>
    <div class="publishSelfCheckTask">
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span class="cardTitle">基础信息</span>
            </div>
            <div class="cardItem">
                <label class="cardLabel">业态类型 <i class="mast">*</i></label>
                <el-select clearable class="selectItem" :filterable="createTask.info.businessType.length > 7" v-if="createTask.info.businessType.length > 0" v-model="savaTaskInfo.StoreTypeId" @change="onOperateChange">
                    <el-option
                            v-for="item in createTask.info.businessType"
                            :key="item.LevelCode"
                            :label="item.Name"
                            :value="item.Id">
                    </el-option>
                </el-select>
                <el-select clearable class="selectItem" :filterable="createTask.info.businessType.length > 7" v-else @change="onOperateChange" v-model="savaTaskInfo.StoreTypeId">
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
                <el-select clearable class="selectItem" :filterable="createTask.info.checkType.length > 7" v-if="createTask.info.checkType.length > 0" v-model="TaskTypeId">
                    <el-option
                            v-for="item in createTask.info.checkType"
                            :key="item.Text"
                            :label="item.Text"
                            :value="item.Id">
                    </el-option>
                </el-select>
                <el-select clearable class="selectItem" :filterable="createTask.info.checkType.length > 7" v-else v-model="TaskTypeId">
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
                <el-input class="selectItem" type="text" v-model="savaTaskInfo.Name" maxlength="15" placeholder="最多输入15个字"></el-input>
                <!-- <span style="font-size:12px;margin-left:20px;">最多输入<i class="mast">15</i>个字！</span> -->
            </div>
            <div class="cardItem">
                <label class="cardLabel">任务说明</label>
                <el-input class="selectItem" style="width:50%" rows="3" type="textarea" maxlength="500" v-model="savaTaskInfo.Explain" placeholder="最多输入500个字"></el-input>
                <!-- <span style="font-size:12px;margin-left:20px;">最多输入<i class="mast">500</i>个字！</span> -->
            </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-top: 10px">
            <div slot="header" class="clearfix">
                <span class="cardTitle">任务周期 </span>
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
			<div class="cardItem" style="display: flex;">
				<label for="" class="cardLabel">
                    <el-radio v-model="savaTaskInfo.ByMethod" :label="3" @change="changeByMethod">自定义</el-radio>
				</label>
				<div style="display: flex;">
					<span style="color: #606266;font-weight: 400;line-height: 44px;">重复 :</span>
					<el-select style="width: 110px;margin-left: 5px;line-height: 44px;height: 32px;" v-model="savaTaskInfo.FrequencyCompary" :disabled="savaTaskInfo.ByMethod==3?false:true" @change="changeFrequencyCompary">
						<el-option label="每周重复" :value="2"></el-option>
						<el-option label="每月重复" :value="3"></el-option>
					</el-select>
                    <el-checkbox-group v-if="savaTaskInfo.FrequencyCompary==2" v-model="weekData.code" size="small" style="line-height: 44px;margin-left: 10px;" class="choseData" :disabled="savaTaskInfo.ByMethod==3?false:true">
                        <el-checkbox-button v-for="item in weekData.datas" :label="item.value" :value="item.value" :key="item.value"  @change="changeDayNum">{{item.label}}</el-checkbox-button>
                    </el-checkbox-group>
                    <div v-if="savaTaskInfo.FrequencyCompary==2 && weekData.code.length>0"  style="line-height: 44px;margin-left: 10px;">每周 <span>{{totalweek}}</span> 重复</div>
                    <el-checkbox-group v-if="savaTaskInfo.FrequencyCompary==3" v-model="monthData.code" size="small" style="line-height: 44px;margin-left: 10px;width: 245px;" class="choseDataMonth" :disabled="savaTaskInfo.ByMethod==3?false:true" >
                        <el-checkbox-button v-for="item in monthData.datas" :label="item.label" :value="item.value" :key="item.value" @change="changeDayNum">{{item.label}}</el-checkbox-button>
                    </el-checkbox-group>
                    <div v-if="savaTaskInfo.FrequencyCompary==3 && monthData.code.length>0"  style="line-height: 44px;margin-left: 10px;">每月 <span>{{totalMarks}}</span> 重复</div>
				</div>
			</div>
            <div class="cardItem">
                <label class="cardLabel">
                    <el-radio v-model="savaTaskInfo.ByMethod" :label="1" @change="changeByMethod">频次</el-radio>
                </label>
                <el-input-number v-model="savaTaskInfo.Frequency" size="small" :min="1" :max="FrequencyMax" label="描述文字" @change="changeFrequency" :disabled="savaTaskInfo.ByMethod==1?false:true"></el-input-number>
                <el-select style="margin-left: 20px;width: 150px" class="selectItem" v-model="savaTaskInfo.FrequencyCompary" @change="FrequencyChange" :disabled="savaTaskInfo.ByMethod==1?false:true">
                    <el-option label="次/每天" :value="1"></el-option>
                    <el-option label="次/每周" :value="2"></el-option>
                    <el-option label="次/每月" :value="3"></el-option>
                    <el-option label="次/每季度" :value="4"></el-option>
                    <el-option label="次/每半年" :value="5"></el-option>
                    <el-option label="次/每年" :value="6"></el-option>
                </el-select>
            </div>
            <div class="cardItem">
                <label class="cardLabel">
                    <el-radio v-model="savaTaskInfo.ByMethod" :label="2" @change="changeByMethod">次数</el-radio>
                </label>
                <el-input-number v-model="savaTaskInfo.Times" size="small" :min="1" :max="days" label="描述文字" :disabled="savaTaskInfo.ByMethod==2?false:true"></el-input-number>
                <span style="margin-left: 20px">次</span>
            </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-top: 10px">
            <div slot="header" class="clearfix">
                <span class="cardTitle">任务执行设置</span>
            </div>
            <div class="cardItem">
                <label class="cardLabel">检查对象 <i class="mast">*</i></label>
                <el-input class="cardItemInput" v-model="checkValue" @click.native="showCheckObjDialogList"></el-input>
            </div>
            <div class="cardItem">
                <label class="cardLabel">检查内容 <i class="mast">*</i></label>
                <el-input class="cardItemInput" v-model="checkingLeng" @click.native="showCheckingContentDialog"></el-input>
            </div>
            <div>
                <!--<el-tooltip placement="top" style="cursor: pointer" :content="rules">-->
                    <!---->
                <!--</el-tooltip>-->
                <span style="margin-left: 17px">新门店符合设置的条件，自动加入本次任务</span>
                <el-radio style="margin-left: 10px" v-model="savaTaskInfo.IsOpen" :label="1">启用</el-radio>
                <el-radio v-model="savaTaskInfo.IsOpen" :label="0">不启用</el-radio>
            </div>
            <!--<el-popover-->
                    <!--placement="top"-->
                    <!--width="160"-->
                    <!--trigger="hover">-->
                <!--<p>这是一段内容这是一段内容确定删除吗？</p>-->
                <!--<div style="text-align: right; margin: 0">-->
                    <!--<el-button size="mini" type="text" @click="visible2 = false">取消</el-button>-->
                    <!--<el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>-->
                <!--</div>-->
                <!--<span slot="reference" style="width: 300px;overflow: hidden;text-overflow: ellipsis;display: inline-block;white-space: nowrap">一二三四五六七</span>-->
            <!--</el-popover>-->
            <div v-show="rules.length>0" style="margin-left: 17px">
                <span style="color: #999">按类型筛选规则：</span>
                <el-popover
                        placement="top-start"
                        title="规则详情"
                        width="500"
                        trigger="hover"
                >
                    <div>
                        <div v-show="rule_operateStr.length>0">
                            <span>业态：</span>
                            <span v-text="rule_operateStr"></span>
                        </div>
                        <div v-show="rule_area.length>0">
                            <span>区域：</span>
                            <span v-text="rule_area"></span>
                        </div>
                        <div v-show="rule_businessStr.length>0">
                            <span>商圈：</span>
                            <span v-text="rule_businessStr"></span>
                        </div>
                        <div v-show="rule_permit.length>0">
                            <span>许可证号包含：</span>
                            <span v-text="rule_permit"></span>
                        </div>
                        <div v-show="rule_storeName.length>0">
                            <span>门店名称包含：</span>
                            <span v-text="rule_storeName"></span>
                        </div>
                        <div v-show="rule_comName.length>0">
                            <span>单位名称包含：</span>
                            <span v-text="rule_comName"></span>
                        </div>
                        <div v-show="rule_restsize.length>0">
                            <span>餐厅规模包含：</span>
                            <span v-text="rule_restsize"></span>
                        </div>
                    </div>
                    <el-button  slot="reference" style="text-align: left;padding-left: 4px;color:#409EFF;width: 380px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap" v-text="rules"></el-button>
                </el-popover>
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
            <ChooseStore @storesResult="storesResult"
                         :rule="savaTaskInfo.PatrolTaskRuleOptionInfoList"
                         @setRule="setRule"
                         :OperateId="savaTaskInfo.StoreTypeId"
                         :ProcessType="1"
                         :selectedStores="selectedStores"
                         :subUserId="savaTaskInfo.SubId"
                         :isShowButtonStore="isShowButtonStore"></ChooseStore>
        </el-dialog>
        <!--检查对象 end-->
        <el-dialog
                title="检查内容"
                append-to-body
                :visible.sync="checkingContent.checkingContentDialog.show"
                top='10vh'
                width="80%">
            <div class="maxDialog">
                <el-table
                        width="100%"
                        center
                        border
                        style="width: 100%;margin-top: 10px"
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
                    <!-- <el-table-column :label="checkingContent.checkingContentTable.img" min-width="60px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span><img class="Picture" :src="scope.row.Picture==''?'无':scope.row.Picture"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.important" min-width="55px" show-overflow-tooltip>
                        <template slot-scope="scope">
                           <span>{{scope.row.LevelText}}</span>
                       </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.voice" min-width="55px" show-overflow-tooltip> -->
                    <!-- <template slot-scope="scope">
                        <span>{{scope.row.HasGuidedGraph}}</span>
                    </template> -->
                    <!-- </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.operationSteps" min-width="76px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.InspectMethod}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.guidedImg" min-width="55px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.HasGuidedGraph == false?'无':'有'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.guidanceLang" min-width="76px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.HasGuideLanguage == false?'无':'有'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.isEnabled" min-width="76px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.IsValid == false?'无':'有'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.defaultPass" min-width="86px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.DefaultOpt == 0">否</span>
                            <span v-if="scope.row.DefaultOpt == 1">默认通过APP不显示</span>
                            <span v-if="scope.row.DefaultOpt == 2">默认通过APP显示（不可更改结果）</span>
                            <span v-if="scope.row.DefaultOpt == null">无</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="checkingContent.checkingContentTable.operate" min-width="55px" show-overflow-tooltip>
                        <template slot-scope="scope">
                          
                           <el-button type="text" @click="setDefaultOpt(scope.row)">设置</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer" v-if="isShowButton == 0 || isShowButton ==1">
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
        <span slot="footer" class="dialog-footer" style="margin-top:10px;text-align:center;width:100%;display:block;">
            <!-- <el-button @click="cancel">取消</el-button>
            <el-button type="primary"  v-if="isShowButton" style="margin-left: 20px" @click="publish">发布</el-button> -->

            <el-button v-if="isShowButton == 2 || isShowButton != 0" @click="cancel">取消</el-button>
            <el-button v-if="isShowButton == 0" @click="savePublish" :disabled="isDisable">保存不发布</el-button>
            <el-button v-if="isShowButton == 0 || isShowButton ==1 " type="primary" style="margin-left: 20px" @click="publish" :disabled="isDisable">发 布</el-button>
        </span>

    </div>
</template>
<script src="./publisSelfCheckTask.js"></script>
<style scoped type="text/scss" lang="scss">
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

    .el-radio {
        line-height: 44px;
    }

    .Picture {
        width: 50px;
        height: 50px;
        display: block;
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

    .publishSelfCheckTask {
        .el-tag--info i {
            display: none;
        }
        .el-select__tags {
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;

        }
    }
</style>
<style>
    .choseData .el-checkbox-button--small .el-checkbox-button__inner{
        padding: 10px !important;
    }
    .choseDataMonth .el-checkbox-button--small .el-checkbox-button__inner{
        padding: 0;
        width: 34px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        border-left: 1px solid #dcdfe6;
    }
    .el-input__inner{
        height: 32px !important;
    }
</style>
