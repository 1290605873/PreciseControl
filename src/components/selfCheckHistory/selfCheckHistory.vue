<template>
	<div class="SelfCheckHistor main-container">
        <div>
            <el-form :inline="true" ref="form" class="demo-form-inline">
                <el-form-item label="" label-width="80px">
                    <el-select class="searchSelect" :filterable="taskTypeList.length > 7" clearable v-model="taskTypeId" placeholder="任务类型">
                        <el-option v-for="item in taskTypeList" :key="item.Id" :lable="item.Id" :value="item.Text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-input class="searchSelect" clearable v-model="taskName" placeholder="任务名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-select class="searchSelect" :filterable="selfCheckResultList.length > 7" clearable v-model="selfCheckResult" placeholder="自查结果" @change="change">
                        <el-option v-for="item in selfCheckResultList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="" label-width="80px">
                    <el-input class="searchSelect" clearable v-model="selfCheckMan" placeholder="自查人员">
                    </el-input>
                </el-form-item> -->
                <el-form-item label="" label-width="80px">
                    <el-date-picker
                      v-model="startTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="" label-width="80px">
                    <el-date-picker
                      v-model="endTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="QueryTask">查询</el-button>
                </el-form-item>   
            </el-form>
        </div>
        <el-table
                :data="datas"
                border
                :height="150"
                fit
                style="width: 100%;margin-top: 10px">
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column :label="column.taskType" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.Text}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.taskName" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{scope.row.Name}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.selfCheckResult" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{scope.row.IsComplete }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column :label="column.selfCheckMan" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                                <span>{{ scope.row.TaskExecutorName }}</span>
                </template>
            </el-table-column> -->
            <el-table-column :label="column.startTime" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{ /\d{4}-\d{1,2}-\d{1,2}/g.exec(scope.row.StartTime).join() }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.endTime" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span>{{ /\d{4}-\d{1,2}-\d{1,2}/g.exec(scope.row.EndTime).join()}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="column.operate" show-overflow-tooltip align="center">
                <template slot-scope="scope">
					<span class="linkType" @click="publisPatrolTask(scope.row.Name,scope.row.Id)">查看详情</span>
                </template>
            </el-table-column>
        </el-table>
        
        <el-dialog
                class="publisPatrolTaskDialog"
                title="查看详情"
                :visible.sync="publisPatrolTaskDialog.show"
                v-if="publisPatrolTaskDialog.show"
                width="60%"
                top="6vh"
                :modal="modal"
                :close-on-click-modal="false">
            <div class="maxHistoryDialog" style="padding-bottom: 10px">
                <task-execution-detail :taskName="taskNameSub" :taskId="taskIdSub"></task-execution-detail>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="publisPatrolTaskDialog.show = false;">取消</el-button>
                    <el-button type="primary" style="margin-left: 20px" @click="publisPatrolTaskDialog.show = false;">确定</el-button>
                </span>
        </el-dialog>
        <pagination ref="pagination" v-show="pageNation.total"
        :total="pageNation.total"
        :page.sync="pageNation.pageNum"
        :limit.sync="pageNation.countPerPage"
        @pagination="onPageNation"></pagination>
	</div>
</template>
<script>
	import Pagination from '../../components/Pagination';
	import publisPatrolTask from '../../components/publisPatrolTask/publisPatrolTask';
	import TaskExecutionDetail from '../../components/TaskExecutionDetail/TaskExecutionDetail';
	export default{
		names: 'SelfCheckHistory',
	    components: {
	        Pagination,
	        publisPatrolTask,
	        TaskExecutionDetail
	    },
	    props: {
	        taskId:{
	            type:String,
	            default:''
	        },
            StoreTypeId:{//业态ID
                type:String,
                default:''
            },
            StoreId:{
                type:String,
                default:''
            },
	    },

	    data(){
	    	return {
                datas:[],//表格
	    		column:{
                    taskType:'任务类型',
	    			taskName:'任务名称',
	    			selfCheckResult:'自查结果',
	    			//selfCheckMan:'自查人',
	    			startTime:'开始时间',
	    			endTime:'结束时间',
	    			operate:'操作'
	    		},
                taskTypeId:'',//任务类型
                taskTypeList:[

                ],
                taskName:'',
                selfCheckManList:[
                    
                ],
                selfCheckResult:'',//自查结果
                selfCheckResultList:[
                    {
                        value: 1,
                        label:'合格'
                    },
                    {
                        value: 0,
                        label:'不合格'
                    },
                ],
	    		modal:false,
	    		publisPatrolTaskDialog:{
	    			show:false
	    		},
	    		startTime:'',
	    		endTime:'',
                pageNation: {//分页
                    total: 0,
                    pageNum: 1,//页数
                    countPerPage: 20//每页数
                },
                taskNameSub:'',//传给任务执行详情的任务名称
                taskIdSub:''//传给任务执行详情的任务id

	    	}
	    },
        created:function(){
            this.getTaskType();
            this.QueryTask();
        },
	    methods:{
	    	QueryTask(){
	    		let data = {
                        "StoreId": this.StoreId,//门店id
                        "StartTime": this.startTime,
                        "EndTime": this.endTime,
                        "Name": this.taskName,
                        //"TaskExecutorName": this.selfCheckMan,
                        "StatusValue": this.selfCheckResult,//自查结果
                        "Text": this.taskTypeId,//任务类型名称
                        "PageIndex": this.pageNation.pageNum,
                        "PageSize": this.pageNation.countPerPage
                    };
                this.$api.SubTaskQueryList(data).then(res =>{
                    if(res && res.Content!=null && res.Content.length>0){
                        this.datas = res.Content;
                        this.pageNation.total = res.Data;
                        let _this = this;
                        for(let item of this.datas){
                            if(item.StatusValue == 1){
                                _this.$set(item,'IsComplete','合格');
                            }else if(item.StatusValue == null){
                                _this.$set(item,'IsComplete','');
                            }else{
                                _this.$set(item,'IsComplete','不合格');
                            }
                        }
                    }else{
                        this.datas = [];
                        this.pageNation.total = 0;
                    }
                    
                })
	    	},
            change(val) {

            },
            //翻页
            onPageNation(){
                this.QueryTask();
            },
            //获取任务类型
            getTaskType(){
                let data = {
                    "StoreTypeId":this.StoreTypeId,//业态Id
                    "TaskTypeId": "",
                    "ProcessType": 1,
                    "Type": 1,
                    "PreviousId": ""
                };
                this.$api.GetBasicOptionList(data).then(
                    res => {
                        if(res){
                            this.taskTypeList = res.Content;
                        }
                        
                    }
                )
            },
            //查看详情
            publisPatrolTask(val,ids) {
                this.publisPatrolTaskDialog.show = true;
                this.taskNameSub = val;
                this.taskIdSub = ids;
            }
	    }
	}
</script>
<style lang="scss" scoped>
    .main-container {
        width: 100%;
        height: 100%;
        @include box(box);
        @include box-orient(vertical);
        .el-middle {
            padding-bottom: 10px;
        }
        padding-top:0 !important;
    }
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
    .el-form-item{
        margin-bottom:0;
    }
    .linkType,
    .linkType:focus {
      color: #337ab7;
      cursor: pointer;

      &:hover {
        color: rgb(32, 160, 255);
      }
    }
    .maxHistoryDialog{
        height: calc(80vh - 83px);
        overflow-y: auto;
    }
</style>