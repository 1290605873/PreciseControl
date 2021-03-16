<template>
    <div class="Checkitemsettings" style="height: 100%;">
        <el-tabs v-model="operationlist.code" @tab-click="handleClick" type="border-card" style="height: 100%;">
            <el-tab-pane v-for="item in operationlist.datas" :label="item.Name" :name="item.Id" :value="item.Id"></el-tab-pane>
            <div>
                <el-tabs v-model="inspectionlist.code" @tab-click="taskTabsClick">
                    <el-tab-pane v-for="item in inspectionlist.datas" :name="item.Id" :label="item.Text" :value="item.Id"></el-tab-pane>
                </el-tabs>
            </div>
            <div>
                <el-container>
                    <el-aside width="200px" class="left">
                        <div class="classifyItemWrap">
                            <div class="classifyItem"
                                 @click="classfifyClick(inx)"
                                 v-for="(classifyItem ,inx) in classify.datas"
                                 :key="classifyItem.Id"
                                 :class="{classifyItemCurrent:inx==classify.currentIndex}">
                                <span v-text="classifyItem.Text"></span>
                            </div>
                        </div>    
                    </el-aside>
                    <el-main class="right">
                        <el-table
                                :data="tablelist"
                                v-loading="Loading"
                                border
                                highlight-current-row
                                class="main-table"
                                ref="table"
                                id="table"
                                height="100%">
                            <!-- <el-table-column type="index" align="" label="序号" width="50" show-overflow-tooltip>
                            </el-table-column> -->
<!--                            <el-table-column type="selection" align="center" width="55">
                            </el-table-column> -->
<!--                            <el-table-column property="ClassificationIdName" label="分类/类型" align="center" width="">
                            </el-table-column> -->
                            <el-table-column property="Text" label="名称" align="" width="" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="Remark" label="说明" align="" width="" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="Picture" label="图片说明" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <img :src="getThumbPic(scope.row.Picture)" alt="" style="width: 40px;height: 40px;border-radius: 4px;">
                                </template>
                            </el-table-column>
                            <!-- <el-table-column property="BusinessApplication" label="业务应用" align="center" width="">
                                <template slot-scope="scope">
                                    <p v-if="scope.row.BusinessApplication == null||''">无</p>
                                    <p v-else>{{scope.row.BusinessApplication}}</p>
                                </template>
                            </el-table-column> -->
                            <el-table-column property="LevelText" label="重要项" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <p v-if="scope.row.LevelId == null||scope.row.LevelId ==''">无</p>
                                    <p v-else>有</p> -->
                                    <span v-text="scope.row.LevelId==null||scope.row.LevelId==''?'无':'有'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column property="InspectMethod" label="操作步骤" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <p v-if="scope.row.LevelText == null||scope.row.LevelText ==''">无</p>
                                    <p v-else>{{scope.row.LevelText}}</p> -->
                                    <span v-text="scope.row.InspectMethod!=4?'有':'无'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column property="IsVoicePlay" label="语音" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <p v-if="scope.row.LevelText == null||scope.row.LevelText ==''">无</p>
                                    <p v-else>{{scope.row.LevelText}}</p> -->
                                    <span v-text="scope.row.IsVoicePlay?'是':'否'"></span>
                                </template>
                            </el-table-column>
                            <el-table-column property="HasGuidedGraph" label="引导图" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p v-if="scope.row.HasGuidedGraph">有</p>
                                    <p v-else>无</p>
                                </template>
                            </el-table-column>
                            <el-table-column property="HasGuideLanguage" label="引导语" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p v-if="scope.row.HasGuideLanguage">有</p>
                                    <p v-else>无</p>
                                </template>
                            </el-table-column>
                            <el-table-column property="IsValid" label="是否启用" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p v-if="scope.row.IsValid == 0">禁用</p>
                                    <p v-if="scope.row.IsValid == 1">启用</p>
                                    <p v-if="scope.row.IsValid == null">禁用</p>
                                </template>
                            </el-table-column>
                            <el-table-column property="CheckResult" label="检查结果" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.CheckResult == true||scope.row.CheckResult == null">合格/不合格</span>
                                    <span v-if="scope.row.CheckResult == false">合格/不合格/不适用</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column property="DefaultOpt" label="默认通过项" align="center" width="">
                                <template slot-scope="scope">
                                    <p v-if="scope.row.DefaultOpt == 0">否</p>
                                    <p v-if="scope.row.DefaultOpt == 1">默认通过APP不显示</p>
                                    <p v-if="scope.row.DefaultOpt == 2">默认通过APP显示（不可更改结果）</p>
                                    <p v-if="scope.row.DefaultOpt == null">无</p>
                                </template>
                            </el-table-column> -->
                            <el-table-column label="操作" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="SetDefaultOpt(scope.$index)">
                                        设置
                                    </el-button>
                                    <!-- <el-button type="text" @click="modifyEById(scope.$index)">
                                        修改
                                    </el-button> -->
                                    <!-- <el-button type="text" @click="DelEByIds(scope.$index)">
                                        删除
                                    </el-button> -->
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination 
                         v-show="total>=0" 
                         :total="total" 
                         :page.sync="searchValue.page" 
                         :limit.sync="searchValue.rows"
                         @pagination="getInspectOptionList"
                         class="main-bottom" id="main-bottom" />
                    </el-main>
                </el-container>
                <el-dialog title="设置检查项业务属性" :visible.sync="gridParam.isviewDetails" :close-on-click-modal="false" class="dialogHeight"
                    width="30%" v-if="gridParam.isviewDetails" height="500" v-dialogDrag style="margin-bottom: 0;">
                    <div style="display: flex;">
                        <p style="margin-right: 10px;width: 75px;text-align: center;">是否启用:</p>
                        <el-radio v-model="IsValid" :label="0">禁用</el-radio>
                        <el-radio v-model="IsValid" :label="1">启用</el-radio>
                        <!-- <el-radio v-model="IsValid" :label="null">禁用</el-radio> -->
                    </div>
                    <div style="display: flex;">
                        <p style="margin-right: 10px;width: 75px;text-align: center;">检查结果:</p>
                        <!-- <el-radio v-model="CheckResult1" :label="true">合格/不合格</el-radio> -->
                        <!-- <el-radio v-model="CheckResult" :label="false" @change="changeresult()">不适用</el-radio> -->
                        <el-checkbox v-model="CheckResultl" :checked="true" disabled style="line-height: 44px;">合格/不合格</el-checkbox>
                        <el-checkbox v-model="CheckResultr" :label="false" @change="changeresult()" style="line-height: 44px;">不适用</el-checkbox>
                        <!-- <el-radio v-model="IsValid" :label="null">禁用</el-radio> -->
                    </div>
                    <!-- <div style="display: flex;">
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
                    </div> -->
                    <div style="text-align: center;margin-top: 10px;">
                        <el-button @click="gridParam.isviewDetails=false">取消</el-button>
                        <el-button type="primary" style="margin-right: 20px;" @click="Preservation()">保存</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-tabs>

        <!-- <button @click="btn()">按钮</button> -->
    </div>
</template>

<script src="@/views/Checkitemsettings/Checkitemsettings.js">
</script>

<style scoped lang="scss">
    .el-dialog {
        .el-radio {
            line-height: 44px;
        }

        .el-dialog__body {
            padding: 20px;
        }
    }
        .classifyItemWrap {
            height: 100%;
            padding-bottom: 100px;
            overflow-y: auto;
            background: rgb(236, 245, 255);
            .classifyItem {
                font-size: 14px;
                color: #909399;
                height: 40px;
                text-align: left;
                padding-left: 10px;
                padding-right: 10px;
                span {
                    display: inline-block;
                    line-height: 40px;
                    max-width: 70%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                i {
                    display: inline-block;
                    line-height: 40px;
                    float: right;
                    visibility: hidden;
                }
            }
            .classifyItem:hover {
                height: 40px;
                background-color: rgb(121, 187, 255);
                color: #fff;
                text-align: left;
                padding-left: 10px;
                opacity: 0.7;
                span {
                    display: inline-block;
                    line-height: 40px;
                    max-width: 70%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                i {
                    display: inline-block;
                    line-height: 40px;
                    float: right;
                    visibility: visible;
        
                }
                i:hover{
                   color: #303133;
                }
            }
        }
        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color:rgb(121, 187, 255);
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
            padding:0 20px;
            .main-table{
                height: 300px;
            }
        }            
</style>
<style lang="scss">
    .Checkitemsettings{
        .el-aside {
            border: 1px solid $defaultColor;
        }
        .el-table thead{
            color: #666666;
        }
        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color: rgb(121, 187, 255);
        }
        p,span{
            -webkit-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;
        }                
    }
</style>
