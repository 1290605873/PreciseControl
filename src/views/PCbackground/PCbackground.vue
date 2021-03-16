<template>
    <!-- 检查结果 -->
    <div class="PCbackground" style="height: 100%;">
        <el-tabs style="height: 100%;"
                 v-model="operationlist.code"
                 @tab-click="handleClick"
                 type="border-card">
            <el-tab-pane
                    v-for="item in operationlist.datas"
                    :label="item.Name"
                    :name="item.Id"
                    :value="item.Id">
            </el-tab-pane>
            <div class="table right">
                <div class="addbutton" style="margin-bottom: 10px;">
                    <el-button type="primary" plain
                               @click="openEditDialog('',0)">添加
                    </el-button>
                </div>
                <el-table
                        highlight-current-row
                        v-loading="loading"
                        :data="tablelist"
                        border
                        class="main-table"
                        ref="table"
                        id="table"
                        style="overflow: auto;"
                        @selection-change="">
                    <el-table-column type="index" align="" label="序号" width="50" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="检查项名称" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-text="scope.row.InspectOptionName"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="表单名称" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-text="scope.row.FormName"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="表单属性" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-text="scope.row.FieldName"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否启用表单数据" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-show="scope.row.IsEnable==1">启用</span>
                            <span v-show="scope.row.IsEnable==0">禁用</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="" width="" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button v-show="false" size="mini" type="primary" @click="openEditDialog(scope.row,1)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="deleteItem(scope.row.InspectOptionBusinessId,scope.row.FormId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination ref="pagination" v-show="total"
                            :total="total"
                            :page.sync="PageNo"
                            :limit.sync="PageSize"
                            @pagination="getInitData">
                </pagination>
            </div>
            <el-dialog
                    :title="title"
                    :visible.sync="isviewAdd"
                    :close-on-click-modal="false"
                    width="31%"
                    v-if="isviewAdd"
                    height="200px"
                    v-dialogDrag>
                <el-form ref="form"  label-width="80px" size="medium">
                    <el-form-item label="表单名称">
                        <el-select v-model="formNameValue" placeholder="请选择表单名称" :filterable="formName.length > 7" @change="changeFormName(formNameValue)">
                            <el-option
                                    v-for="item in formName"
                                    :key="item.formId"
                                    :label="item.formName"
                                    :value="item.formId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="表单属性">
                        <el-select v-model="AttributeValue" placeholder="请选择表单属性" :filterable="Attribute.length > 7">
                            <el-option
                                    v-for="item in Attribute"
                                    :key="item.fieldKey"
                                    :label="item.fieldName"
                                    :value="item.fieldKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="检查分类">
                        <el-select v-model="ItemNameValue" placeholder="请选择检查项分类" :filterable="ItemName.length > 7" @change="changeItem(ItemNameValue)">
                            <el-option
                                    v-for="item in ItemName"
                                    :key="item.Id"
                                    :label="item.Text"
                                    :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="检查项">
                        <el-select v-model="itemValue" placeholder="请选择检查项" :filterable="item.length > 7">
                            <el-option
                                    v-for="item in item"
                                    :key="item.Id"
                                    :label="item.Text"
                                    :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否启用">
                            <el-select clearable v-model="isenable" placeholder="请选择是否启用">
                                <el-option label="否" value="0"></el-option>
                                <el-option label="是" value="1"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="">
                       <span style="color: red">仅支持【一个步骤，一张照片】【一个步骤，多张照片】的检查项</span>
                    </el-form-item>
                    <el-form-item style="display:block;text-align:center;margin-top:80px;">
                        <el-button  @click="isviewAdd = false">取消</el-button>
                        <el-button type="primary" @click="submitForm">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/PCbackground/PCbackground.js">
</script>

<style scoped lang="scss" type="text/scss">
    .PCbackground {
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
