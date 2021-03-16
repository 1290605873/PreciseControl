<template>
	<div class="Checkitemresultsetting">
        <el-tabs style="height: 100%;" v-model="operationlist.code" @tab-click="handleClick" type="border-card">
            <el-tab-pane v-for="item in operationlist.datas" :label="item.Name" :name="item.Id" :value="item.Id"></el-tab-pane>
            <div class="secondlevel">
                <el-tabs v-model="inspectionlist.code" @tab-click="taskTabsClick">
                    <el-tab-pane v-for="item in inspectionlist.datas" :label="item.Text" :name="item.Id" :value="item.Id"></el-tab-pane>
                </el-tabs>
            </div> 
            <div class="table right">
                <el-table 
                 :data="tablelist" 
                 border
                 highlight-current-row
                 class="main-table" 
                 ref="table"  
                 id="table"
                 style="overflow: auto;"
                 @selection-change="">
                    <el-table-column type="index" align="center" label="序号" width="50">
                    </el-table-column>
                    <el-table-column property="OrigNameType" label="原始名称" align="center" width="">
                        <template slot-scope="scope">
                            <span v-if="scope.row.OrigNameType == 1">合格</span>
                            <span v-if="scope.row.OrigNameType == 0">不合格</span>
                            <span v-if="scope.row.OrigNameType == 2">不适用</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="Alias" label="别名" align="center" width="">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="modifylist(scope.$index)">
                                修改
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div> 
            <el-dialog title="修改" :visible.sync="gridParam.isviewCondition" :close-on-click-modal="false" class="dialogHeight"
                width="25%" v-if="gridParam.isviewCondition" height="500" v-dialogDrag>
                <div style="display: flex;padding-right: 40px;">
                    <p style="width: 50px;text-align: right;margin-right: 5px;">别名:</p>
                    <el-input clearable type="text" style="line-height: 44px;" @input.native="changeCode"  placeholder="最多可输入4个汉字" v-model="gridParam.Text" maxlength="4"></el-input>
                </div>
                <div style="text-align: center;margin-top: 10px;">
                    <el-button @click="gridParam.isviewCondition=false">取消</el-button>
                    <el-button type="primary" style="margin-right: 20px;" @click="addTitle()">保存</el-button>
                </div>                
            </el-dialog>
        </el-tabs>
    </div>
</template>

<script src="@/views/Checkitemresultsetting/Checkitemresultsetting.js">
</script>

<style lang="scss" scoped>
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
