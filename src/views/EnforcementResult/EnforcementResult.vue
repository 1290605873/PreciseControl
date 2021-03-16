<template>
    <!-- 执法结果 -->
    <div class="EnforcementResult" style="height: 100%;">
        <el-tabs style="height: 100%;" v-model="operationlist.code" @tab-click="handleClick" type="border-card">
            <el-tab-pane v-for="item in operationlist.datas" :label="item.Name" :name="item.Id" :value="item.Id"></el-tab-pane>
            <div class="secondlevel">
                <el-tabs v-model="inspectionlist.code" @tab-click="taskTabsClick">
                    <el-tab-pane v-for="item in inspectionlist.datas" :label="item.Text" :name="item.Id" :value="item.Id"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="table right">
                <div class="addbutton" style="margin-bottom: 10px;">
                    <el-button type="primary" plain @click="addview">添加</el-button>
                </div>
                <el-table :data="tablelist" border class="main-table" ref="table" id="table" style="overflow: auto;"
                    @selection-change="">
                    <el-table-column type="index" align="" label="序号" width="50" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="Text" label="标题" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="IsDefault" label="是否默认值" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.IsDefault">是</span>
                            <span v-if="!scope.row.IsDefault">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="IsDeadline" label="是否有限期" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.IsDeadline">是</span>
                            <span v-if="!scope.row.IsDeadline">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="IsReform" label="是否启用整改" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.IsReform">是</span>
                            <span v-if="!scope.row.IsReform">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="IsReform" label="是否开出执法凭证" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.IsAuto">是</span>
                            <span v-if="!scope.row.IsAuto">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="" label="操作" width="" show-overflow-tooltip>
                        <!-- <template slot="header" slot-scope="scope">
                            <div style="text-align: right !important;width: 100%">
                                <el-button plain type="primary" @click="addview">添加</el-button>
                            </div>
                        </template> -->
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="modifylist(scope.$index)">
                                修改
                            </el-button>
                            <el-button size="mini" type="danger" @click="DelEByIds(scope.$index)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <pagination 
                 v-show="total>0" 
                 :total="total" 
                 :page.sync="searchValue.page" 
                 :limit.sync="searchValue.rows"
                 @pagination="getBasicOptionList"
                 class="main-bottom" id="main-bottom" /> -->
            </div>
            <el-dialog :title="title" :visible.sync="gridParam.isviewAdd" :close-on-click-modal="false" class="dialogHeight"
                width="25%" v-if="gridParam.isviewAdd" height="500" v-dialogDrag>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 100px;text-align: right;margin-right: 5px;">标题:</p>
                    <el-input clearable type="text" style="line-height: 44px;width: 180px;" @input.native="changeCode"
                        placeholder="最多可输入20个汉字" v-model="gridParam.Text" maxlength="20"></el-input>
                </div>
                <div style="display: flex;padding-right: 40px;" prop="checkNum">
                    <p style="width: 100px;text-align: right;margin-right: 5px;">是否默认值:</p>
                    <el-radio v-model="gridParam.IsDefault" :label="true" style="line-height: 44px;">是</el-radio>
                    <el-radio v-model="gridParam.IsDefault" :label="false" style="line-height: 44px;">否</el-radio>
                </div>
                <div style="display: flex;padding-right: 40px;" prop="checkNum">
                    <p style="width: 100px;text-align: right;margin-right: 5px;">是否有限期:</p>
                    <el-radio v-model="gridParam.IsDeadline" :label="true" style="line-height: 44px;">是</el-radio>
                    <el-radio v-model="gridParam.IsDeadline" :label="false" style="line-height: 44px;">否</el-radio>

                </div>
                <div style="display: flex;padding-right: 40px;" prop="checkNum">
                    <p style="width: 116px;text-align: right;margin-right: 5px;">是否启用整改</p>
                    <el-radio v-model="gridParam.IsReform" :label="true" style="line-height: 44px;">是</el-radio>
                    <el-radio v-model="gridParam.IsReform" :label="false" style="line-height: 44px;">否</el-radio>

                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 116px;text-align: right;margin-right: 5px;">是否开出执法凭证</p>
                    <el-radio v-model="gridParam.IsEnforceVoucher" :label="true" style="line-height: 44px;">是</el-radio>
                    <el-radio v-model="gridParam.IsEnforceVoucher" :label="false" style="line-height: 44px;">否</el-radio>

                </div>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button @click="gridParam.isviewAdd=false">取消</el-button>
                    <el-button type="primary" style="margin-right: 20px;" @click="addTitle()">保存</el-button>
                </div>
            </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/EnforcementResult/EnforcementResult.js">
</script>

<style scoped lang="scss">
    .EnforcementResult {
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
