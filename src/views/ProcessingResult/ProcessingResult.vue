<template>
    <!-- 处理结果 -->
    <div class="ProcessingResult" style="height: 100%;">
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
                    <el-table-column property="PreviousText" label="对应巡查结果" align="" width="" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="IsDeadline" label="进入下一步" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.IsDeadline">是</span>
                            <span v-if="!scope.row.IsDeadline">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="" label="操作" width="" show-overflow-tooltip>
                        <!--                     <template slot="header" slot-scope="scope">
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
                 class="main-bottom" id="main-bottom" /> -->
            </div>
            <el-dialog :title="title"
                       :visible.sync="gridParam.isviewAdd"
                       :close-on-click-modal="false"
                       class="dialogHeight"
                       width="400px"
                       v-if="gridParam.isviewAdd"
                       height="500"
                       v-dialogDrag>
                <el-form>
                    <el-form-item label="标题" label-width="110px">
                        <el-input clearable type="text"
                                  style="line-height: 44px;width: 200px;"
                                  placeholder="最多可输入20个汉字"
                                  @input.native="changeCode"
                                  v-model="gridParam.Text"
                                  maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="对应巡查结果" label-width="110px">
                        <el-select clearable class="com-width" v-model="Inspectionresults.code" :filterable="Inspectionresults.datas.length > 7" placeholder="全部" style="line-height: 44px;width: 200px;">
                            <el-option v-for="item in Inspectionresults.datas" :key="item.Id" :label="item.Text" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="进入下一步" label-width="110px">
                        <el-radio v-model="gridParam.IsInspectItem" :label="true">是</el-radio>
                        <el-radio v-model="gridParam.IsInspectItem" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="自动流转" label-width="110px" v-show="gridParam.IsInspectItem">
                        <el-radio v-model="gridParam.IsAuto" :label="true">开启</el-radio>
                        <el-radio v-model="gridParam.IsAuto" :label="false">关闭</el-radio>
                    </el-form-item>
                    <el-form-item label="下步业务" label-width="110px" v-show="gridParam.IsInspectItem">
                        <el-checkbox-group v-model="gridParam.NextStep">
                            <el-checkbox label="1" >整改</el-checkbox>
                            <el-checkbox label="2" :disabled="gridParam.IsAuto">巡查</el-checkbox>
                            <el-checkbox label="3" :disabled="gridParam.IsAuto">执法</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
					 <el-button @click="gridParam.isviewAdd=false">取消</el-button>
					<el-button type="primary" style="margin-right: 20px;" @click="addTitle()">保存</el-button>
				</span>
            </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/ProcessingResult/ProcessingResult.js">
</script>

<style scoped lang="scss">
    .ProcessingResult {

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

    .el-radio {
        line-height: 44px;
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
