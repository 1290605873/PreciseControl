<template>
    <div class="SelfcheckingSetting" style="height: 100%;">
        <el-tabs style="height: 100%;" v-model="operationlist.code" @tab-click="handleClick" type="border-card">
            <el-tab-pane v-for="item in operationlist.datas" :label="item.Name" :name="item.Id" :value="item.Id"></el-tab-pane>
            <div class="secondlevel">
                <el-tabs v-model="inspectionlist.code" @tab-click="taskTabsClick">
                    <el-tab-pane v-for="item in inspectionlist.datas" :label="item.Text" :name="item.Id" :value="item.Id"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="table">
                <el-container>
                    <el-aside width="200px" class="left">
                        <div class="classifyItemWrap">
                            <div class="classifyItem" @click="classfifyClick(inx)" v-for="(classifyItem ,inx) in classify.datas"
                                :key="classifyItem.Id" :class="{classifyItemCurrent:inx==classify.currentIndex}">
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
                                :height="150"
                                style="overflow: auto;"
                                @selection-change="">
                            <el-table-column type="index" align="" label="序号" width="50" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="Text" label="自查点名称" align="" width="" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="Remark" label="说明" align="" width="" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="Picture" label="图片" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <img :src="getThumbPic(scope.row.Picture)" alt="" style="width: 40px;height: 40px;border-radius: 4px;">
                                </template>
                            </el-table-column>
                            <el-table-column property="InspectMethod" label="操作步骤" align="" width=""
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.InspectMethod>0">有</span>
                                    <span v-else>无</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="HasGuidedGraph" label="引导图" align="" width=""
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.HasGuidedGraph">有</span>
                                    <span v-else>无</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="HasGuideLanguage" label="引导语" align="" width=""
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.HasGuideLanguage">有</span>
                                    <span v-else>无</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="RoleByResponsible" label="责任人角色" align="" width=""
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.RoleByResponsible == '0'">食品安全管理员</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="CompletionCriteria" label="自查完成标准" align="" width=""
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.CompletionCriteria == '0'">单人通知，指定人执行</span>
                                    <span v-if="scope.row.CompletionCriteria == '1'">全员通知，全员完成</span>
                                    <span v-if="scope.row.CompletionCriteria == '2'">全员通知，谁做都行</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="NoticeTime" label="通知时间" align="" width="" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="NoticeNum" label="通知次数" align="" width="" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="NoticeInterval" label="通知时间间隔" align="" width=""
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column property="IsValid" label="是否启用" align="" width="" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p v-if="scope.row.IsValid == 0">禁用</p>
                                    <p v-if="scope.row.IsValid == 1">启用</p>
                                    <p v-if="scope.row.IsValid == null">禁用</p>
                                </template>
                            </el-table-column>                            
                            <el-table-column property="CheckResult" label="检查结果" align="" width=""
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.CheckResult == true||scope.row.CheckResult == null">合格/不合格</span>
                                    <span v-if="scope.row.CheckResult == false">合格/不合格/不适用</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="" width="80">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="SetupId(scope.$index)">
                                        设置
                                    </el-button>
                                    <!-- <el-button size="mini" type="danger" @click="DelEByIds(scope.row.Id)">
                                        删除
                                    </el-button> -->
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total>0" :total="total" :page.sync="searchValue.page" :limit.sync="searchValue.rows"
                            class="main-bottom" id="main-bottom" @pagination="getInspectOptionSetListAsync" />
                    </el-main>
                </el-container>
            </div>
            <el-dialog title="设置" :visible.sync="gridParam.settings" :close-on-click-modal="false" class="dialogHeight"
                width="30%" v-if="gridParam.settings" height="" v-dialogDrag style="margin-bottom: 0;">
                <ul>
                    <li>
                        <p>自查完成标准:</p>
                        <el-select v-model="gridParam.CompletionCriteria" placeholder="请选择" style="line-height: 44px;margin-right: 20px;width: 220px;">
                            <el-option key="0" label="单人通知，指定人执行" value="0"></el-option>
                            <el-option key="1" label="全员通知，全员完成" value="1"></el-option>
                            <el-option key="2" label="全员通知，谁做都行" value="2"></el-option>
                        </el-select>
                    </li>
                    <li>
                        <p>责任人角色:</p>
                        <el-select v-model="gridParam.RoleByResponsible" placeholder="请选择" style="line-height: 44px;margin-right: 20px;width: 220px;">
                            <el-option key="0" label="食品安全管理员" value="0"></el-option>
                        </el-select>
                        <!-- <el-input placeholder v-model="searchValue.RoleByResponsible" class="" style="width: 220px;line-height: 44px;"></el-input> -->
                    </li>
                    <li>
                        <p>通知时间:</p>
                        <el-select v-model="gridParam.EditingConditionshour" :filterable="gridParam.hour.length > 7" placeholder="时" style="line-height: 44px;margin-right: 20px;width: 100px;">
                            <el-option v-for="item in gridParam.hour" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="gridParam.EditingConditionsMinute" :filterable="gridParam.Minute.length > 7" placeholder="分" style="line-height: 44px;margin-right: 20px;width: 100px;">
                            <el-option v-for="item in gridParam.Minute" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </li>
                    <li>
                        <p>通知次数:</p>
                        <el-input placeholder v-model="gridParam.NoticeNum" class="" style="width: 220px;line-height: 44px;"></el-input>
                    </li>
                    <li>
                        <p>通知时间间隔:</p>
                        <el-input placeholder type="number" v-enter-number oninput="if(value.length>6)value=value.slice(0,6)"
                            v-model="searchValue.notificationsnum" class="" style="width: 100px;margin-right: 20px;line-height: 44px;"></el-input>
                        <el-select v-model="gridParam.EditingConditions" :filterable="gridParam.EditingList.length > 7" placeholder="分" style="line-height: 44px;margin-right: 20px;width: 100px;">
                            <el-option v-for="item in gridParam.EditingList" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </li>
                    <li>
                        <p>检查结果:</p>
                        <el-checkbox v-model="CheckResultl" :checked="true" disabled style="line-height: 44px;">合格/不合格</el-checkbox>
                        <el-checkbox v-model="CheckResultr" :label="false" @change="changeresult()" style="line-height: 44px;">不适用</el-checkbox>
                    </li>
                    <li>
                        <p style="">是否启用:</p>
                        <el-radio v-model="IsValid" :label="0" style="line-height: 44px;">禁用</el-radio>
                        <el-radio v-model="IsValid" :label="1" style="line-height: 44px;">启用</el-radio>
                    </li>
                </ul>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button @click="gridParam.settings=false">取消</el-button>
                    <el-button type="primary" style="margin-right: 20px;" @click="Update">保存</el-button>
                </div>
            </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/SelfcheckingSetting/SelfcheckingSetting.js">
</script>

<style scoped lang="scss" scoped>
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        padding: 0;

        .com-width {
            width: 130px;
        }

        .com-width-time {
            width: 140px
        }
    }
</style>
<style scoped lang="scss">
    .SelfcheckingSetting {
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
            padding: 0 20px;

            .main-table {
                height: 300px;
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

                i:hover {
                    color: #303133;
                }
            }
        }

        .classifyItemCurrent {
            opacity: 1;
            color: white !important;
            background-color: rgb(121, 187, 255);
        }

        .dialogHeight {
            ul {
                padding-left: 0;
                margin: 0;

                li {
                    list-style: none;
                    display: flex;

                    p {
                        width: 100px;
                        padding-left: 10px;
                    }
                }
            }
        }
    }

    .el-aside {
        // text-align: center;
        // border: 1px solid $defaultColor;
    }

    .el-table thead {
        color: #666666;
    }

    p,
    span {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
<style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>
