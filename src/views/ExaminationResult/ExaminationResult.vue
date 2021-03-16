<template>
    <!-- 检查结果 -->
    <div class="ExaminationResult" style="height: 100%;">
        <el-tabs style="height: 100%;" v-model="operationlist.code" @tab-click="handleClick" type="border-card">
            <el-tab-pane v-for="item in operationlist.datas" :label="item.Name" :name="item.Id" :value="item.Id"></el-tab-pane>
            <div class="secondlevel">
                <el-tabs v-model="inspectionlist.code" @tab-click="taskTabsClick">
                    <el-tab-pane v-for="item in inspectionlist.datas" :label="item.Text" :name="item.Id" :value="item.Id"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="table right">
                <div class="addbutton" style="margin-bottom: 10px;">
                    <el-button type="primary" plain @click="gridParam.isviewAdd=true;gridParam.Text='';gridParam.Score=0;gridParam.Id='';gridParam.state=true;title='添加'">添加</el-button>
                </div>
                <el-table
                        :data="tablelist"
                        border
                        highlight-current-row
                        class="main-table"
                        ref="table"
                        id="table"
                        style="overflow: auto;"
                    @selection-change="">
                    <el-table-column type="index" align="" label="序号" width="50" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="Text" label="标题" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="Score" label="严重程度顺序" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="IsDefault" label="状态" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.IsDefault == true">合格</span>
                            <span v-if="scope.row.IsDefault == false">不合格(地图中门店图标显示感叹号)</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="" label="操作" width="" show-overflow-tooltip>
                        <!--                                <template slot="header"   slot-scope="scope">
                                    <div style="text-align: right !important;width: 100%">
                                        <el-button plain type="primary" @click="gridParam.isviewAdd=true;gridParam.Text='';gridParam.Score='';gridParam.Id='';">添加</el-button>
                                    </div>
                                </template>  -->
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="modifylist(scope.$index)">
                                修改
                            </el-button>
                            <el-button size="mini" type="success" @click="Settingconditions(scope.$index)">
                                设置条件
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
                 class="main-bottom" id="main-bottom" /> -->
            </div>
            <el-dialog :title="title" :visible.sync="gridParam.isviewAdd" :close-on-click-modal="false" class="dialogHeight"
                width="30%" v-if="gridParam.isviewAdd" height="500" v-dialogDrag>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 150px;text-align: right;margin-right: 5px;">标题:</p>
                    <el-input clearable type="text" style="line-height: 44px;width: 350px;" v-model="gridParam.Text"
                        placeholder="最多可输入20个汉字" @input.native="changeCode" maxlength="20"></el-input>
                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 150px;text-align: right;margin-right: 5px;">严重程度顺序:</p>
                    <!-- <el-input clearable type="number" style="line-height: 44px;" v-model="gridParam.Score" placeholder="请输入数字" v-enter-number maxlength="6"></el-input> -->
                   <el-input-number size="small" style="height: 32px;margin-top: 6px;width: 350px;" v-model="gridParam.Score"
                        controls-position="right" @change="handleChange" :min="0" :max="999999"></el-input-number>
                </div>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 150px;text-align: right;margin-right: 5px;">状态:</p>
                    <div>
                        <el-radio v-model="gridParam.state" :label="true" ref="ref" style="line-height: 44px;margin: 0;">合格</el-radio>
                        <el-radio v-model="gridParam.state" :label="false" ref="ref" style="line-height: 44px;margin: 0;">不合格(地图中门店图标显示感叹号)</el-radio>
                    </div>
                </div>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button @click="gridParam.isviewAdd=false">取消</el-button>
                    <el-button type="primary" style="margin-right: 20px;" @click="addTitle()">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="设置条件" :visible.sync="gridParam.isviewCondition" :close-on-click-modal="false" class="dialogHeight"
                width="50%" v-if="gridParam.isviewCondition" height="500" v-dialogDrag>
                <div class="" style="display: flex;">
                    <p style="margin-right: 5px;">编辑条件:</p>
                    <!-- <el-input type="text" v-model="gridParam.EditingConditions" style="line-height: 44px;width: 200px;"></el-input> -->
                    <el-select v-model="gridParam.EditingConditions" placeholder="请选择" @change="selectGet($event)" :filterable="gridParam.EditingList.length > 7"
                        style="line-height: 44px;margin-right: 20px;width: 150px;">
                        <el-option v-for="item in gridParam.EditingList" :key="item.Id" :label="item.Text" :value="item.Id"></el-option>
                    </el-select>
                    <el-select v-model="gridParam.condition" style="line-height: 44px;margin-right: 20px;width: 110px;">
                        <el-option label="大于等于" :key="1" :value="1">大于等于</el-option>
                        <el-option label="大于" :key="2" :value="2">大于</el-option>
                    </el-select>
                    <!-- <el-input clearable type="text" v-model="gridParam.conditioninput" style="line-height: 44px;width: 100px;"   min="1" oninput="if(value.length>6)value=value.slice(0,6)"></el-input> -->
                    <el-input-number size="small" style="height: 32px;margin-top: 6px;" v-model="gridParam.conditioninput"
                        controls-position="right" @change="handleChanget" :min="0" :max="999999"></el-input-number>
                    <el-button type="primary" style="height: 34px;margin-top: 5px;margin-left: 30px;" @click="Preservationcondition()">保存</el-button>
                </div>
                <p>条件列表</p>
                <el-table
                        :data="Conditionlist"
                        highlight-current-row
                        border
                        class="main-table"
                        ref="table"
                        :height="300"
                        id="table"
                        @selection-change="">
                    <el-table-column type="index" align="center" label="序号" width="50" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="Remark" label="巡查内容结果条件" align="center" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="text" @click="DelCondition(scope.$index)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="gridParam.isviewCondition = false">取消</el-button>
                    <el-button type="primary" @click="gridParam.isviewCondition = false">确定</el-button>
                </span>
            </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/ExaminationResult/ExaminationResult.js">
</script>

<style scoped lang="scss">
    .ExaminationResult {
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
