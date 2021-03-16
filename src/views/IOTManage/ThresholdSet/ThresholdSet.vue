<template>
	<div class="threshold-set">
		<el-container>
			<el-aside>
				<el-scrollbar>
					<TreeAreaChoose
						:limit="limitLevel"
						@getLoadNode="loadNode"
						@getCurrentNode="ZTreeOnClick">
					</TreeAreaChoose>
				</el-scrollbar>
			</el-aside>
			<el-main>
				<el-button
					size="mini"
					type="primary"
					class="add-btn"
					@click="Add">新增</el-button>
				<el-table
					:data="tableData"
					class="main-table">
					<el-table-column
						type="index"
						label="序号"
						width="60"
						fixed>
					</el-table-column>
					<el-table-column
						label="设备类型"
						prop="TypeName"
						align="center"
						fixed
						width="180"
						show-overflow-tooltip>
					</el-table-column>
					<el-table-column
						label="是否隐藏湿度"
						align="center"
						width="120">
						<template slot-scope="scope">
							{{scope.row.IsHidHumidity == 0 ? '无' : scope.row.IsHidHumidity == 1 ? '否' : '是'}}
						</template>
					</el-table-column>
					<el-table-column
						label="测量单位"
						align="center"
						width="180"
						show-overflow-tooltip>
						<template slot-scope="scope">
							<span v-for="(i,j) in scope.row.SubList"
								:key="j"
								class="unit-box">
								{{i.UnitDesc}}:{{i.Unit}}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						label="默认检测方式"
						align="center"
						width="120">
						<template slot-scope="scope">
							{{scope.row.MonitorWayValue == 0 ? '无' : scope.row.MonitorWayValue == 1 ? '工作时间' : '频次'}}
						</template>
					</el-table-column>
					<el-table-column
						label="阈值范围(合规值)"
						align="center"
						width="180"
						show-overflow-tooltip>
						<template slot-scope="scope">
							<div v-if="scope.row.ShowType != 3">
								<span
									v-for="(i,j) in scope.row.SubList"
									:key="j"
									class="unit-box">
									{{i.UnitDesc}}：
									{{
										i.MinValue == -99999&&i.MaxValue == 99999 ? "" :
										i.MinValue == -99999 ? "<" + i.MaxValue + i.Unit :
										i.MaxValue == 99999 ? '>'+ i.MinValue + i.Unit :
										i.MinValue + i.Unit +'至'+ i.MaxValue + i.Unit }}
								</span>
							</div>
							<span v-if="scope.row.WorkHours > 0 && scope.row.ShowType != 3" class="unit-box">工作时长：{{scope.row.WorkHours}} 分钟</span>
							<span v-if="scope.row.ShowType == 3" class="unit-box">{{scope.row.SubList[0].UnitDesc}}:{{scope.row.SubList[0].MinValue}} 分钟</span>
						</template>
					</el-table-column>
					<!-- <el-table-column label="报警时间/频率" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<div style="cursor:pointer;color:#409EFF" @click="Edit(scope.row,1)">
								<span class="unit-box">{{AlarmtTypeList[scope.row.AlarmtType]}}</span>
								<span class="unit-box" v-if="scope.row.AlarmInterval != null">{{scope.row.AlarmInterval}} / 分钟一次</span>
							</div>
						</template>
					</el-table-column> -->

					<!-- <el-table-column label="形成监管任务" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<span style="cursor:pointer;color:#409EFF">
								{{scope.row.Overdue == null ? '未设置' : '超期未完成'+ scope.row.Overdue +'次'}}
							</span>
						</template>

					</el-table-column> -->

					<el-table-column
						label="默认频次值"
						align="center"
						prop="Frequency"
						width="100">
					</el-table-column>
					<el-table-column
						label="工作时间默认值"
						prop="workTimeList"
						align="center"
						width="180">
						<template slot-scope="scope">
							<span
								v-for="(i, j) in scope.row.workTimeList"
								:key="j"
								class="unit-box">
								{{i.StartTime}}&nbsp;~&nbsp;{{i.EndTime}}
							</span>
						</template>
					</el-table-column>
						<el-table-column
							label="开启值"
							align="center"
							width="80">
							<template slot-scope="scope">
								<span v-if="scope.row.OpeningValue != null">
									{{scope.row.OpeningValueOperate == 0 ? '>' : '<' }}&nbsp;{{scope.row.OpeningValue}}
								</span>
							</template>
						</el-table-column>
					<el-table-column label="操作" width="244">
						<template slot-scope="scope">
							<el-button
								type="primary"
								size="mini"
								@click="Edit(scope.row)">
								修改
							</el-button>
							<el-button
								type="danger"
								size="mini"
								@click="Delete(scope.row.Id)">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
		</el-container>
		<EditThreshold
			:ShowThreshold="threshold.show"
			:EquipList='equipList'
			:AlarmtTypeList="AlarmtTypeList"
			:ThresholdData="threshold.data"
			@CloseThreshold="CloseThreshold">
		</EditThreshold>
	</div>
</template>

<script type="text/javascript" src="./ThresholdSet.js"></script>

<style scoped lang="scss">
.threshold-set{
	.el-aside{
		height:calc(100vh - 120px);
		.el-scrollbar{
			height:100%;
			/deep/ .el-scrollbar__wrap{
				overflow-x: hidden;
			}
		}
	}
	.el-main{
		padding-top: 0;
		.el-table{
			/deep/ .el-table__fixed th,
			/deep/ .el-table__fixed tr{
				background-color: #f2f2f2;
			}
			/deep/ .el-table__fixed td{
				background: #FFF;
				padding: 8px 0;
			}
		}
		.unit-box{
			display: block;
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
		.add-btn{
			margin-bottom: 15px;
		}
	}
}


</style>
