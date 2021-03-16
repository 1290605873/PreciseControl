<template>
	<div class="Statussettings main-container">
        <el-table
                :data="tablelist"
                border
                highlight-current-row
            >
            <el-table-column property="EquipmentCode" label="门店状态及颜色" align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.Name }}</span>
                </template>
            </el-table-column>
            <el-table-column property="EquipmentCode" label="累计未完成次数上限" align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.UnfinishedLimit }}</span>
                </template>
            </el-table-column>
            <el-table-column property="EquipmentCode" label="累计未完成次数超上限后状态变更为" align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.NextName}}</span>
                </template>
            </el-table-column>
            <el-table-column property="EquipmentCode" label="提示语" align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.Tips }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                    <el-button type="text" @click="editorList(scope.row.Id,scope.row.Name,scope.row.UnfinishedLimit,scope.row.NextName,scope.row.Tips)">编辑</el-button>
                </template>
            </el-table-column>                    
        </el-table>
        <el-dialog 
            title="编辑门店状态显示" 
            :visible.sync="editorDialog.show" 
            :close-on-click-modal="false"
            class="dialogHeight"
            width="36%"  
            style="margin-bottom: 0;">
            <el-form ref="form">
                <el-form-item label="门店状态及颜色" label-width="240px">
                    <span v-model="form.statusAndColor">{{form.statusAndColor}}</span>
                </el-form-item>
                <el-form-item label="累计未完成次数及上限" label-width="240px" prop="timeUpperLimit">
                    <el-input 
                        type="number"
                        v-model="form.timeUpperLimit" :disabled="disabled" style="width:90%;">
                     </el-input>
                </el-form-item>
                <el-form-item label="累计未完成次数超上限后状态变更为" label-width="240px">
                    <span v-model="form.UpperLimitChangeColor">{{form.UpperLimitChangeColor}}</span>
                </el-form-item>
                <el-form-item label="提示语" label-width="240px">
                    <el-input type="textarea" v-model="form.tips" style="width:90%" rows="3"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: center;margin-top: 10px;">
                <el-button type="primary" plain style="margin-right: 20px;" @click="editorSave">保存</el-button>
            </div>                    
        </el-dialog>
    </div>
</template>

<script src="@/views/Statussettings/Statussettings.js">
</script>

<style scoped lang="scss" scoped>
.main-container{
	width: 100%;
    height:100%;
	@include box(box);
	@include box-orient(vertical);	
	.com-width{
		width: 130px;
	}
    .com-width-time{
        width: 140px
    }
}
.Statussettings .el-table{
    width:90%;
    margin:40px auto;
}
</style>

