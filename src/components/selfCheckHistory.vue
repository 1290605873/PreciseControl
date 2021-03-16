<template>
	<div class="SelfCheckHistor">
		<div>
            <label class="searhCluseLabel">任务类型:</label>
            <el-select class="searchSelect" clearable>
                <el-option></el-option>
            </el-select>
            <label class="searhCluseLabel">任务名称:</label>
            <el-input class="searchSelect" clearable>
            </el-input>
            <label class="searhCluseLabel">自查结果:</label>
            <el-input class="searchSelect" clearable>
            </el-input>
            <label class="searhCluseLabel">自查人员:</label>
            <el-input class="searchSelect" clearable>
            </el-input>
            <div class="block">
		    	<span class="demonstration">开始日期:</span>
			    <el-date-picker
			      v-model="value1"
			      type="date"
			      placeholder="选择日期">
			    </el-date-picker>
			</div>
            <div class="block">
		    	<span class="demonstration">结束日期:</span>
			    <el-date-picker
			      v-model="value2"
			      type="date"
			      placeholder="选择日期">
			    </el-date-picker>
			</div>
            
        </div>
        <div>
        	<label class="searhCluseLabel">责任主体:</label>
            <el-input class="searchSelect" clearable>
            </el-input>
            <label class="searhCluseLabel">历史任务数量:</label>
            <el-input class="searchSelect" clearable>
            </el-input>
            <el-button type="primary" @click="QueryTask">查询</el-button>
        </div>
        <el-table
                :data="datas"
                border
                :height="150"
                fit
                style="width: 100%;margin-top: 10px">
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column :label="column.taskName" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{  }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.selfCheckResult" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{  }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.selfCheckMan" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{  }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.startTime" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{  }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.endTime" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{  }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.operate" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{  }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-button @click="publisPatrolTaskDialog.show = true">查看详情</el-button>
        <el-dialog
                class="publisPatrolTaskDialog"
                title="查看详情"
                :visible.sync="publisPatrolTaskDialog.show"
                width="65%"
                top="10vh"
                :modal="modal"
                :close-on-click-modal="false">
            <div class="maxDialog" style="padding-bottom: 10px">
                <task-execution-detail></task-execution-detail>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button>取消</el-button>
                    <el-button type="primary" style="margin-left: 20px">发布</el-button>
                </span>
        </el-dialog>
	</div>
</template>
<script>
	//import Pagination from '../../components/Pagination';
	import publisPatrolTask from '../../components/publisPatrolTask/publisPatrolTask';
	import TaskExecutionDetail from '../../components/TaskExecutionDetail/TaskExecutionDetail';
	export default{
		names: 'SelfCheckHistory',
	    components: {
	        //Pagination
	        publisPatrolTask,
	        TaskExecutionDetail
	    },
	    props: {
	        taskId:{
	            type:String,
	            default:''
	        }
	    },
	    data(){
	    	return {
	    		column:{
	    			taskName:'任务名称',
	    			selfCheckResult:'自查结果',
	    			selfCheckMan:'自查人',
	    			startTime:'开始时间',
	    			endTime:'结束时间',
	    			operate:'操作'
	    		},
	    		modal:false,
	    		publisPatrolTaskDialog:{
	    			show:false
	    		},
	    		value1:'',
	    		value2:''
	    	}
	    },
	    methods:{
	    	QueryTask(){
	    		let data = {

	    		}
	    	},
            //获取任务类型
            getTaskType(){
                let data = {
                    "StoreTypeId":'',//业态Id
                    "ProcessType":0,
                    "Type":1,
                };
                this.$api.GetBasicOptionList(data).then(
                    res => {

                    }
                )
            }
	    }
	}
</script>
<style lang="scss" scoped>
	.SelfCheckHistor{
		width:100%;
		height:100%
	}
	.searhCluseLabel {
        text-align: center;
        vertical-align: middle;
        font-size: 14px;
        color: #606266;
        line-height: 34px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        width: 110px;
        display: inline-block;
    }
    .searchSelect {
        width: 180px;
    }
    .searchInput {
        width: 180px
    }
    .el-button{
    	margin-left:20px;
    }
	.block{
		display:inline-block;
		margin:0 6px;
	}
	.el-date-editor.el-input{
		width:180px;
		margin-left:9px
	}
	.demonstration{
		text-align: center;
        vertical-align: middle;
        font-size: 14px;
        color: #606266;
        line-height: 34px;
        padding: 0 10px 0 0;
        box-sizing: border-box;
        width: 92px;
        display: inline-block;
	}


</style>